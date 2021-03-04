import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';
import { ProjectService } from 'src/app/shared/project/project.service';
import { GraphService } from 'src/app/shared/graph/graph.service';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { TextsearchService } from 'src/app/shared/textsearch/textsearch.service';

@Component({
  selector: 'app-project-stats',
  templateUrl: './project-stats.component.html',
  styleUrls: ['./project-stats.component.scss'],
})
@Autounsubscribe()
export class ProjectStatsComponent implements OnInit {
  @Input() selectedProject: any;
  @Input() sessionInfo: any;
  @Input() onFullWidth: any = ()=>{};
  @Input() statsFullWidth: boolean = false;
  // observables
  sessionSubs$;
  projectSubs$;
  projectSummarySubs$;
  public projectYearlyData: any[] =[];
  public projectViewYears: any[]=[];
  public startPeriod: string = moment().format('YYYY');
  public endPeriod: string = moment().format('YYYY');
  public minPeriod: string = moment().subtract(5,'y').format('YYYY');
  public maxPeriod: string = moment().format('YYYY');
  public graphData: any;
  public graphMode: string = 'efforts';


  constructor(
    private router:Router,
    private session: SessionService,
    private project: ProjectService,
    private graph: GraphService,
    private common: ComponentsService,
    private searchMap: TextsearchService,
  ) { }

  ngOnInit() {
    this.getProjectSummaries();
  }

  ngOnDestroy(){

  }

  ionYearChange(){
    this.minPeriod = moment(this.startPeriod).subtract(5,'y').format('YYYY');
    this.maxPeriod = moment(this.endPeriod).add(5,'y').format('YYYY') > moment().format('YYYY') ?
                     moment().format('YYYY')
                     :
                     moment(this.endPeriod).add(5,'y').format('YYYY');
    this.getProjectSummaries();
  }

  graphModeChanged(e){
    this.graphMode = e.detail.value;
  }

  // search implement
  async getProjectSummaries(){
    let queryObj = [];
    if(this.projectSubs$?.unsubscribe){
      await this.projectSubs$.unsubscribe();
    }

    if(this.sessionInfo?.uid && this.sessionInfo?.subscriberId && this.selectedProject){
      this.projectViewYears =[];
      for(let y=parseInt(this.startPeriod); y<= parseInt(this.endPeriod); y++){
        this.projectViewYears.push(y.toString());
      }
      const {subscriberId, uid} = this.sessionInfo;
      queryObj = [
                  {field: 'subscriberId',operator: '==', value: subscriberId},
                  {field: 'projectId',operator: '==', value: this.selectedProject.data.projectId},
                  {field: 'year',operator: 'in', value: this.projectViewYears},
                  ];
      // project data
      this.projectSubs$ = this.project.getProjectSummary(queryObj)
                            .subscribe(async act=>{
                              let allSummaries = act.map((a: any) => {
                                const data = a.payload.doc.data();
                                const id = a.payload.doc.id;
                                return {id, data};
                              });

                              this.projectYearlyData = allSummaries;
                              this.graphData = this.graph.createProjectSummaryGraph(this.projectYearlyData, this.projectViewYears);
                              console.log("project summary", this.graphData)
                            });
    } else {
      // console.log("else part");
    }

  }

}
