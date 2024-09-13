import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Child } from '../../child/entities/child.entity';
import { User } from '../../users/entities/user.entity';
@Entity()
export class ChildCare {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.childCares, { eager: true })
  @JoinColumn()
  user: User;

  @ManyToMany(() => Child, (child) => child.childCares)
  children: Child[];
}
