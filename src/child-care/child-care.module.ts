import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChildCare } from './entities/child-care.entity';
import { ChildCareController } from './child-care.controller';
import { ChildCareService } from './child-care.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChildCare]), UsersModule],
  controllers: [ChildCareController],
  providers: [ChildCareService],
  exports: [TypeOrmModule],
})
export class ChildCareModule {}
