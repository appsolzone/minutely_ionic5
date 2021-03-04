import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddProjectMobilePage } from './add-project-mobile.page';

describe('AddProjectMobilePage', () => {
  let component: AddProjectMobilePage;
  let fixture: ComponentFixture<AddProjectMobilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProjectMobilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddProjectMobilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
