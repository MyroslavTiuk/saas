import {MigrationInterface, QueryRunner} from "typeorm";

export class removeAdminLocationFromPayload1705891288533 implements MigrationInterface {
    name = 'removeAdminLocationFromPayload1705891288533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`payloads\` DROP COLUMN \`admin_location_id\`
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`payloads\`
            ADD \`admin_location_id\` bigint NOT NULL
        `);
    }

}
