import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchComponentPage } from './search-component.page';

describe('SearchComponentPage', () => {
  let component: SearchComponentPage;
  let fixture: ComponentFixture<SearchComponentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchComponentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
