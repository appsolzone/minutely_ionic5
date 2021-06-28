import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-role-mobile',
  templateUrl: './edit-role-mobile.page.html',
  styleUrls: ['./edit-role-mobile.page.scss'],
})
export class EditRoleMobilePage implements OnInit {
  public selectedRoleData: any ={};
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.selectedRoleData = history.state?.data?.selectedRoleData;
    if(!this.selectedRoleData){
      this.router.navigate(['settings']);
    }
  }

  ionViewDidEnter(){
    this.selectedRoleData = history.state?.data ? history.state?.data?.selectedRoleData : this.selectedRoleData;
    if(!this.selectedRoleData){
      this.router.navigate(['settings']);
    }
  }

}
