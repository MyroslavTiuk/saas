import { MigrationInterface, QueryRunner } from 'typeorm';

export class migrateAttendancesTable11704346835502 implements MigrationInterface {
  name = 'migrateAttendancesTable11704346835502';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`attendances\` DROP FOREIGN KEY \`FK_b58d23787d8a7cf7b553828daac\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`attendances\` DROP COLUMN \`device_id\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`attendances\`
            ADD CONSTRAINT \`FK_c7590e2b1c45b767972efe2e411\` FOREIGN KEY (\`clock_in_device_id\`) REFERENCES \`devices\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`attendances\` DROP FOREIGN KEY \`FK_c7590e2b1c45b767972efe2e411\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`attendances\`
            ADD \`device_id\` bigint NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`attendances\`
            ADD CONSTRAINT \`FK_b58d23787d8a7cf7b553828daac\` FOREIGN KEY (\`device_id\`) REFERENCES \`devices\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}
