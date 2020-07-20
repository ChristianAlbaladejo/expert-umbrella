import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../app/services/products.service';
import { UserService } from '../../../app/services/user.service';
import { Product } from '../../../app/models/product';
import { User } from '../../../app/models/user';
import { Router, ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers: [ProductsService, UserService],
})
export class ProductsComponent implements OnInit {
  public product: Product;
  public families;
  selectedLanguage = 'es';

  constructor(
    private _productsService: ProductsService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router,
    public translate: TranslateService
  ) {
    this.product = new Product('','','','','','', '','','','','','','','','','','','','', '','','','','','');

    translate.addLangs(['en', 'es']);
    translate.setDefaultLang('es');
  }

  ngOnInit(): void {
    console.log('componente');
    this._productsService.getFamilies().subscribe(
      (response) => {
        console.log(response);
        this.families = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ifLogin() {
    /* this._userService.ifGetIdentity(); */
    let identity = JSON.parse(localStorage.getItem('identity'));
    if (identity == null) {
      return true;
    } else {
      return false;
    }
  }

  goLogin() {
    if (this.ifLogin()) {
      this._router.navigate(['/login']);
    } else {
      this._router.navigate(['/cart']);
    }
  }

  selectLanguage(lang: string) {
    this.translate.use(lang);
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
