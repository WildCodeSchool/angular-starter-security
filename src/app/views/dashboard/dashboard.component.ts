import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';
import { ProductsService } from './../../services/products.service';
import { Component, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  public products: Observable<Product[]>;
  public user: Observable<User | undefined>;
  public userProfilePicture: Observable<SafeUrl | undefined>;
  public isAdmin: boolean;
  public picture: File | null | undefined;

  constructor(private productService: ProductsService,
    private userService: UserService,
    private authService: AuthService) {
      this.products = this.productService.getProducts();
      this.user = this.authService.currentUser.asObservable();
      this.isAdmin = this.authService.isAdmin();
      this.userProfilePicture = this.authService.currentUser.pipe(
          map((user: User | undefined) => user?.profilePictureSafeUrl)
        )
      }

      onSubmitNewPicture(event: Event): void {
        this.picture = (event.target as HTMLInputElement).files?.item(0)
      }

      logout(): void {
        this.authService.logout();
      }

      sendPicture(): void {
        let currentUser = this.authService.currentUser.getValue();
        this.picture?.arrayBuffer().then((result: ArrayBuffer) => {
          let reader: FileReader | null = new FileReader();
          reader.readAsDataURL(new Blob([new Uint8Array(result)], {type: 'image/*'}));
          reader.onloadend = () => {
            this.userService.updateMe(<string> currentUser?.email, <string> reader?.result?.toString()).subscribe(
              (updatedUser: User) => {
                this.authService.currentUser.next(updatedUser);
                this.picture = null;
              });
          }
        });
      }
}
