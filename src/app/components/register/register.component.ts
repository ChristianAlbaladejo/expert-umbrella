import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../../app/models/user';
import { UserService } from '../../../app/services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductsService } from '../../../app/services/products.service';
import * as $ from "jquery";
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [ProductsService, UserService],
})
export class RegisterComponent implements OnInit {
  public user: User;
  public password2;
  public token;
  public identity;
  gotocart;
  lastCustomer;
  mailing = false;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private http: HttpClient,
    private _userService: UserService) {
    this.user = new User("", "", "", "", "", "", "", "", "");
    this.gotocart = this._router.getCurrentNavigation().extras.state.flag;
  }

  ngOnInit(): void {
    $(document).ready(function () {
      $("#success-alert").hide();
      $("#danger-alert").hide();
    })
  }

  async register() { 
    if (this.user.password == this.password2) {
      await this.http.get('https://panesandco.herokuapp.com/lastCustomer').subscribe(response =>{
        this.lastCustomer = response[0]['MAX(id)'];
      });
       this._userService.register(this.user).subscribe(
        response => {
          $("#success-alert").fadeTo(2000, 500).slideUp(500, function () {
            $("#success-alert").slideUp(500);
          });
          // loguear al usuario y conseguir sus datos
          this._userService.login(this.user).subscribe(
            response => {
              this.identity = response.user;
              this.token = response.token;
              localStorage.setItem('identity', JSON.stringify(this.identity));
              localStorage.setItem('token', this.token);

              $("#success-alert").fadeTo(2000, 500).slideUp(500, function () {
                $("#success-alert").slideUp(500);
              });
              if (this.gotocart) {
                this._router.navigate(['/cart']);
              } else {
                this._router.navigate(['/products']);
              }
            },
            error => {
              var errorMessage = <any>error;
              console.log(errorMessage);
              $("#danger-alert").fadeTo(2000, 500).slideUp(500, function () {
                $("#danger-alert").slideUp(500);
              });
            }
          );

        },
        error => {
          console.log(<any>error);
          $("#danger-alert").fadeTo(2000, 500).slideUp(500, function () {
            $("#danger-alert").slideUp(500);
          });
        }
      ); 
     /*  let headers = new HttpHeaders({
        'Content-Type': 'application/xml; charset=utf-8',
        'Api-Token': 'Blade001$',
        'Accept': 'application/xml'
      });

      var body = '<?xml version="1.0" encoding = "utf-8" standalone = "yes" ?>' +
        '<Export>' +
        '<Customers>' +
        '<Customer Id="' + this.lastCustomer + '" FiscalName = "' + this.user.name + ' ' + this.user.lastname + '" Cif = "' + this.user.CIF + '" BusinessName = "' + this.user.name + ' ' + this.user.lastname +'" Street = "'+this.user.calle+'" City = "'+this.user.poblacion+'" Region = "Murcia" ZipCode = "'+this.user.CP+'" DiscountRate = "0.00" ApplySurcharge = "true" CardNumber = "" Telephone = "'+this.user.telefono+'" ContactPerson = "" Email = "'+this.user.email+'" AccountCode = "" Notes = "" ShowNotes = "true" SendMailing ="'+this.mailing+'" />' +
        '</Customers>' +
        '< /Export>'
      this.http
        .post('http://localhost:8984/api/import/',
          body, { headers: headers })
        .subscribe(data => {

        }, error => {

        }
        ); */
    }
  }

  checked(event: any){
    this.mailing = event.currentTarget.checked;
    console.log(this.mailing);
    
  }


}
