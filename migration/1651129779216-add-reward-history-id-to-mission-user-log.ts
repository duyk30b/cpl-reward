import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addRewardHistoryIdToMissionUserLog1651129779216
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'mission_user_logs',
      new TableColumn({
        name: 'reward_history_id',
        type: 'int',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('mission_user_logs', 'reward_history_id')
  }
}
