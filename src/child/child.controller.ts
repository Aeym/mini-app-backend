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

import { ChildService } from './child.service';
import { CreateChildDto } from './dto/create-child.dto';
import { FindOneParamsDto } from 'src/common/dto/find-one-params.dto';

@Controller()
export class ChildController {
  constructor(private readonly childService: ChildService) {}

  @Get('child-care/:id/children')
  async findChildrenByChildCare(@Param() params: FindOneParamsDto) {
    return this.childService.findChildrenByChildCare(params.id);
  }

  @Post('child')
  async create(
    @Body() createChildDto: CreateChildDto,
    @Headers('X-Auth') username: string,
  ) {
    if (!username) {
      throw new ForbiddenException('Missing X-Auth header');
    }

    return this.childService.createOrUpdateChild(createChildDto, username);
  }

  @Delete('child-care/:childCareId/child/:childId')
  async removeAssignment(
    @Param('childCareId') childCareId: number,
    @Param('childId') childId: number,
    @Headers('X-Auth') username: string,
  ) {
    if (!username) {
      throw new ForbiddenException('Missing X-Auth header');
    }

    return this.childService.removeChildAssignment(
      childCareId,
      childId,
      username,
    );
  }
}
