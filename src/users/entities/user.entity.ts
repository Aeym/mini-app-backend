import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Child } from '../../child/entities/child.entity';
import { ChildCare } from '../../child-care/entities/child-care.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @OneToMany(() => ChildCare, (childCare) => childCare.user)
  childCares: ChildCare[];

  @OneToMany(() => Child, (child) => child.user)
  children: Child[];
}
