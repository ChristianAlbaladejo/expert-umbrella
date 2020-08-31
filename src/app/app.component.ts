import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Solution, GoogleObj } from './models/solution';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  lang = new FormControl('en');
  data: Solution = {
    title: '',
    description: '',
    detail: '',
  };
  number = 0;
  location;
  subscription: Subscription;
  identity;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    public _http: HttpClient
  ) {
    this.number = 0;
    setInterval(() => {
      this.location = this._router.url;
    }, 900);
    
  }

  ngOnInit() {
    setInterval(async () => {
      let identity = JSON.parse(localStorage.getItem('identity'));
      let array = JSON.parse(localStorage.getItem('cart'));
      this.number = await array.length
      this.identity = identity;
    }, 1000);
     if (localStorage.getItem('cart')) {
    } else {
      localStorage.setItem('cart', JSON.stringify({}));
    } 
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goLogin() {
    this._router.navigate(['/cart']);
  }

  recharge() {
    var url = 'C:\\tmp\\php.php';
    window.location.href = url;
    /*   let url = 'http://cors-anywhere.localhost/php/php.php';
    let headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
      'Access-Control-Allow-Headers':'X-Requested-With,content-type',
      'Access-Control-Allow-Credentials': 'true'
    });
     this._http
       .get(url , { headers: headers })
       .subscribe((data) => {
         alert(data);
       }); */
  }


  openNav() {
    document.getElementById("mySidebar").style.width = "250px";

  }

  closeNav() {
    document.getElementById("mySidebar").style.width = "0";

  }

  logout() {
    localStorage.clear()
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

  closeModal(){
    document.getElementById("mySidebar").style.width = "0";
  }
}
