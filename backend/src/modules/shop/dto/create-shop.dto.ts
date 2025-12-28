import { IsNotEmpty, IsString } from 'class-validator';
import { Trim } from '../../../common/decorators/trim.decorator';
import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';

// DTO para criar um novo centro de serviços
export class CreateShopDto {
  @ApiProperty({ example: 'Oficina do Carlos' })
  @IsString()
  @IsNotEmpty()
  @Trim()
  shopName: string;
}
