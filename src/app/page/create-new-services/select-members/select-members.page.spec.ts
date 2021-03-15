import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectMembersPage } from './select-members.page';

describe('SelectMembersPage', () => {
  let component: SelectMembersPage;
  let fixture: ComponentFixture<SelectMembersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectMembersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectMembersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
