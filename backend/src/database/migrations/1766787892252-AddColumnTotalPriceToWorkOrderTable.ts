import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnTotalPriceToWorkOrderTable1766787892252 implements MigrationInterface {
  name = 'AddColumnTotalPriceToWorkOrderTable1766787892252';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "work_orders" ADD "WorkOrderTotalPrice" numeric(10,2) NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "work_orders" DROP COLUMN "WorkOrderTotalPrice"`,
    );
  }
}
