import { MigrationInterface, QueryRunner } from 'typeorm';

export class createEmailVerifyTable1704357089664 implements MigrationInterface {
  name = 'createEmailVerifyTable1704357089664';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`email_verify_code\` (
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`email\` varchar(255) NOT NULL,
                \`type\` enum (
                    'email_verify',
                    'reset_password',
                    'forget_password'
                ) NOT NULL DEFAULT 'email_verify',
                \`code\` int NOT NULL,
                \`verify_token\` varchar(255) NOT NULL,
                \`expiry_date\` datetime NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE \`email_verify_code\`
        `);
  }
}
