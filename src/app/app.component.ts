import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SolutionService } from './services/solution.service';
import { Solution, GoogleObj } from './models/solution';
import { GoogletranslateService } from './services/googletranslate.service';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BadgeService } from './services/badge.service';
import { Subscription } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [BadgeService],
})
export class AppComponent {
  lang = new FormControl('en');
  data: Solution = {
    title: '',
    description: '',
    detail: '',
  };
  number = 0;
  subscription: Subscription;
  private translateBtn: any;
  identity;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _badge: BadgeService,
    private solution: SolutionService,
    private google: GoogletranslateService,
    public _http: HttpClient
  ) {
    this.number = 0;
    console.log(this.number)
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

  send() {
    const googleObj: GoogleObj = {
      q: [this.data.title, this.data.description, this.data.detail],
      target: this.lang.value,
    };

    this.translateBtn.disabled = true;

    this.google.translate(googleObj).subscribe(
      (res: any) => {
        this.translateBtn.disabled = false;
        this.data = {
          title: res.data.translations[0].translatedText,
          description: res.data.translations[1].translatedText,
          detail: res.data.translations[2].translatedText,
        };

      },
      (err) => {
        console.log(err);
      }
    );
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
}
