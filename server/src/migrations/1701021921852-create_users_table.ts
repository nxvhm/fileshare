import { MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableColumn,
  TableForeignKey
} from "typeorm"

export class CreateUsersTable1701021921852 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: "users",
          columns: [
            {
              name: 'id',
              type: "int",
              isPrimary: true,
              isGenerated: true,
              generationStrategy: 'increment'
            },
            {
              name: 'name',
              type: 'varchar',
            },
            {
              name: 'email',
              type: 'varchar',
              isUnique: true

            },
            {
              name: "password",
              type: "varchar"
            },
            {
              name: "created_at",
              type: "timestamp",
              default: "now()"
            },
            {
              name: 'updated_at',
              type: "datetime",
              default: "CURRENT_TIMESTAMP",
              onUpdate: "CURRENT_TIMESTAMP"
            }
          ]
        })
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.dropTable('users', true);
		}
}
