import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm'

export class removeUnusedIdxMissionUser1651117663298
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('mission_user', 'UNIQUE_MISSION_USER')
    await queryRunner.dropIndex('mission_user', 'UNIQUE_MISSION_USER_UMC')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'mission_user',
      new TableIndex({
        isUnique: true,
        name: 'UNIQUE_MISSION_USER',
        columnNames: ['user_id', 'mission_id'],
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
}
