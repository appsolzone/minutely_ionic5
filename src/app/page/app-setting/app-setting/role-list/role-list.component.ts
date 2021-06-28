import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { appDefaultAclFeatures, appDefaultAclAclList } from 'src/app/shared/acl/appDefaultAclRole';
import { AclService } from 'src/app/shared/acl/acl.service';
import { ComponentsService } from 'src/app/shared/components/components.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.scss'],
})
@Autounsubscribe()
export class RoleListComponent implements OnInit {

  @Input() sessionInfo: any;
  @Output() onSelectRole = new EventEmitter<string>();
  // observables
  allRolesSubs$;
  public allRoles: any;
  public features = [];
  public appFeatures = appDefaultAclFeatures;

  constructor(
    private router: Router,
    private acl: AclService,
    private common: ComponentsService,
  ) { }

  ngOnInit() {
    this.features = Object.keys(appDefaultAclFeatures);
    this.getRoleDetails();
  }

  ngOnDestroy(){

  }

  // get permissions for the role
  async getRoleDetails(){
    if (this.allRolesSubs$?.unsubscribe) {
      await this.allRolesSubs$.unsubscribe();
    }
    const { role, subscriberId } = this.sessionInfo.userProfile;
    let queryObj=[
      {field: 'subscriberId', operator: '==', value: subscriberId},
      // {field: 'roleName', operator: '==', value: role}
    ];
    this.allRolesSubs$ = this.acl
      .getRoleData(queryObj)
      .subscribe((sub) => {
        //// console.log("subscribed up", data.userData, this.userData);
        const allRoleData = sub.map((a: any) => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        });
        this.allRoles = allRoleData;
      });
  }

  selectedRole(role){
    this.onSelectRole.emit({...role.data});
  }

  goToEditRoleMobile(role){
    if(role && this.sessionInfo.userProfile.role==role.data.roleName){
      if(role && this.sessionInfo.userProfile.role==role.data.roleName){
      let buttons = [
         {
          text: 'Dismiss',
          role: 'error',
          cssClass: 'error-button',
          handler: () => {
            // console.log('Confirm Ok');
          }
        }
      ];
      this.common.presentAlert('Warning','Please note that you can not edit permissions for the role which is assigned to your profile', buttons);
    } else {
      let selectedRoleData = role ?
                            {...role}
                            :
                            {id: null, data: {...appDefaultAclAclList['USER'], roleName:'', description: '', subscriberId: this.sessionInfo?.subscriberId}}
      this.router.navigate(['settings/edit-role-mobile'],{state: {data:{selectedRoleData: {...selectedRoleData}}}});
    }

  }

}
