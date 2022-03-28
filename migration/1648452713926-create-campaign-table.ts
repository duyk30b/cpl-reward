import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm'

export class createCampaignTable1648452713926 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'campaigns',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'start_date',
            type: 'int',
          },
          {
            name: 'end_date',
            type: 'int',
          },
          {
            name: 'notification_link',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'campaign_image',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'priority',
            type: 'int',
            default: 0,
          },
          {
            name: 'is_system',
            type: 'tinyint',
            default: 0,
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
            name: 'title_jp',
            type: 'varchar',
          },
          {
            name: 'description_jp',
            type: 'text',
          },
          {
            name: 'notification_link_jp',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'campaign_image_jp',
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
    await queryRunner.createIndex(
      'campaigns',
      new TableIndex({
        name: 'INDEX_TITLE',
        columnNames: ['title'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('campaigns', 'INDEX_TITLE')
    await queryRunner.dropTable('campaigns', true)
  }
}
