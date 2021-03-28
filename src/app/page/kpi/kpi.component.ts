import { Component, OnInit, Input } from '@angular/core';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { KpiService } from 'src/app/shared/kpi/kpi.service';


@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.scss'],
})
@Autounsubscribe()
export class KpiComponent implements OnInit {
  @Input() kpiTypes:any[]=['meeting','task','issue','risk']; //,'riskMatrix'];
  // observables
  kpiSubs$;
  public kpiData:any;
  public highLightCells: any={
    LowLow: null, LowMedium: null, MediumLow: null,
    MediumMedium: null, LowHigh: null, HighLow: null,
    MediumHigh: null, HighMedium: null, HighHigh: null
  };

  constructor(
    private kpi: KpiService,
  ) {
    this.kpiSubs$ = this.kpi.watch().subscribe(value=>{
      this.kpiData = value;
      if(this.kpiData){
        const {
            riskLowLow,riskLowMedium,riskMediumLow,
            riskMediumMedium,riskLowHigh,riskHighLow,
            riskMediumHigh,riskHighMedium,riskHighHigh
          } = this.kpiData;
        this.highLightCells ={
          LowLow: riskLowLow,LowMedium: riskLowMedium,MediumLow: riskMediumLow,
          MediumMedium: riskMediumMedium,LowHigh: riskLowHigh,HighLow: riskHighLow,
          MediumHigh: riskMediumHigh,HighMedium: riskHighMedium,HighHigh: riskHighHigh
        };
      }
      console.log("kpivalue", this.kpiData);
    });
  }

  ngOnInit() {}
  ngOnDestroy(){}

}
