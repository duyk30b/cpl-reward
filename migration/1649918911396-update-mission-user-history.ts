import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class updateMissionUserHistory1649918911396
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('mission_user', [
      'money_earned',
      'total_money_earned',
      'referred_user_info',
    ])
    await queryRunner.addColumns('mission_user', [
      new TableColumn({
        name: 'user_type',
        type: 'varchar',
      }),
    ])

    await queryRunner.dropColumns('mission_user_logs', [
      'referred_user_info',
      'total_money_earned',
    ])
    await queryRunner.addColumns('mission_user_logs', [
      new TableColumn({
        name: 'currency',
        type: 'varchar',
        isNullable: true,
      }),
      new TableColumn({
        name: 'user_type',
        type: 'varchar',
      }),
    ])

    await queryRunner.addColumns('user_reward_histories', [
      new TableColumn({
        name: 'referrer_user_id',
        type: 'bigInt',
        isNullable: true,
        default: null,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('mission_user', [
      new TableColumn({
        name: 'money_earned',
        type: 'decimal',
        precision: 49,
        scale: 18,
        default: 0,
      }),
      new TableColumn({
        name: 'total_money_earned',
        type: 'decimal',
        precision: 49,
        scale: 18,
        default: 0,
      }),
      new TableColumn({
        name: 'referred_user_info',
        type: 'varchar',
      }),
    ])
    await queryRunner.dropColumns('mission_user', ['user_type'])

    await queryRunner.addColumns('mission_user_logs', [
      new TableColumn({
        name: 'total_money_earned',
        type: 'decimal',
        precision: 49,
        scale: 18,
        default: 0,
      }),
      new TableColumn({
        name: 'referred_user_info',
        type: 'varchar',
      }),
    ])
    await queryRunner.dropColumns('mission_user_logs', [
      'currency',
      'user_type',
    ])

    await queryRunner.dropColumns('user_reward_histories', ['referrer_user_id'])
  }
}
