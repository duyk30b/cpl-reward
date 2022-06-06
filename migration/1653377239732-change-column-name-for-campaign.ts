import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm'

export class changeColumnNameForCampaign1653377239732
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'campaigns',
      'is_system',
      new TableColumn({
        name: 'type',
        type: 'tinyint',
        default: 0,
      }),
    )
    await queryRunner.createIndex(
      'campaigns',
      new TableIndex({
        name: 'INDEX_CAMPAIGN_TYPE',
        columnNames: ['type'],
      }),
    )
    await queryRunner.addColumn(
      'campaigns',
      new TableColumn({
        name: 'reset_time',
        type: 'varchar(5)',
        default: "'00:00'",
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('campaigns', 'reset_time')
    await queryRunner.dropIndex('campaigns', 'INDEX_CAMPAIGN_TYPE')
    await queryRunner.changeColumn(
      'campaigns',
      'type',
      new TableColumn({
        name: 'is_system',
        type: 'boolean',
        default: false,
      }),
    )
  }
}
