import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { ChildCareModule } from './child-care/child-care.module';
import { ChildCare } from './child-care/entities/child-care.entity';
import { ChildModule } from './child/child.module';
import { Child } from './child/entities/child.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'nestuser',
      password: 'nest_password',
      database: 'nest_app',
      entities: [User, ChildCare, Child],
      synchronize: true,
    }),
    UsersModule,
    ChildCareModule,
    ChildModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
