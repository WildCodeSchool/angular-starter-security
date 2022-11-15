import { SafeUrl } from "@angular/platform-browser";

export class User {
  public profilePictureSafeUrl!: SafeUrl;

  constructor(
    public id: number,
    public email: string,
    public profilePicture: Blob
  ) {}
}
