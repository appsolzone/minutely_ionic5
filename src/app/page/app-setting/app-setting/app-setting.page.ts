import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { AnalyticsService } from 'src/app/shared/analytics/analytics.service';
import { SettingsService } from 'src/app/shared/settings/settings.service';

@Component({
  selector: 'app-app-setting',
  templateUrl: './app-setting.page.html',
  styleUrls: ['./app-setting.page.scss'],
})
@Autounsubscribe()
export class AppSettingPage implements OnInit {
  // observables
  sessionSubs$;
  public sessionInfo: any;

  constructor(
    private router: Router,
    private session: SessionService,
    private analytics: AnalyticsService,
    private settingsservice: SettingsService,
  ) {
    this.getSessionInfo();
  }

  ngOnInit() {
    this.analytics.setScreenName({name: 'AppSettingPage'});
    let event = {
      name: 'Settings_Page',
      params: {}
    };
    this.analytics.logEvent(event);
  }
  ngOnDestroy() {}

  ionViewDidEnter() {
    this.analytics.setScreenName({name: 'AppSettingPage'});
    let event = {
      name: 'Settings_Page',
      params: {}
    };
    this.analytics.logEvent(event);
  }

  getSessionInfo(){
   this.sessionSubs$ = this.session.watch().subscribe(value=>{
      console.log("Session Subscription got", value);

      // Re populate the values as required
      this.sessionInfo = value;


      if(this.sessionInfo){
        // Nothing to do just display details
        if(this.sessionInfo?.userProfile){
          // this.getNotifications();
        }
      } else {
         this.router.navigate(['profile']);
      }
    });
 }

 gotoManageRoles(){
   // TBA
   this.router.navigate(['settings/manageroles']);
 }

 updateSettings(parameter){
   this.settingsservice.updateSettings(parameter, this.sessionInfo.orgProfile.settings[parameter], this.sessionInfo.subscriberId);
 }

}
