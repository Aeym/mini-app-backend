import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Child } from './entities/child.entity';
import { ChildCare } from 'src/child-care/entities/child-care.entity';
import { CreateChildDto } from './dto/create-child.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ChildService {
  constructor(
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ChildCare)
    private childCareRepository: Repository<ChildCare>,
  ) {}

  async findChildrenByChildCare(childCareId: number): Promise<Child[]> {
    const childCare = await this.childCareRepository.findOne({
      where: { id: childCareId },
      relations: ['children'],
    });

    if (!childCare) {
      throw new NotFoundException(
        `Child care with ID ${childCareId} not found`,
      );
    }

    return childCare.children;
  }

  async createOrUpdateChild(
    createChildDto: CreateChildDto,
    username: string,
  ): Promise<Child> {
    const { firstname, lastname, childCareId } = createChildDto;

    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    const childCare = await this.childCareRepository.findOneBy({
      id: childCareId,
    });
    if (!childCare) {
      throw new NotFoundException(
        `Child care with ID ${childCareId} not found`,
      );
    }

    let child = await this.childRepository.findOne({
      where: { firstname, lastname, user },
      relations: ['childCares'],
    });

    if (child) {
      if (!child.childCares.some((cc) => cc.id === childCareId)) {
        // TODO : ne pas réassigner si déjà le cas
        child.childCares.push(childCare);
        await this.childRepository.save(child);
      }
    } else {
      child = this.childRepository.create({
        firstname,
        lastname,
        user,
        childCares: [childCare],
      });
      await this.childRepository.save(child);
    }

    return child;
  }

  async removeChildAssignment(
    childCareId: number,
    childId: number,
    username: string,
  ): Promise<void> {
    const child = await this.childRepository.findOne({
      where: { id: childId },
      relations: ['childCares', 'user'],
    });

    if (!child) {
      throw new NotFoundException(`Child with ID ${childId} not found`);
    }

    if (child.user.username !== username) {
      throw new ForbiddenException('You cannot remove this assignment');
    }

    const childCare = await this.childCareRepository.findOneBy({
      id: childCareId,
    });
    if (!childCare) {
      throw new NotFoundException(
        `Child care with ID ${childCareId} not found`,
      );
    }

    child.childCares = child.childCares.filter((cc) => cc.id === childCareId);

    if (child.childCares.length === 0) {
      await this.childRepository.remove(child);
    } else {
      await this.childRepository.save(child);
    }
  }
}
