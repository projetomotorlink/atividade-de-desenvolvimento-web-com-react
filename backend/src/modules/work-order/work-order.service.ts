import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { WorkOrders } from './entities/work-order.entity';
import { Service } from './entities/service.entity';
import { User } from '../user/entities/user.entity';
import { Shop } from '../shop/entities/shop.entity';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';

@Injectable()
export class WorkOrderService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(WorkOrders)
    private workOrderRepository: Repository<WorkOrders>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Shop)
    private shopRepository: Repository<Shop>,
  ) {}

  // Cria uma nova ordem de serviço
  async create(
    userId: string,
    shopId: string,
    createWorkOrderDto: CreateWorkOrderDto,
  ): Promise<WorkOrders> {
    // Valida se o usuário existe
    const user = await this.userRepository.findOne({ where: { id: userId } });

    // Se o usuário não for encontrado, lança uma exceção
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Valida se o centro de serviço existe
    const shop = await this.shopRepository.findOne({ where: { id: shopId } });

    // Se o centro de serviço não for encontrado, lança uma exceção
    if (!shop) {
      throw new NotFoundException('Loja não encontrada');
    }

    // Gera o protocolo da ordem de serviço
    const anoAtual = new Date().getFullYear();
    const startOfYear = new Date(anoAtual, 0, 1);
    const endOfYear = new Date(anoAtual, 11, 31, 23, 59, 59);
    const quantidadeOrdens = await this.workOrderRepository.count({
      where: {
        shop: { id: shopId },
        createdAt: Between(startOfYear, endOfYear),
      },
    });
    const proximoNumero = (quantidadeOrdens + 1).toString().padStart(4, '0');
    const protocolo = `PROT-${anoAtual}-${proximoNumero}`;

    // Calcula o preço total dos serviços
    const precoTotal = this.calculateTotalPrice(createWorkOrderDto.services);

    // Cria as entidades de serviço associadas à ordem de serviço
    const servicos: Service[] = [];
    for (const servicoDto of createWorkOrderDto.services) {
      const servico = this.serviceRepository.create({
        name: servicoDto.name,
        currentPrice: servicoDto.currentPrice,
      });
      servicos.push(servico);
    }

    // Cria a entidade de ordem de serviço
    const workOrder = this.workOrderRepository.create({
      protocolo: protocolo,
      description: createWorkOrderDto.description,
      status: createWorkOrderDto.status,
      WorkOrderTotalPrice: precoTotal,
      shop: shop,
      createdBy: user,
      services: servicos,
    });

    // Salva a ordem de serviço no banco de dados
    const ordemSalva = await this.workOrderRepository.save(workOrder);

    // Retorna a ordem de serviço criada
    return this.findOne(ordemSalva.id, shopId);
  }

  // Busca todas as ordens de serviço de um centro de serviço
  async findAll(shopId: string): Promise<WorkOrders[]> {
    const ordens = await this.workOrderRepository.find({
      where: { shop: { id: shopId } },
      relations: ['services', 'createdBy', 'shop'],
      order: { createdAt: 'DESC' },
    });

    return ordens;
  }

  // Busca uma ordem de serviço pelo ID
  async findOne(id: string, shopId: string): Promise<WorkOrders> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id: id },
      relations: ['services', 'createdBy', 'shop'],
    });

    // Verifica se a ordem de serviço existe
    if (!workOrder) {
      throw new NotFoundException('Ordem de serviço não encontrada');
    }

    // Verifica se a ordem de serviço pertence ao centro de serviço solicitado
    if (workOrder.shop.id !== shopId) {
      throw new ForbiddenException(
        'Você não tem permissão para acessar esta ordem de serviço',
      );
    }

    // Retorna a ordem de serviço encontrada
    return workOrder;
  }

  // Atualiza uma ordem de serviço existente
  async update(
    id: string,
    shopId: string,
    updateWorkOrderDto: UpdateWorkOrderDto,
  ): Promise<WorkOrders> {
    // Busca a ordem de serviço a ser atualizada
    const workOrder = await this.findOne(id, shopId);

    // Cria um query runner para gerenciar a transação
    const queryRunner = this.dataSource.createQueryRunner();

    // Conecta o query runner ao banco de dados
    await queryRunner.connect();

    // Inicia a transação
    await queryRunner.startTransaction();

    try {
      // Atualiza os campos da ordem de serviço conforme o DTO recebido
      if (updateWorkOrderDto.description !== undefined) {
        workOrder.description = updateWorkOrderDto.description;
      }

      // Atualiza o status da ordem de serviço se fornecido
      if (updateWorkOrderDto.status !== undefined) {
        workOrder.status = updateWorkOrderDto.status;
      }

      // Atualiza os serviços associados à ordem de serviço se fornecidos
      if (updateWorkOrderDto.services) {
        // Remove os serviços antigos associados à ordem de serviço
        await queryRunner.manager.delete(Service, {
          workOrder: { id: workOrder.id },
        });

        // Cria novas entidades de serviço com base no DTO recebido
        const newServices = updateWorkOrderDto.services.map((serviceDto) =>
          queryRunner.manager.create(Service, {
            name: serviceDto.name,
            currentPrice: serviceDto.currentPrice,
            workOrder: workOrder,
          }),
        );

        // Associa os novos serviços à ordem de serviço
        workOrder.services = newServices;

        // Recalcula o preço total da ordem de serviço
        workOrder.WorkOrderTotalPrice = this.calculateTotalPrice(
          updateWorkOrderDto.services,
        );
      }

      // Salva as alterações na ordem de serviço
      await queryRunner.manager.save(workOrder);

      // Commit a transação
      await queryRunner.commitTransaction();

      // Retorna a ordem de serviço atualizada
      return this.findOne(id, shopId);
    } catch (error) {
      // Rollback a transação em caso de erro
      await queryRunner.rollbackTransaction();

      // Lança uma exceção de erro interno do servidor em caso de falha
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      throw new InternalServerErrorException(
        'Erro ao atualizar ordem de serviço: ' + errorMessage,
      );
    } finally {
      // Libera o query runner
      await queryRunner.release();
    }
  }

  // Remove uma ordem de serviço pelo ID
  async remove(id: string, shopId: string): Promise<void> {
    // Busca a ordem de serviço a ser removida
    const workOrder = await this.findOne(id, shopId);

    try {
      // Remove a ordem de serviço do banco de dados
      await this.workOrderRepository.remove(workOrder);
    } catch (error) {
      // Lança uma exceção de erro interno do servidor em caso de falha
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido';
      throw new InternalServerErrorException(
        'Erro ao deletar ordem de serviço: ' + errorMessage,
      );
    }
  }

  // Calcula o preço total dos serviços
  private calculateTotalPrice(
    services: Array<{ name: string; currentPrice: number }>,
  ): number {
    let total = 0;

    // Soma o preço atual de cada serviço para obter o total
    for (const service of services) {
      total = total + Number(service.currentPrice);
    }

    // Retorna o preço total calculado
    return total;
  }
}
