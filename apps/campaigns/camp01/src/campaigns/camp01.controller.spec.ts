import { Test, TestingModule } from '@nestjs/testing';
import { Campaigns/camp01Controller } from './campaigns/camp01.controller';
import { Campaigns/camp01Service } from './campaigns/camp01.service';

describe('Campaigns/camp01Controller', () => {
  let campaigns/camp01Controller: Campaigns/camp01Controller;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [Campaigns/camp01Controller],
      providers: [Campaigns/camp01Service],
    }).compile();

    campaigns/camp01Controller = app.get<Campaigns/camp01Controller>(Campaigns/camp01Controller);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(campaigns/camp01Controller.getHello()).toBe('Hello World!');
    });
  });
});
