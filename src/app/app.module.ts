import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductsComponent } from './components/products/products.component';
import { CartComponent } from './components/cart/cart.component';
import { FilterProductsComponent } from './components/filter-products/filter-products.component';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleProductComponent } from './components/simple-product/simple-product.component';
import { NgxStripeModule } from 'ngx-stripe';
import { OrdersComponent } from './components/orders/orders.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { NgxNumberSpinnerModule } from 'ngx-number-spinner';
import { MenuComponent } from './components/menu/menu.component';

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ProductsComponent,
    CartComponent,
    FilterProductsComponent,
    SimpleProductComponent,
    OrdersComponent,
    DateAgoPipe,
    MenuComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientModule,
    NgxStripeModule.forRoot('pk_test_51H9oTAATbeiMfoWZHrm3q0QCUtANPgu7FJ2x1CLcb5zCALiQ3yGdCq23LjRC4D6KGtzyDeeIUKu8hruQneZBBfHs00fbbXUCym'),
    ReactiveFormsModule,
    NgxNumberSpinnerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
