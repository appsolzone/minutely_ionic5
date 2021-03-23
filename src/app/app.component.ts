import { Component } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd } from '@angular/router';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { appPages } from './shared/app-menu-pages';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public selectedIndex: number;
  public appPages = appPages;
  public isMenubarCollapsed: boolean = false;
  public darkMode: boolean = false;
  constructor(
    private router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addListener((e) => this.changeDarkMode(e.matches));
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  ngOnInit() {
    this.selectedIndex = this.appPages.findIndex(page => page.tab.toLowerCase() === 'profile');
    // Subscribe route change events for syncing the split pane menu selectors when the screen size changes
    this.router.events.subscribe((event: Event) => {
            // console.log("events", window.location.hash.replace('#',''), event instanceof NavigationStart, event instanceof NavigationEnd);
            // console.log("events", window.location.pathname);
            if (event instanceof NavigationStart) {
                //do something on start activity
                let currentPath = window.location.pathname; //.hash.replace('#','');
                let currentIndex = null;
                if (currentPath !== undefined) {
                  let tabPath = currentPath.split('/')[1];
                  currentIndex = this.appPages.findIndex(page => page.tab.toLowerCase() === tabPath?.toLowerCase().split('/')[0]);
                } else {
                  currentIndex = this.appPages.findIndex(page => page.tab.toLowerCase() === 'profile');
                }
                if(currentIndex != null && currentIndex!=-1){
                  appPages[currentIndex].url = currentPath;
                }
                 console.log("changeSelectedIndex", currentPath, currentIndex);
            }

            if (event instanceof NavigationEnd) {
                //do something on end activity
                const path = window.location.pathname.split('/')[1]; //.hash.replace('#','').split('tabs/')[1];
                if (path !== undefined) {
                  this.selectedIndex = this.appPages.findIndex(page => page.tab.toLowerCase() === path.toLowerCase().split('/')[0]);
                } else {
                  this.selectedIndex = this.appPages.findIndex(page => page.tab.toLowerCase() === 'profile');
                }
                // console.log("changeSelectedIndex NavigationEnd", window.location.hash, path, this.selectedIndex);
            }
    });
  }

  changeDarkMode(ev){
    // if(ev){
      this.darkMode = ev;
    // }
    console.log("document.body.classList", document.body.classList, ev, this.darkMode);
    document.body.classList.toggle('dark', this.darkMode);
  }

}
