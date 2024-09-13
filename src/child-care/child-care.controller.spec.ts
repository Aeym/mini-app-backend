import { Test, TestingModule } from '@nestjs/testing';
import { ChildCareController } from './child-care.controller';
import { ChildCareService } from './child-care.service';
import { ForbiddenException } from '@nestjs/common';
import { CreateChildCareDto } from './dto/create-child-care.dto';
import { FindOneParamsDto } from '../common/dto/find-one-params.dto';
import { ChildCare } from './entities/child-care.entity';
import { User } from '../users/entities/user.entity';
import { Child } from '../child/entities/child.entity';

describe('ChildCareController', () => {
  let controller: ChildCareController;
  let service: ChildCareService;

  const mockChildCareService = {
    findAll: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildCareController],
      providers: [
        {
          provide: ChildCareService,
          useValue: mockChildCareService,
        },
      ],
    }).compile();

    controller = module.get<ChildCareController>(ChildCareController);
    service = module.get<ChildCareService>(ChildCareService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of child cares', async () => {
      const result = [mockChildCare];
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new child care', async () => {
      const createChildCareDto: CreateChildCareDto = { name: 'New Child Care' };
      const username = 'testuser';
      const createdChildCare = mockChildCare;

      jest.spyOn(service, 'create').mockResolvedValue(createdChildCare);

      expect(await controller.create(createChildCareDto, username)).toEqual(
        createdChildCare,
      );
      expect(service.create).toHaveBeenCalledWith(createChildCareDto, username);
    });

    it('should throw ForbiddenException if X-Auth header is missing', async () => {
      const createChildCareDto: CreateChildCareDto = { name: 'New Child Care' };

      await expect(controller.create(createChildCareDto, '')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a child care by ID', async () => {
      const params: FindOneParamsDto = { id: 1 };
      const username = 'testuser';

      jest.spyOn(service, 'remove').mockResolvedValue();

      await controller.remove(params, username);
      expect(service.remove).toHaveBeenCalledWith(1, username);
    });

    it('should throw ForbiddenException if X-Auth header is missing', async () => {
      const params: FindOneParamsDto = { id: 1 };

      await expect(controller.remove(params, '')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
