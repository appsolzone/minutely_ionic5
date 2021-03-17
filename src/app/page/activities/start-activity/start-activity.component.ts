import { Component, OnInit, Input } from '@angular/core';
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
  @Input() sessionInfo: any = {};
  @Input() onCancel: any = ()=>{};
  // observables
  // variables
  public searchModeProject = 'all';
  public searchModeActivity = 'all';
  public searchedprojects: any[]=[];
  public searchedactivities: any[] =[];
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
  ) { }

  ngOnInit() {}

  ngOnDestroy() {}

  projectSearchOptionsChanged(e){
    this.searchModeProject = e.detail.value;
    this.onSearchProject();
  }

  activitySearchOptionsChanged(e){
    this.searchModeActivity = e.detail.value;
    this.onSearchActivity();
  }

  onSearchProject(){
    const {subscriberId, uid} = this.sessionInfo;
    let queryObj = [
                {field: 'subscriberId',operator: '==', value: subscriberId},
                ];
    let searchTextObj = {seachField: 'searchMap', text: this.newTask.searchTitle.trim(), searchOption: this.searchModeProject};
    if(this.newTask.searchTitle.length >=3){
      this.project.getProjectsOnce(queryObj, searchTextObj, null)
        .then(projects=>{
          this.newTask.activity = {};
          this.searchedactivities = [];
          this.newTask.taskProject = {};
          this.searchedprojects = [];
          projects.forEach((doc)=>{
            this.searchedprojects.push(doc.data());
          });
        })
    } else {
      this.newTask.activity = {};
      this.searchedactivities = [];
      this.newTask.taskProject = {};
      this.searchedprojects = [];
    }

  }

  onSearchActivity(){
    const {subscriberId, uid} = this.sessionInfo;

    if(this.newTask.activity.name==this.newTask.taskName){
      // do nothing
    } else {
      this.newTask.activity = {};
      if(this.newTask.taskName.length <3){
        this.searchedactivities = [];
      } else if(this.newTask.taskProject.activities){
        let matchMap = this.searchMap.createSearchMap(this.newTask.taskName);
        let newexp = this.searchModeActivity == 'all' ? '^(?=.*?\ '+matchMap.matchAny.join('\ )(?=.*?\ ')+'\ ).*$' : ' (' + matchMap.matchAny.join('|') + ') '
        this.searchedactivities = this.newTask.taskProject.activities.filter(a=>a.status!='COMPLETE' && (' '+this.searchMap.createSearchMap(a.name).matchAny.join(' ')+' ').match(new RegExp(newexp)));
      }
    }

  }


  async createNewActivity(type: string){
    this.common.showLoader("Starting new activity, please wait ...");
    const {subscriberId, uid, name, picUrl, email } = this.sessionInfo.userProfile;
    if(type == 'save'){
      if(this.newTask.taskName && this.newTask.searchTitle && this.newTask.hourlyRate){
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
                        });
        } else {
          this.common.hideLoader();
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
      }
    }
  }

}
