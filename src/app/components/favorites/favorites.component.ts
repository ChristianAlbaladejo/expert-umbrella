import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../app/services/products.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as $ from "jquery";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  providers: [ProductsService]
})
export class FavoritesComponent implements OnInit {

  public product = [];
  public cart = [];
  public user;
  public productLike = []
  constructor(public _productsService: ProductsService, private http: HttpClient) { }

  ngOnInit(): void {
    this.user = localStorage.getItem("identity")
    this.user = JSON.parse(this.user);
    $(document).ready(function () {
      $("#success-alert").hide();
    })
    setTimeout(() => {
      this.load();
    },
      500);
  }

  load() {
    this._productsService.getFav(this.user[0].id).subscribe(
      (response) => {
        this.product = response;
        this.product.forEach(element => {
          element['name'] = decodeURIComponent(escape(element['name']));
        });
        console.log(this.product)
      }
    ), error => {
      console.log(error);
    }

    this._productsService.getFav(this.user[0].id).subscribe(
      (response) => {
        this.productLike = response;
        this.productLike.forEach(element => {
          element['name'] = decodeURIComponent(escape(element['name']));
        });
      }
    ), error => {
      console.log(error);
    }
    let array = localStorage.getItem('cart');
    array = JSON.parse(array);
    for (let i = 0; i < array.length; i++) {
      this.cart.push(array[i]);
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
