import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationshipsToTheOrderTable1766787311180 implements MigrationInterface {
  name = 'AddRelationshipsToTheOrderTable1766787311180';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "services" ADD "work_order_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "work_orders" ADD "protocolo" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_orders" ADD "shop_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_orders" ADD "created_by_id" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "services" ADD CONSTRAINT "FK_70db194c6c63b776899ff19d38f" FOREIGN KEY ("work_order_id") REFERENCES "work_orders"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_orders" ADD CONSTRAINT "FK_afe7b9a2057711a64bd4a09d8ce" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_orders" ADD CONSTRAINT "FK_892244c7e30eda7d2406dda545b" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "work_orders" DROP CONSTRAINT "FK_892244c7e30eda7d2406dda545b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_orders" DROP CONSTRAINT "FK_afe7b9a2057711a64bd4a09d8ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services" DROP CONSTRAINT "FK_70db194c6c63b776899ff19d38f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "work_orders" DROP COLUMN "created_by_id"`,
    );
    await queryRunner.query(`ALTER TABLE "work_orders" DROP COLUMN "shop_id"`);
    await queryRunner.query(
      `ALTER TABLE "work_orders" DROP COLUMN "protocolo"`,
    );
    await queryRunner.query(
      `ALTER TABLE "services" DROP COLUMN "work_order_id"`,
    );
  }
}
