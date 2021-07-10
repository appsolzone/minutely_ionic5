import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { appDefaultAclFeatures } from 'src/app/shared/acl/appDefaultAclRole';
import { AclService } from 'src/app/shared/acl/acl.service';
import { ComponentsService } from 'src/app/shared/components/components.service';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss'],
})
export class EditRoleComponent implements OnInit {
  @Input() roleData: any;
  @Output() onSelectRole = new EventEmitter<string>();
  public modules = [];
  public features = [];
  public roleFeatures: any = {};
  // public permissions: any ={};

  constructor(
    private router: Router,
    private acl: AclService,
    private common: ComponentsService,
  ) { }

  ngOnInit() {
    console.log("calling on ngInit", this.roleData);
    if(this.roleData){
      this.processRole();
    }

  }

  processRole(){
    // this.modules = Object.keys(appDefaultAclPermissions);
    this.features = Object.keys(appDefaultAclFeatures);
    // this.permissions  = {};
    this.roleFeatures = {};
    this.features.forEach(f=>{
      if(this.roleData.data.features && this.roleData.data.features[f]){
        Object.assign(this.roleFeatures,{[f]:{...appDefaultAclFeatures[f], ...this.roleData.data.features[f]}});
      } else {
        Object.assign(this.roleFeatures,{[f]:{...appDefaultAclFeatures[f]}});
      }
    });
    // this.modules.forEach(m=>{
    //   if(this.roleData.data.permissions && this.roleData.data.permissions[m]){
    //     Object.assign(this.permissions,{[m]:{...appDefaultAclPermissions[m], ...this.roleData.data.permissions[m]}});
    //   } else {
    //     Object.assign(this.permissions,{[m]:{...appDefaultAclPermissions[m]}});
    //   }
    // });
    console.log("calling on processRole", this.roleFeatures);
  }

  cancelEditRole(){
    this.onSelectRole.emit(null);
  }

  async saveRole(){
    this.common.showLoader('Saving role information, please wait...');
    let roleToSave = {
                id: this.roleData.id,
                data: {
                  ...this.roleData.data,
                  features: this.roleFeatures,
                }
               }
    let res = await this.acl.saveRole({...roleToSave});
    this.common.hideLoader();
    if(res?.status=='error'){
      let buttons = [{
                       text: 'Dismiss',
                       role: 'error',
                       cssClass: 'error-button',
                       handler: () => {
                       }
                     }];
      this.common.presentAlert(res.title, res.msg, buttons);
    } else {
      this.common.presentToaster("Role saved successfully")
      this.router.navigate(['settings/manageroles'])
    }
  }

}
