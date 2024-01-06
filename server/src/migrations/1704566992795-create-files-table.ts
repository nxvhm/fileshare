import { MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableColumn,
  TableForeignKey
} from "typeorm"

export class CreateFilesTable1704566992795 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.query(
				`CREATE TABLE files (
					id BIGINT(11) UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
					user_id INT(11) UNSIGNED NOT NULL,
					name VARCHAR(128) NOT NULL,
					parent_id BIGINT(11) UNSIGNED NULL DEFAULT NULL,
					hash VARCHAR(256) NOT NULL,
					mime VARCHAR(24) NULL DEFAULT NULL,
					created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
				)`
			);

			await queryRunner.createForeignKey('files', new TableForeignKey({
				name: 'fk_files_user_id_users',
				columnNames: ['user_id'],
				referencedTableName: 'users',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE'
			}));

			await queryRunner.createForeignKey('files', new TableForeignKey({
				name: 'fk_files_parent_id_files',
				columnNames: ['parent_id'],
				referencedTableName: 'files',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE'
			}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
			const exists = await queryRunner.hasTable('files');

			if (exists) await queryRunner.query(`
				DROP TABLE IF EXISTS files
			`);
    }

}
