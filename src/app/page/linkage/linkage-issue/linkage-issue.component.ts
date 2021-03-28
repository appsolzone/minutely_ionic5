import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-linkage-issue',
  templateUrl: './linkage-issue.component.html',
  styleUrls: ['./linkage-issue.component.scss'],
})
export class LinkageIssueComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() issues: any[];
  public linkedIssues: any[];

  constructor(
    private router:Router,
  ) { }

  ngOnInit() {
    if(this.issues){
      this.getlinkedIssues();
    }
  }

  ngOnDestroy(){}

  ngOnChanges() {
    if(this.issues){
      this.getlinkedIssues();
    }
  }

  getlinkedIssues(){
    let newissues = this.issues.map(t=>{
      const data = t.data;
      const id = t.id;
      const issueInitiationDate = new Date(data.issueInitiationDate?.seconds*1000);
      const targetCompletionDate = data.targetCompletionDate?.seconds ? new Date(data.targetCompletionDate?.seconds*1000) : null;
      // return {id, data: { ...data, startTime, endTime }};
      return {id, data: {...data, issueInitiationDate, targetCompletionDate }};
    });
    this.linkedIssues =[];
    this.linkedIssues = newissues.sort((a:any,b:any)=>a.data.issueInitiationDate-b.data.issueInitiationDate);
  }

  openIssueDetails(issue){
    this.router.navigate(['issue/issue-details-linkage/'+issue.id],{state: {data:{issue: issue}}});
  }

  profileImgErrorHandler(user: any){
    user.picUrl = '/assets/shapes.svg';
  }

}
