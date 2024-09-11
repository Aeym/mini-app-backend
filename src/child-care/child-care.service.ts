import { Injectable } from '@nestjs/common';
import { CreateChildCareDto } from './dto/create-child-care.dto';
import { UpdateChildCareDto } from './dto/update-child-care.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChildCare } from './entities/child-care.entity';

@Injectable()
export class ChildCareService {
  constructor(
    @InjectRepository(ChildCare)
    private usersRepository: Repository<ChildCare>,
  ) {}

  create(createChildCareDto: CreateChildCareDto) {
    return 'This action adds a new childCare';
  }

  findAll() {
    return `This action returns all childCare`;
  }

  findOne(id: number) {
    return `This action returns a #${id} childCare`;
  }

  update(id: number, updateChildCareDto: UpdateChildCareDto) {
    return `This action updates a #${id} childCare`;
  }

  remove(id: number) {
    return `This action removes a #${id} childCare`;
  }
}
