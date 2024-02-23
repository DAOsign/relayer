import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountBalance1708689834790 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE account ADD COLUMN balance bigint NOT NULL DEFAULT 1000;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTE TABLE account DROP COLUMN balance;`);
  }
}
