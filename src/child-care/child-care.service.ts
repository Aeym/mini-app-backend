import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChildCare } from './entities/child-care.entity';
import { CreateChildCareDto } from './dto/create-child-care.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChildCareService {
  constructor(
    @InjectRepository(ChildCare)
    private childCareRepository: Repository<ChildCare>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<ChildCare[]> {
    return this.childCareRepository.find();
  }

  async create(
    createChildCareDto: CreateChildCareDto,
    username: string,
  ): Promise<ChildCare> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    const childCare = this.childCareRepository.create({
      name: createChildCareDto.name,
      user: user,
    });

    return this.childCareRepository.save(childCare);
  }

  async remove(id: number, username: string): Promise<void> {
    const childCare = await this.childCareRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!childCare) {
      throw new NotFoundException(`Child care with ID ${id} not found`);
    }

    if (childCare.user.username !== username) {
      throw new ForbiddenException(`You cannot delete this child care`);
    }

    await this.childCareRepository.delete(id);
  }
}
