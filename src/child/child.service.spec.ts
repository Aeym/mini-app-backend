import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChildService } from './child.service';
import { Child } from './entities/child.entity';
import { ChildCare } from '../child-care/entities/child-care.entity';
import { User } from '../users/entities/user.entity';

describe('ChildService', () => {
  let service: ChildService;
  let childRepository: Repository<Child>;
  let childCareRepository: Repository<ChildCare>;
  let userRepository: Repository<User>;

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    email: 'test@test.com',
    childCares: [],
    children: [],
  };
  const mockChildCare: ChildCare = {
    id: 1,
    name: 'Test ChildCare',
    user: mockUser,
    children: [],
  };
  const mockChild: Child = {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    user: mockUser,
    childCares: [mockChildCare],
  };

  const mockChildRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      stream: jest.fn(),
    })),
  };

  const mockChildCareRepository = {
    findOne: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChildService,
        { provide: getRepositoryToken(Child), useValue: mockChildRepository },
        {
          provide: getRepositoryToken(ChildCare),
          useValue: mockChildCareRepository,
        },
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<ChildService>(ChildService);
    childRepository = module.get<Repository<Child>>(getRepositoryToken(Child));
    childCareRepository = module.get<Repository<ChildCare>>(
      getRepositoryToken(ChildCare),
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findChildrenByChildCare', () => {
    it('should return children of a specific child care', async () => {
      jest
        .spyOn(childCareRepository, 'findOne')
        .mockResolvedValue(mockChildCare);
      const result = await service.findChildrenByChildCare(1);
      expect(childCareRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['children', 'children.user'],
      });
      expect(result).toEqual(mockChildCare.children);
    });

    it('should throw NotFoundException if child care is not found', async () => {
      jest.spyOn(childCareRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findChildrenByChildCare(1)).rejects.toThrow(
        new NotFoundException(`Child care with ID 1 not found`),
      );
    });
  });

  describe('createOrUpdateChild', () => {
    it('should create a new child if not found', async () => {
      const createChildDto = {
        firstname: 'John',
        lastname: 'Doe',
        childCareId: 1,
      };
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest
        .spyOn(childCareRepository, 'findOneBy')
        .mockResolvedValue(mockChildCare);
      jest.spyOn(childRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(childRepository, 'create').mockReturnValue(mockChild);
      jest.spyOn(childRepository, 'save').mockResolvedValue(mockChild);

      const result = await service.createOrUpdateChild(
        createChildDto,
        'testuser',
      );

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        username: 'testuser',
      });
      expect(childCareRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(childRepository.create).toHaveBeenCalledWith({
        firstname: 'John',
        lastname: 'Doe',
        user: mockUser,
        childCares: [mockChildCare],
      });
      expect(childRepository.save).toHaveBeenCalledWith(mockChild);
      expect(result).toEqual(mockChild);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(null);
      const createChildDto = {
        firstname: 'John',
        lastname: 'Doe',
        childCareId: 1,
      };
      await expect(
        service.createOrUpdateChild(createChildDto, 'testuser'),
      ).rejects.toThrow(
        new NotFoundException('User with username testuser not found'),
      );
    });

    it('should throw ConflictException if child already assigned', async () => {
      jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(mockUser);
      jest
        .spyOn(childCareRepository, 'findOneBy')
        .mockResolvedValue(mockChildCare);
      jest.spyOn(childRepository, 'findOne').mockResolvedValue(mockChild);

      const createChildDto = {
        firstname: 'John',
        lastname: 'Doe',
        childCareId: 1,
      };

      await expect(
        service.createOrUpdateChild(createChildDto, 'testuser'),
      ).rejects.toThrow(
        new ConflictException('Child is already assigned to this child care.'),
      );
    });
  });

  describe('removeChildAssignment', () => {
    it('should remove child assignment if authorized', async () => {
      jest.spyOn(childRepository, 'findOne').mockResolvedValue(mockChild);
      jest
        .spyOn(childCareRepository, 'findOneBy')
        .mockResolvedValue(mockChildCare);
      jest.spyOn(childRepository, 'save').mockResolvedValue(mockChild);

      await service.removeChildAssignment(1, 1, 'testuser');

      expect(childRepository.save).toHaveBeenCalled();
      expect(childRepository.remove).toHaveBeenCalled();
    });

    it('should throw NotFoundException if child not found', async () => {
      jest.spyOn(childRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.removeChildAssignment(1, 1, 'testuser'),
      ).rejects.toThrow(new NotFoundException(`Child with ID 1 not found`));
    });

    it('should throw ForbiddenException if user is not the child owner', async () => {
      const otherUser = { ...mockUser, username: 'otheruser' };
      const otherChild = { ...mockChild, user: otherUser };
      jest.spyOn(childRepository, 'findOne').mockResolvedValue(otherChild);

      await expect(
        service.removeChildAssignment(1, 1, 'testuser'),
      ).rejects.toThrow(
        new ForbiddenException('You cannot remove this assignment'),
      );
    });
  });
});
