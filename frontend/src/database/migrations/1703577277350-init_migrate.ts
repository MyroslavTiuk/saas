import { MigrationInterface, QueryRunner } from 'typeorm';

export class initMigrate1703577277350 implements MigrationInterface {
  name = 'initMigrate1703577277350';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`payloads\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`admin_location_id\` bigint NOT NULL,
                \`pay_no\` bigint NOT NULL,
                \`start_at\` datetime NOT NULL,
                \`end_at\` datetime NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`attendances\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`employee_id\` bigint NOT NULL,
                \`clock_in_device_id\` bigint NOT NULL,
                \`clock_out_device_id\` bigint NULL,
                \`clocked_in\` varchar(255) NULL,
                \`clocked_out\` varchar(255) NULL,
                \`worked_hours\` varchar(255) NULL,
                \`date\` varchar(255) NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                \`device_id\` bigint NULL,
                UNIQUE INDEX \`IDX_7797173c5d5349271c80c7122c\` (\`employee_id\`, \`date\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`devices\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`admin_location_id\` bigint NOT NULL,
                \`device_id\` varchar(255) NOT NULL,
                \`device_product_key\` varchar(255) NOT NULL,
                \`device_name\` varchar(255) NULL,
                \`make_or_model\` varchar(255) NULL,
                \`gps_location\` varchar(255) NULL,
                \`account_no_desc\` varchar(255) NULL,
                \`paypoint_desc\` varchar(255) NULL,
                \`ip_address\` varchar(255) NULL,
                \`status\` tinyint NOT NULL DEFAULT 1,
                \`created_by\` bigint NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                UNIQUE INDEX \`IDX_2667f40edb344d6f274a0d42b6\` (\`device_id\`),
                UNIQUE INDEX \`IDX_a41bd44ed7cd760ac2982e9d9c\` (\`device_product_key\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`user_detail\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`user_id\` bigint NOT NULL,
                \`surname\` varchar(255) NULL,
                \`given_name\` varchar(255) NULL,
                \`job_title\` varchar(255) NULL,
                \`office_phone\` varchar(255) NULL,
                \`mobile_number\` varchar(255) NULL,
                \`admin_desc\` varchar(255) NULL,
                \`account_no_desc\` varchar(255) NULL,
                \`paypoint_desc\` varchar(255) NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                UNIQUE INDEX \`REL_aebc3bfe11ea329ed91cd8c575\` (\`user_id\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`users\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`admin_location_id\` bigint NULL,
                \`email\` varchar(255) NOT NULL,
                \`password\` varchar(255) NULL,
                \`status\` tinyint NOT NULL DEFAULT 1,
                \`access_privilege\` varchar(255) NULL,
                \`admin_location_level_user\` varchar(255) NULL,
                \`creator\` varchar(255) NULL,
                \`verified\` tinyint NOT NULL DEFAULT 0,
                \`verified_at\` datetime NULL,
                \`access_token\` varchar(255) NULL,
                \`refresh_token\` varchar(255) NULL,
                \`expiry_access_date\` datetime NULL,
                \`expiry_refresh_date\` datetime NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`admin_locations\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`admin_location\` varchar(255) NOT NULL,
                \`admin_desc\` varchar(255) NOT NULL,
                \`user_type\` varchar(255) NOT NULL,
                \`created_by\` bigint NOT NULL,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                UNIQUE INDEX \`IDX_3fe06695daa3139b9891b04e50\` (\`admin_location\`, \`user_type\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`employees\` (
                \`id\` bigint NOT NULL AUTO_INCREMENT,
                \`employee_no\` varchar(255) NOT NULL,
                \`admin_location_id\` bigint NOT NULL,
                \`name_report\` varchar(255) NOT NULL,
                \`position_no\` varchar(255) NULL,
                \`occup_pos_title\` varchar(255) NULL,
                \`award\` varchar(255) NULL,
                \`award_desc\` varchar(255) NULL,
                \`classification\` varchar(255) NULL,
                \`class_desc\` varchar(255) NULL,
                \`step_no\` varchar(255) NULL,
                \`occup_type\` varchar(255) NULL,
                \`gender\` varchar(255) NULL,
                \`first_commence\` datetime NULL,
                \`account_no\` varchar(255) NULL,
                \`account_no_desc\` varchar(255) NULL,
                \`emp_status\` varchar(255) NULL,
                \`paypoint\` varchar(255) NULL,
                \`paypoint_desc\` varchar(255) NULL,
                \`date_of_birth\` datetime NULL,
                \`occup_pos_cat\` varchar(255) NULL,
                \`avatar_src\` varchar(255) NULL,
                \`archived_reason\` varchar(255) NULL,
                \`archived_comment\` varchar(255) NULL,
                \`archived_file\` varchar(255) NULL,
                \`archived_at\` datetime NULL,
                \`archived_by\` bigint NULL,
                \`created_by\` bigint NOT NULL,
                \`status\` tinyint NOT NULL DEFAULT 1,
                \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`deleted_at\` datetime(6) NULL,
                UNIQUE INDEX \`IDX_d9efe9b7b295017edab1ef9d7b\` (\`employee_no\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`attendances\`
            ADD CONSTRAINT \`FK_43dca8b4751d7449a38b583991c\` FOREIGN KEY (\`employee_id\`) REFERENCES \`employees\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`attendances\`
            ADD CONSTRAINT \`FK_b58d23787d8a7cf7b553828daac\` FOREIGN KEY (\`device_id\`) REFERENCES \`devices\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`attendances\`
            ADD CONSTRAINT \`FK_4339d994a1854714f2e629a6b54\` FOREIGN KEY (\`clock_out_device_id\`) REFERENCES \`devices\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`devices\`
            ADD CONSTRAINT \`FK_72da6e8556ff8064927a175f18c\` FOREIGN KEY (\`admin_location_id\`) REFERENCES \`admin_locations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`devices\`
            ADD CONSTRAINT \`FK_9d845b2bf8b0dcd91ca1017cf6d\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`user_detail\`
            ADD CONSTRAINT \`FK_aebc3bfe11ea329ed91cd8c5759\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`users\`
            ADD CONSTRAINT \`FK_7bde6d9fc009ad4bc5adeac1a7a\` FOREIGN KEY (\`admin_location_id\`) REFERENCES \`admin_locations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`admin_locations\`
            ADD CONSTRAINT \`FK_99e4212edf898616e99629a22a8\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`employees\`
            ADD CONSTRAINT \`FK_d0bba26317cffa8a5f3ae118e7b\` FOREIGN KEY (\`admin_location_id\`) REFERENCES \`admin_locations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`employees\`
            ADD CONSTRAINT \`FK_43d76ca7eecf9373241e2e890fb\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`employees\`
            ADD CONSTRAINT \`FK_9b78526cddd5b169eb7a90049f1\` FOREIGN KEY (\`archived_by\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`employees\` DROP FOREIGN KEY \`FK_9b78526cddd5b169eb7a90049f1\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`employees\` DROP FOREIGN KEY \`FK_43d76ca7eecf9373241e2e890fb\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`employees\` DROP FOREIGN KEY \`FK_d0bba26317cffa8a5f3ae118e7b\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`admin_locations\` DROP FOREIGN KEY \`FK_99e4212edf898616e99629a22a8\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`users\` DROP FOREIGN KEY \`FK_7bde6d9fc009ad4bc5adeac1a7a\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`user_detail\` DROP FOREIGN KEY \`FK_aebc3bfe11ea329ed91cd8c5759\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`devices\` DROP FOREIGN KEY \`FK_9d845b2bf8b0dcd91ca1017cf6d\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`devices\` DROP FOREIGN KEY \`FK_72da6e8556ff8064927a175f18c\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`attendances\` DROP FOREIGN KEY \`FK_4339d994a1854714f2e629a6b54\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`attendances\` DROP FOREIGN KEY \`FK_b58d23787d8a7cf7b553828daac\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`attendances\` DROP FOREIGN KEY \`FK_43dca8b4751d7449a38b583991c\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_d9efe9b7b295017edab1ef9d7b\` ON \`employees\`
        `);
    await queryRunner.query(`
            DROP TABLE \`employees\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_3fe06695daa3139b9891b04e50\` ON \`admin_locations\`
        `);
    await queryRunner.query(`
            DROP TABLE \`admin_locations\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\`
        `);
    await queryRunner.query(`
            DROP TABLE \`users\`
        `);
    await queryRunner.query(`
            DROP INDEX \`REL_aebc3bfe11ea329ed91cd8c575\` ON \`user_detail\`
        `);
    await queryRunner.query(`
            DROP TABLE \`user_detail\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_a41bd44ed7cd760ac2982e9d9c\` ON \`devices\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_2667f40edb344d6f274a0d42b6\` ON \`devices\`
        `);
    await queryRunner.query(`
            DROP TABLE \`devices\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_7797173c5d5349271c80c7122c\` ON \`attendances\`
        `);
    await queryRunner.query(`
            DROP TABLE \`attendances\`
        `);
    await queryRunner.query(`
            DROP TABLE \`payloads\`
        `);
  }
}
