import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ChildCareService } from './child-care.service';
import { Child } from '../child/entities/child.entity';
import { ChildCare } from './entities/child-care.entity';
import { CreateChildCareDto } from './dto/create-child-care.dto';
import { EmailService } from '../email/email.service';
import { User } from '../users/entities/user.entity';

describe('ChildCareService', () => {
  let service: ChildCareService;
  let childCareRepository: Repository<ChildCare>;
  let userRepository: Repository<User>;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@test.com',
    childCares: [],
    children: [],
  };

  const mockChild: Child = {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    user: mockUser,
    childCares: [],
  };

  const mockChildCare: ChildCare = {
    id: 1,
    name: 'Test ChildCare',
    user: mockUser,
    children: [mockChild],
  };

  const mockChildCareRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockChildRepository = {
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  const mockEmailService = {
    sendEmailsInBatches: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChildCareService,
        {
          provide: getRepositoryToken(ChildCare),
          useValue: mockChildCareRepository,
        },
        {
          provide: getRepositoryToken(Child),
          useValue: mockChildRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<ChildCareService>(ChildCareService);
    childCareRepository = module.get<Repository<ChildCare>>(
      getRepositoryToken(ChildCare),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all child cares', async () => {
      const result = [mockChildCare];
      jest.spyOn(childCareRepository, 'find').mockResolvedValue(result);

      const childCares = await service.findAll();
      expect(childCareRepository.find).toHaveBeenCalledWith({
        relations: ['user'],
      });
      expect(childCares).toEqual(result);
    });
  });

  describe('create', () => {
    it('should create a new child care', async () => {
      const createChildCareDto: CreateChildCareDto = { name: 'New Child Care' };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest.spyOn(childCareRepository, 'create').mockReturnValue(mockChildCare);
      jest.spyOn(childCareRepository, 'save').mockResolvedValue(mockChildCare);

      const result = await service.create(createChildCareDto, 'testuser');

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        username: 'testuser',
      });
      expect(childCareRepository.create).toHaveBeenCalledWith({
        name: createChildCareDto.name,
        user: mockUser,
      });
      expect(childCareRepository.save).toHaveBeenCalledWith(mockChildCare);
      expect(result).toEqual(mockChildCare);
    });
  });
});
