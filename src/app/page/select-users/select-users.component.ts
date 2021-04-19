import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { ManageuserService } from 'src/app/shared/manageuser/manageuser.service';
import { TextsearchService } from 'src/app/shared/textsearch/textsearch.service';

@Component({
  selector: 'app-select-users',
  templateUrl: './select-users.component.html',
  styleUrls: ['./select-users.component.scss'],
})
@Autounsubscribe()
export class SelectUsersComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() alreadySelectedUserList: any[];
  @Input() multiSelect: boolean = false;
  @Input() buttonItem: any = { icon: 'checkmark-done', text: 'Done'};
  @Input() popoverMode:boolean = false;
  @Input() showAddUser:boolean = true;
  @Input() sectionHeader:any = null; //{ icon: 'people', text: 'Select Users to send email ' }
  @Output() onSelectionComplete= new EventEmitter<any>();
  // observables
  userSubs$;
  public userList: any[];
  public textSearch: string = "";
  public filterdUserList: any[];
  public searchMode: string = 'all';
  public selectedUser: any;
  public selectedUsers: any[]=[];

  constructor(
    private common: ComponentsService,
    private user: ManageuserService,
    private searchMap: TextsearchService,
    private router: Router,
    public popoverController: PopoverController
  ) { }

  ngOnInit() {
    if(this.sessionInfo?.subscriberId){
      this.getUsers();
    }
  }
  ngOnDestroy() {}

  ngOnChanges(){
    if(this.sessionInfo?.subscriberId && !this.userSubs$){
      this.getUsers();
    }
  }

  getUsers(){
    const {subscriberId} = this.sessionInfo;
    let queryObj = [{field: 'subscriberId',operator: '==', value: subscriberId},
                    {field: 'status',operator: '==', value: 'ACTIVE'}]
    if(!this.userSubs$?.unsubscribe){
      this.userSubs$ = this.user.fetchAllUsers(queryObj)
                        .subscribe(act=>{
                          this.selectedUsers = [];
                          let allUsers = act.map((a: any) => {
                            const data = a.payload.doc.data();
                            const id = a.payload.doc.id;
                            let matchedUser = {selected: false};
                            if(this.alreadySelectedUserList){
                              let idx = this.alreadySelectedUserList.findIndex(s=>s.uid==data.uid);
                              if(idx!=-1){
                                matchedUser = {...this.alreadySelectedUserList[idx], selected: true};
                                this.selectedUsers.push({...matchedUser,...data});
                              }
                            }
                            return {...matchedUser,...data};
                          });
                          this.userList =allUsers;
                          this.onSearchUser();
                        });
    }

  }

  onSearchUser(){

      if(!this.textSearch.trim()){
        this.filterdUserList = this.userList;
      } else {
        let matchMap = this.searchMap.createSearchMap(this.textSearch.trim());
        let matchStrings = this.textSearch.trim().replace(/[\!\@\#\$\%\^\&\*\(\)\.\+]+/g,'').replace(/  +/g,' ').toLowerCase().split(' ');
        let newexp = this.searchMode == 'all' ? '^(?=.*?\ '+matchMap.matchAny.join('\ )(?=.*?\ ')+'\ ).*$' : ' (' + matchMap.matchAny.join('|') + ') ';
        let newExpString = this.searchMode == 'all' ? '^(?=.*?'+matchStrings.join(')(?=.*?')+'\).*$' : '^.*(' + matchStrings.join('|') + ').*$';
        console.log("newExpString", newExpString);
        this.filterdUserList = this.userList.filter(a=>{
            let refString = a.name + ' ' + a.role + ' ' + a.email;
            return (
                      (' '+this.searchMap.createSearchMap(refString).matchAny.join(' ')+' ').match(new RegExp(newexp)) ||
                      (refString.toLowerCase()).match(new RegExp(newExpString))
                    )
          });
      }


  }

  multiSelectAddRemove(user){
    console.log("user.selected", user.selected, this.selectedUsers);
    if(user.selected){
      let idx = this.selectedUsers.findIndex(su=>su.uid==user.uid);
      if(idx==-1){
        this.selectedUsers.push(user);
      }
    } else {
      let idx = this.selectedUsers.findIndex(su=>su.uid==user.uid);
      if(idx!=-1){
        this.selectedUsers.splice(idx,1);
      }
    }
    console.log("post splice user.selected", user.selected, this.selectedUsers);
  }

  returnSelectedUsers(){
    console.log("this.selectedUsers",this.selectedUser, this.selectedUsers);
    if(this.multiSelect){
      this.onSelectionComplete.emit(this.selectedUsers);
    } else {
      this.onSelectionComplete.emit(this.selectedUser);
    }
    // this.selectedUsers = [];
    // this.selectedUser = null;
    // this.textSearch ='';

    if(this.popoverMode) this.closePopover();
  }

  gotoAddMemberPage(){
    let currentPath = window.location.pathname;
    this.router.navigate([currentPath+'/add-member']);
  }
  async closePopover() {
     console.log("this.selectedUsers",this.selectedUser, this.selectedUsers);
    await this.popoverController.dismiss(this.selectedUsers);
  }

}
