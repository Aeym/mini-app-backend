import { ChildCare } from 'src/child-care/entities/child-care.entity';
import { Child } from 'src/child/entities/child.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @OneToMany(() => ChildCare, (childCare) => childCare.user)
  childCares: ChildCare[];

  @OneToMany(() => Child, (child) => child.user)
  children: Child[];
}
