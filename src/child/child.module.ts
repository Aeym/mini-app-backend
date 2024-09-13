import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Child } from './entities/child.entity';
import { ChildCareModule } from '../child-care/child-care.module';
import { ChildController } from './child.controller';
import { ChildService } from './child.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Child]),
    UsersModule,
    forwardRef(() => ChildCareModule),
  ],
  controllers: [ChildController],
  providers: [ChildService],
  exports: [TypeOrmModule],
})
export class ChildModule {}
