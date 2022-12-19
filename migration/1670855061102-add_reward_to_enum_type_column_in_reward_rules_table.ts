import { MigrationInterface, QueryRunner } from 'typeorm'

export class addRewardToEnumTypeColumnInRewardRulesTable1670855061102
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`reward_rules\` MODIFY COLUMN \`key\` enum('cashback', 'balance', 'dividend', 'reward') NOT NULL;`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return
  }
}
