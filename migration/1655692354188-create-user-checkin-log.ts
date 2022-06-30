import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createUserCheckinLog1655692354188 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_checkin_logs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'campaign_id',
            type: 'int',
          },
          {
            name: 'last_ignore_display',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'last_checkin',
            type: 'int',
            isNullable: true,
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
    )

    await queryRunner.createIndex(
      'user_checkin_logs',
      new TableIndex({
        name: 'INDEX_USER_CAMPAIGN',
        columnNames: ['user_id', 'campaign_id'],
      }),
    )

    await queryRunner.createIndex(
      'user_checkin_logs',
      new TableIndex({
        isUnique: true,
        name: 'UNIQUE_USER_CAMPAIGN',
        columnNames: ['user_id', 'campaign_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_checkin_logs')
  }
}
