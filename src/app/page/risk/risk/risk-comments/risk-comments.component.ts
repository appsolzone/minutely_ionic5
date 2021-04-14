import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-risk-comments',
  templateUrl: './risk-comments.component.html',
  styleUrls: ['./risk-comments.component.scss'],
})
export class RiskCommentsComponent implements OnInit {
 @Input() sessionInfo: any;
  @Input() risk: any;

  // form data
  public riskDetails: any;

  constructor(
    private router:Router
  ) { }

  ngOnInit() {
   this.riskDetails = this.risk?.data;
    console.log("riskdetails", this.riskDetails);
    // if(this.riskDetails){
    //   //this.checkAcceptence();
    // }
  }

  ngOnChanges() {
    this.riskDetails = this.risk?.data;
    if(this.riskDetails){
      // TBA
    }
  }


  profileImgErrorHandler(user: any){
    user.picUrl = '../../../../assets/shapes.svg';
  }


  goToCommentPage(risk){
    this.router.navigate(['risk/comments'],{state: {data:{risk: risk}}});
  }
}
