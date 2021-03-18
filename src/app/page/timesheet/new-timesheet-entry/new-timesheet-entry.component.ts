import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Platform } from '@ionic/angular';
import { Autounsubscribe } from '../../../decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { ActivityService } from 'src/app/shared/activity/activity.service';
import { ProjectService } from 'src/app/shared/project/project.service';
import { ComponentsService } from '../../../shared/components/components.service';
import { TextsearchService } from '../../../shared/textsearch/textsearch.service';
import { TimesheetService } from 'src/app/shared/timesheet/timesheet.service';

@Component({
  selector: 'app-new-timesheet-entry',
  templateUrl: './new-timesheet-entry.component.html',
  styleUrls: ['./new-timesheet-entry.component.scss'],
})
@Autounsubscribe()
export class NewTimesheetEntryComponent implements OnInit {
  @ViewChild('project') myInput: any;
  @ViewChild('activity') myActivityInput: any;
  // inputs
  @Input() sessionInfo: any = {};
  @Input() dateRange: any = {};
  @Input() wdEntryData: any = null;
  @Input() wdEntryDataIndex: number = null;
  @Input() addNewActivityData: any = ()=>{};
  @Input() newTimeSheetData: any[] = [];
  // observables
  weeklyActivitiesSubs$;
  projectSubs$;
  // variables
  public isMobile: boolean = true;
  public searchModeProject = 'all';
  public searchModeActivity = 'all';
  public allProjects: any[] = [];
  public searchedprojects: any[]=[];
  public isProjectSearchFocused: boolean = true;
  public colorStack: any[];
  public searchedactivities: any[] =[];
  public isSearchFocused: boolean = true;
  public timeInputValidationAlertShown: boolean = false;
  public viewLoaded: boolean = false;
  public wdEntry = {
    project: {},
    activity: {},
    count: 0,
    efforts: {Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0,Sun:0},
    billingAmount: {Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0,Sun:0},
    durations: {
                  Mon:{start:null, finish: null},
                  Tue:{start:null, finish: null},
                  Wed:{start:null, finish: null},
                  Thu:{start:null, finish: null},
                  Fri:{start:null, finish: null},
                  Sat:{start:null, finish: null},
                  Sun:{start:null, finish: null}
                 }
  };
  public weekDays: any[] =  [
                              {short:'M', medium: 'Mon', weekDate: null, start: null, finish: null, min:'', max:'', startTime: '', startPh: '00:00', finishTime: '', finishPh: '00:00'},
                              {short:'T', medium: 'Tue', weekDate: null, start: null, finish: null, min:'', max:'', startTime: '', startPh: '00:00', finishTime: '', finishPh: '00:00'},
                              {short:'W', medium: 'Wed', weekDate: null, start: null, finish: null, min:'', max:'', startTime: '', startPh: '00:00', finishTime: '', finishPh: '00:00'},
                              {short:'T', medium: 'Thu', weekDate: null, start: null, finish: null, min:'', max:'', startTime: '', startPh: '00:00', finishTime: '', finishPh: '00:00'},
                              {short:'F', medium: 'Fri', weekDate: null, start: null, finish: null, min:'', max:'', startTime: '', startPh: '00:00', finishTime: '', finishPh: '00:00'},
                              {short:'S', medium: 'Sat', weekDate: null, start: null, finish: null, min:'', max:'', startTime: '', startPh: '00:00', finishTime: '', finishPh: '00:00'},
                              {short:'S', medium: 'Sun', weekDate: null, start: null, finish: null, min:'', max:'', startTime: '', startPh: '00:00', finishTime: '', finishPh: '00:00'}
                            ];
  public newTask: any = {
                          searchTitle: '',
                          taskProject: {},
                          taskName: '',
                          activity: {},
                          hourlyRate: null,
                        };

  constructor(
    private session: SessionService,
    private activity: ActivityService,
    private common:ComponentsService,
    private project: ProjectService,
    public searchMap: TextsearchService,
    public timesheet: TimesheetService,
    private platform: Platform,
  ) {
    this.colorStack = this.project.projColorStack;
    this.isMobile = !this.platform.is('desktop');
    console.log("this.platform", this.platform.platforms());
  }

  async ngOnInit() {
    if(!this.projectSubs$ || !this.projectSubs$?.unsubscribe){
      await this.getProjects();
    }
    // populate dates for the wekdays in concern
    if(this.wdEntryData){
      this.wdEntry = this.wdEntryData;
      this.newTask.taskProject =  this.wdEntryData.project;
      this.newTask.activity =  this.wdEntryData.activity;
      this.newTask.hourlyRate =  this.wdEntryData.rate;
    }

    this.weekDays.forEach((wd,i)=>{
      wd.weekDate=moment(this.dateRange.startDate).add(i,'d');
      wd.min= moment(wd.weekDate).format('YYYY-MM-DDT00:00');
      wd.max= moment(wd.weekDate).format('YYYY-MM-DDT23:59');
      if(this.wdEntryData){
        wd.start = this.wdEntry.durations[wd.medium].start ?
                      moment(this.wdEntry.durations[wd.medium].start).format('YYYY-MM-DDTHH:mm')
                      :
                      moment(wd.weekDate).format('YYYY-MM-DDT00:00');
        wd.finish = this.wdEntry.durations[wd.medium].finish ?
                      moment(this.wdEntry.durations[wd.medium].finish).format('YYYY-MM-DDTHH:mm')
                      :
                      moment(wd.weekDate).format('YYYY-MM-DDT00:00');
      } else {
        wd.start = wd.finish = moment(wd.weekDate).format('YYYY-MM-DDT00:00');
      }
    });
    setTimeout(()=>{
      this.myInput.setFocus();
      this.viewLoaded = true;
    },150);

  }


  ngOnDestroy() {}

  projectSearchOptionsChanged(e){
    this.searchModeProject = e.detail.value;
    this.onSearchProject();
    setTimeout(()=>{
      this.myInput.setFocus();
    },150);
  }

  activitySearchOptionsChanged(e){
    this.searchModeActivity = e.detail.value;
    this.onSearchActivity();
    setTimeout(()=>{
      this.myActivityInput.setFocus();
    },150);
  }

  // search implement
  async getProjects(){
    let queryObj = [];
    if(this.projectSubs$?.unsubscribe){
      await this.projectSubs$.unsubscribe();
    }

    if(this.sessionInfo?.uid && this.sessionInfo?.subscriberId){
      const {subscriberId, uid} = this.sessionInfo;
      queryObj = [
                  {field: 'subscriberId',operator: '==', value: subscriberId},
                  {field: 'status',operator: '==', value: 'OPEN'}
                  ];
      this.projectSubs$ = this.project.getProjects(queryObj)
                            .subscribe(async act=>{
                              let allProjects = act.map((a: any) => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                const inceptionDate = new Date(data.inceptionDate?.seconds*1000);
                                const closureDate = data.closureDate? new Date(data.closureDate?.seconds*1000) : null;
                                const projectNo = data.projectId.replace(/[A-Z]/,'');
                                // return {id, data};
                                return {...data, inceptionDate, closureDate, projectNo};
                              });

                              this.allProjects = allProjects;
                              console.log("allProjects", this.allProjects);
                              // this.isProjectSearchFocused = true;
                              this.onSearchProject();

                            });
    } else {
      // console.log("else part");
    }

  }

  onSearchProject(){
    const {subscriberId, uid} = this.sessionInfo;

    if(this.newTask.taskProject.title==this.newTask.searchTitle){
      // do nothing
    } else {
      // this.newTask.activity = {};
      // if(this.newTask.searchTitle.length <3){
      if(!this.newTask.searchTitle.trim()){
        this.searchedprojects = []; //this.allProjects ? this.allProjects : [];
      } else {
        let matchMap = this.searchMap.createSearchMap(this.newTask.searchTitle);
        let matchStrings = this.newTask.searchTitle.trim().replace(/[\!\@\#\$\%\^\&\*\(\)\.\+]+/g,'').replace(/  +/g,' ').toLowerCase().split(' ');
        let newexp = this.searchModeProject == 'all' ? '^(?=.*?\ '+matchMap.matchAny.join('\ )(?=.*?\ ')+'\ ).*$' : ' (' + matchMap.matchAny.join('|') + ') ';
        let newExpString = this.searchModeProject == 'all' ? '^(?=.*?'+matchStrings.join(')(?=.*?')+'\).*$' : '^.*(' + matchStrings.join('|') + ').*$';
        console.log("newExpString project", newExpString);
        this.searchedprojects = this.allProjects.filter(a=>{
            let matched  = (
                              (' '+this.searchMap.createSearchMap(a.title).matchAny.join(' ')+' ').match(new RegExp(newexp)) ||
                              (a.title.toLowerCase()).match(new RegExp(newExpString),'i')
                            );
            return matched;
          });
          this.newTask.activity = {};
          this.searchedactivities = []; //this.newTask.taskProject.activities ? this.newTask.taskProject.activities : [];
          this.newTask.taskProject = {};
          // this.searchedprojects = [];
      }
    }


      // this.newTask.activity = {};
      // this.searchedactivities = this.newTask.taskProject.activities ? this.newTask.taskProject.activities : [];
      // // this.newTask.taskProject = {};
      // this.searchedprojects = [];

  }

  onProjectFocus(){
    this.isProjectSearchFocused = true;
    this.onSearchProject()
  }

  onProjectBlur(){
    setTimeout(()=>{this.isProjectSearchFocused = false;this.myActivityInput.setFocus();},150)
  }

  onSearchActivity(){
    const {subscriberId, uid} = this.sessionInfo;

    if(this.newTask.activity.name==this.newTask.taskName){
      // do nothing
    } else {
      // this.newTask.activity = {};
      // if(this.newTask.taskName.length <3){
      if(!this.newTask.taskName.trim()){
        this.searchedactivities = []; //this.newTask.taskProject.activities ? this.newTask.taskProject.activities : [];
        this.newTask.activity = {};
      } else if(this.newTask.taskProject.activities){
        let matchMap = this.searchMap.createSearchMap(this.newTask.taskName);
        let matchStrings = this.newTask.taskName.trim().replace(/[\!\@\#\$\%\^\&\*\(\)\.\+]+/g,'').replace(/  +/g,' ').toLowerCase().split(' ');
        let newexp = this.searchModeActivity == 'all' ? '^(?=.*?\ '+matchMap.matchAny.join('\ )(?=.*?\ ')+'\ ).*$' : ' (' + matchMap.matchAny.join('|') + ') ';
        let newExpString = this.searchModeActivity == 'all' ? '^(?=.*?'+matchStrings.join(')(?=.*?')+'\).*$' : '^.*(' + matchStrings.join('|') + ').*$';
        console.log("newExpString", newExpString);
        this.searchedactivities = this.newTask.taskProject.activities.filter(a=>{
            return a.status!='COMPLETE' &&
                    (
                      (' '+this.searchMap.createSearchMap(a.name).matchAny.join(' ')+' ').match(new RegExp(newexp)) ||
                      (a.name.toLowerCase()).match(new RegExp(newExpString))
                    )
          });
        this.newTask.activity = {};
      }
    }

  }

  onActivityFocus(){
    this.isSearchFocused = true;
    this.onSearchActivity()
  }

  onActivityBlur(){
    setTimeout(()=>{this.isSearchFocused = false;},150)
  }

  async startFinishChange(i){
    // console.log("data date change", this.weekDays[i].min,this.weekDays[i].max, this.weekDays[i].start, this.weekDays[i].finish);
    const day = this.weekDays[i];
    // if its not the same as input wdentry for editing
    if(this.viewLoaded){
      if(day.start && day.finish && day.start != day.finish && day.start < day.finish){
        this.common.showLoader();
        let message = await this.timesheet.validateWdEntry(this.sessionInfo, new Date(day.start), new Date(day.finish), this.newTimeSheetData);
        setTimeout(()=>this.common.hideLoader(),150);
        if(!message.nonConflictingActivity){
          this.weekDays[i].finish = this.weekDays[i].start = moment(this.weekDays[i].weekDate).format('YYYY-MM-DDT00:00');
          this.weekDays[i].startPh = this.weekDays[i].finishPh = "00:00";
          this.wdEntry.durations[day.medium] = {start: new Date(this.weekDays[i].start), finish: new Date(this.weekDays[i].finish)};
          this.wdEntry.efforts[day.medium] = 0; //moment().diff(moment(this.newTask.activeTask[0].startTime.seconds*1000)); // - this.session.admin.timeOffset;
          this.wdEntry.billingAmount[day.medium] = 0;

          let title=message.title;
          let body = message.body
          let buttons: any[] = [
                          {
                            text: 'Dismiss',
                            role: 'cancel',
                            cssClass: '',
                            handler: ()=>{}
                          }
                        ];

          await this.common.presentAlert(title,body ,buttons);
        } else {
          this.wdEntry.durations[day.medium] = {start: new Date(day.start), finish: new Date(day.finish)};
          this.weekDays[i].startPh = moment(new Date(this.weekDays[i].start)).format('HH:mm')
          this.weekDays[i].finishPh = moment(new Date(this.weekDays[i].finish)).format('HH:mm');
          this.wdEntry.efforts[day.medium] = moment(day.finish).diff(moment(day.start))/(60*60*1000); //moment().diff(moment(this.newTask.activeTask[0].startTime.seconds*1000)); // - this.session.admin.timeOffset;
          this.wdEntry.billingAmount[day.medium] = this.wdEntry.efforts[day.medium] * (this.newTask.hourlyRate*1);
          this.wdEntry.count ++;
        }

        // console.log("message from validation", message, day.start, day.finish);
      } else {
        // console.log("message from validation new ", day.start, day.finish);
        this.weekDays[i].finish = this.weekDays[i].start;
        this.weekDays[i].startPh = this.weekDays[i].finishPh = moment(new Date(this.weekDays[i].start)).format('HH:mm');
        this.wdEntry.durations[day.medium] = {start: new Date(this.weekDays[i].start), finish: new Date(this.weekDays[i].finish)};
        this.wdEntry.efforts[day.medium] = 0; //moment().diff(moment(this.newTask.activeTask[0].startTime.seconds*1000)); // - this.session.admin.timeOffset;
        this.wdEntry.billingAmount[day.medium] = 0;

        this.wdEntry.durations[day.medium] = {start: new Date(day.start), finish: new Date(day.finish)};
        this.wdEntry.efforts[day.medium] = moment(day.finish).diff(moment(day.start))/(60*60*1000); //moment().diff(moment(this.newTask.activeTask[0].startTime.seconds*1000)); // - this.session.admin.timeOffset;
        this.wdEntry.billingAmount[day.medium] = this.wdEntry.efforts[day.medium] * (this.newTask.hourlyRate*1);
        this.wdEntry.count = Object.keys(this.wdEntry.efforts).filter(e=>this.wdEntry.efforts[e]>0).length;
      }
    }

  }


  prepareNewActivityData(){
    // create new activity
      let activityObj = {
          project: this.newTask.taskProject.projectId ? {projectId: this.newTask.taskProject.projectId, title: this.newTask.taskProject.title} : {projectId: null, title: this.newTask.searchTitle},
          activity: this.newTask.activity.activityId ? {activityId: this.newTask.activity.activityId, name: this.newTask.activity.name} : {activityId: null, name: this.newTask.taskName},
          rate: this.newTask.hourlyRate*1, //forcing the number data type here
          efforts: {...this.wdEntry.efforts},
          billingAmount: {...this.wdEntry.billingAmount},
          durations: { ...this.wdEntry.durations }
        };
        return activityObj;
  }

  clickCancel(){
    this.addNewActivityData();
  }

  async saveData(){
    let data = this.prepareNewActivityData();
    if(!data.project.projectId || !data.activity.activityId || data.rate==null || this.wdEntry.count==0){
      let title="Incomplete data";
      let body = "Unable to process activity data. Please ensure that non zero effort is entered at least for one day."
      let buttons: any[] = [
                      {
                        text: 'Dismiss',
                        role: 'cancel',
                        cssClass: '',
                        handler: ()=>{}
                      }
                    ];

      await this.common.presentAlert(title,body ,buttons);
    } else {
      // console.log("data in the new entry page", data);
      this.addNewActivityData(data, this.wdEntryDataIndex);
    }

  }

  timeInputFocus(day,startFinish){
    // setTimeout(()=>{
      day[startFinish+'Time'] = day[startFinish+'Ph'] ? day[startFinish+'Ph'].replace(/[^0-9]+/g,'') : '0000';
    // },100);
  }

  async timeInputChange(i, startFinish){
    let day = this.weekDays[i];
    console.log("entry",startFinish,day[startFinish+'Time']);
    let timestring: any = (day[startFinish+'Time']+'').replace(/[^0-9]+/g,'');
    day[startFinish+'Ph'] = (timestring*1 + '');
    let title="Invalid time";
    let body = "Invalid time entered, please ensure that the time is 24 hr format and follows HHmm format."
    let buttons: any[] = [
                    {
                      text: 'Dismiss',
                      role: 'cancel',
                      cssClass: '',
                      handler: ()=>{ this.timeInputValidationAlertShown = false;}
                    }
                  ];
    let hr:any = '00';
    let mi:any = '00';
    console.log("entry",startFinish,hr,mi,day[startFinish+'Ph'],day[startFinish+'Ph'].length);
    if(day[startFinish+'Ph'].length >=1 && day[startFinish+'Ph'].length <= 4){
      hr = (day[startFinish+'Ph'].length - 2 > 0 ? day[startFinish+'Ph'].substr(0, day[startFinish+'Ph'].length - 2) : '00' ).padStart(2,'0');
      mi = (day[startFinish+'Ph'].length >0 ? day[startFinish+'Ph'].substr(-2) : '00' ).padStart(2,'0');
      console.log("entry if",startFinish,hr,mi,day[startFinish+'Ph'],day[startFinish+'Ph'].length);
      if(hr*1<0 || hr*1 > 23 || mi*1 < 0 || mi*1 > 59){
        hr = '00';
        mi = '00';
        this.timeInputValidationAlertShown = true;
        await this.common.presentAlert(title,body ,buttons);
      }
    } else {
      console.log("else of ",startFinish,hr,mi,day[startFinish+'Ph'].length);
      this.timeInputValidationAlertShown = true;
      await this.common.presentAlert(title,body ,buttons);
    }
    day[startFinish+'Ph'] = hr + ':' + mi;
    day[startFinish] = moment(new Date(day[startFinish])).format('YYYY-MM-DDT') + day[startFinish+'Ph'];
    console.log(startFinish,day[startFinish+'Ph'], day.start, day.finish);
    day[startFinish+'Time'] = '';
    console.log('before started validation', day.start, day.finish, this.timeInputValidationAlertShown);
    if(day.start && day.finish && !this.timeInputValidationAlertShown){
      this.timeInputValidationAlertShown = true;
      console.log('started validation', day.start, day.finish);
      await this.startFinishChange(i);
      this.timeInputValidationAlertShown = false;
    }
  }

}
