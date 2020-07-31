import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleProductComponent } from './simple-product.component';

describe('SimpleProductComponent', () => {
  let component: SimpleProductComponent;
  let fixture: ComponentFixture<SimpleProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
