import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createMissionUserTable1648454673446 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'mission_user',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'mission_id',
            type: 'int',
          },
          {
            name: 'campaign_id',
            type: 'int',
          },
          {
            name: 'user_id',
            type: 'bigInt',
          },
          {
            name: 'success_count',
            type: 'int',
            default: 0,
          },
          {
            name: 'money_earned',
            type: 'decimal',
            precision: 49,
            scale: 18,
            default: 0,
          },
          {
            name: 'total_money_earned',
            type: 'decimal',
            precision: 49,
            scale: 18,
            default: 0,
          },
          {
            name: 'referred_user_info',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'updated_at',
            type: 'int',
            isNullable: true,
          },
        ],
      }),
      true,
    )
    await queryRunner.createIndex(
      'mission_user',
      new TableIndex({
        name: 'INDEX_CAMPAIGN_ID',
        columnNames: ['campaign_id'],
      }),
    )

    await queryRunner.createIndex(
      'mission_user',
      new TableIndex({
        name: 'INDEX_MISSION_ID',
        columnNames: ['mission_id'],
      }),
    )

    await queryRunner.createIndex(
      'mission_user',
      new TableIndex({
        name: 'INDEX_USER_ID',
        columnNames: ['user_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('mission_user', 'INDEX_CAMPAIGN_ID')
    await queryRunner.dropIndex('mission_user', 'INDEX_MISSION_ID')
    await queryRunner.dropIndex('mission_user', 'INDEX_USER_ID')
    await queryRunner.dropTable('mission_users')
  }
}
