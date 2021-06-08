import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import * as papa from 'papaparse';
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
  @Input() showAddNonPermUser:boolean = false;
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
  public showAddTempUser: boolean = false;
  public addUserData:any;
  public emailRegExp = "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"; //RFC 5322

  constructor(
    private common: ComponentsService,
    private user: ManageuserService,
    private searchMap: TextsearchService,
    private router: Router,
    public popoverController: PopoverController
  ) {
    this.addUserData = {...this.user.newUser};
  }

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
                          let tempUserList = this.alreadySelectedUserList.filter(u=>!u.uid).map(tu=>{return {...tu, selected: true}});
                          this.selectedUsers = [...tempUserList];
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
                          this.userList =[...allUsers,...tempUserList];
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
    console.log("user.selected", user, this.userList, user.selected, this.selectedUsers);
    if(user.selected){
      let idx = this.selectedUsers.findIndex(su=>su.uid && su.uid!=''? su.uid==user.uid : su.email==user.email);
      if(idx==-1){
        this.selectedUsers.push(user);
      }
    } else {
      let idx = this.selectedUsers.findIndex(su=>su.uid && su.uid!='' ? su.uid==user.uid : su.email==user.email);
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

  showHideAddTempUser(){
    this.showAddTempUser = !this.showAddTempUser;
    this.addUserData = {...this.user.newUser, name: '', email: ''};
  }

  onAddTempUser(){
    // TBA
    console.log("addUserData",{...this.addUserData, selected: true});
    this.userList.push({...this.addUserData,selected: true});
    this.selectedUsers.push({...this.addUserData, selected: true});
    this.showHideAddTempUser();
  }

  selectedFile(e){
    console.log("event:",e);

    const file = e.target.files[0];
    console.log(file);
    this.extractData(file);
  }

   private async extractData(res) {
    let resCsvData = res || '';
    let extractMembers = [];
    await papa.parse(resCsvData, {
      complete: async parsedData => {
        let headerRow = parsedData.data.splice(0, 1)[0];
        let csvData = parsedData.data;
        //  console.log("header",headerRow);
        //  console.log("csvdata:",csvData);
        csvData.map((splitText)=>{
        console.log("every single array",splitText)
          var obj = {
            ...this.addUserData,
            selected:true,
            picUrl:'',
            jobTitle:'Non permanent user',
            name: null,
            email: null
          };
          for(var i = 0; i < splitText.length; i++) {
            var data = splitText[i];
            if(data?.trim()){obj[headerRow[i]?.trim().toLowerCase()] = data?.trim();}
          }
          console.log(obj);
          if(obj.name && obj.email){extractMembers.push(obj);}
        })
        // add all those users
          if(extractMembers.length==0){
            this.common.presentAlert("Warning", "No valid user found in the selected file. Please check and try again.");
          } else {
            await this.common.presentToaster("Attendee list uploaded successfully");
            console.log("Now the object is:",extractMembers);
            this.userList = [...this.userList,...extractMembers];
            this.selectedUsers = [...this.selectedUsers,...extractMembers];
            this.onSearchUser();
          }

          console.log(this.userList,this.selectedUsers);
          //this.showHideAddTempUser();
          //this.showAddTempUser = !this.showAddTempUser;
        }
    });

    // if(extractMembers.length > 0){
    //   await this.common.presentToaster("Attendee list uploaded successfully");
    // }
  }

}
