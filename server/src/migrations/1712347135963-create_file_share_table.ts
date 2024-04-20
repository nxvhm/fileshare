import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class CreateFileShareTable1712347135963 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.query(
				`CREATE TABLE shares (
					user_id INT(11) UNSIGNED NOT NULL,
					file_id BIGINT(11) UNSIGNED NOT NULL,
					created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
					PRIMARY KEY (user_id, file_id)
				)
				`
			);

			await queryRunner.createForeignKey('shares', new TableForeignKey({
				name: 'fk_shares_share_user_id_users',
				columnNames: ['user_id'],
				referencedTableName: 'users',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE'
			}));

			await queryRunner.createForeignKey('shares', new TableForeignKey({
				name: 'fk_shares_file_id_files',
				columnNames: ['file_id'],
				referencedTableName: 'files',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE'
			}));

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
			const exists = await queryRunner.hasTable('shares');

			if (exists)
				 await queryRunner.query(`DROP TABLE IF EXISTS shares`);
    }

}
