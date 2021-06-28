import { Component, ViewChild } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd } from '@angular/router';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { appPages } from './shared/app-menu-pages';

import { isDevMode } from '@angular/core';

// import { IonRouterOutlet, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

import { ComponentsService } from 'src/app/shared/components/components.service';
import { FcmService } from 'src/app/shared/fcm/fcm.service';
import { AnalyticsService } from 'src/app/shared/analytics/analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public selectedIndex: number;
  public lastUrl: string;
  public appPages = appPages;
  public isMenubarCollapsed: boolean = false;
  public darkMode: boolean = false;
  // @ViewChild(IonRouterOutlet, { static : true }) routerOutlet: IonRouterOutlet;
  constructor(
    private router: Router,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private common: ComponentsService,
    private fcmService: FcmService,
    private analytics: AnalyticsService,
  ) {
    if (!isDevMode()) {
        console.log = function () {};
    }
    this.initializeApp();
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Listen for changes to the prefers-color-scheme media query
    prefersDark.addListener((e) => this.changeDarkMode(e.matches));
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // Trigger the push setup
      this.fcmService.initPush();
      this.analytics.initAnalytics();
    });
  }
  ngOnInit() {
    this.handleBackButton();
    this.selectedIndex = this.appPages.findIndex(page => page.tab.toLowerCase() === 'profile');
    this.lastUrl = '/profile';
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
                  this.lastUrl = currentPath;
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

  handleBackButton(){
    this.platform.backButton.subscribeWithPriority(-1, async () => {
      // if (!this.routerOutlet.canGoBack()) {
      // if(this.router.url.match('-linkage') && this.lastSelectedIndex != this.selectedIndex){
      //   // history.back();
      //   alert("this.routerOutlet.canGoBack()" + (this.routerOutlet.canGoBack() ? 'canGoBack' : 'Not possible'))
      //   // this.router.navigate([appPages[this.selectedIndex].tab]);
      //   // this.lastSelectedIndex = null;
      // } else
      if(this.router.url.replace('/','') == appPages[this.selectedIndex].tab.toLowerCase()){
        let title = 'Alert';
        let body = 'Are you sure, you would like to exit commonModule?';
        let response: boolean = false;
        let buttons: any[] = [
                        {
                          text: 'Dismiss',
                          role: 'cancel',
                          cssClass: '',
                          handler: ()=>{}  ,
                          resolve: false
                        },
                        {
                          text: 'Exit',
                          role: '',
                          cssClass: '',
                          handler: ()=>{App.exitApp();},
                          resolve: true
                        }
                      ];

        await this.common.presentAlertConfirm(title,body, buttons);
      } else {
        let lastPath = window.location.pathname;
        setTimeout(async ()=>{
          // let's check the url if changed, if its not changed then the
          // alert("[this.router.url]" + this.router.url + " [last url] " + this.lastUrl + " [appUrl] " + appPages[this.selectedIndex].url + " [lastPath] " + lastPath)
          if(lastPath==this.router.url){
            // this.router.navigate([appPages[this.selectedIndex].tab]);
            let title = 'Information';
            let body = 'Please use the back button at the top left corner of the screen if you wish to go back to previous page.';
            await this.common.presentAlert(title,body);
          }
        },50)
      }
    });
  }

}
