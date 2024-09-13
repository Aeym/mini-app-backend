import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChildCare } from './entities/child-care.entity';
import { ChildCareController } from './child-care.controller';
import { ChildCareService } from './child-care.service';
import { ChildModule } from '../child/child.module';
import { EmailService } from '../email/email.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChildCare]),
    forwardRef(() => ChildModule),
    UsersModule,
  ],
  controllers: [ChildCareController],
  providers: [ChildCareService, EmailService],
  exports: [TypeOrmModule],
})
export class ChildCareModule {}
