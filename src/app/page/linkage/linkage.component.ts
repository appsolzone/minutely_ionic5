import { Component, OnInit, Input } from '@angular/core';
import { Autounsubscribe } from 'src/app/decorator/autounsubscribe';
import { LinkageService } from 'src/app/shared/linkage/linkage.service';

@Component({
  selector: 'app-linkage',
  templateUrl: './linkage.component.html',
  styleUrls: ['./linkage.component.scss'],
})
@Autounsubscribe()
export class LinkageComponent implements OnInit {
  @Input() sessionInfo: any;
  @Input() selectedObject: any;
  // observables
  meetingLinksSubs$;
  taskLinksSubs$;
  issueLinksSubs$;
  riskLinksSubs$;
  // form data
  public selectedItem: string = 'meetings';
  public linkages: any = {
                            meetings: null,
                            tasks: null,
                            issues: null,
                            riskd: null
                          };

  constructor(
    private linkage: LinkageService
  ) { }

  ngOnInit() {
    if(this.selectedObject?.id && !this.linkages.meetings){
      this.getLinkedItems();
    }
  }

  ngOnDestroy(){}

  ngOnChanges() {
    if(this.selectedObject?.id && !this.linkages.meetings){
      this.getLinkedItems();
    }
  }

  linkageOptionsChanged(e){
    this.selectedItem = e.detail.value;
    this.getLinkedItems();
  }

  getLinkages(){
    return this.linkage.getLinkages(this.selectedObject.id, this.selectedItem)
                              .subscribe(act=>{
                                let allItems = act.map((a: any) => {
                                  const data = a.payload.doc.data();
                                  const id = a.payload.doc.id;
                                  return {id, data};
                                });
                                this.linkages[this.selectedItem] =[];
                                this.linkages[this.selectedItem] = allItems;
                                console.log("linkedMeetings", this.linkages[this.selectedItem]);
                              });
  }

  getLinkedItems(){
    if(!this.linkages[this.selectedItem]){
      switch(this.selectedItem){
        case 'meetings':
          this.meetingLinksSubs$ = this.getLinkages();
          break;
        case 'tasks':
          this.taskLinksSubs$ = this.getLinkages();
          break;

        case 'issues':
          this.issueLinksSubs$ = this.getLinkages();
          break;
        case 'risks':
          this.riskLinksSubs$ = this.getLinkages();
          break;
      }
    }

  }

}
