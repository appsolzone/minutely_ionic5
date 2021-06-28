import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ManagerolesPage } from './manageroles.page';

describe('ManagerolesPage', () => {
  let component: ManagerolesPage;
  let fixture: ComponentFixture<ManagerolesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagerolesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerolesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
