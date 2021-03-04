import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { ProjectService } from 'src/app/shared/project/project.service';
import { ComponentsService } from 'src/app/shared/components/components.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss'],
})
@Autounsubscribe()
export class ProjectListComponent implements OnInit {
  @Input() openAddProject: any = ()=>{};
  @Input() onSelectProject: any = ()=>{};
  @Input() addProject: boolean = false;
  // observables
  sessionSubs$;
  projectSubs$;
  public sessionInfo: any;
  public allProjects: any[]=[];
  public searchText: string = '';
  public searchMode: string = 'all';

  constructor(
    private router:Router,
    private session: SessionService,
    private project: ProjectService,
    private common: ComponentsService,
  ) {
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      if(this.sessionInfo?.uid != value?.uid || this.sessionInfo?.subscriberId != value?.subscriberId){
        // re initialise all content
        this.getProjects();
      }
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
      // call getactivities if no sessionInfo to clean the subscription and timer
      // else if sessionInfo is present and not subscribed yet then subscribe to get the data
      if(!value || (value?.uid && value?.subscriberId && !this.projectSubs$?.unsubscribe)){
        this.getProjects();
      }
    });
  }

  ngOnInit() {
    this.getProjects();
  }

  ngOnDestroy(){

  }

  gotoAddProject(){
    this.router.navigate(['/projects/add-project-mobile']);
  }

  SearchOptionsChanged(e){
    this.searchMode = e.detail.value;
    this.getProjects();
  }

  ionChange(e){
    if(this.searchText?.trim().length>=2){
      this.getProjects();
    }
  }

  onClear(e){
    this.searchText = '';
    this.getProjects();
  }

  // search implement
  async getProjects(){
    let searchTextObj = null;
    let queryObj = [];
    if(this.projectSubs$?.unsubscribe){
      await this.projectSubs$.unsubscribe();
    }

    if(this.sessionInfo?.uid && this.sessionInfo?.subscriberId){
      const {subscriberId, uid} = this.sessionInfo;
      queryObj = [
                  {field: 'subscriberId',operator: '==', value: subscriberId},
                  ];
      if(this.searchText.trim()!='' && this.searchText.trim().length>=2){
        searchTextObj = {seachField: 'searchMap', text: this.searchText.trim(), searchOption: this.searchMode};
      } else{
        queryObj.push({field: 'status',operator: '==', value: 'OPEN'})
      }
      this.projectSubs$ = this.project.getProjects(queryObj, searchTextObj)
                            .subscribe(async act=>{
                              let allProjects = act.map((a: any) => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                const inceptionDate = new Date(data.inceptionDate?.seconds*1000);
                                const closureDate = data.closureDate? new Date(data.closureDate?.seconds*1000) : null;
                                // return {id, data};
                                return {id, data: {...data, inceptionDate, closureDate}};
                              });

                              this.allProjects = allProjects;

                            });
    } else {
      // console.log("else part");
    }

  }

  showProjectDetails(p){
    this.onSelectProject(p);
  }
  gotoProjectDetails(p){
    this.router.navigate(['/projects/project-details'],{ state: { project: p }});
  }

}
