import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenToUserTable1766781436621 implements MigrationInterface {
  name = 'AddRefreshTokenToUserTable1766781436621';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "refreshToken" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshToken"`);
  }
}
