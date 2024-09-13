import { ChildCare } from '../../child-care/entities/child-care.entity';
import { User } from '../../users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Child {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @ManyToOne(() => User, (user) => user.children, { eager: true })
  user: User;

  @ManyToMany(() => ChildCare, (childCare) => childCare.children)
  @JoinTable()
  childCares: ChildCare[];
}
