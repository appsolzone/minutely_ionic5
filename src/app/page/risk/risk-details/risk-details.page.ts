import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { CrudService } from 'src/app/shared/crud/crud.service';

@Component({
  selector: 'app-risk-details',
  templateUrl: './risk-details.page.html',
  styleUrls: ['./risk-details.page.scss'],
})

@Autounsubscribe()
export class RiskDetailsPage implements OnInit,OnDestroy {
  //observable
  risk$;
  //variable
  risk:object|null = null;

  constructor(
    private crud:CrudService,
    private componentService:ComponentsService,
    private router:Router
    ) { }

  ngOnInit() {
  }
  ngOnDestroy(){}

  ionViewWillEnter(){
   // this.componentService.showLoader()
    this.risk$ = this.crud.detailsPagePasing$.subscribe(
      (res)=>{
        this.risk = res;
        console.log("this details :",this.risk);
        if(res == null) this.router.navigate(["/risk"]);
      },
      (err)=>{
        console.log(err);
      },
      ()=>{
        //this.componentService.hideLoader()
      }
      );
  }

  goToCommentPage(risk){
   let passObj = {...risk,parentModule:'risk',navigateBack:'/risk/details'};
   this.crud.detailsPagePasing$.next(passObj);
   this.router.navigate(['/risk/details/comments']); 
  }
}
