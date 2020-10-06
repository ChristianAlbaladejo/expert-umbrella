import { Component, OnInit, ErrorHandler } from '@angular/core';
import { ProductsService } from '../../../app/services/products.service';
import { UserService } from '../../../app/services/user.service';
import { Product } from '../../../app/models/product';
import { User } from '../../../app/models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import * as $ from "jquery";
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers: [ProductsService, UserService],
})
export class ProductsComponent implements OnInit {
  test;
  public product: Product;
  public families = [];
  public products: Product[];
  public cart = [];
  public count: number = 0;
  public productLike;
  public user;
  selectedLanguage = 'es';
  search = '';

  constructor(
    private _productsService: ProductsService,
    private _userService: UserService,
    private http: HttpClient,
    private _route: ActivatedRoute,
    private _router: Router,
    public translate: TranslateService
  ) {
    /*     this.product = new Product('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''); */

    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('es');
  }

  ngOnInit(): void {
    this.user = localStorage.getItem("identity")
    this.user = JSON.parse(this.user);
    $(document).ready(function () {
      $("#success-alert").hide();
    })
    let array = localStorage.getItem('cart');
    array = JSON.parse(array);
    for (let i = 0; i < array.length; i++) {
      this.cart.push(array[i]);
    }
  }

  ngAfterViewInit(): void {
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
        this.families.sort((a, b) => parseFloat(b.showInPos) - parseFloat(a.showInPos));
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
        console.log(this.products);
        this.products.forEach(element => {
          element['name'] = decodeURIComponent(escape(element['name']));
        });
      },
      (error) => {
      }
    );
    if (this.user) {
      this._productsService.getFav(this.user[0].id).subscribe(
        (response) => {
          this.productLike = response;
          this.productLike.forEach(element => {
            element['name'] = decodeURIComponent(escape(element['name']));
          });
        }
      ), error => {
      }
    }
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
      .post(environment.APIURL+'/addFavorite/',
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
