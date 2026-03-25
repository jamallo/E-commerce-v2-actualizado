import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutExitoComponent } from './checkout-exito.component';

describe('CheckoutExitoComponent', () => {
  let component: CheckoutExitoComponent;
  let fixture: ComponentFixture<CheckoutExitoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckoutExitoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckoutExitoComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
