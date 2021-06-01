import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { MinutelyKpiService } from 'src/app/shared/minutelykpi/minutelykpi.service';


@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.scss'],
})
@Autounsubscribe()
export class KpiComponent implements OnInit {
  @Input() kpiTypes:any[]=['meeting','task','issue','risk']; //,'riskMatrix', 'avgResolution'];
  // observables
  kpiSubs$;
  public kpiData:any;
  public highLightCells: any={
    LowLow: null, LowMedium: null, MediumLow: null,
    MediumMedium: null, LowHigh: null, HighLow: null,
    MediumHigh: null, HighMedium: null, HighHigh: null
  };
  public averageGraphX: any;

  constructor(
    private router: Router,
    private kpi: MinutelyKpiService,
  ) {
    this.kpiSubs$ = this.kpi.watch().subscribe(value=>{
      this.kpiData = value;
      if(this.kpiData){
        const {
            riskLowLow,riskLowMedium,riskMediumLow,
            riskMediumMedium,riskLowHigh,riskHighLow,
            riskMediumHigh,riskHighMedium,riskHighHigh,
            averageResolutionTask, averageResolutionRisk,
            averageResolutionIssue
          } = this.kpiData;
        this.highLightCells ={
          LowLow: riskLowLow ? riskLowLow : '-',LowMedium: riskLowMedium ? riskLowMedium : '-',MediumLow: riskMediumLow ? riskMediumLow : '-',
          MediumMedium: riskMediumMedium ? riskMediumMedium : '-',LowHigh: riskLowHigh ? riskLowHigh : '-',HighLow: riskHighLow ? riskHighLow : '-',
          MediumHigh: riskMediumHigh ? riskMediumHigh : '-',HighMedium: riskHighMedium ? riskHighMedium : '-',HighHigh: riskHighHigh ? riskHighHigh : '-'
        };
        let maxValueOfX = Math.max(averageResolutionTask, averageResolutionRisk, averageResolutionIssue);
         maxValueOfX =  maxValueOfX > 0 ?  maxValueOfX : 1;
        this.averageGraphX = {
           icon: 'analytics-outline',
           title: 'Average resolution time (days)',
           maxValue: 1,
           data: [
              {icon: 'body', label: 'Tasks completion', labelValue: averageResolutionTask?.toFixed(1), stack: [{cssClass: 'green', width: (averageResolutionTask*100/maxValueOfX), height: 1}]},
              {icon: 'flag', label: 'Risks resolution', labelValue: averageResolutionRisk?.toFixed(1), stack: [{cssClass: 'warning', width: (averageResolutionRisk*100/maxValueOfX), height: 1}]},
              {icon: 'options', label: 'Issues resolution', labelValue: averageResolutionIssue?.toFixed(1), stack: [{cssClass: 'danger', width: (averageResolutionIssue*100/maxValueOfX), height: 1}]}
            ],
        };
      }
      console.log("kpivalue", this.kpiData);
    });
  }

  ngOnInit() {}
  ngOnDestroy(){}

  gotoItemPage(item){
    this.router.navigate([item]);
  }

}
