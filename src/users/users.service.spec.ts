import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';

import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateOrUpdateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;

  const mockUsersRepository = {
    findOneBy: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrUpdate', () => {
    const createOrUpdateUserDto: CreateOrUpdateUserDto = {
      email: 'test@example.com',
      username: 'testuser',
    };

    it('should create a new user if it does not exist', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null);
      mockUsersRepository.create.mockReturnValue({
        email: createOrUpdateUserDto.email,
        username: createOrUpdateUserDto.username,
      });
      mockUsersRepository.save.mockResolvedValue({
        id: 1,
        email: createOrUpdateUserDto.email,
        username: createOrUpdateUserDto.username,
      });

      const result = await service.createOrUpdate(createOrUpdateUserDto);

      expect(result).toEqual({
        id: 1,
        email: createOrUpdateUserDto.email,
        username: createOrUpdateUserDto.username,
      });
      expect(usersRepository.create).toHaveBeenCalledWith({
        email: createOrUpdateUserDto.email,
        username: createOrUpdateUserDto.username,
      });
      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if username already exists', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue({
        id: 1,
        email: createOrUpdateUserDto.email,
        username: createOrUpdateUserDto.username,
      });

      await expect(
        service.createOrUpdate(createOrUpdateUserDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findOne', () => {
    it('should return the user when found', async () => {
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        childCares: [],
        children: [],
      };
      mockUsersRepository.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findOne('testuser');

      expect(result).toEqual(mockUser);
      expect(usersRepository.findOneBy).toHaveBeenCalledWith({
        username: 'testuser',
      });
    });

    it('should throw NotFoundException when the user is not found', async () => {
      mockUsersRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('nonexistentuser')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
