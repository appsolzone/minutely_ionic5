import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { User } from 'src/app/interface/user';
import { CrudService } from 'src/app/shared/crud/crud.service';
import { SearchText } from 'src/app/shared/empty-screen-text/empty-screen-text';
import { SearchServicesService } from 'src/app/shared/search-services/search-services.service';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-search-component',
  templateUrl: './search-component.page.html',
  styleUrls: ['./search-component.page.scss'],
})
@Autounsubscribe()
export class SearchComponentPage implements OnInit,OnDestroy {
  // observables
  sessionSubs$;
  allSearchresult$;


  userData: any;
  allProfiles: any[];
  userProfile: User;
  orgProfile:any =null;


  searchTexts:any = '';
  searchEmptyTexts:any;
  searchEmptyObj = SearchText;
  searchType = 'all';
  searchService:any;
  allSearchresult:any;
  searchServ:any;

  constructor(
    private _crud:CrudService,
    private _searchService:SearchServicesService,
    private _session:SessionService,
    private _router:Router,
  ) { }


  ngOnDestroy(){}


  ngOnInit() {
   this.getSessionInfo();
   this.setValue();
  }
  ionViewWillEnter(){
   this.setValue();
  }

    getSessionInfo(){
    this.sessionSubs$ = this._session.watch().subscribe(value=>{
       if(value?.userProfile){
       // Nothing to do just display details
       // Re populate the values as required
       this.userProfile = value?.userProfile;
       this.orgProfile = value?.orgProfile;
       } else {
          this._router.navigate(['profile']);
       }
     });
  }

  setValue(){
    this._crud.search_action$.subscribe(res=>{
     console.log("search text ",this.searchEmptyTexts);
     console.log(this.searchEmptyObj[res]);
     this.searchEmptyTexts = this.searchEmptyObj[res];
     this.searchServ = res;
  });
  }

  async searchMood(toggled:boolean){
    if(toggled){
    this.searchType = this.searchType == 'any'?'all':'any';
    }

    let searchTextObj = null;
    let queryObj = [];
    if(this.allSearchresult$ ?.unsubscribe){
      await this.allSearchresult$ .unsubscribe();
    }

    if(this.userProfile?.uid && this.orgProfile?.subscriberId){
      const {subscriberId, uid} = this.userProfile;
      queryObj = [
                  {field: 'subscriberId',operator: '==', value: subscriberId},
                  ];
      if(this.searchTexts.trim()!='' && this.searchTexts.trim().length>=2){
        searchTextObj = {seachField: 'titleSearchMap', text: this.searchTexts.trim(), searchOption: this.searchType};
      }
      console.log(queryObj,searchTextObj)

      this.allSearchresult$ = this._searchService.fetchAllRisks(this.searchServ,queryObj,searchTextObj)
                            .subscribe(res=>{
      console.log(res);
      this.allSearchresult = res;
    });
    } else {
      // console.log("else part");
    }

  }
}
