import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserCommentsPage } from './user-comments.page';

describe('UserCommentsPage', () => {
  let component: UserCommentsPage;
  let fixture: ComponentFixture<UserCommentsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserCommentsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCommentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
