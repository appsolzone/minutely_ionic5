import { Component } from '@angular/core';
import { appPages } from '../shared/app-menu-pages';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  public appPages = appPages;

  constructor() {}

}
