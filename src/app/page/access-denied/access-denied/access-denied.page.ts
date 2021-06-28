import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.page.html',
  styleUrls: ['./access-denied.page.scss'],
})
export class AccessDeniedPage implements OnInit {
  public data: any;

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
    this.data = history.state?.data;
    if(!this.data){
      this.router.navigate(['profile']);
    }
  }

  ionViewDidEnter(){
    this.data = history.state?.data;
    console.log("data received ionViewDidEnter ", this.data)
    if(!this.data){
      this.router.navigate(['profile']);
    }
  }

}
