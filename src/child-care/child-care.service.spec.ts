import { Test, TestingModule } from '@nestjs/testing';
import { ChildCareService } from './child-care.service';

describe('ChildCareService', () => {
  let service: ChildCareService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChildCareService],
    }).compile();

    service = module.get<ChildCareService>(ChildCareService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
