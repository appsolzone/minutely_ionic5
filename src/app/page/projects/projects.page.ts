import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Autounsubscribe } from '../../decorator/autounsubscribe';
import { SessionService } from 'src/app/shared/session/session.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
})
@Autounsubscribe()
export class ProjectsPage implements OnInit {
  // observables
  sessionSubs$;
  public sessionInfo: any;
  public addProject: boolean = false;
  public selectedProject: any;

  constructor(
    private router:Router,
    private session: SessionService,
  ) {
    this.sessionSubs$ = this.session.watch().subscribe(value=>{
      // console.log("Session Subscription got", value);
      // Re populate the values as required
      this.sessionInfo = value;
      if(!this.sessionInfo){
        this.router.navigate(['profile']);
      }
    });
  }

  ngOnInit() {
  }

  ngOnDestroy(){

  }

  ionViewWillEnter(){
    if(!this.sessionInfo?.uid){
      this.router.navigate(['profile']);
    }
  }
  openAddProject(){
    this.addProject = !this.addProject;
  }

  onSelectProject(p){
    this.selectedProject = p;
  }

}
