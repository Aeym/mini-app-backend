import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Headers,
  ForbiddenException,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';

import { ChildService } from './child.service';
import { CreateChildDto } from './dto/create-child.dto';
import { FindOneParamsDto } from '../common/dto/find-one-params.dto';
import { RemoveAssignementDto } from './dto/remove-assignement.dto';

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
    @Param() removeAssignementDto: RemoveAssignementDto,
    @Headers('X-Auth') username: string,
  ) {
    if (!username) {
      throw new ForbiddenException('Missing X-Auth header');
    }

    return this.childService.removeChildAssignment(
      removeAssignementDto.childCareId,
      removeAssignementDto.childId,
      username,
    );
  }

  @Get('children/export.csv')
  async exportChildren(
    @Query('childCareId') childCareId: number | undefined,
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="children_export.csv"',
    );

    await this.childService.exportChildren(res, childCareId);
  }
}
