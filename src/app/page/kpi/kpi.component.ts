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
  @Input() kpiTypes:any[]=['meeting','task','issue','risk'];
  // observables
  kpiSubs$;
  public kpiData:any;

  constructor(
    private kpi: KpiService,
  ) {
    this.kpiSubs$ = this.kpi.watch().subscribe(value=>{
      this.kpiData = value;
      console.log("kpivalue", this.kpiData);
    });
  }

  ngOnInit() {}
  ngOnDestroy(){}

}
