import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';
import { ProductsService } from './../../services/products.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public products: Observable<Product[]>;
  public user: Observable<User>;

  constructor(private productService: ProductsService,
    private userService: UserService,
    private authService: AuthService) {
    this.products = this.productService.getProducts();
    this.user = this.userService.getConnectedUser();
    this.user.subscribe((user: User) => {
      console.log(user.isAdmin)
      console.log(user.roles)
    })
   }

  ngOnInit(): void {
  }

  logout(): void {
    this.authService.logout();
  }

}
