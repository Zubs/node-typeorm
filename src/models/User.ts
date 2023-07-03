import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string | undefined;

  @Column({
    type: 'varchar',
    length: 30,
  })
  name: string | undefined;

  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
  })
  email: string | undefined;

  @Column({
    type: 'varchar',
    length: 30,
  })
  password: string | undefined;
}
