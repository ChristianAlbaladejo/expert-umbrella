import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { SolutionService } from './services/solution.service';
import { Solution, GoogleObj } from './models/solution';
import { GoogletranslateService } from './services/googletranslate.service';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  private translateBtn: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private solution: SolutionService,
    private google: GoogletranslateService,
    public _http: HttpClient
  ) { }

  ngOnInit() {
    this.solution.getSolution().subscribe((res) => (this.data = res));
    this.translateBtn = document.getElementById('translatebtn');
    if (localStorage.getItem('cart')) {

    } else {
      localStorage.setItem('cart', JSON.stringify({}));
    }
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
        console.log(this.data);
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
}
