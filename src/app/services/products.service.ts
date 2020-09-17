import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';

@Injectable()
export class ProductsService {
  public url: string;
  public identify;
  public stats;

  constructor(public _http: HttpClient) {
    this.url = environment.APIURL;
    /*   this.url = 'http://localhost:3000'; */
  }

  getFamilies(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8"',

    });

    return this._http.get(this.url + '/', { headers: headers });
  }

  getProducts(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8"',
    });

    return this._http.get(this.url + '/products', { headers: headers });
  }

  getProductsById(id): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8"',
    });

    return this._http.get(this.url + '/products/' + id, { headers: headers });
  }

  getProductById(id): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8"',
    });

    return this._http.get(this.url + '/product/' + id, { headers: headers });
  }

  familyName(id): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8"',
    });

    return this._http.get(this.url + '/familiName/' + id, { headers: headers });
  }

  lastOrder(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8"',
    });

    return this._http.get(this.url + '/lastOrder/', { headers: headers });
  }

  filter(f): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8"',
    });

    return this._http.get(this.url + '/filter/' + f, { headers: headers });
  }

  filterByName(f, id): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8"',
    });

    return this._http.get(this.url + '/filterByName/' + f + '/' + id, { headers: headers });
  }

  getSalesOrders(id): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8"',
      'Authorization': localStorage.getItem("token")
    });

    return this._http.get(this.url + '/salesorders/' + id, { headers: headers });
  }

  checkFav(productId, userId): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8"',
      'Authorization': localStorage.getItem("token")
    });

    return this._http.get(this.url + '/checkFavorite/' + productId + '/' + userId, { headers: headers });
  }

  deleteFav(productId, userId): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8"',
      'Authorization': localStorage.getItem("token")
    });

    return this._http.delete(this.url + '/removeFavorite/' + productId + '/' + userId, { headers: headers });
  }

  addFav(productId, userId): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8"',
      'Authorization': localStorage.getItem("token")
    });

    let body = {
      "productId": productId,
      "userId": userId
    }
    return this._http.post(this.url + '/addFavorite/', body, { headers: headers });
  }

  getFav(userId): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8"',
      'Authorization': localStorage.getItem("token")
    });

    return this._http.get(this.url + '/getFavorites/' + userId, { headers: headers });
  }
}
