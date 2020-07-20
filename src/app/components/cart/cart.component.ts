import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  public products = [];
  total = 0;
  constructor(
    private _route: ActivatedRoute,
    private http: HttpClient,
    private _router: Router) { }

  ngOnInit(): void {
    let array = localStorage.getItem('cart');
    this.products = JSON.parse(array);
    for (let i = 0; i < this.products.length; i++) {
      var perProduct = this.products[i]["costPrice"] * this.products[i]["quantity"];
      this.total = perProduct + this.total;
    }
    this.total += 5;
  }

  onChange($event, p) {
    this.total = 0;
    p.quantity == parseInt($event.srcElement.value);
    for (let i = 0; i < this.products.length; i++) {
      var perProduct = this.products[i]["costPrice"] * this.products[i]["quantity"];
      this.total = perProduct + this.total;
    }
    this.total += 5;
    localStorage.setItem('cart', JSON.stringify(this.products));
  }

  deleteProduct(p) {
    for (let i = 0; i < this.products.length; i++) {
      if (p.id == this.products[i]["id"]) {
        this.products.splice(i, 1);
      }
    }
    this.total = 0;
    for (let i = 0; i < this.products.length; i++) {
      var perProduct = this.products[i]["costPrice"] * this.products[i]["quantity"];
      this.total = perProduct + this.total;
    }
    this.total += 5;
    localStorage.setItem('cart', JSON.stringify(this.products));
  }

  /* testRequest() {
    let productString;
    for (let i = 0; i < this.products.length; i++) {
      productString += this.products[i]['name'] + ' x' + this.products[i]['quantity'] + '      ' + this.products[i]['costPrice'] + 'Õ!\n';
    }

    console.log(productString);
    let ticket = "Õ\n\nCo.\n30730\nC/Jose Serrano n27 ! \n !=================================================\nPEDIDO\nfecha del pedido va aqui 18:36:00\n=================================================\n" + productString + "\n=================================================\nTotal Impuestos incluidos " + this.total + "Õ!\n\n=================================================\n Aqui va el usuario registrado \n\n\n\n\n\n\n\n\n\n\n\n                                         V ! "
    var body = { 'PrinterName': 'IMPRESORA', 'Format': 'plain', 'Data': ticket };
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'api-token': 'Blade001$'
    });

    this.http
      .post('http://localhost:8984/api/print/',
        body, { headers: headers })
      .subscribe(data => {
        alert('ok');
        let orderlines = JSON.stringify(this.products)

        let re = /\"/gi;
        let result = orderlines.replace(re, "'");
        var body = {
          'orderLines': result,
          'cashDiscount': 0,
          'grossAmount': this.total,
          'surchargeRate': 0,
          'netAmount': 0,
          'vatAmount': 0,
          'surchargeAmount': 0,
          'sended': true
        };
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        console.log(body);

        this.http
          .post('http://localhost:3000/order',
            body, { headers: headers })
          .subscribe(data => {
            alert('pedido registrado');
          }, error => {
            console.log(JSON.stringify(error.json()));
          });
      }, error => {
        let orderlines = JSON.stringify(this.products)

        let re = /\"/gi;
        let result = orderlines.replace(re, "'");
        var body = {
          'orderLines': result,
          'cashDiscount': 0,
          'grossAmount': this.total,
          'surchargeRate': 0,
          'netAmount': 0,
          'vatAmount': 0,
          'surchargeAmount': 0,
          'sended': false
        };
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        console.log(body);

        this.http
          .post('http://localhost:3000/order',
            body, { headers: headers })
          .subscribe(data => {
            alert('pedido registrado');
          }, error => {
            console.log(JSON.stringify(error.json()));
          });
      });
  }*/
  testRequest() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/xml; charset=utf-8',
      'Api-Token': 'Blade001$',
      'Accept': 'application/xml'
    });
    var body = '<?xml version="1.0" encoding = "utf-8" standalone = "yes" ?>' + '<Export>'
      + '<SalesOrders>'
      + '<SalesOrder Serie="P" Number = "33" DeliveryDate = "" Status = "Pending" BusinessDay = "2020-07-07" Guests = "" Date = "2020-07-07T17:59:55" VatIncluded = "true" >'
      + '<Customer Id="2" FiscalName = "JNC" Cif = "B30442016" Street = "C/ García, 10" City = "Madrid" Region = "Madrid" ZipCode = "28010" ApplySurcharge = "false" AccountCode = "" />' +
      '<DeliveryAddress Street="C/ García, 10" City = "Madrid" Region = "Madrid" ZipCode = "28010" />' +
      '<Pos Id="1" Name = "TPV" />' +
      '<Workplace Id="1" Name = "TALLER DE SABORES Y PANES, SL" />' +
      '<User Id="4" Name = "TOÑI" />' +
      '<SaleCenter Id="1" Name = "Barra" Location = "B1" />' +
      '<SuggestedTip Percentage="0.00" VatId = "0" VatRate = "0.00" SurchargeRate = "0.00" ApplyToVatIncluded = "true" IgnoreTicketDiscounts = "false" />' +
      '<ServiceCharge Rate="0.00" VatId = "0" VatRate = "0.00" SurchargeRate = "0.00" ApplyToVatIncluded = "true" IgnoreTicketDiscounts = "false" GrossAmount = "0.00" NetAmount = "0.00" VatAmount = "0.00" SurchargeAmount = "0.00" />' +
      '<Lines>' +
      '<Line Index="0" CreationDate = "2020-07-07T17:59:15" Type = "Standard" ParentIndex = "" ProductId = "46" ProductName = "Pepito Ternera" SaleFormatId = "46" SaleFormatName = "Pepito Ternera" SaleFormatRatio = "1.00" MainBarcode = "" ProductPrice = "3.50" VatId = "3" VatRate = "0.10" SurchargeRate = "0.014" ProductCostPrice = "" MenuGroup = "" PreparationTypeId = "2" PreparationTypeName = "Cocina" PLU = "" FamilyId = "2" FamilyName = "SALADO" PreparationOrderId = "3" PreparationOrderName = "Segundos" Quantity = "1.00" UnitCostPrice = "" TotalCostPrice = "" UserId = "4" UnitPrice = "3.50" DiscountRate = "0.00" CashDiscount = "0.00" OfferId = "" OfferCode = "" TotalAmount = "3.50" />' +
      '<Line Index="1" CreationDate = "2020-07-07T17:59:18" Type = "Standard" ParentIndex = "" ProductId = "52" ProductName = "Montado" SaleFormatId = "52" SaleFormatName = "Montado" SaleFormatRatio = "1.00" MainBarcode = "" ProductPrice = "1.50" VatId = "3" VatRate = "0.10" SurchargeRate = "0.014" ProductCostPrice = "" MenuGroup = "" PreparationTypeId = "2" PreparationTypeName = "Cocina" PLU = "" FamilyId = "3" FamilyName = "BOLLERIA" PreparationOrderId = "3" PreparationOrderName = "Segundos" Quantity = "1.00" UnitCostPrice = "" TotalCostPrice = "" UserId = "4" UnitPrice = "1.50" DiscountRate = "0.00" CashDiscount = "0.00" OfferId = "" OfferCode = "" TotalAmount = "1.50" />' +
      '<Line Index="2" CreationDate = "2020-07-07T17:59:19" Type = "Standard" ParentIndex = "" ProductId = "51" ProductName = "Bocadillo Jamón Ibérico" SaleFormatId = "51" SaleFormatName = "Bocadillo Jamón Ibérico" SaleFormatRatio = "1.00" MainBarcode = "" ProductPrice = "4.50" VatId = "3" VatRate = "0.10" SurchargeRate = "0.014" ProductCostPrice = "" MenuGroup = "" PreparationTypeId = "2" PreparationTypeName = "Cocina" PLU = "" FamilyId = "3" FamilyName = "BOLLERIA" PreparationOrderId = "3" PreparationOrderName = "Segundos" Quantity = "1.00" UnitCostPrice = "" TotalCostPrice = "" UserId = "4" UnitPrice = "4.50" DiscountRate = "0.00" CashDiscount = "0.00" OfferId = "" OfferCode = "" TotalAmount = "4.50" />' +
      '<Line Index="3" CreationDate = "2020-07-07T17:59:20" Type = "Standard" ParentIndex = "" ProductId = "8" ProductName = "Coca Cola Zero" SaleFormatId = "8" SaleFormatName = "Coca Cola Zero" SaleFormatRatio = "1.00" MainBarcode = "" ProductPrice = "2.50" VatId = "3" VatRate = "0.10" SurchargeRate = "0.014" ProductCostPrice = "" MenuGroup = "" PreparationTypeId = "1" PreparationTypeName = "Barra" PLU = "" FamilyId = "1" FamilyName = "PAN" PreparationOrderId = "1" PreparationOrderName = "Bebidas" Quantity = "1.00" UnitCostPrice = "" TotalCostPrice = "" UserId = "4" UnitPrice = "2.50" DiscountRate = "0.00" CashDiscount = "0.00" OfferId = "" OfferCode = "" TotalAmount = "2.50" />' +
      '</Lines>' +
      '<Discounts DiscountRate = "0.005" CashDiscount = "0.00" />' +
      '<Payments />' +
      '<Offers />' +
      '<Totals GrossAmount="11.94" NetAmount = "10.85" VatAmount = "1.09" SurchargeAmount = "0.00" >' +
      '<Taxes>' +
      '<Tax VatRate="0.10" SurchargeRate = "0.014" GrossAmount = "11.94" NetAmount = "10.85" VatAmount = "1.09" SurchargeAmount = "0.00" />' +
      '</Taxes>' +
      '</Totals>' +
      '</SalesOrder>' +
      '</SalesOrders>' +
      '</Export>'
    console.log(body);
    /*   let parser = new DOMParser();
      let doc = parser.parseFromString(body, "application/xml"); */
    /* console.log(doc); */

    this.http
      .post('http://localhost:8984/api/import/',
        body, { headers: headers })
      .subscribe(data => {
        alert('pedido registrado');
      }, error => {
        console.log(JSON.stringify(error));
      });
  }

} 
