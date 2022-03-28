import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class createAdminActionLogTable1648454705542
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'admin_action_logs',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'admin_id',
            type: 'int',
          },
          {
            name: 'action_name',
            type: 'varchar',
          },
          {
            name: 'content_data',
            type: 'varchar',
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
    await queryRunner.dropTable('admin_action_logs')
  }
}
