import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-page',
  templateUrl: './modal-page.page.html',
  styleUrls: ['./modal-page.page.scss'],
})
export class ModalPagePage implements OnInit,OnChanges {
  @Input() data: string;
  text:string = '';

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }
  ngOnChanges(){
    console.log("Data prom parents :",this.data);
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true,
      data:this.text
    });
  }
}
