import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-linkage-risk',
  templateUrl: './linkage-risk.component.html',
  styleUrls: ['./linkage-risk.component.scss'],
})
export class LinkageRiskComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() risks: any[];
  @Input() viewMode = '';
  public linkedRisks: any[];


  constructor(
    private router:Router,
  ) { }

  ngOnInit() {
    if(this.risks){
      this.getlinkedRisks();
    }
  }

  ngOnDestroy(){}

  ngOnChanges() {
    if(this.risks){
      this.getlinkedRisks();
    }
  }

  getlinkedRisks(){
    let newrisks = this.risks.map(t=>{
      const data = t.data;
      const id = t.id;
      const riskInitiationDate = new Date(data.riskInitiationDate?.seconds*1000);
      const targetCompletionDate = data.targetCompletionDate?.seconds ? new Date(data.targetCompletionDate?.seconds*1000) : null;
      // return {id, data: { ...data, startTime, endTime }};
      const highLightCells = {[data.riskProbability+data.riskImpact]: ''};
      return {id, data: {...data, riskInitiationDate, targetCompletionDate }, highLightCells};
    });
    this.linkedRisks =[];
    this.linkedRisks = newrisks.sort((a:any,b:any)=>a.data.riskInitiationDate-b.data.riskInitiationDate);
  }

  openRiskDetails(risk){
    this.router.navigate(['risk/risk-details-linkage/'+risk.id],{state: {data:{risk: risk}}});
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '/assets/shapes.svg';
  }

}
