import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addDisplayConditionsToMissions1650945310000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'missions',
      new TableColumn({
        name: 'display_conditions',
        type: 'text',
        isNullable: true,
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('missions', 'display_conditions')
  }
}
