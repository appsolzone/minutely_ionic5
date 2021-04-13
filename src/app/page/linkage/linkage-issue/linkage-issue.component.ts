import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { LinkageService } from 'src/app/shared/linkage/linkage.service';

@Component({
  selector: 'app-linkage-issue',
  templateUrl: './linkage-issue.component.html',
  styleUrls: ['./linkage-issue.component.scss'],
})
export class LinkageIssueComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() issues: any[];
  // @Input() editedlinkedIssues: any[];
  @Input() viewMode = '';
  // @Input() alllinkedIssues: any[];
  @Output() onEditLinkage = new EventEmitter<any>();
  public showSearchList: boolean = false;
  public linkedIssues: any[] =[];
  public editedlinkedIssues: any[] = [];

  constructor(
    private router:Router,
    private common: ComponentsService,
    private linkage: LinkageService
  ) { }

  ngOnInit() {
    if(this.issues){
      this.getLinkedIssues();
    }
  }

  ngOnDestroy(){}

  ngOnChanges() {
    if(this.issues){
      console.log("getLinkedIssues....onngChange", this.issues)
      this.getLinkedIssues();
    }
  }

  getLinkedIssues(){
    let newIssues = this.issues.map(m=>{
      const data = m.data;
      const id = m.id;
      const state = m.state;
      const issueInitiationDate = data.issueInitiationDate?.seconds ? new Date(data.issueInitiationDate?.seconds*1000) : data.issueInitiationDate;
      const targetCompletionDate = data.targetCompletionDate?.seconds ? new Date(data.targetCompletionDate?.seconds*1000) : data.targetCompletionDate ? data.targetCompletionDate : null;
      // return {id, data: { ...data, startTime, endTime }};
      if(state){
        return {id, data: {...data, issueInitiationDate, targetCompletionDate }, state};
      } else {
        return {id, data: {...data, issueInitiationDate, targetCompletionDate }};
      }

    });
    // this.linkedIssues =[];
    this.linkedIssues = newIssues.sort((a:any,b:any)=>a.data.issueInitiationDate-b.data.issueInitiationDate);
    this.editedlinkedIssues = this.linkedIssues.filter(m=>['pending','delete'].includes(m.state));
    console.log("getLinkedIssues....", this.linkedIssues, this.editedlinkedIssues)
  }

  openIssueDetails(issue){
    this.router.navigate(['issue/issue-details-linkage/'+issue.id],{state: {data:{issue: issue}}});
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '/assets/shapes.svg';
  }

  linkSelectedIssue(m){
    console.log("linkSelectedIssue", m)
    const data = m.data;
    const id = m.id;
    let idx = this.linkedIssues.findIndex(lm=>lm.id==id);
    if(idx!=-1){
      this.linkedIssues.splice(idx,1);
      this.issues.splice(idx,1);
    }
    // const issueInitiationDate = new Date(data.issueInitiationDate?.seconds*1000);
    // const targetCompletionDate = data.targetCompletionDate?.seconds ? new Date(data.targetCompletionDate?.seconds*1000) : null;
    // return {id, data: { ...data, startTime, endTime }};
    this.editedlinkedIssues.push({...m,state: 'pending'});
    this.linkedIssues.push({...m,state: 'pending'});
    this.onEditLinkage.emit({editedlinkages: this.editedlinkedIssues});
    this.common.presentToaster("'"+m.data.issueTitle+"' has been added to the list of linked issue. It'll be saved when the changes are saved.")
    console.log("linkSelectedIssue", this.linkedIssues, this.editedlinkedIssues)
  }

  undoDelinkIssue(m,i){
    // now check if the state is to be deleted 'delete'
    // then restore the linkage back
    const data = m.data;
    const id = m.id;
    let eidx = this.editedlinkedIssues.findIndex(elm=>elm.id==id);
    this.editedlinkedIssues.splice(eidx,1);
    delete m.state;
    this.onEditLinkage.emit({editedlinkages: this.editedlinkedIssues});
    this.common.presentToaster("The linkage has been restored for '"+m.data.issueTitle+"'. It'll be saved when the changes are saved.")
  }

  delinkSelectedIssue(m,i){
    console.log("delinkSelectedIssue", m, i)
    const data = m.data;
    const id = m.id;
    // if its already pending just delete it from the list
    if(m.state=='pending'){
      let eidx = this.editedlinkedIssues.findIndex(elm=>elm.id==id);
      this.editedlinkedIssues.splice(eidx,1);
      this.linkedIssues.splice(i,1);
    } else {
      this.editedlinkedIssues.push({...m,state: 'delete'});
      // now set the state as delete
      // m.state= 'delete';
    }
    this.onEditLinkage.emit({linkages: this.linkedIssues, editedlinkages: this.editedlinkedIssues});

    this.common.presentToaster("'"+m.data.issueTitle+"' has been removed from the list of linked issue. It'll be saved when the changes are saved.")
    console.log("delinkSelectedIssue", this.linkedIssues, this.editedlinkedIssues)
  }

}
