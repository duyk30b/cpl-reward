import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addTargetTypeColumn1648573194615 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'missions',
      new TableColumn({
        name: 'target_type',
        type: 'smallint',
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('missions', 'target_type')
  }
}
