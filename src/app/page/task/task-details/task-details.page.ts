import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { ComponentsService } from 'src/app/shared/components/components.service';
import { CrudService } from 'src/app/shared/crud/crud.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.page.html',
  styleUrls: ['./task-details.page.scss'],
})
@Autounsubscribe()
export class TaskDetailsPage implements OnInit,OnDestroy {
//observable
  task$;
  //variable
  task:object|null = null;

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
    this.task$ = this.crud.detailsPagePasing$.subscribe(
      (res)=>{
        this.task = res;
        console.log("this details :",this.task);
        if(res == null) this.router.navigate(["/task"]);
      },
      (err)=>{
        console.log(err);
      },
      ()=>{
        //this.componentService.hideLoader()
      }
      );
  }

  goToCommentPage(task){
   let passObj = {...task,parentModule:'task',navigateBack:'/task/details'};
   this.crud.detailsPagePasing$.next(passObj);
   this.router.navigate(['/task/details/comments']); 
  }
}
