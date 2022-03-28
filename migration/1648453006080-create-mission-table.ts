import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class createMissionTable1648453006080 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'missions',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'campaign_id',
            type: 'int',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'title_jp',
            type: 'varchar',
          },
          {
            name: 'detail_explain',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'detail_explain_jp',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'guide_link',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'guide_link_jp',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'opening_date',
            type: 'int',
          },
          {
            name: 'closing_date',
            type: 'int',
          },
          {
            name: 'priority',
            type: 'int',
            default: 0,
          },
          {
            name: 'limit_received_reward',
            type: 'int',
            default: 1,
          },
          {
            name: 'is_active',
            type: 'smallint',
            default: 1,
          },
          {
            name: 'status',
            type: 'smallint',
            default: 0,
          },
          {
            name: 'judgment_conditions',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'user_conditions',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'grant_target',
            type: 'text',
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
      true,
    )

    await queryRunner.createForeignKey(
      'missions',
      new TableForeignKey({
        columnNames: ['campaign_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'campaigns',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('missions')
    await queryRunner.dropForeignKeys('missions', table.foreignKeys)
    await queryRunner.dropTable('missions', true)
  }
}
