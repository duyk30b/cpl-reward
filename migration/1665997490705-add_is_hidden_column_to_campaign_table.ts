import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addIsHiddenColumnToCampaignTable1665997490705
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'campaigns',
      new TableColumn({
        name: 'is_hidden',
        type: 'boolean',
        default: false,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('campaigns', 'is_hidden')
  }
}
