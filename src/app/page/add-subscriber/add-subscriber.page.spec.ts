import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddSubscriberPage } from './add-subscriber.page';

describe('AddSubscriberPage', () => {
  let component: AddSubscriberPage;
  let fixture: ComponentFixture<AddSubscriberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSubscriberPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddSubscriberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
