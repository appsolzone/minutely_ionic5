import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InitiatePage } from './initiate.page';

describe('InitiatePage', () => {
  let component: InitiatePage;
  let fixture: ComponentFixture<InitiatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitiatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InitiatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
