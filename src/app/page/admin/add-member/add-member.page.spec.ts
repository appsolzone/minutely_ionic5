import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddMemberPage } from './add-member.page';

describe('AddMemberPage', () => {
  let component: AddMemberPage;
  let fixture: ComponentFixture<AddMemberPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMemberPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddMemberPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
