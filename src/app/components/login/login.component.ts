import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../../app/models/user'; 
import { UserService } from '../../../app/services/user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [ UserService],
})
export class LoginComponent implements OnInit {
  public user: User;
  public token;
  public identity;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService) {
    this.user = new User("", "", "", "", "", "", "", "");
  }

  ngOnInit(): void {}


  login() {
    // loguear al usuario y conseguir sus datos
    this._userService.login(this.user).subscribe(
      response => {
        this.identity = response.user;
        this.token = response.token;
          localStorage.setItem('identity', JSON.stringify(this.identity));
          localStorage.setItem('token', this.token);
        
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
      }
    );
  }
}
