import { Column, Entity, ObjectIdColumn } from "typeorm";
import { Role } from '@shared-all/enums/role.enum';

@Entity()
export class User {
  @ObjectIdColumn()
  _id: string;

  @Column()
  userName: string;

  @Column()
  email: string;

  @Column()
  status: number;

  @Column()
  role: Role;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  password: {
    hash: string;
    salt: string;
  };
}


