import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateOrUpdateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    createOrUpdate: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService, // Mock the UsersService
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrUpdateUser', () => {
    it('should call UsersService.createOrUpdate with the correct DTO', async () => {
      const createOrUpdateUserDto: CreateOrUpdateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
      };

      mockUsersService.createOrUpdate.mockResolvedValue(createOrUpdateUserDto);

      const result = await controller.createOrUpdateUser(createOrUpdateUserDto);

      expect(usersService.createOrUpdate).toHaveBeenCalledWith(
        createOrUpdateUserDto,
      );
      expect(result).toEqual(createOrUpdateUserDto);
    });
  });

  describe('findOne', () => {
    it('should call UsersService.findOne with the correct username', async () => {
      const getUserDto: GetUserDto = {
        username: 'testuser',
      };
      const expectedUser = { username: 'testuser', email: 'test@example.com' };

      mockUsersService.findOne.mockResolvedValue(expectedUser);

      const result = await controller.findOne(getUserDto);

      expect(usersService.findOne).toHaveBeenCalledWith('testuser');
      expect(result).toEqual(expectedUser);
    });

    it('should return null if the user is not found', async () => {
      const getUserDto: GetUserDto = {
        username: 'nonexistentuser',
      };

      mockUsersService.findOne.mockResolvedValue(null);

      const result = await controller.findOne(getUserDto);

      expect(usersService.findOne).toHaveBeenCalledWith('nonexistentuser');
      expect(result).toBeNull();
    });
  });
});
