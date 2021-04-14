import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { LinkageService } from 'src/app/shared/linkage/linkage.service';

@Component({
  selector: 'app-linkage-risk',
  templateUrl: './linkage-risk.component.html',
  styleUrls: ['./linkage-risk.component.scss'],
})
export class LinkageRiskComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() risks: any[];
  // @Input() editedlinkedRisks: any[];
  @Input() viewMode = '';
  // @Input() alllinkedRisks: any[];
  @Output() onEditLinkage = new EventEmitter<any>();
  public showSearchList: boolean = false;
  public linkedRisks: any[] =[];
  public editedlinkedRisks: any[] = [];

  constructor(
    private router:Router,
    private common: ComponentsService,
    private linkage: LinkageService
  ) { }

  ngOnInit() {
    if(this.risks){
      this.getLinkedRisks();
    }
  }

  ngOnDestroy(){}

  ngOnChanges() {
    if(this.risks){
      console.log("getLinkedRisks....onngChange", this.risks)
      this.getLinkedRisks();
    }
  }

  getLinkedRisks(){
    let newRisks = this.risks.map(m=>{
      const data = m.data;
      const id = m.id;
      const state = m.state;
      const riskInitiationDate = data.riskInitiationDate?.seconds ? new Date(data.riskInitiationDate?.seconds*1000) : data.riskInitiationDate;
      const targetCompletionDate = data.targetCompletionDate?.seconds ? new Date(data.targetCompletionDate?.seconds*1000) : data.targetCompletionDate ? data.targetCompletionDate : null;
      // return {id, data: { ...data, startTime, endTime }};
      const highLightCells = {[data.riskProbability+data.riskImpact]: ''};
      if(state){
        return {id, data: {...data, riskInitiationDate, targetCompletionDate },highLightCells, state};
      } else {
        return {id, data: {...data, riskInitiationDate, targetCompletionDate },highLightCells};
      }

    });
    // this.linkedRisks =[];
    this.linkedRisks = newRisks.sort((a:any,b:any)=>a.data.riskInitiationDate-b.data.riskInitiationDate);
    this.editedlinkedRisks = this.linkedRisks.filter(m=>['pending','delete'].includes(m.state));
    console.log("getLinkedRisks....", this.linkedRisks, this.editedlinkedRisks)
  }

  openRiskDetails(risk){
    this.router.navigate(['risk/risk-details-linkage/'+risk.id],{state: {data:{risk: risk}}});
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '/assets/shapes.svg';
  }

  linkSelectedRisk(m){
    console.log("linkSelectedRisk", m)
    const data = m.data;
    const id = m.id;
    let idx = this.linkedRisks.findIndex(lm=>lm.id==id);
    if(idx!=-1){
      this.linkedRisks.splice(idx,1);
      this.risks.splice(idx,1);
    }
    // const riskInitiationDate = new Date(data.riskInitiationDate?.seconds*1000);
    // const targetCompletionDate = data.targetCompletionDate?.seconds ? new Date(data.targetCompletionDate?.seconds*1000) : null;
    // return {id, data: { ...data, startTime, endTime }};
    this.editedlinkedRisks.push({...m,state: 'pending'});
    this.linkedRisks.push({...m,state: 'pending'});
    this.onEditLinkage.emit({editedlinkages: this.editedlinkedRisks});
    this.common.presentToaster("'"+m.data.riskTitle+"' has been added to the list of linked risk. It'll be saved when the changes are saved.")
    console.log("linkSelectedRisk", this.linkedRisks, this.editedlinkedRisks)
  }

  undoDelinkRisk(m,i){
    // now check if the state is to be deleted 'delete'
    // then restore the linkage back
    const data = m.data;
    const id = m.id;
    let eidx = this.editedlinkedRisks.findIndex(elm=>elm.id==id);
    this.editedlinkedRisks.splice(eidx,1);
    delete m.state;
    this.onEditLinkage.emit({editedlinkages: this.editedlinkedRisks});
    this.common.presentToaster("The linkage has been restored for '"+m.data.riskTitle+"'. It'll be saved when the changes are saved.")
  }

  delinkSelectedRisk(m,i){
    console.log("delinkSelectedRisk", m, i)
    const data = m.data;
    const id = m.id;
    // if its already pending just delete it from the list
    if(m.state=='pending'){
      let eidx = this.editedlinkedRisks.findIndex(elm=>elm.id==id);
      this.editedlinkedRisks.splice(eidx,1);
      this.linkedRisks.splice(i,1);
    } else {
      this.editedlinkedRisks.push({...m,state: 'delete'});
      // now set the state as delete
      // m.state= 'delete';
    }
    this.onEditLinkage.emit({linkages: this.linkedRisks, editedlinkages: this.editedlinkedRisks});

    this.common.presentToaster("'"+m.data.riskTitle+"' has been removed from the list of linked risk. It'll be saved when the changes are saved.")
    console.log("delinkSelectedRisk", this.linkedRisks, this.editedlinkedRisks)
  }

}
