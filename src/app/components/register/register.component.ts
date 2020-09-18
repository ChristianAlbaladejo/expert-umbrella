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
  formattedaddress = " ";
  validateStreet = false;
  options = {
    componentRestrictions: {
      country: ["ES"]
    }
  }
  public AddressChange(address: any) {
    this.validateStreet = false
    console.log(this.validateStreet, address);
    if (address != 'input') {
      //setting address from API to local variable 
      this.formattedaddress = address.formatted_address
      if (this.getDistanciaMetros(address.geometry.location.lat(), address.geometry.location.lng(), 37.804516, -0.831246)) {
        this.formattedaddress = "Podemos repartir"
        this.validateStreet = true
        this.user.calle = address.formatted_address
      } else {
        this.formattedaddress = "Lo sentimos no podemos repartir a esa dirección"
        $("#calle").val('');
        this.user.calle = ""
        this.validateStreet = false
      }
    }
  }
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

  checked(event: any) {
    this.mailing = event.currentTarget.checked;
    console.log(this.mailing);

  }

  getDistanciaMetros(lat1, lon1, lat2, lon2) {
    const rad = function (x) { return x * Math.PI / 180; }
    var R = 6378.137; //Radio de la tierra en km 
    var dLat = rad(lat2 - lat1);
    var dLong = rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) *
      Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;
    console.log(d)
    if (d <= 8) {
      return true
    } else {
      return false
    }
  }

}
