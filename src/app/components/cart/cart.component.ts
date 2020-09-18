import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductsService } from '../../../app/services/products.service';
import { UserService } from '../../../app/services/user.service';
import { User } from '../../../app/models/user';
import * as $ from "jquery";
import * as bootstrap from 'bootstrap';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  providers: [ProductsService, UserService],
})
export class CartComponent implements OnInit, OnDestroy {
  @ViewChild("content") modal: ElementRef;
  @ViewChild("target") modalTarget: ElementRef;
  public products = [];
  public family = [];
  public user;
  public fechaRecogida;
  public loading = false;
  displayForm = false;
  total = 0;
  lastOrderId;
  orderNotes = '';
  currentDate;
  creditCard = true;
  chargesType = 'tarjeta';
  shipping = 0;
  shippingType = true;
  validateStreet = true
  //Local Variable defined 
  formattedaddress = " ";
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
        this.user[0].calle = address.formatted_address
      } else {
        this.formattedaddress = "Lo sentimos no podemos repartir a esa dirección"
        $("#direccion").val('');
        this.user[0].calle = ""
        this.validateStreet = false
      }
    }

  }
  closeResult = '';
  constructor(
    private _productsService: ProductsService,
    private _route: ActivatedRoute,
    private http: HttpClient,
    private _userService: UserService,
    private modalService: NgbModal,
    private _router: Router) { }

  async ngOnInit(): Promise<void> {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json; charset=UTF-8"',

    });
    $.getJSON('', function (data) {
      console.log(data)
    });
    $(document).ready(function () {
      $("#success-alert").hide();
      $("#danger-alert").hide();
    })
    this.user = new User("", "", "", "", "", "", "", "", "");
    await this.getFamilyName();
    setTimeout(() => {
      this.load();
    },
      300);
    this.user = localStorage.getItem("identity")
    this.user = JSON.parse(this.user);
    var f = new Date();
    this.currentDate = f.getFullYear() + "-" + ("0" + (f.getMonth() + 1)).slice(-2) + "-" + f.getDate() + "T00:00";
    $.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function (data) {

    });
    this.loadStripe();
  }

  ngOnDestroy() { }

  onChange($event, p) {
    this.total = 0;
    p.quantity == parseInt($event.srcElement.value);
    for (let i = 0; i < this.products.length; i++) {
      var perProduct = this.products[i]["costPrice"] * this.products[i]["quantity"];
      this.total = perProduct + this.total;
    }
    if (!this.shippingType) {
      if (this.total > 30) {
        this.shipping = 0
      } else {
        this.shipping = 5
      }
    }
    localStorage.setItem('cart', JSON.stringify(this.products));
  }

  load() {
    let familyname = '';
    let array = localStorage.getItem('cart');
    this.products = JSON.parse(array);
    for (let i = 0; i < this.products.length; i++) {
      var perProduct = this.products[i]["costPrice"] * this.products[i]["quantity"];
      this.products[i]['name'] = decodeURIComponent(escape(this.products[i]['name']));
      this.family.forEach(element => {
        if (element.id == this.products[i].familyId) {
          familyname = element.name
        }
      });
      this.products[i].familyName = familyname
      this.total = perProduct + this.total;
    }
    if (!this.shippingType) {
      if (this.total > 30) {
        this.shipping = 0
      } else {
        this.shipping = 5
      }
    }
  }

  open() {
    this.modalService.open(this.modal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModal() {
    this.modalService.open(this.modalTarget, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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

  async buy() {
    this.loading = true;
    if (this.ifLogin()) {

    } else if (this.fechaRecogida != undefined) {

      this.lastOrder();
      setTimeout(() => {
        this.testRequest();
      },
        2000);
    } else {
      $("#danger-alert").fadeTo(2000, 500).slideUp(500, function () {
        $("#danger-alert").slideUp(500);
      });
    }
  }

  async testRequest() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/xml; charset=utf-8',
      'Api-Token': environment.APITOKEN,
      'Accept': 'application/xml'
    });
    let lines = '';
    for (let i = 0; i < this.products.length; i++) {
      let date = Date.now();
      var dt = new Date(date);
      var lastIndex = i;
      lines += "<Line Index=" + '"' + i + '"' + " CreationDate = " + '"' + dt.toISOString() + '"' + " Type = " + '"' + 'Standard' + '"' + " ParentIndex =" + '"' + '"' + " ProductId = " + '"' + this.products[i].id + '"' + " ProductName = " + '"' + this.products[i].name + '"' + " SaleFormatId = " + '"' + this.products[i].id + '"' + " SaleFormatName = " + '"' + this.products[i].name + '"' + " SaleFormatRatio = " + '"' + '1.00' + '"' + " MainBarcode = " + '"' + '"' + " ProductPrice = " + '"' + this.products[i].costPrice + '"' + " VatId = " + '"' + '3' + '"' + " VatRate = " + '"' + '0.10' + '"' + " SurchargeRate = " + '"' + '0.014' + '"' + " ProductCostPrice = " + '"' + '"' + " MenuGroup = " + '"' + '"' + " PreparationTypeId = " + '"' + '2' + '"' + " PreparationTypeName = " + '"' + 'Cocina' + '"' + " PLU =" + '"' + '"' + " FamilyId = " + '"' + this.products[i].familyId + '"' + " FamilyName = " + '"' + this.products[i].familyName + '"' + " PreparationOrderId = " + '"' + '4' + '"' + "  PreparationOrderName = " + '"' + 'Postres' + '"' + " Quantity = " + '"' + this.products[i].quantity + '"' + " UnitCostPrice =" + '"' + '"' + " TotalCostPrice = " + '"' + '"' + " UserId = " + '"' + '4' + '"' + " UnitPrice = " + '"' + this.products[i].costPrice + '"' + " DiscountRate = " + '"' + '0.00' + '"' + " CashDiscount = " + '"' + '0.00' + '"' + " OfferId =" + '"' + '"' + "  OfferCode = " + '"' + '"' + " TotalAmount = " + '"' + this.products[i].costPrice + '"' + "> <Notes><![CDATA[" + this.products[i].notes + "]]></Notes> </Line> "
    }

    if (this.total >= 30) {
      lines += "<Line Index=" + '"' + lastIndex + 1 + '"' + " CreationDate = " + '"' + dt.toISOString() + '"' + " Type = " + '"' + 'Standard' + '"' + " ParentIndex =" + '"' + '"' + " ProductId = " + '"' + 1217 + '"' + " ProductName = " + '"' + 'portes' + '"' + " SaleFormatId = " + '"' + 1217 + '"' + " SaleFormatName = " + '"' + 'portes' + '"' + " SaleFormatRatio = " + '"' + '1.00' + '"' + " MainBarcode = " + '"' + '"' + " ProductPrice = " + '"' + 5 + '"' + " VatId = " + '"' + '3' + '"' + " VatRate = " + '"' + '0.10' + '"' + " SurchargeRate = " + '"' + '0.014' + '"' + " ProductCostPrice = " + '"' + '"' + " MenuGroup = " + '"' + '"' + " PreparationTypeId = " + '"' + '2' + '"' + " PreparationTypeName = " + '"' + 'Cocina' + '"' + " PLU =" + '"' + '"' + " FamilyId = " + '"' + 11 + '"' + " FamilyName = " + '"' + 'HALLOWEN' + '"' + " PreparationOrderId = " + '"' + '4' + '"' + "  PreparationOrderName = " + '"' + 'Postres' + '"' + " Quantity = " + '"' + 1 + '"' + " UnitCostPrice =" + '"' + '"' + " TotalCostPrice = " + '"' + '"' + " UserId = " + '"' + '4' + '"' + " UnitPrice = " + '"' + 5 + '"' + " DiscountRate = " + '"' + '0.00' + '"' + " CashDiscount = " + '"' + '0.00' + '"' + " OfferId =" + '"' + '"' + "  OfferCode = " + '"' + '"' + " TotalAmount = " + '"' + 5 + '"' + "> <Notes><![CDATA[]]></Notes> </Line> "
    }
    var deliveryDate = new Date(this.fechaRecogida);
    var body = '<?xml version="1.0" encoding = "utf-8" standalone = "yes" ?>' + '<Export>'
      + '<SalesOrders>'
      + '<SalesOrder Serie="AW" Number = ' + '"' + (parseInt(this.lastOrderId) + 1) + '"' + ' DeliveryDate = "' + deliveryDate.toISOString() + '" Status = "Pending" BusinessDay = "2020-07-07" Guests = "" Date = "2020-07-07T17:59:55" VatIncluded = "true" >'
      + '<Customer Id="1" FiscalName = "' + this.user[0].name + ' ' + this.user[0].lastname + '" Cif = "' + this.user[0].CIF + '" Street = "" City = "" Region = "" ZipCode = "" ApplySurcharge = "false" AccountCode = "" />' +
      '<DeliveryAddress Street="' + this.user[0].calle + '" City = "Murcia" Region = "' + this.user[0].poblacion + '" ZipCode = "' + this.user[0].CP + '" />' +
      '<Pos Id="1" Name = "TPV" />' +
      '<Workplace Id="1" Name = "TALLER DE SABORES Y PANES, SL" />' +
      '<User Id="4" Name = "TOÑI" />' +
      '<SaleCenter Id="1" Name = "Barra" Location = "B1" />' +
      '<Notes><![CDATA[' + this.orderNotes + ']]></Notes>' +
      '<SuggestedTip Percentage="0.00" VatId = "0" VatRate = "0.00" SurchargeRate = "0.00" ApplyToVatIncluded = "true" IgnoreTicketDiscounts = "false" />' +
      '<ServiceCharge Rate="0.00" VatId = "0" VatRate = "0.00" SurchargeRate = "0.00" ApplyToVatIncluded = "true" IgnoreTicketDiscounts = "false" GrossAmount = "0.00" NetAmount = "0.00" VatAmount = "0.00" SurchargeAmount = "0.00" />' +
      '<Lines>' +
      lines +
      '</Lines>' +
      '<Discounts DiscountRate = "0.000" CashDiscount = "0.00" />' +
      '<Payments />' +
      '<Offers />' +
      '<Totals GrossAmount="' + this.total + '" NetAmount = "' + this.total + '" VatAmount = "1.09" SurchargeAmount = "0.00" >' +
      '<Taxes>' +
      '<Tax VatRate="0.10" SurchargeRate = "0.014" GrossAmount = "11.94" NetAmount = "10.85" VatAmount = "1.09" SurchargeAmount = "0.00" />' +
      '</Taxes>' +
      '</Totals>' +
      '</SalesOrder>' +
      '</SalesOrders>' +
      '</Export>'
    console.log(body);
    this.http
      .post(environment.TPVIP + '/api/import/',
        body, { headers: headers })
      .subscribe(data => {
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
          'sended': true,
          'userId': this.user[0].id,
          'email': this.user[0].email,
          'deliveryDate': deliveryDate.toISOString(),
          'orderNotes': this.orderNotes,
          'chargesType': this.chargesType
        };
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token")
        });
        this.http
          .post(environment.APIURL + '/order',
            body, { headers: headers })
          .subscribe(data => {
          }, error => {
          });
        //print ticket
        headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'api-token': environment.APITOKEN
        });
        var currentdate = new Date();
        var datetime = currentdate.getDate() + "/"
          + (currentdate.getMonth() + 1) + "/"
          + currentdate.getFullYear() + " @ "
          + currentdate.getHours() + ":"
          + currentdate.getMinutes() + ":"
          + currentdate.getSeconds();
        var text = {
          "PrinterName": environment.PRINTERNAME,
          "Format": "plain",
          "Data": '\n\nSE HA GENERADO UN NUEVO PEDIDO AW-' + (parseInt(this.lastOrderId) + 1) + '\n FECHA DE PEDIDO:' + datetime + ' \n\nCLIENTE:    ' + this.user[0].name.toUpperCase() + ' ' + this.user[0].lastname.toUpperCase() + '\n CALLE:     ' + this.user[0].calle.toUpperCase() + '\n CIUDAD: ' + '   Murcia' + '\n POBLACION: ' + this.user[0].poblacion.toUpperCase() + '\n CP :       ' + this.user[0].CP + '\n CONTACTO : ' + this.user[0].telefono + ' ' + this.user[0].email + '\n  TOTAL:    ' + Math.round((this.total + Number.EPSILON) * 100) / 100 + 'euros\n RECOGIDA/ENTREGA: ' + this.fechaRecogida.replace(/T/g, ' ') + '\n\n Forma de Pago: ' + this.chargesType.toUpperCase() + '\n\n\n\n\n\n\n\n\n\n\n'
        };
        this.http
          .post(environment.TPVIP + '/api/print/',
            text, { headers: headers })
          .subscribe(data => {
            localStorage.removeItem('cart');
            localStorage.setItem('cart', JSON.stringify({}));
            this._router.navigate(['/products']);
          });
        $("#success-alert").fadeTo(2000, 500).slideUp(500, function () {
          $("#success-alert").slideUp(500);
        });
        localStorage.removeItem('cart');
        localStorage.setItem('cart', JSON.stringify({}));
        this._router.navigate(['/products']);
        this.loading = false;
      }, error => {
        this.open()
        console.log(error)
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
          'sended': false,
          'userId': this.user[0].id,
          'email': this.user[0].email,
          'deliveryDate': deliveryDate.toISOString(),
          'orderNotes': this.orderNotes,
          'chargesType': this.chargesType
        };
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem("token")
        });
        this.http
          .post('https://panesandco.herokuapp.com/order',
            body, { headers: headers })
          .subscribe(data => {
          }, error => {
          });
        $("#danger-alert").fadeTo(2000, 500).slideUp(500, function () {
          $("#danger-alert").slideUp(500);
        });
        this.loading = false;
      });
  }

  async getFamilyName() {
    this._productsService.getFamilies().subscribe(
      (response) => {
        this.family = response;
      },
      (error) => {
      }
    );
  }

  async lastOrder() {
    await this._productsService.lastOrder().subscribe(
      (response) => {
        this.lastOrderId = response[0]['MAX(id)'];
        if (this.lastOrderId == 'undefined' || this.lastOrderId == 'null') {
          this.lastOrderId = 1
        }
      },
      (error) => {
      }
    );
  }

  onItemChange() {
    this.displayForm = true;
  }

  onChangeRadio(flag) {
    if (flag == 'delivery') {
      this.validateStreet = false
      this.shippingType = false;
      this.displayForm = true;
      this.creditCard = true
      this.user = localStorage.getItem("identity")
      this.user = JSON.parse(this.user);
      if (this.total > 30) {
        this.shipping = 0
      } else {
        this.shipping = 5
      }
    } else if (flag == 'tienda') {
      this.shipping = 0
      this.creditCard = false
      this.displayForm = false;
      this.user[0].calle = "El pedido se tomara en mesa X"
      this.shippingType = true;
      this.validateStreet = true

    } else if (flag == 'rtienda') {
      this.creditCard = true
      this.displayForm = false;
      this.user[0].calle = "El pedido se recogera en tienda";
      this.shipping = 0;
      this.shippingType = true;
      this.validateStreet = true
    }
  }

  onOtherChange() {
    this.displayForm = false;
  }

  ifLogin() {
    let identity = JSON.parse(localStorage.getItem('identity'));
    if (identity == null) {
      return true;
    } else {
      return false;
    }
  }

  loadStripe() {
    if (!window.document.getElementById('stripe-script')) {
      var s = window.document.createElement("script");
      s.id = "stripe-script";
      s.type = "text/javascript";
      s.src = "https://checkout.stripe.com/checkout.js";
      window.document.body.appendChild(s);
    }
  }

  pay(amount) {
    if (this.total <= 15 && this.chargesType == 'tarjeta') {
      this.openModal();
    } else {
      if (this.ifLogin()) {
      } else {
        if (this.chargesType == 'tarjeta') {
          var handler = (<any>window).StripeCheckout.configure({
            key: environment.STRIPEPK,
            locale: 'auto',
            token: (token: any) => {
              // You can access the token ID with `token.id`.
              // Get the token ID to your server-side code for use.
              var body = {
                'stripeToken': token.id,
                'amount': amount * 100
              };
              let headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              });
              this.http.post(environment.APIURL + '/charge',
                body, { headers: headers })
                .subscribe(data => {
                  this.buy()
                }, error => {
                  console.log(error)
                });
            }
          });

          handler.open({
            name: 'Panes&Co Checkout',
            description: '',
            amount: amount * 100
          });
        } else {
          this.buy()
        }
      }
    }
  }

  formaDePago(method) {
    if (method == 'tarjeta') {
      this.chargesType = 'tarjeta'
    } else if (method == 'efectivo') {
      this.chargesType = 'efectivo'
    } else {
      this.chargesType = 'El cliente quiere solicitar un credito'
    }
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

