import { MigrationInterface, QueryRunner } from "typeorm"

export class CreateTokensTable1701722751427 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

			await queryRunner.query(
				`CREATE TABLE user_token (
					id INT(11) UNSIGNED PRIMARY KEY AUTO_INCREMENT,
					user_id INT(11) UNSIGNED NOT NULL,
					token VARCHAR(255) NOT NULL,
					expires_at DATETIME NOT NULL,
					created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
				)`
			);


    }

    public async down(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.query(`
				DROP TABLE IF EXISTS user_token
			`);
    }

}
