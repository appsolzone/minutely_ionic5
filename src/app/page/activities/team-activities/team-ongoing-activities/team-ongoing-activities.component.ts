import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { ActivityService } from 'src/app/shared/activity/activity.service';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { TextsearchService } from 'src/app/shared/textsearch/textsearch.service';

@Component({
  selector: 'app-team-ongoing-activities',
  templateUrl: './team-ongoing-activities.component.html',
  styleUrls: ['./team-ongoing-activities.component.scss'],
})
@Autounsubscribe()
export class TeamOngoingActivitiesComponent implements OnInit {
  @Input()  sessionInfo: any;
  // observables
  ongoingActivitySubs$;

  public allOngoingTasks: any[] = [];
  public showSearchBar: boolean = false;
  public matchedActivities: any[] =[]
  public searchText: string = '';
  public searchMode: string = 'all';

  constructor(
    private router:Router,
    private activity: ActivityService,
    private common:ComponentsService,
    private searchMap: TextsearchService,
  ) { }

  ngOnInit() {
    this.getActivities();
  }

  ngOnDestroy(){

  }

  gotoTeamStatsMobile(){
    this.router.navigate(['activities/team-activities/team-activity-stats-mobile']);
  }

  // search implement
  async getActivities(){
    this.getOngoingActivities();
  }
  async getOngoingActivities(){
    let queryObj = [];
    if(this.ongoingActivitySubs$?.unsubscribe){
      await this.ongoingActivitySubs$.unsubscribe();
    }
    if(this.sessionInfo?.uid && this.sessionInfo?.subscriberId){
      const {subscriberId, uid} = this.sessionInfo;
      queryObj = [
                  {field: 'subscriberId',operator: '==', value: subscriberId},
                  {field: 'status',operator: 'in', value: ['ACTIVE','PAUSE']}
                  ];
      this.ongoingActivitySubs$ = this.activity.getActivities(queryObj)
                            .subscribe(async act=>{
                              let allActivities = act.map((a: any) => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                const startTime = new Date(data.startTime?.seconds*1000);
                                const endTime = new Date(data.endTime?.seconds*1000);
                                const statusLabel = data.status == 'ACTIVE' ?
                                                    'Started working '+ moment(startTime).fromNow()
                                                    :
                                                    'Last worked ' + moment(endTime).fromNow();
                                // return {id, data};
                                return {id, data: {...data, startTime, endTime, statusLabel}};
                              });

                              this.allOngoingTasks =[];
                              this.allOngoingTasks = allActivities.sort((a,b)=>(b.data.startTime)-(a.data.startTime));

                              this.onSearchActivity();

                              console.log("allOngoingTasks", this.allOngoingTasks, subscriberId);

                            });
    } else {
    }

  }

  SearchOptionsChanged(e){
    this.searchMode = e.detail.value;
    this.ionChange(e);
  }

  ionChange(e){
    // if(this.searchText?.trim().length>=2){
      this.onSearchActivity();
    // }
  }

  onClear(e){
    this.searchText = '';
    this.matchedActivities=[];
  }

  onSearchActivity(){
    let matchMap = this.searchMap.createSearchMap(this.searchText);
    let newexp = this.searchMode == 'all' ? '^(?=.*?\ '+matchMap.matchAny.join('\ )(?=.*?\ ')+'\ ).*$' : ' (' + matchMap.matchAny.join('|') + ') '

    let matchStrings = this.searchText.trim().replace(/[\!\@\#\$\%\^\&\*\(\)\.\+]+/g,'').replace(/  +/g,' ').toLowerCase().split(' ');
    let newExpString = this.searchMode == 'all' ? '^(?=.*?'+matchStrings.join(')(?=.*?')+'\).*$' : '^.*(' + matchStrings.join('|') + ').*$';

    this.matchedActivities = this.allOngoingTasks.filter(a=>{
      let matched  = (
                        (' '+this.searchMap.createSearchMap(a.data.name).matchAny.join(' ')+' ').match(new RegExp(newexp)) ||
                        (a.data.name.toLowerCase()).match(new RegExp(newExpString),'i')||
                        (' '+this.searchMap.createSearchMap(a.data.project.title).matchAny.join(' ')+' ').match(new RegExp(newexp)) ||
                        (a.data.project.title.toLowerCase()).match(new RegExp(newExpString),'i') ||
                        (' '+this.searchMap.createSearchMap(a.data.user.name).matchAny.join(' ')+' ').match(new RegExp(newexp)) ||
                        (a.data.user.name.toLowerCase()).match(new RegExp(newExpString),'i') ||
                        (' '+this.searchMap.createSearchMap(a.data.status).matchAny.join(' ')+' ').match(new RegExp(newexp)) ||
                        (a.data.status.toLowerCase()).match(new RegExp(newExpString),'i')
                      );
      return matched;
    });

  }

}
