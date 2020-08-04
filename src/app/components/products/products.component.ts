import { Component, OnInit, ErrorHandler } from '@angular/core';
import { ProductsService } from '../../../app/services/products.service';
import { UserService } from '../../../app/services/user.service';
import { Product } from '../../../app/models/product';
import { User } from '../../../app/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import * as $ from "jquery";
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers: [ProductsService, UserService],
})
export class ProductsComponent implements OnInit {
  test;
  public product: Product;
  public families = [] ;
  public products: Product[];
  public cart = [];
  public count: number = 0;
  selectedLanguage = 'es';
  search = '';

  constructor(
    private _productsService: ProductsService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    public translate: TranslateService
  ) {
    /*     this.product = new Product('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''); */

    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('es');
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
  }

  ngAfterViewInit(): void{
    this._productsService.getFamilies().subscribe(
      (response) => {
        for (let i = 0; i < response.length; i++) {
          var image = new Image();
          let self = this;
          image.onload = function () {
            // image exists and is loaded
            self.families.push(response[i]);
          }
          image.onerror = function () {
          }
          image.src = '../../../assets/' + response[i].name + '.jpg'
        }
      },
      (error) => {
      }
    );
  }

  ifLogin() {
    /* this._userService.ifGetIdentity(); */
    let identity = JSON.parse(localStorage.getItem('identity'));
    if (identity == null) {
      return true;
    } else {
      return false;
    }
  }

  goLogin() {
    if (this.ifLogin()) {
      this._router.navigate(['/login']);
    } else {
      this._router.navigate(['/cart']);
    }
  }

  selectLanguage(lang: string) {
    this.translate.use(lang);
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }

  filter() {
    this._productsService.filter(this.search).subscribe(
      (response) => {
        this.products = response;
        this.products.forEach(element => {
          element['name'] = decodeURIComponent(escape(element['name']));
        });
      },
      (error) => {
      }
    );
  }

  //products
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
}
