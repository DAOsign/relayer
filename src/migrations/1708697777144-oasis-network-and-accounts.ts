import { MigrationInterface, QueryRunner } from "typeorm";

export class OasisNetworkAndAccounts1708697777144 implements MigrationInterface {
  networkTableData = [{ id: 4, name: "Oasis" }];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.createQueryBuilder().insert().into("network").values(this.networkTableData).execute();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
