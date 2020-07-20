import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProductsService } from '../../../app/services/products.service';
import { Product } from '../../../app/models/product';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-filter-products',
  templateUrl: './filter-products.component.html',
  styleUrls: ['./filter-products.component.scss'],
  providers: [ProductsService],
})
export class FilterProductsComponent implements OnInit {
  test;
  public product: Product[];
  public cart = [];
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private http: HttpClient,
    private _productsService: ProductsService) {
    this.test = this._router.getCurrentNavigation().extras.state;
    /* this.product = new Product('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''); */
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this._productsService.getProductsById(this.test.id).subscribe(
      (response) => {
        this.product = response;
        this.product.forEach(element => {
          element['name'] = decodeURIComponent(escape(element['name']));
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addQuantity(p) {
    p.quantity += 1;
  }

  quitQuantity(p) {
    p.quantity -= 1;
  }

  addToCart(p) {
    let flag = false;
    let array = localStorage.getItem('cart');
    array = JSON.parse(array);
    for (let i = 0; i < array.length; i++) {
      if (array[i]["id"] == p.id) {
        array[i]["quantity"] += p.quantity;
        flag = true
      }
    }
    if (flag) {
      localStorage.setItem('cart', JSON.stringify(array));
    } else {
      this.cart.push(p);
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

}
