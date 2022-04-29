import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm'

export class addColumnReferenceIdToHistory1651223764357
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('user_reward_histories', [
      new TableColumn({
        name: 'reference_id',
        type: 'bigInt',
        isNullable: true,
        default: null,
      }),
    ])
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user_reward_histories', 'reference_id')
  }
}
