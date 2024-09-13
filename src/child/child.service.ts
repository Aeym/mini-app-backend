import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Response } from 'express';
import { format } from 'fast-csv';
import { PassThrough } from 'stream';

import { Child } from './entities/child.entity';
import { ChildCare } from '../child-care/entities/child-care.entity';
import { CreateChildDto } from './dto/create-child.dto';
import { User } from '../users/entities/user.entity';

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
      relations: ['children', 'children.user'],
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
        child.childCares.push(childCare);
        await this.childRepository.save(child);
      } else {
        throw new ConflictException(
          'Child is already assigned to this child care.',
        );
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

    child.childCares = child.childCares.filter(
      (cc) => cc.id.toString() !== childCareId.toString(),
    );

    if (child.childCares.length === 0) {
      await this.childRepository.remove(child);
    } else {
      await this.childRepository.save(child);
    }
  }

  async exportChildren(res: Response, childCareId?: number): Promise<void> {
    const passThrough = new PassThrough();

    const csvStream = format({
      headers: ['ID', 'First Name', 'Last Name', 'User ID'],
    });
    csvStream.pipe(passThrough);
    passThrough.pipe(res);

    const childrenQuery = this.childRepository
      .createQueryBuilder('child')
      .select([
        'child.id AS child_id',
        'child.firstname AS child_firstname',
        'child.lastname AS child_lastname',
        'child.userId AS child_userId',
      ])
      .orderBy('child.lastname', 'ASC');

    if (childCareId) {
      childrenQuery
        .leftJoin('child.childCares', 'childCare')
        .where('childCare.id = :childCareId', { childCareId });
    }

    const stream = await childrenQuery.stream();
    stream.on('data', (rawChild: any) => {
      csvStream.write({
        ID: rawChild.child_id,
        'First Name': rawChild.child_firstname,
        'Last Name': rawChild.child_lastname,
        'User ID': rawChild.child_userId,
      });
    });

    stream.on('end', () => csvStream.end());

    stream.on('error', (error) => {
      console.error('Error streaming data:', error);
      csvStream.end();
    });
  }
}
