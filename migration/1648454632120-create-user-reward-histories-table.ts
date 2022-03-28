import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class createUserRewardHistoriesTable1648454632120
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_reward_histories',
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
            name: 'mission_id',
            type: 'int',
          },
          {
            name: 'user_id',
            type: 'int',
          },
          {
            name: 'user_type',
            type: 'varchar',
          },
          {
            name: 'amount',
            type: 'decimal',
            precision: 49,
            scale: 18,
            default: 0,
          },
          {
            name: 'currency',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'wallet',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'smallint',
            default: 0,
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
      'user_reward_histories',
      new TableForeignKey({
        columnNames: ['mission_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'missions',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('user_reward_histories')
    await queryRunner.dropForeignKeys(
      'user_reward_histories',
      table.foreignKeys,
    )
    await queryRunner.dropTable('user_reward_histories', true)
  }
}
