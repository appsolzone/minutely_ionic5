import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import '@codetrix-studio/capacitor-google-auth';
import { Plugins } from '@capacitor/core';

import { AuthenticationService } from '../../shared/authentication/authentication.service';
import { ComponentsService } from './../../shared/components/components.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  // @ViewChild('firebaseuiauthcontainer') firebaseui: ElementRef;
  // observables
  getauthStateSubs$;
  public showResetButton = false;
  public observer: any;
  public firebaseui: any;
  public isMobile: boolean = false;
  public showGooglesignin: boolean = true;
  public hideFirebaseUiGoogleButton: boolean = false;
  public signInWelcomeTxt: string = 'Manage meetings and projects with greater efficiency with commonModule. \
  It connects resources of your organisation and helps in managing and tracking meetings. Easy to generate \
  minutes and circulating MoM. You can link other project items like issues, tasks and \
  risk in one place to boost productivity and efficiency.';
  signinUi: any;
  userData: any;
  redirectUrl = 'profile';
  constructor(
    private router: Router,
    private platform: Platform,
    private auth: AuthenticationService,
    private common: ComponentsService
  ) {
    this.isMobile =
      this.platform.is('mobile') && !this.platform.is('mobileweb');
    this.getauthStateSubs$ = this.auth.authState(
      this.authStateCallBack.bind(this)
    );
  }

  ngOnInit() {}

  async googleSignup() {
    const googleUser = (await Plugins.GoogleAuth.signIn(null).catch((err) =>
      alert(err)
    )) as any;
    // console.log('my user: ', googleUser);
    // userInfo = googleUser;
    // alert("Googleuser" + googleUser.authentication.idToken);
    const credential = this.auth.frb.auth.GoogleAuthProvider.credential(
      googleUser.authentication.idToken
    );
    // alert(googleUser.authentication.idToken);
    // return this.afAuth.auth.signInAndRetrieveDataWithCredential(credential);
    this.auth.auth.signInWithCredential(credential).then(() => {
      // initiate the Check aclkpi
      this.router.navigate([this.redirectUrl]);
    });
    this.stopFirebaseuiauthcontainerObserver();
    await this.common.showLoader('Please wait ... G auth signin');
  }

  resetAuthButtons() {
    this.authStateCallBack({ userData: null, signinUi: this.auth.signinUi });
  }

  authStateCallBack(data) {
    this.signinUi = data.signinUi;
    this.userData = data.userData;
    this.redirectUrl = history.state?.redirectUrl
      ? history.state.redirectUrl
      : 'profile';
    const signInOptions = [
      {
        provider: this.auth.firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        customParameters: {
          // Forces account selection even when one account
          // is available.
          prompt: 'select_account',
        },
      },
      // 'microsoft.com',
      // 'yahoo.com',
      // {
      //   provider: this.auth.firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      //   defaultCountry: 'IN',
      // },
      this.auth.firebase.auth.EmailAuthProvider.PROVIDER_ID,
    ];

    // console.log("SigninPage history.state",this.redirectUrl,history.state?.redirectUrl);
    setTimeout(() => {
      if (this.signinUi) {
        // Configure FirebaseUI.
        const uiConfig = {
          credentialHelper: 'none', // firebaseui.auth.CredentialHelper.NONE,
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
          signInOptions,
          // tosUrl and privacyPolicyUrl accept either url string or a callback
          // function.
          // Terms of service url/callback.
          tosUrl: 'https://organizedhub.com/terms-of-use',
          // Privacy policy url/callback.
          // privacyPolicyUrl() {
          //   window.location.assign('https://organizedhub.com/privacy-policy');
          // },
          privacyPolicyUrl: 'https://organizedhub.com/privacy-policy',
          callbacks: {
            // Avoid redirects after sign-in.
            signInSuccessWithAuthResult: () => {
              console.log('success');
              // stop frebaseui observer for form
              this.stopFirebaseuiauthcontainerObserver();
              this.common.hideLoader();
              this.router.navigate([this.redirectUrl]);
              return false;
            },
            uiShown: () => {
              // The widget is rendered.
              // Hide the loader.
              // document.getElementById('loader').style.display = 'none';
              console.log('UI Shown');
              // alert("UI Shown");
              this.showResetButton = false;
              this.showGooglesignin = true;
              // start observing firebaseui form
              this.startFirebaseuiauthcontainerObserver(
                'firebaseuiauthcontainer',
                1
              );
              this.common.hideLoader();
            },
          },
        };

        this.showResetButton = false;
        this.showGooglesignin = true;
        this.hideFirebaseUiGoogleButton = false;
        this.signinUi.start('#firebaseuiauthcontainer', uiConfig);
      } else {
        console.log('else of this.siginui');
        this.stopFirebaseuiauthcontainerObserver();
        this.common.hideLoader();
      }
    }, 10);
  }

  stopFirebaseuiauthcontainerObserver() {
    this.common.hideLoader();
    if (this.isMobile && this.observer?.disconnect) {
      console.log('stop observing now');
      this.showResetButton = false;
      this.showGooglesignin = true;
      this.hideFirebaseUiGoogleButton = false;
      this.observer.disconnect();
    }
  }

  startFirebaseuiauthcontainerObserver(refId, source) {
    this.firebaseui = document.getElementById(refId);
    // stop any observer
    this.stopFirebaseuiauthcontainerObserver();

    if (this.isMobile && this.firebaseui) {
      // alert(this.firebaseui);
      console.log('view child', this.firebaseui);
      if (!this.observer) {
        this.observer = new MutationObserver((mutations) => {
          this.showHideButtons('insideobserver ' + source);
        });
      }
      this.showHideButtons('one off call for buttons ' + source);
      // now start observing the form changes
      this.observer.observe(this.firebaseui, {
        attributes: true,
        childList: true,
        characterData: true,
      });
    }
  }

  showHideButtons(source) {
    const element = document.getElementsByTagName('button');
    const isGoogleBtnTxt = element[0].innerText.trim().toUpperCase();
    const isGoogleBtnClass = element[0].className;
    console.log(
      'element',
      element,
      element[0].innerText.trim().toUpperCase(),
      isGoogleBtnTxt,
      isGoogleBtnClass
    );
    // alert("showbuttons called" + source + "  " + element.length + "   " + element[0].innerText.trim().toUpperCase());
    if (
      element &&
      (!isGoogleBtnTxt.includes('SIGN IN WITH GOOGLE') ||
        !isGoogleBtnClass.includes('firebaseui-idp-google'))
    ) {
      this.showGooglesignin = false;
    } else {
      this.showGooglesignin =
        element.length == 1 ||
        !isGoogleBtnClass.includes('firebaseui-idp-google')
          ? false
          : true;
    }
    console.log(
      'this.showGooglesignin',
      element[0].className,
      isGoogleBtnClass,
      this.showGooglesignin
    );
    if (
      element &&
      ((element[0].innerText &&
        isGoogleBtnTxt.includes('SIGN IN WITH GOOGLE')) ||
        isGoogleBtnClass.includes('firebaseui-idp-google'))
    ) {
      console.log('element', element[0], element[0].innerText, isGoogleBtnTxt);
      // element[0].classList.add('hideFirebaseuiButton');
      element[0].style.opacity = '0';
      element[0].disabled = true;
      this.showGooglesignin = element.length == 1 ? false : true;
      this.showResetButton = element.length == 1 ? true : false;
    } else {
      this.showResetButton = false;
    }
  }
}
