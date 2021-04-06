import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { SessionService } from 'src/app/shared/session/session.service';
import { ComponentsService } from 'src/app/shared/components/components.service';

@Component({
  selector: 'app-broadcast-message',
  templateUrl: './broadcast-message.page.html',
  styleUrls: ['./broadcast-message.page.scss'],
})
@Autounsubscribe()
export class BroadcastMessagePage implements OnInit {
  // observables
  sessionSubs$;
  public sessionInfo: any;
  public msg: any = {magBody: '', msgTitle: ''};

  constructor(
    private router: Router,
    private notification: NotificationsService,
    private session: SessionService,
    private common:ComponentsService,
  ) {
    this.sessionSubs$ = this.session.watch().subscribe(async value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      if(this.sessionInfo?.uid != value?.uid || this.sessionInfo?.subscriberId != value?.subscriberId){
        this.msg = {magBody: '', msgTitle: ''};
      }
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
    });
  }

  ngOnInit() {}
  ngOnDestroy(){}

  async processUserList(userList){
    let selectedUserList = [];
    userList.forEach(u=>{
        const {name, email, uid } = u;
        selectedUserList.push({name, email, uid});
      });
    let broadcast = await this.notification.broadcastNotifications(this.msg, this.sessionInfo, selectedUserList);
    if(broadcast.status=='success'){
      this.common.presentToaster(broadcast.body);
    }

    this.router.navigate(['admin']);
  }

}
