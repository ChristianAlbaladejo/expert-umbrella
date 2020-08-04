import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../../../app/services/products.service';
import { UserService } from '../../../app/services/user.service';
import { Product } from '../../../app/models/product';
import { User } from '../../../app/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import * as $ from "jquery";
@Component({
  selector: 'app-simple-product',
  templateUrl: './simple-product.component.html',
  styleUrls: ['./simple-product.component.scss'],
  providers: [ProductsService, UserService]
})
export class SimpleProductComponent implements OnInit, OnDestroy {
  test;
  public product: Product;
  public families;
  public products: Product[];
  public cart = [];
  public restUrl;

  constructor(
    private _productsService: ProductsService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.test = this._router.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    $(document).ready(function () {
    $("#success-alert").hide();
    })
    let array = localStorage.getItem('cart');
    array = JSON.parse(array);
    for (let i = 0; i < array.length; i++) {
      this.cart.push(array[i]);
    }
    this._productsService.getFamilies().subscribe(
      (response) => {
        this.families = response;
      },
      (error) => {
      2}
    );
    this.load();

  }

  ngOnDestroy() {
    if (this.product) {

      this._router.navigateByUrl('/product/filtered2', { state: { id: this.product['familyId'] } });
    }
  }

  load() {
    if (this.test == null || this.test == undefined) {
      this._router.navigate(['/products']);
    } else {
      if (this.test == null || this.test == undefined) {
        this._router.navigate(['/products']);
      } else {
        this._productsService.getProductById(this.test.id).subscribe(
          (response) => {
            this.product = response[0];
            this.product['notes'] = '';
          },
          (error) => {
          }
        );
      }
    }
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
    $("#success-alert").fadeTo(2000, 500).slideUp(500, function () {
      $("#success-alert").slideUp(500);
    });
    window.history.back();
  }

  addQuantity(p) {
    p.quantity += 1;
  }

  quitQuantity(p) {
    p.quantity -= 1;
  }

}
