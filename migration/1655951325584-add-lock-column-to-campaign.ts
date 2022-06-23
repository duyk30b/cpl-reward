import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addLockColumnToCampaign1655951325584
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'campaigns',
      new TableColumn({
        name: 'is_lock',
        type: 'boolean',
        default: false,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('campaigns', 'is_lock')
  }
}
