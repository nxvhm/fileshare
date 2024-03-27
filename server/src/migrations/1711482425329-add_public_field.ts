import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddPublicField1711482425329 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
			const hasColumn = await queryRunner.hasColumn('files', 'public');
			if(hasColumn)
				return;

			await queryRunner.query('ALTER TABLE files ADD COLUMN `public` TINYINT(2) UNSIGNED NOT NULL DEFAULT 0 AFTER `type`');
		}

    public async down(queryRunner: QueryRunner): Promise<void> {
			const hasColumn = await queryRunner.hasColumn('files', 'public');
			if(!hasColumn)
				return;

			await queryRunner.dropColumn('files', 'public');
    }

}
