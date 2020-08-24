import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../app/services/products.service';
import * as $ from "jquery";
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
  constructor(public _productsService: ProductsService) {
   
  }

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
    let array = localStorage.getItem('cart');
    array = JSON.parse(array);
    for (let i = 0; i < array.length; i++) {
      this.cart.push(array[i]);
    }
  }
}
