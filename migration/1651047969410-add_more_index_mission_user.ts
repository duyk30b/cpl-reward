import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm'

export class addMoreIndexMissionUser1651047969410
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'mission_user',
      new TableIndex({
        isUnique: true,
        name: 'UNIQUE_MISSION_USER_UMC',
        columnNames: ['user_id', 'mission_id', 'campaign_id'],
      }),
    )
    await queryRunner.createIndex(
      'mission_user',
      new TableIndex({
        isUnique: true,
        name: 'UNIQUE_MISSION_USER_UMCT',
        columnNames: ['user_id', 'mission_id', 'campaign_id', 'user_type'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('mission_user', 'UNIQUE_MISSION_USER_UMC')
    await queryRunner.dropIndex('mission_user', 'UNIQUE_MISSION_USER_UMCT')
  }
}
