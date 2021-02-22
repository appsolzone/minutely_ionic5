import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaypalPaymentPage } from './paypal-payment.page';

describe('PaypalPaymentPage', () => {
  let component: PaypalPaymentPage;
  let fixture: ComponentFixture<PaypalPaymentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaypalPaymentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaypalPaymentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
