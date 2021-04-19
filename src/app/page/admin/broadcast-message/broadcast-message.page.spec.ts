import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BroadcastMessagePage } from './broadcast-message.page';

describe('BroadcastMessagePage', () => {
  let component: BroadcastMessagePage;
  let fixture: ComponentFixture<BroadcastMessagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BroadcastMessagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BroadcastMessagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
