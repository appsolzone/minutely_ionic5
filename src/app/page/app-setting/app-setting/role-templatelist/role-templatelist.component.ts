import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { appDefaultAclAclList } from 'src/app/shared/acl/appDefaultAclRole';

@Component({
  selector: 'app-role-templatelist',
  templateUrl: './role-templatelist.component.html',
  styleUrls: ['./role-templatelist.component.scss'],
})
export class RoleTemplatelistComponent implements OnInit {
  @Input() sessionInfo: any;
  @Output() onSelectRole = new EventEmitter<string>();
  public templates = appDefaultAclAclList;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    console.log("appDefaultAclAclList", appDefaultAclAclList)
  }

  selectedRole(role){
    this.onSelectRole.emit({...role, roleName:'', description: '', subscriberId: this.sessionInfo?.subscriberId});
  }

  goToEditRoleMobile(role){
    this.router.navigate(['settings/edit-role-mobile'],{state: {data:{selectedRoleData: {id: null, data: {...role, roleName:'', description: '', subscriberId: this.sessionInfo?.subscriberId}}}}});
  }

}
