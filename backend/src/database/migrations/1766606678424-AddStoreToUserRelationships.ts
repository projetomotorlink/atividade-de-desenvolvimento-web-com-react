import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStoreToUserRelationships1766606678424 implements MigrationInterface {
  name = 'AddStoreToUserRelationships1766606678424';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "shopId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_7680babafb8b9ca907bfbd142c5" UNIQUE ("shopId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_7680babafb8b9ca907bfbd142c5" FOREIGN KEY ("shopId") REFERENCES "shops"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "FK_7680babafb8b9ca907bfbd142c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP CONSTRAINT "UQ_7680babafb8b9ca907bfbd142c5"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "shopId"`);
  }
}
