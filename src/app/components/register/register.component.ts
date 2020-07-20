import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../../app/models/user';
import { UserService } from '../../../app/services/user.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [UserService],
})
export class RegisterComponent implements OnInit {
  public user: User;
  public password2;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService) {
    this.user = new User("", "", "", "", "", "", "", "");
  }

  ngOnInit(): void {
  }

  register() {
    if (this.user.password == this.password2) {
    this._userService.register(this.user).subscribe(
      response => {
      },
      error => {
        console.log(<any>error);
      }
    );
    }
  }

}
