import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { ProjectService } from 'src/app/shared/project/project.service';
import { ActivityService } from 'src/app/shared/activity/activity.service';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { TextsearchService } from 'src/app/shared/textsearch/textsearch.service';
import { AccesscontrolService } from 'src/app/shared/accesscontrol/accesscontrol.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.page.html',
  styleUrls: ['./project-details.page.scss'],
})
@Autounsubscribe()
export class ProjectDetailsPage implements OnInit {
  // observables
  sessionSubs$;
  projectSubs$;
  projectSummarySubs$;
  public sessionInfo: any;
  public selectedProject: any;
  public matchedActivities: any[] =[]
  public searchText: string = '';
  public searchMode: string = 'all';
  public showAddActivity: boolean = false;
  public newActivityName: string;
  public statsFullWidth: boolean = false;
  public colorStack: any[];
  public editProject: boolean = false;
  public editActivity: boolean = false;

  constructor(
    private router:Router,
    private session: SessionService,
    private project: ProjectService,
    private activity: ActivityService,
    private common: ComponentsService,
    private searchMap: TextsearchService,
    private accesscontrol: AccesscontrolService,
  ) {
    this.colorStack = this.project.projColorStack;
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      if(this.sessionInfo?.uid != value?.uid || this.sessionInfo?.subscriberId != value?.subscriberId){
        // re initialise all content
      }
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
      // call getactivities if no sessionInfo to clean the subscription and timer
      // else if sessionInfo is present and not subscribed yet then subscribe to get the data
      if(!value || (value?.uid && value?.subscriberId && !this.projectSubs$?.unsubscribe)){
        // this.getProject();
      }
    });
  }

  ngOnInit() {
    this.selectedProject = window.history.state.project;
    if(!this.selectedProject){
      this.router.navigate(['projects']);
    } else {
      this.getProject();
    }

  }

  ionViewWillEnter(){
    let newSelectedProject = window.history.state.project;
    if(!newSelectedProject && !this.selectedProject){
      this.router.navigate(['projects']);
    } else if(!this.selectedProject || newSelectedProject?.projectId != this.selectedProject?.projectId){
      this.selectedProject = newSelectedProject;
      this.getProject();
    }
  }

  ngOnDestroy(){

  }

  SearchOptionsChanged(e){
    this.searchMode = e.detail.value;
    this.ionChange(e);
  }

  ionChange(e){
    if(this.searchText?.trim().length>=2){
      this.onSearchActivity();
    }
  }

  onClear(e){
    this.searchText = '';
    this.matchedActivities=[];
  }

  onSearchActivity(){
    // let matchMap = this.searchMap.createSearchMap(this.searchText);
    // let newexp = this.searchMode == 'all' ? '^(?=.*?\ '+matchMap.matchAny.join('\ )(?=.*?\ ')+'\ ).*$' : ' (' + matchMap.matchAny.join('|') + ') '
    // this.matchedActivities = this.selectedProject.data.activities.filter(a=>(' '+this.searchMap.createSearchMap(a.name).matchAny.join(' ')+' ').match(new RegExp(newexp)));

    let matchMap = this.searchMap.createSearchMap(this.searchText);
    let newexp = this.searchMode == 'all' ? '^(?=.*?\ '+matchMap.matchAny.join('\ )(?=.*?\ ')+'\ ).*$' : ' (' + matchMap.matchAny.join('|') + ') '

    let matchStrings = this.searchText.trim().replace(/[\!\@\#\$\%\^\&\*\(\)\.\+]+/g,'').replace(/  +/g,' ').toLowerCase().split(' ');
    let newExpString = this.searchMode == 'all' ? '^(?=.*?'+matchStrings.join(')(?=.*?')+'\).*$' : '^.*(' + matchStrings.join('|') + ').*$';

    this.matchedActivities = this.selectedProject.data.activities.filter(a=>{
      let searchString = (a.name + ' ' + a.status).toLowerCase();
      let matched  = (
                        (' '+this.searchMap.createSearchMap(a.name).matchAny.join(' ')+' ').match(new RegExp(newexp)) ||
                        searchString.match(new RegExp(newExpString))
                      );
      return matched;
    });
  }

  // search implement
  async getProject(){
    let queryObj = [];
    if(this.projectSubs$?.unsubscribe){
      await this.projectSubs$.unsubscribe();
    }

    if(this.sessionInfo?.uid && this.sessionInfo?.subscriberId && this.selectedProject){
      const {subscriberId, uid} = this.sessionInfo;
      queryObj = [
                  {field: 'subscriberId',operator: '==', value: subscriberId},
                  {field: 'projectId',operator: '==', value: this.selectedProject.data.projectId},
                  ];
      // project data
      this.projectSubs$ = this.project.getProjects(queryObj)
                            .subscribe(async act=>{
                              let allProjects = act.map((a: any) => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                const inceptionDate = new Date(data.inceptionDate?.seconds*1000);
                                const closureDate = data.closureDate? new Date(data.closureDate?.seconds*1000) : null;
                                const targetClosureDate = data.targetClosureDate ? new Date(data.targetClosureDate?.seconds*1000) : null;
                                const projectNo = data.projectId.replace(/[A-Z]/,'');
                                // return {id, data};
                                return {id, projectNo, targetClosureDate: moment(targetClosureDate).format('MMM D, YYYY'), data: {...data, inceptionDate, closureDate, targetClosureDate}};
                                // return {id, data};
                                // return {id, data: {...data, inceptionDate, closureDate}};
                              });

                              this.selectedProject = allProjects[0];
                              console.log('project_details', this.selectedProject)

                            });
    } else {
      // console.log("else part");
    }

  }

  // createActivity
  addActivity(){
    let activityObject = {
      projectId: this.selectedProject.data.projectId,
      activityId: null,
      name: this.newActivityName,
      status: 'OPEN',
    };
    this.project.createProjectActivity(activityObject, this.sessionInfo)
        .then(res=>{
          this.newActivityName = null;
          this.showAddActivity = false;
        });
  }

  onFullWidth(){
    this.statsFullWidth = !this.statsFullWidth;
  }

  openStartActivity(activity){
    let startActivity: any = {
                          activity: {...activity},
                          taskProject: {...this.selectedProject.data, projectNo: this.selectedProject.projectNo}
                        };
    this.activity.patch(startActivity);
    this.router.navigate(['activities']);
  }

  async openEditProject(override: boolean=null){
    if(override!=null){
      this.editProject = override;
    } else {
      // check whether the user has access or not
      let permissionToEdit = await this.accesscontrol.canEditProject(this.sessionInfo, this.selectedProject);
      if(permissionToEdit.canEdit){
        // add the code here
        this.editProject = true;
      } else {
        let {title, body} = permissionToEdit;
        let buttons: any[] = [
                        {
                          text: 'Dismiss',
                          role: 'cancel',
                          cssClass: '',
                          handler: ()=>{}
                        },
                      ];

        await this.common.presentAlert(title,body ,buttons);
      }
    }
  }

  async openEditActivity(override: boolean=null){
    if(override!=null){
      this.editActivity = override;
    } else {
      // check whether the user has access or not
      let permissionToEdit = await this.accesscontrol.canEditProject(this.sessionInfo, this.selectedProject);
      if(permissionToEdit.canEdit){
        // add the code here
        this.editActivity = true;
      } else {
        let {title, body} = permissionToEdit;
        let buttons: any[] = [
                        {
                          text: 'Dismiss',
                          role: 'cancel',
                          cssClass: '',
                          handler: ()=>{}
                        },
                      ];

        await this.common.presentAlert(title,body ,buttons);
      }
    }
  }

}
