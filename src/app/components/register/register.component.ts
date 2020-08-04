import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../../app/models/user';
import { UserService } from '../../../app/services/user.service';
import * as $ from "jquery";
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [UserService],
})
export class RegisterComponent implements OnInit {
  public user: User;
  public password2;
  public token;
  public identity;
  gotocart;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
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

  register() {
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
    }
  }

}
