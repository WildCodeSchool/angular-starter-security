import { ProductsService } from './../../services/products.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/dto/product';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public products: Observable<Product[]>;
  constructor(private productService: ProductsService) {
    this.products = this.productService.getProducts();
   }

  ngOnInit(): void {
  }

}
