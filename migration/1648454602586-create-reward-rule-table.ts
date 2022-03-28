import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm'

export class createRewardRuleTable1648454602586 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'reward_rules',
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
            name: 'type_rule',
            type: 'varchar',
          },
          {
            name: 'key',
            type: 'varchar',
          },
          {
            name: 'currency',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'limit_value',
            type: 'decimal',
            precision: 49,
            scale: 18,
            isNullable: true,
          },
          {
            name: 'release_value',
            type: 'decimal',
            precision: 49,
            scale: 18,
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

    await queryRunner.createForeignKey(
      'reward_rules',
      new TableForeignKey({
        columnNames: ['mission_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'missions',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('reward_rules')
    await queryRunner.dropForeignKeys('reward_rules', table.foreignKeys)
    await queryRunner.dropTable('reward_rules', true)
  }
}
