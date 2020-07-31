import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProductsService } from '../../../app/services/products.service';
import { BadgeService } from '../../../app/services/badge.service';
import { Product } from '../../../app/models/product';
import { HttpClient } from '@angular/common/http';
import * as $ from "jquery";

@Component({
  selector: 'app-filter-products',
  templateUrl: './filter-products.component.html',
  styleUrls: ['./filter-products.component.scss'],
  providers: [ProductsService, BadgeService],
})
export class FilterProductsComponent implements OnInit {
  test;
  public product: Product[];
  public cart = [];
  public count: number = 0;
  search = '';

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private http: HttpClient,
    private _badge: BadgeService,
    private _productsService: ProductsService) {
    this.test = this._router.getCurrentNavigation().extras.state;
    /* this.product = new Product('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''); */
    
  }

  ngOnInit(): void {
    
    this.loadProducts();
    let array = localStorage.getItem('cart');
    array = JSON.parse(array);
    for (let i = 0; i < array.length; i++) {
      this.cart.push(array[i]);
    }
    $(document).ready(function () {
      $("#success-alert").hide();
    })
    
  }

  loadProducts() {
    if (this.test == null || this.test == undefined) {
      this._router.navigate(['/products']);
    } else {
      this._productsService.getProductsById(this.test.id).subscribe(
        (response) => {
          this.product = response;
          this.product.forEach(element => {
            element['name'] = decodeURIComponent(escape(element['name']));
          });
        },
        (error) => {

        }
      );
    }
    $('#success-alert').css('color', 'red');

    $("#success-alert").hide();
  }

  addQuantity(p) {
    p.quantity += 1;
  }

  quitQuantity(p) {
    p.quantity -= 1;
  }

  sendNumber() {
    this._badge.sendNumber(this.increament());
  }

  increament() {
    this.count += 1;
    return this.count;
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
  }

  filter() {
    if (this.search == '') {
      this.loadProducts()
    } else {
      this._productsService.filterByName(this.search, this.test.id).subscribe(
        (response) => {
          this.product = response;
          this.product.forEach(element => {
            element['name'] = decodeURIComponent(escape(element['name']));
          });
        },
        (error) => {
        }
      );
    }
  }

}
