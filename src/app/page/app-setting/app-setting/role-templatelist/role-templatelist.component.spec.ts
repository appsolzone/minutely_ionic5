import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoleTemplatelistComponent } from './role-templatelist.component';

describe('RoleTemplatelistComponent', () => {
  let component: RoleTemplatelistComponent;
  let fixture: ComponentFixture<RoleTemplatelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleTemplatelistComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoleTemplatelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
