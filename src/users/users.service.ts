import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateOrUpdateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createOrUpdate(
    createOrUpdateUserDto: CreateOrUpdateUserDto,
  ): Promise<User> {
    const { email, username } = createOrUpdateUserDto;

    await this.ensureUsernameIsUnique(username);

    const user = await this.findOrCreateUserByEmail(email, username);

    return this.usersRepository.save(user);
  }

  async findOne(username: string): Promise<User> {
    return this.findUserByUsername(username);
  }

  private async ensureUsernameIsUnique(username: string): Promise<void> {
    const userWithUsername = await this.usersRepository.findOneBy({ username });

    if (userWithUsername) {
      throw new ConflictException('Username already exists');
    }
  }

  private async findOrCreateUserByEmail(
    email: string,
    username: string,
  ): Promise<User> {
    let user = await this.usersRepository.findOneBy({ email });

    if (user) {
      user.username = username;
    } else {
      user = this.usersRepository.create({ email, username });
    }

    return user;
  }

  private async findUserByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException(`User not found with username: ${username}`);
    }

    return user;
  }
}
