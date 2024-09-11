import { Controller, Get, Body, Param, Put } from '@nestjs/common';

import { CreateOrUpdateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put()
  createOrUpdateUser(@Body() createOrUpdateUserDto: CreateOrUpdateUserDto) {
    return this.usersService.createOrUpdate(createOrUpdateUserDto);
  }

  @Get(':username')
  async findOne(@Param() getUserDto: GetUserDto) {
    return this.usersService.findOne(getUserDto.username);
  }
}
