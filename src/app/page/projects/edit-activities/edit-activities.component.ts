import { Component, OnInit, Input } from '@angular/core';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { Project } from 'src/app/interface/project';
import { ProjectService } from 'src/app/shared/project/project.service';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { TextsearchService } from 'src/app/shared/textsearch/textsearch.service';

@Component({
  selector: 'app-edit-activities',
  templateUrl: './edit-activities.component.html',
  styleUrls: ['./edit-activities.component.scss'],
})
@Autounsubscribe()
export class EditActivitiesComponent implements OnInit {

  @Input() sessionInfo: any;
  @Input() projectDetails: any;
  @Input() onCancel: any = ()=>{};
  public editProject: Project;
  public activities: any[] = [];
  public matchedActivities: any[] =[]
  public searchText: string = '';
  public searchMode: string = 'all';

  constructor(
    private project: ProjectService,
    private common: ComponentsService,
    private searchMap: TextsearchService,
  ) {
  }

  ngOnInit() {
    this.editProject = {...this.projectDetails.data};
    this.editProject.activities.forEach(act=>{
      this.activities.push({...act, isComplete: act.status!='OPEN'});
    });
    this.matchedActivities = this.activities;
  }
  ngOnDestroy(){}

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

    this.matchedActivities = this.activities.filter(a=>{
      let searchString = (a.name + ' ' + a.status).toLowerCase();
      let matched  = (
                        (' '+this.searchMap.createSearchMap(a.name).matchAny.join(' ')+' ').match(new RegExp(newexp)) ||
                        searchString.match(new RegExp(newExpString))
                      );
      return matched;
    });

  }

  saveProject(){
    this.common.showLoader("Saving project activities, please wait...")
    let updatedProject = { ...this.editProject};
    updatedProject.activities = this.activities.map(act=>{
                                    let activity = {...act, status: act.isComplete ? 'COMPLETE' : 'OPEN'};
                                    delete activity.isComplete;
                                    return activity;
                                  });
    this.project.updateProject(this.projectDetails.id, updatedProject, this.sessionInfo)
      .then(async res=>{
        let title = "Activities updated";
        let body = "The activitied of the project '" + updatedProject.title+"' has been updated successfully."
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
        this.onCancel(false);
      })
      .catch(async err=>{
        let title = "Error";
        let body = "Activities of project '" +updatedProject.title+"' could not be updated. Please check and try again."
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
      })
  }

}
