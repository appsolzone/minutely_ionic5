import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { AnalyticsService } from 'src/app/shared/analytics/analytics.service';

@Component({
  selector: 'app-manageroles',
  templateUrl: './manageroles.page.html',
  styleUrls: ['./manageroles.page.scss'],
})
@Autounsubscribe()
export class ManagerolesPage implements OnInit {
  // observables
  sessionSubs$;
  public sessionInfo: any;
  public selectedRoleData: any;

  constructor(
    private router: Router,
    private session: SessionService,
    private analytics: AnalyticsService,
  ) {
    this.getSessionInfo();
  }

  ngOnInit() {
    this.analytics.setScreenName({name: 'ManagerolesPage'});
    let event = {
      name: 'Managerole_Page',
      params: {}
    };
    this.analytics.logEvent(event);
  }
  ngOnDestroy() {}

  ionViewDidEnter() {
    this.analytics.setScreenName({name: 'ManagerolesPage'});
    let event = {
      name: 'Managerole_Page',
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

 onSelectRole(role){
   console.log("Selected role", role?.roleName);
   this.selectedRoleData = undefined;
   setTimeout(()=>this.selectedRoleData = role,300);
 }

}
