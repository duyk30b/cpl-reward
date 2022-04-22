import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm'

export class createMissionUserIndex1650420084545 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'mission_user',
      new TableIndex({
        isUnique: true,
        name: 'UNIQUE_MISSION_USER',
        columnNames: ['user_id', 'mission_id'],
      }),
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('mission_user', 'UNIQUE_MISSION_USER')
  }
}
