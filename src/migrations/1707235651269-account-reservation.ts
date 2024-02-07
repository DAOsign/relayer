import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AccountReservation1707235651269 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("account", "locked");
    await queryRunner.addColumn(
      "account",
      new TableColumn({
        name: "current_proof",
        type: "integer",
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      "account",
      new TableForeignKey({
        columnNames: ["current_proof"],
        referencedTableName: "proof",
        referencedColumnNames: ["id"],
        name: "account_to_proof",
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "account",
      new TableColumn({
        name: "locked",
        type: "boolean",
        default: false,
      }),
    );

    await queryRunner.dropForeignKey("account", "account_to_proof");
    await queryRunner.dropColumn("account", "current_proof");
  }
}
