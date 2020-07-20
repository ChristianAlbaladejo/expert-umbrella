import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProductsService {
  public url: string;
  public identify;
  public stats;

  constructor(public _http: HttpClient) {
    this.url = 'http://localhost:3000';
  }

  getFamilies(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      
    });

    return this._http.get(this.url + '/', { headers: headers });
  }

  getProducts(): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      
    });

    return this._http.get(this.url + '/products', { headers: headers });
  }

  getProductsById(id): Observable<any> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      
    });

    return this._http.get(this.url + '/products/'+id, { headers: headers });
  }
}
