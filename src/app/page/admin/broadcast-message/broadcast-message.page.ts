import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';
import { SessionService } from 'src/app/shared/session/session.service';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { appPages } from 'src/app/shared/app-menu-pages';

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
  public path: string = 'admin';

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

  ngOnInit() {
    let location = window.location.pathname;
    this.path = location.match(/admin/) ? 'admin' : '';
  }
  ngOnDestroy(){}

  async processUserList(userList){
    let selectedUserList = [];
    let response = true;
    if(userList?.length>0){
      if(!this.msg.msgBody || !this.msg.msgTitle){
        response = false;
        await this.common.presentAlert('Error','Please note that broadcast message or title is missing. Please enter broadcast title and message to try again.');
      } else {
        userList.forEach(u=>{
            const {name, email, uid } = u;
            selectedUserList.push({name, email, uid});
          });
        let broadcast = await this.notification.broadcastNotifications(this.msg, this.sessionInfo, selectedUserList);
        if(broadcast.status=='success'){
          this.common.presentToaster(broadcast.body);
        }
      }

    }

    if(response){
      if(this.path=='admin'){
        this.router.navigate(['admin']);
      } else {
        this.router.navigate([appPages[0].url])
      }
    }

  }

}
