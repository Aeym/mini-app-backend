import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Headers,
  ForbiddenException,
} from '@nestjs/common';

import { ChildCareService } from './child-care.service';
import { CreateChildCareDto } from './dto/create-child-care.dto';
import { FindOneParamsDto } from '../common/dto/find-one-params.dto';

@Controller()
export class ChildCareController {
  constructor(private readonly childCareService: ChildCareService) {}

  @Get('child-cares')
  async findAll() {
    return this.childCareService.findAll();
  }

  @Post('child-care')
  async create(
    @Body() createChildCareDto: CreateChildCareDto,
    @Headers('X-Auth') username: string,
  ) {
    if (!username) {
      throw new ForbiddenException('Missing X-Auth header');
    }

    return this.childCareService.create(createChildCareDto, username);
  }

  @Delete('child-care/:id')
  async remove(
    @Param() params: FindOneParamsDto,
    @Headers('X-Auth') username: string,
  ) {
    if (!username) {
      throw new ForbiddenException('Missing X-Auth header');
    }

    return this.childCareService.remove(params.id, username);
  }
}
