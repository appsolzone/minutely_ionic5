import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BargraphComponent } from './bargraph.component';

describe('BargraphComponent', () => {
  let component: BargraphComponent;
  let fixture: ComponentFixture<BargraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BargraphComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BargraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
