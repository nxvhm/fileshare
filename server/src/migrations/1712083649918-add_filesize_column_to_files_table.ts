import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFilesizeColumnToFilesTable1712083649918 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
			const hasColumn = await queryRunner.hasColumn('files', 'filesize');
			if(hasColumn)
				return;

			await queryRunner.query('ALTER TABLE files ADD COLUMN `filesize` BIGINT UNSIGNED NULL DEFAULT 0 AFTER `mime`');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
			const hasColumn = await queryRunner.hasColumn('files', 'filesize');
			if(!hasColumn)
				return;

			await queryRunner.dropColumn('files', 'filesize');
    }

}
