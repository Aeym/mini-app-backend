import { Module } from '@nestjs/common';
import { ChildCareService } from './child-care.service';
import { ChildCareController } from './child-care.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildCare } from './entities/child-care.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChildCare])],
  controllers: [ChildCareController],
  providers: [ChildCareService],
})
export class ChildCareModule {}
