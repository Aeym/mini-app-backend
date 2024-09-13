import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Child } from '../child/entities/child.entity';
import { ChildCare } from './entities/child-care.entity';
import { CreateChildCareDto } from './dto/create-child-care.dto';
import { EmailService } from '../email/email.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChildCareService {
  constructor(
    @InjectRepository(ChildCare)
    private childCareRepository: Repository<ChildCare>,
    @InjectRepository(Child)
    private childRepository: Repository<Child>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
  ) {}

  async findAll(): Promise<ChildCare[]> {
    return this.childCareRepository.find({
      relations: ['user'],
    });
  }

  async create(
    createChildCareDto: CreateChildCareDto,
    username: string,
  ): Promise<ChildCare> {
    const user = await this.findUserByUsername(username);

    const childCare = this.childCareRepository.create({
      name: createChildCareDto.name,
      user: user,
    });

    return this.childCareRepository.save(childCare);
  }

  async remove(id: number, username: string): Promise<void> {
    const childCare = await this.childCareRepository.findOne({
      where: { id },
      relations: ['user', 'children', 'children.childCares', 'children.user'],
    });

    if (!childCare) {
      throw new NotFoundException(`Child care with ID ${id} not found`);
    }

    if (childCare.user.username !== username) {
      throw new ForbiddenException(`You cannot delete this child care`);
    }

    await this.handleChildCareRemoval(childCare, id);

    const usersToInform = this.getUsersToInform(childCare, username);
    const emailList = Array.from(usersToInform);

    setImmediate(() => this.emailService.sendEmailsInBatches(emailList));
  }

  private async handleChildCareRemoval(
    childCare: ChildCare,
    childCareId: number,
  ): Promise<void> {
    for (const child of childCare.children) {
      child.childCares = child.childCares.filter(
        (cc) => cc.id.toString() !== childCareId.toString(),
      );
      await this.childRepository.save(child);

      if (child.childCares.length === 0) {
        await this.childRepository.delete(child.id);
      }
    }

    await this.childCareRepository.delete(childCareId);
  }

  private async findUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  private getUsersToInform(
    childCare: ChildCare,
    initiatorUsername: string,
  ): Set<string> {
    const usersToInform = new Set<string>();
    for (const child of childCare.children) {
      if (child.user.username !== initiatorUsername) {
        usersToInform.add(child.user.email);
      }
    }
    return usersToInform;
  }
}
