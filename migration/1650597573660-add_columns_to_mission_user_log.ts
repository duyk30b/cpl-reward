import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm'

export class addColumnsToMissionUserLog1650597573660
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'mission_user_logs',
      new TableColumn({
        name: 'wallet',
        type: 'varchar(100)',
        isNullable: true,
      }),
    )

    await queryRunner.addColumn(
      'mission_user_logs',
      new TableColumn({
        name: 'status',
        type: 'tinyint',
        default: 0,
      }),
    )

    await queryRunner.createIndex(
      'mission_user_logs',
      new TableIndex({
        name: 'INDEX_STATUS',
        columnNames: ['status'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('mission_user_logs', 'INDEX_STATUS')
    await queryRunner.dropColumn('mission_user_logs', 'wallet')
    await queryRunner.dropColumn('mission_user_logs', 'status')
  }
}
