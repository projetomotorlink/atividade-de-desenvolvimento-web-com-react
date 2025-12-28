import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { WorkOrderService } from './work-order.service';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';
import { ResponseWorkOrderDto } from './dto/response-work-order.dto';
import { JwtAuthGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import type { RequestWithAccessToken } from '../auth/interfaces/request-with-user.interface';

@ApiTags('Ordens de Serviço')
@Controller({
  path: 'work-orders',
  version: '1',
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class WorkOrderController {
  constructor(private readonly workOrderService: WorkOrderService) {}

  // Cria uma nova ordem de serviço
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova ordem de serviço' })
  async create(
    @Req() req: RequestWithAccessToken,
    @Body() createWorkOrderDto: CreateWorkOrderDto,
  ): Promise<ResponseWorkOrderDto> {
    const userId = req.user.sub;
    const shopId = req.user.shopId;

    // Verifica se o usuário possui um centro de serviço associado
    if (!shopId) {
      throw new BadRequestException(
        'Usuário não possui centro de serviço associado',
      );
    }

    // Cria a ordem de serviço
    return await this.workOrderService.create(
      userId,
      shopId,
      createWorkOrderDto,
    );
  }

  // Lista todas as ordens de serviço do centro de serviço
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Lista todas as ordens de serviço do centro de serviço',
  })
  async findAll(
    @Req() req: RequestWithAccessToken,
  ): Promise<ResponseWorkOrderDto[]> {
    const shopId = req.user.shopId;

    // Verifica se o usuário possui um centro de serviço associado
    if (!shopId) {
      throw new BadRequestException(
        'Usuário não possui centro de serviço associado',
      );
    }

    // Busca todas as ordens de serviço do centro de serviço
    return await this.workOrderService.findAll(shopId);
  }

  // Busca detalhes de uma ordem de serviço específica
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Busca detalhes de uma ordem de serviço' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithAccessToken,
  ): Promise<ResponseWorkOrderDto> {
    const shopId = req.user.shopId;

    // Verifica se o usuário possui um centro de serviço associado
    if (!shopId) {
      throw new BadRequestException(
        'Usuário não possui centro de serviço associado',
      );
    }

    // Busca a ordem de serviço pelo ID
    return await this.workOrderService.findOne(id, shopId);
  }

  // Atualiza uma ordem de serviço existente
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualiza uma ordem de serviço' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithAccessToken,
    @Body() updateWorkOrderDto: UpdateWorkOrderDto,
  ): Promise<ResponseWorkOrderDto> {
    const shopId = req.user.shopId;

    // Verifica se o usuário possui um centro de serviço associado
    if (!shopId) {
      throw new BadRequestException(
        'Usuário não possui centro de serviço associado',
      );
    }

    // Atualiza a ordem de serviço
    return await this.workOrderService.update(id, shopId, updateWorkOrderDto);
  }

  // Remove uma ordem de serviço
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove uma ordem de serviço' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithAccessToken,
  ): Promise<void> {
    const shopId = req.user.shopId;

    // Verifica se o usuário possui um centro de serviço associado
    if (!shopId) {
      throw new BadRequestException(
        'Usuário não possui centro de serviço associado',
      );
    }

    // Remove a ordem de serviço
    return await this.workOrderService.remove(id, shopId);
  }
}
