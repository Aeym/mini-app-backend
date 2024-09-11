import { Test, TestingModule } from '@nestjs/testing';
import { ChildCareController } from './child-care.controller';
import { ChildCareService } from './child-care.service';

describe('ChildCareController', () => {
  let controller: ChildCareController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildCareController],
      providers: [ChildCareService],
    }).compile();

    controller = module.get<ChildCareController>(ChildCareController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
