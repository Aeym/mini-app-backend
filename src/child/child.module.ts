import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Child } from './entities/child.entity';
import { ChildCareModule } from 'src/child-care/child-care.module';
import { ChildController } from './child.controller';
import { ChildService } from './child.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Child]), UsersModule, ChildCareModule],
  controllers: [ChildController],
  providers: [ChildService],
})
export class ChildModule {}
