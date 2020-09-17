import { Component, OnInit, ɵConsole } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProductsService } from '../../../app/services/products.service';
import { Product } from '../../../app/models/product';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as $ from "jquery";
import { environment } from '../../../environments/environment';

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
  public count: number = 0;
  public user;
  public productLike;
  search = '';

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private http: HttpClient,
    private _productsService: ProductsService) {
    this.test = this._router.getCurrentNavigation().extras.state;
    /* this.product = new Product('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''); */

  }

  ngOnInit(): void {
    this.user = localStorage.getItem("identity")
    this.user = JSON.parse(this.user);
    console.log(this.user)
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
      if (this.user != null) {
        this._productsService.getFav(this.user[0].id).subscribe(
          (response) => {
            this.productLike = response;
            this.productLike.forEach(element => {
              element['name'] = decodeURIComponent(escape(element['name']));
            });
            console.log(this.productLike)
          }
        ), error => {
          console.log(error);
        }
      }
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

  checkFav(p) {
    for (let x = 0; x < this.productLike.length; x++) {
      if (p.id == this.productLike[x].productId) {
        return true;
      }
    }
    return false
  }

  addFav(p) {
    if (this.user) {
    this.productLike.push({ "productId": p.id, "userId": this.user[0].id })
    var body = {
      "productId": p.id,
      "userId": this.user[0].id
    };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem("token")
    });
    this.http
      .post(environment.APIURL+'/addFavorite/',
        body, { headers: headers })
      .subscribe(data => {
      }, error => {
        console.log(error);
      }
      );
    }
  }

  deleteFav(p) {
    for (let i = 0; i < this.productLike.length; i++) {
      if (p.id == this.productLike[i].productId) {
        this.productLike.splice(i, 1)
      }
    }
    this._productsService.deleteFav(p.id, this.user[0].id).subscribe((response) => {
    }, error => {
      console.log(error);
    });
  }
}
