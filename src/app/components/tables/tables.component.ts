import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {

  public tables;
  constructor(private http: HttpClient,) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8"',
      'Access-Control-Allow-Origin': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection':'keep-alive',
        });
    this.http.get('http://192.168.200.227:5000/tables', { headers: headers }).subscribe(response => {
      console.log(response[0])
      this.tables = response[0];
    }, error => {
      console.log(error);
    });
  }

}
