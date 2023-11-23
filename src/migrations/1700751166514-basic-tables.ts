import {MigrationInterface, QueryRunner, Table} from "typeorm"

export class BasicTables1700751166514 implements MigrationInterface {
    networkTable = new Table({
        name: "network",
        columns: [
            { name: "network_id", type: "serial", isPrimary: true },
            { name: "name", type: "varchar", isNullable: false, isUnique: true }
        ]
    })

    accountTable = new Table({
        name: "account",
        columns: [
            { name: "account_id", type: "serial", isPrimary: true, comment: "PK" },
            { name: "network_id", type: "integer", isNullable: false, comment: "Network ID" },
            { name: "address", type: "varchar", isNullable: false, comment: "Blockchain Address derived from Master Key" },
            { name: "hd_path", type: "varchar", isNullable: false, comment: "BIP44 Hierarchical deterministic path" },
            { name: "locked", type: "boolean", isNullable: false, comment: "True if address is locked by executing transaction" },
        ],
        foreignKeys: [
            { columnNames: ["network_id"], referencedTableName: "network", referencedColumnNames: ["network_id"] },
        ]
    })

    txTable = new Table({
        name: "tx",
        columns: [
            { name: "tx_id", type: "serial", isPrimary: true, comment: "PK"},
            { name: "payload", type: "jsonb", isNullable: false, comment: "Raw transaction payload (Proof in json format)" },
            { name: "network_id", type: "integer", comment: "Network ID" },
            { name: "account_id", type: "integer", comment: "Account ID used to sign transaction" },
            { name: "tx_hash", type: "varchar", comment: "Transaction hash" },
            { name: "status", type: "integer", comment: "Transaction execution status. 1 - new, 2 - in progress, 3 - success, 4 - error" },
            { name: "error", type: "varchar" },
            { name: "created_at", type: "timestamp with time zone", default: "now()", isNullable: false },
            { name: "updated_at", type: "timestamp with time zone", isNullable: false }
        ],
        foreignKeys: [
            { columnNames: ["network_id"], referencedTableName: "network", referencedColumnNames: ["network_id"] },
            { columnNames: ["account_id"], referencedTableName: "account", referencedColumnNames: ["account_id"] }
        ]
    })

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.networkTable);
        await queryRunner.createTable(this.accountTable);
        await queryRunner.createTable(this.txTable);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.txTable, true, true, true);
        await queryRunner.dropTable(this.accountTable, true, true, true);
        await queryRunner.dropTable(this.networkTable, true, true, true);
    }

}
