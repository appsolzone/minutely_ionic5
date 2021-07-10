import { Injectable } from '@angular/core';
import { Plugins, PermissionType, Capacitor } from "@capacitor/core";
import { ComponentsService } from 'src/app/shared/components/components.service';
const { SpeechRecognition, Permissions } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  constructor(
    // TBA
    private common: ComponentsService
  ) { }

  async startListening(prompt: string ="Say something"){
    // check whether we have speech SpeechRecognition
    // alert("Start")
    // if(!SpeechRecognition.available()){
    //   alert("not available")
    //   return {status: false, title: 'Warning', body: 'Please note that speech Recognition is not available for your device.'};
    // }
    // alert("available")
    // Now check if the permission is available
    return Permissions.query({name: PermissionType.Microphone}).then(res=>{
    console.log("response ", res);
      if(res.state!='granted'){
        let title= Capacitor.platform !== 'web' ? "Access Required" : "Available on Mobile App";
        let message = Capacitor.platform !== 'web' ?
                      "Please grant access for Microphone from settings to continue"
                      :
                      "Please note that speech to text is a mobile only feature and currently not available for web. Please use mobile app to avail speach to text feature. For web continue to use keyborad to write input text.";
        let buttons = [
           {
            text: 'Dismiss',
            role: 'error',
            cssClass: 'error-button',
            handler: () => {
              console.log('Confirm Ok');
            }
          }
        ];
        this.common.presentAlert(title, message, buttons);
        return {text: ''}
      } else {
        return SpeechRecognition.hasPermission().then(async val=>{
          if(val==false){
            SpeechRecognition.requestPermission();
            return {text: ''};
          } else {
            // alert("permission, now start speech")

            return SpeechRecognition.start({
              language: "en-US", //"bn-IN",
              maxResults: 2,
              prompt: prompt,
              partialResults: true,
              popup: true,
            }).then(res=>{
              // alert('Length: ' + res.matches.length);
              // let text = '';
              // res.matches.forEach(m=>{
              //   text = text + ',' + typeof m;
              // });
              // alert('type of: ' + JSON.stringify(res.matches));
              // alert('type of: ' + res.matches);
              return {text: res?.matches?.length >0 ? res.matches[0] : ''};
            })
          }
        });
      }
    })


  }

  stop(){
    SpeechRecognition.stop();
  }
}
