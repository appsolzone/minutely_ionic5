import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LinkageTaskComponent } from './linkage-task.component';

describe('LinkageTaskComponent', () => {
  let component: LinkageTaskComponent;
  let fixture: ComponentFixture<LinkageTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkageTaskComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkageTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
