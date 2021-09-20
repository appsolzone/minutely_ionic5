import { Injectable } from '@angular/core';
import { Plugins, PermissionType, Capacitor } from "@capacitor/core";
import { recognition } from 'src/app/shared/speech/speech-web.js';
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

  async startListening(prompt: string ="Say something", sessionInfo: any = null){
    if(Capacitor.platform == 'web'){
      let res = await this.startListeningWeb(prompt, sessionInfo);
      return res;
    }
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
              language: sessionInfo?.userProfile?.speechServiceLang ? sessionInfo?.userProfile?.speechServiceLang.lang : 'en-US', //"en-US", //"bn-IN",
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

  async startListeningWeb(prompt: string ="Say something", sessionInfo: any = null): Promise<any>{
      let text = '';
      if(recognition){
        recognition.lang = sessionInfo?.userProfile?.speechServiceLang ? sessionInfo?.userProfile?.speechServiceLang.lang : 'en-US';
        await this.common.showLoader("Say " + prompt,0,'dots')
        recognition.start();
        return new Promise((resolve: any, reject: any)=>{

          recognition.onresult = (event)=> {
          //   // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
          //   // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
          //   // It has a getter so it can be accessed like an array
          //   // The first [0] returns the SpeechRecognitionResult at the last position.
          //   // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
          //   // These also have getters so they can be accessed like arrays.
          //   // The second [0] returns the SpeechRecognitionAlternative at position 0.
          //   // We then return the transcript property of the SpeechRecognitionAlternative object
          //   // var color = event.results[0][0].transcript;
          //   // diagnostic.textContent = 'Result received: ' + color + '.';
          //   // bg.style.backgroundColor = color;
          //   // console.log('Confidence: ' + event.results[0][0].confidence);
            var text = event.results[0][0].transcript;
            this.common.hideLoader()
            resolve({text: text});
          }
          recognition.onspeechend = ()=>{
            console.log('stop 1: ', new Date());
            this.common.hideLoader()
            recognition.stop();
            console.log('stop 2: ', new Date());
          }
          recognition.onnomatch = (event)=>{
            // diagnostic.textContent = "I didn't recognise that color.";
            this.common.hideLoader()
            this.common.presentAlert('Error',"Could not recognize the speech")
          }

          recognition.onerror = (event)=> {
            // diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
            this.common.hideLoader()
            let msg = 'Error occurred in recognition: ' + event.error + '.' +
            ' It may have cused due to incompatible browser. Please try with Chrome browser.' +
            ' Also note that this feature is available on mobile app as well.';
            setTimeout(()=>this.common.presentAlert('Error',msg),300)
          }

        });
      } else {
        this.common.hideLoader()
        let msg = 'Error occurred in recognition. ' +
                  ' It may have cused due to incompatible browser. Please try with Chrome browser.' +
                  ' Also note that this feature is available on mobile app as well.';
        this.common.presentAlert('Error',msg);
      }

  }
}
