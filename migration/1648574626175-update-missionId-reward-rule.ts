import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class updateMissionIdRewardRule1648574626175
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'reward_rules',
      new TableColumn({
        name: 'mission_id',
        type: 'int',
      }),
      new TableColumn({
        name: 'mission_id',
        type: 'int',
        default: null,
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'reward_rules',
      new TableColumn({
        name: 'mission_id',
        type: 'int',
        default: null,
      }),
      new TableColumn({
        name: 'mission_id',
        type: 'int',
      }),
    )
  }
}
