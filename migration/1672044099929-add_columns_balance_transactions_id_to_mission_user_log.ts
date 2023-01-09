import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addColumnsBalanceTransactionsIdToMissionUserLog1672044099929
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'mission_user_logs',
      new TableColumn({
        name: 'balance_transaction_id',
        type: 'varchar',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('mission_user_logs', 'balance_transaction_id')
  }
}
