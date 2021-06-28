import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditRoleMobilePage } from './edit-role-mobile.page';

describe('EditRoleMobilePage', () => {
  let component: EditRoleMobilePage;
  let fixture: ComponentFixture<EditRoleMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRoleMobilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditRoleMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
