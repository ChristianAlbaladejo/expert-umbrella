import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../../../app/services/products.service';
import { UserService } from '../../../app/services/user.service';
import { Product } from '../../../app/models/product';
import { User } from '../../../app/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { NgxNumberSpinnerModule } from 'ngx-number-spinner';
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
  public productLike;
  public restUrl;
  public user;

  constructor(
    private _productsService: ProductsService,
    private _userService: UserService,
    private http: HttpClient,
    private _route: ActivatedRoute,
    private _router: Router,
  ) {
    this.test = this._router.getCurrentNavigation().extras.state;
  }

  ngOnInit(): void {
    $(document).ready(function () {
    $("#success-alert").hide();
    })
    this.user = localStorage.getItem("identity")
    this.user = JSON.parse(this.user);
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
  change(value: number, p): void {
    p.quantity = value;
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

  checkFav(p) {
    for (let x = 0; x < this.productLike.length; x++) {
      if (p.id == this.productLike[x].productId) {
        return true;
      }
    }
    return false
  }

  addFav(p) {
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
      .post('https://panesandco.herokuapp.com/addFavorite/',
        body, { headers: headers })
      .subscribe(data => {
      }, error => {
        console.log(error);
      }
      );
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
