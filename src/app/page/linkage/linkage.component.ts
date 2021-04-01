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
  @Input() viewMode = '';
  @Input() alllinkages: any = {
                            meetings: [],
                            tasks: [],
                            issues: [],
                            risks: []
                          };
  @Input() editedlinkages: any = {
                            meetings: [],
                            tasks: [],
                            issues: [],
                            risks: []
                          };
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
                            risks: null
                          };
  // public editedlinkages: any = {
  //                           meetings: [],
  //                           tasks: [],
  //                           issues: [],
  //                           risks: []
  //                         };

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
    if(this.selectedObject?.id){
      this.getLinkedItems();
    }
  }

  getLinkages(){
    return this.linkage.getLinkages(this.selectedObject.id, this.selectedItem)
                              .subscribe(act=>{
                                let allItems = [];
                                act.forEach((a: any) => {
                                  const data = a.payload.doc.data();
                                  const id = a.payload.doc.id;
                                  let idx = this.editedlinkages[this.selectedItem].findIndex(el=>el.id==id);
                                  if(idx==-1){
                                    allItems.push({id, data});
                                  }
                                });
                                this.linkages[this.selectedItem] =[...allItems, ...this.editedlinkages[this.selectedItem]];
                                this.alllinkages[this.selectedItem] = [...this.linkages[this.selectedItem]]
                                // this.linkages[this.selectedItem] = allItems;
                                console.log("linkedMeetings", this.linkages[this.selectedItem]);
                              });
  }

  repopulateItems(){
    let allItems = [];
    this.linkages[this.selectedItem].forEach((a: any) => {
      const data = a.data;
      const id = a.id;
      let idx = this.editedlinkages[this.selectedItem].findIndex(el=>el.id==id);
      if(idx==-1){
        allItems.push({id, data});
      }
    });
    this.linkages[this.selectedItem] =[...allItems, ...this.editedlinkages[this.selectedItem]];
    this.alllinkages[this.selectedItem] = [...this.linkages[this.selectedItem]]
    // this.linkages[this.selectedItem] = allItems;
    console.log("repopulateItems linkedMeetings", this.linkages[this.selectedItem]);
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
    } else {
      // there might be edited items, so process again
      if(this.linkages[this.selectedItem].length >= 0){
        this.repopulateItems();
      }
    }

  }

}
