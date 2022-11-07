import { Role } from './../interfaces/role';
export class User {
  public isAdmin!: boolean;

  constructor(
    public id: number,
    public email: string,
    public roles: Role[]
  ) {}
}
