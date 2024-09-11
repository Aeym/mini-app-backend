import { Child } from 'src/child/entities/child.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ChildCare {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.childCares)
  @JoinColumn()
  user: User;

  @ManyToMany(() => Child, (child) => child.childCares)
  children: Child[];
}
