import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../../app/models/user';
@Injectable()
export class UserService {
    public url: string;
    public identity;
    public stats;

    constructor(public _http: HttpClient) {
        this.url = "http://localhost:3000/"
    }

    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));

        if (identity != "undefined") {
            this.identity = identity;
        } else {
            this.identity = null;
        }

        return this.identity;
    }

    ifGetIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity'));
        if (identity == null) {
            return true;
        } else {
            return false;
        }
    }

    login(user: User): Observable<any> {
        var body = {
            'email': user.email,
            'password': user.password,
            'gettoken': 'true'
        };
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this._http.post(this.url + 'login', body, { headers: headers });
    }

    register(user: User): Observable<any> {
        
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
        });
        return this._http.post(this.url + 'register', user, { headers: headers });
    }
}

