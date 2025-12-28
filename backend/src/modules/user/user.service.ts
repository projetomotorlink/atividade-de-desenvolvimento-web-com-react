import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Cria um novo usuário
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Desestrutura o DTO para obter as senhas e o email
    const { password1, password2, email, ...userData } = createUserDto;

    // Valida se as senhas coincidem
    if (password1 !== password2) {
      throw new BadRequestException('As senhas não coincidem.');
    }

    // Faz o hash da senha antes de salvar no banco de dados
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password1, salt);

    // Cria a entidade do usuário
    const newUser = this.userRepository.create({
      ...userData,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    try {
      // Salva o novo usuário no banco de dados e retorna o usuário criado
      return await this.userRepository.save(newUser);
    } catch (error: unknown) {
      // Obtem informações do erro para análise de banco de dados
      const databaseError = error as { code?: string; detail?: string };

      // Verifica se o erro é de conflito (e-mail já existente)
      if (
        databaseError.code === '23505' ||
        databaseError.detail?.includes('already exists')
      ) {
        // Lança uma exceção de conflito avisando que o e-mail já está em uso
        throw new ConflictException('Este e-mail já está em uso.');
      }

      // Lança uma exceção genérica para outros tipos de erro
      throw new InternalServerErrorException('Erro ao criar usuário.');
    }
  }

  // Busca um usuário pelo e-mail (inclui password para validação no login)
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.shop', 'shop')
      .where('user.email = :email', { email })
      .addSelect('user.password')
      .getOne();

    return user;
  }

  // Busca um usuário pelo ID (exclui password por segurança)
  async findById(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'firstName', 'lastName', 'email', 'role', 'refreshToken'],
      relations: ['shop'],
    });

    return user;
  }

  // Atualiza o token de refresh do usuário
  async updateRefreshToken(
    userId: string,
    hashedRefreshToken: string | null,
  ): Promise<void> {
    await this.userRepository.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }
}
