import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { CreateShopDto } from './dto/create-shop.dto';

@Injectable()
export class ShopService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
  ) {}

  // Cria um novo centro de serviços
  async create(createShopDto: CreateShopDto): Promise<Shop> {
    const newShop = this.shopRepository.create({
      ...createShopDto,
    });

    // Salva o novo centro de serviços no banco de dados
    return await this.shopRepository.save(newShop);
  }

  // Busca um centro de serviços pelo ID
  async findById(id: string): Promise<Shop | null> {
    const shop = await this.shopRepository.findOne({
      where: { id },
    });

    return shop;
  }
}
