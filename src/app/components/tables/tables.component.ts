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
    console.log(this.tables, 'sdfs');
    
    this.load();
  }

  load() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8"',
      'Access-Control-Allow-Origin': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
    this.http.get('http://192.168.1.109:5000/tables', { headers: headers }).subscribe(response => {
      this.tables = response;
    }, error => {
      console.log(error);
    });
  }
}
