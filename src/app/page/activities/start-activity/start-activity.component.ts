import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { Autounsubscribe } from '../../../decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { ActivityService } from 'src/app/shared/activity/activity.service';
import { ProjectService } from 'src/app/shared/project/project.service';
import { ComponentsService } from '../../../shared/components/components.service';
import { TextsearchService } from '../../../shared/textsearch/textsearch.service';

@Component({
  selector: 'app-start-activity',
  templateUrl: './start-activity.component.html',
  styleUrls: ['./start-activity.component.scss'],
})
@Autounsubscribe()
export class StartActivityComponent implements OnInit {
  @ViewChild('project') myInput: any;
  @ViewChild('activity') myActivityInput: any;
  @ViewChild('hourlyRate') myHourlyRateInput: any;

  @Input() sessionInfo: any = {};
  @Input() allTasks: any[] = [];
  @Input() onCancel: any = ()=>{};
  // observables
  projectSubs$;
  newActivitySubs$;
  // variables
  public newInputActivity: any;
  public searchModeProject = 'all';
  public searchModeActivity = 'all';
  public allProjects: any[] = [];
  public searchedprojects: any[]=[];
  public isProjectSearchFocused: boolean = true;
  public colorStack: any[];
  public searchedactivities: any[] =[];
  public isSearchFocused: boolean = true;
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
  ) {
    this.colorStack = this.project.projColorStack;
    this.newActivitySubs$ = this.activity.watch().subscribe(act=>{
      console.log("activities main this.newActivitySubs", act,act?.activity?.activityId);
      if(act && (act?.activity?.activityId || act?.taskProject?.projectId)){
        this.assignInputActivity(act);
      } else {
        this.newInputActivity = null;
      }
    });
  }

  async ngOnInit() {
    if(!this.projectSubs$ || !this.projectSubs$?.unsubscribe){
      await this.getProjects();
    }
    setTimeout(()=>{
      if(!this.newInputActivity?.activity?.activityId){
        this.myInput.setFocus();
      } else {
        this.myHourlyRateInput.setFocus();
      }
    },150);
  }

  ngOnDestroy() {}

  assignInputActivity(act){
    this.newInputActivity = act;
    let { activity, taskProject } = act;
    this.newTask = {...this.newTask, searchTitle: act.taskProject.title, taskName: activity.name, activity: {...activity}, taskProject: {...taskProject}};
    this.isProjectSearchFocused = this.isSearchFocused = false;
    console.log("activities main this.newTask", act,this.newTask);
    setTimeout(()=>{
      console.log("activities main this.newTask myHourlyRateInput.setFocus", act,this.newTask);
      this.myHourlyRateInput.setFocus();
    },150);
  }

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
                              (a.title.toLowerCase()).match(new RegExp(newExpString))
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


  async createNewActivity(type: string){
    this.common.showLoader("Starting new activity, please wait ...");
    const {subscriberId, uid, name, picUrl, email } = this.sessionInfo.userProfile;
    if(type == 'save'){
      let ProjectTitle = this.newTask.taskProject.projectId ? this.newTask.taskProject.title : this.newTask.searchTitle;
      let activityName = this.newTask.activity.name ? this.newTask.activity.name : this.newTask.taskName;
      let onGoingTask = this.allTasks.filter(t=>t.data.activityId==this.newTask.activity.activityId);
      if(onGoingTask.length>0){
        let title="Paused activity found";
        let body = "Please note that activity '"+ this.newTask.activity.name +"' is currently paused. Check the list of activities and restart the activity."
        let buttons: any[] = [
                        {
                          text: 'Dismiss',
                          role: 'cancel',
                          cssClass: '',
                          handler: ()=>{}
                        }
                      ];

        await this.common.presentAlert(title,body ,buttons);
        this.common.hideLoader();
      } else if(ProjectTitle && activityName && this.newTask.hourlyRate){
        let coordinates = await this.session.getCurrentPosition();
        if(coordinates){
          let locationStart = {
            latitude: coordinates.coords.latitude,
            longitude: coordinates.coords.longitude,
            altitude: coordinates.coords.altitude,
            accuracy: coordinates.coords.accuracy,
            altitudeAccuracy: coordinates.coords.altitudeAccuracy,
            heading: coordinates.coords.heading,
            speed: coordinates.coords.speed,
          };
        // create new activity
          let activityObj = {
              project: this.newTask.taskProject.projectId ? {projectId: this.newTask.taskProject.projectId, title: this.newTask.taskProject.title} : {title: this.newTask.searchTitle},
              activityId: this.newTask.activity.activityId ? this.newTask.activity.activityId : null,
              name: this.newTask.activity.name ? this.newTask.activity.name : this.newTask.taskName,
              rate: this.newTask.hourlyRate*1, //forcing the number data type here
              locationStart: locationStart,
              locationComplete: {},
              uid: uid,
              status: 'ACTIVE',
              subscriberId: subscriberId,
              startTime: new Date(moment().valueOf()), //TBA - this.session.admin.timeOffset), //firebase.firestore.FieldValue.serverTimestamp(),
              endTime: '',
              user: {
                uid: uid,
                name: name,
                picUrl: picUrl,
                email: email
              }
            };

          await this.activity.createUserActivity(activityObj, this.sessionInfo)
                        .then(async res=>{
                          this.common.hideLoader();
                          let title="Activity Started";
                          let body = "New activity has been started successfully."
                          let buttons: any[] = [
                                          {
                                            text: 'Dismiss',
                                            role: 'cancel',
                                            cssClass: '',
                                            handler: ()=>{}
                                          }
                                        ];

                          await this.common.presentAlert(title,body ,buttons);
                          this.common.hideLoader();
                          // this.sfp.defaultAlert("Activity Started","New activity has been started successfully");
                          Object.assign(this.newTask,{
                            searchTitle: '',
                            taskProject: {},
                            taskName: '',
                            activity: {},
                            hourlyRate: 0,
                          })
                          // hide the create new activity panel
                          this.onCancel();
                        })
                        .catch(async err=>{
                          this.common.hideLoader();
                          console.log("new activity error", err);
                          let title="Error";
                          let body = err.body ? err.body : "Please note that new activity could not be created! Please try again."
                          let buttons: any[] = [
                                          {
                                            text: 'Dismiss',
                                            role: 'cancel',
                                            cssClass: '',
                                            handler: ()=>{}
                                          }
                                        ];

                          await this.common.presentAlert(title,body ,buttons);
                          this.common.hideLoader();
                        });
        } else {
          let title = "Warning";
          let body = "Activity can not be started. It seems location service is not activated or permission is not allowed. Please enable location service and try again.";
          let buttons: any[] = [
                          {
                            text: 'Dismiss',
                            role: 'cancel',
                            cssClass: '',
                            handler: ()=>{}
                          }
                        ];

          await this.common.presentAlert(title,body ,buttons);
          this.common.hideLoader();
        }
      }else{
        let title="Missing Info";
        let body = "Please enter project name, activity name and hourly rates to continue."
        let buttons: any[] = [
                        {
                          text: 'Dismiss',
                          role: 'cancel',
                          cssClass: '',
                          handler: ()=>{}
                        }
                      ];

        await this.common.presentAlert(title,body ,buttons);
        this.common.hideLoader();
      }
    }
    this.activity.clear();
  }

}
