import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../shared/authentication/authentication.service';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  // observables
  getauthStateSubs$;
  public signInWelcomeTxt: string = 'Onestop solution for your organisation HRMS needs. \
                                      Be it expanding operations across regions or viewing trends in one place, \
                                      bring everything together. Get the team to focus on the \
                                      targets and leave the rest to HRMS.';
  signinUi: any;
  userData: any;
  redirectUrl: string = 'profile';
  constructor(
    private router: Router,
    private auth: AuthenticationService,
  ) {
    this.getauthStateSubs$ = this.auth.authState(this.authStateCallBack.bind(this));
  }

  ngOnInit() {

  }

  authStateCallBack(data){
    this.signinUi = data.signinUi;
    this.userData = data.userData;
    this.redirectUrl = history.state?.redirectUrl ? history.state.redirectUrl : 'profile';
    //console.log("SigninPage history.state",this.redirectUrl,history.state?.redirectUrl);
    setTimeout(()=>{
      if(this.signinUi){

        // Configure FirebaseUI.
        const uiConfig = {
          credentialHelper: 'none', //firebaseui.auth.CredentialHelper.NONE,
          // Popup signin flow rather than redirect flow.
          signInFlow: 'popup',
          // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
          signInSuccessUrl: '/',
          // We will display Google and Facebook as auth providers.
          // signInOptions: [
          //   'google.com',
          //   'apple.com',
          //   'microsoft.com',
          //   'yahoo.com',
          //   'email',
          // ],
          signInOptions: [
            {
              provider: this.auth.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
              customParameters: {
                // Forces account selection even when one account
                // is available.
                prompt: 'select_account'
              }
            },
            // 'microsoft.com',
            // 'yahoo.com',
            // {
            //   provider: this.auth.firebase.auth.PhoneAuthProvider.PROVIDER_ID,
            //   defaultCountry: 'IN',
            // },
            this.auth.firebase.auth.EmailAuthProvider.PROVIDER_ID
          ],
          // tosUrl and privacyPolicyUrl accept either url string or a callback
          // function.
          // Terms of service url/callback.
          tosUrl: 'https://orghomeidea.web.app/',
          // Privacy policy url/callback.
          privacyPolicyUrl: function() {
            window.location.assign('https://orghomeidea.web.app/');
          },
          callbacks: {
              // Avoid redirects after sign-in.
              signInSuccessWithAuthResult: () => {this.router.navigate([this.redirectUrl]); return false;},
              uiShown: function() {
                // The widget is rendered.
                // Hide the loader.
                // document.getElementById('loader').style.display = 'none';
                //console.log("UI Shown")
              }
            },
        };


        this.signinUi.start('#firebaseuiauthcontainer', uiConfig);
      }
    },1);

  }

}
