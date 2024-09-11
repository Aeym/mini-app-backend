import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChildCareService } from './child-care.service';
import { CreateChildCareDto } from './dto/create-child-care.dto';
import { UpdateChildCareDto } from './dto/update-child-care.dto';

@Controller('child-care')
export class ChildCareController {
  constructor(private readonly childCareService: ChildCareService) {}

  @Post()
  create(@Body() createChildCareDto: CreateChildCareDto) {
    return this.childCareService.create(createChildCareDto);
  }

  @Get()
  findAll() {
    return this.childCareService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.childCareService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChildCareDto: UpdateChildCareDto,
  ) {
    return this.childCareService.update(+id, updateChildCareDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.childCareService.remove(+id);
  }
}
