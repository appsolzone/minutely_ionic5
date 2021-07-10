import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppSettingPage } from './app-setting.page';

describe('AppSettingPage', () => {
  let component: AppSettingPage;
  let fixture: ComponentFixture<AppSettingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSettingPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AppSettingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
