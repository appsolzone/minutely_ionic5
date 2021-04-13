import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateIssuePage } from './create-issue.page';

describe('CreateIssuePage', () => {
  let component: CreateIssuePage;
  let fixture: ComponentFixture<CreateIssuePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateIssuePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateIssuePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
