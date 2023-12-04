import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm"

export class CreateTokensTable1701722751427 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

			await queryRunner.query(
				`CREATE TABLE user_token (
					id INT(11) UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
					user_id INT(11) UNSIGNED NOT NULL,
					token VARCHAR(255) NOT NULL,
					expires_at DATETIME NOT NULL,
					created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
				)`
			);

			await queryRunner.createForeignKey('user_token', new TableForeignKey({
				name: 'fk_user_token_user_id_users',
				columnNames: ['user_id'],
				referencedTableName: 'users',
				referencedColumnNames: ['id'],
				onDelete: 'CASCADE',
				onUpdate: 'CASCADE'
			}));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
			const exists = await queryRunner.hasTable('user_token');

			if (exists) await queryRunner.query(`
				DROP TABLE IF EXISTS user_token
			`);
    }

}
