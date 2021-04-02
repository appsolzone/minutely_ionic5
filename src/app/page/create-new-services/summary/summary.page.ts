import { Component, OnDestroy, OnInit } from '@angular/core';
import { CrudService } from 'src/app/shared/crud/crud.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})
export class SummaryPage implements OnInit,OnDestroy {
  //observables
  initiateData$:any;

  constructor(
    private _crud:CrudService,
  ) { }

  ngOnInit() {
    this.previousResponse();
  }
  ngOnDestroy(){}
  previousResponse(){
  this._crud.crud_action$.subscribe(res=>{
    this.initiateData$ = res;
    console.log(res)
  });  
  }
}
