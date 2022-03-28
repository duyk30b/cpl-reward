import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createMissionUserLogTable1648454684733
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'mission_user_logs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'mission_id',
            type: 'int',
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'success_count',
            type: 'int',
            default: 0,
          },
          {
            name: 'money_earned',
            type: 'decimal',
            precision: 49,
            scale: 18,
            isNullable: true,
          },
          {
            name: 'total_money_earned',
            type: 'decimal',
            precision: 49,
            scale: 18,
            isNullable: true,
          },
          {
            name: 'referred_user_info',
            type: 'varchar',
          },
          {
            name: 'note',
            type: 'text',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('mission_user_logs')
  }
}
