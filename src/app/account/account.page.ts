import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ModalController, Platform, IonRouterOutlet } from '@ionic/angular';
import { Settings } from './../data/settings';
import { ApiService } from './../api.service';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { Config } from './../config';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LoginPage } from './../account/login/login.page';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { ActivatedRoute, Router } from '@angular/router';
//import { SpinnerDialog } from '@awesome-cordova-plugins/spinner-dialog/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import 'rxjs/add/operator/map';
//import { map } from 'rxjs/operators';


@Component({
    selector: 'app-account',
    templateUrl: 'account.page.html',
    styleUrls: ['account.page.scss']
})


export class AccountPage implements OnInit {
    httpOptions = {
        headers: new HttpHeaders({ 
            'Host': 'https://hmkalindojava.com/rwsystem',
            'Origin': 'http://localhost:8100',
            'Access-Control-Request-Method': 'GET',
            'Access-Control-Request-Headers': 'Content-Type'
        })
      };
    membership: any;
    points: any;
    wallet: any = {};
    toggle: any;
    constructor(public modalController: ModalController, private statusBar: StatusBar, private config: Config, public api: ApiService, public navCtrl: NavController, public settings: Settings, public platform: Platform, private appRate: AppRate, private emailComposer: EmailComposer, private socialSharing: SocialSharing, public loadingController: LoadingController, public routerOutlet: IonRouterOutlet, private iab: InAppBrowser, public route: ActivatedRoute,public router: Router,public http: HttpClient) {
        this.platform = platform;
    }
   
    openWebpage(){
        const options : InAppBrowserOptions ={
            location:'yes',
            hideurlbar:'yes',
            closebuttoncaption:'Exit',
            closebuttoncolor:'#ffffff',
            hidenavigationbuttons:'yes',
            toolbarcolor:'#32ad4a'
        }
        const browser = this.iab.create('https://hmkalindojava.com/konfirmasi-pembayaran-mobile/','_blank',options); 
        browser.on('loadstop').subscribe(event => {
            browser.insertCSS({ code: "html{height: 100%;} body{height: calc(100% - 45px);}" });
          });
        browser.on('exit').subscribe(event => {
                    browser.close();
                    this.navCtrl.navigateRoot('/');
            }); 
    }
    
	doRefresh(event) {
        
        this.ngOnInit();
        setTimeout(() => {
            event.target.complete();
        }, 2000);
    }
    

    getPoints(){
        //let headers = new HttpHeaders().set('access-control-allow-methods','GET').set('access-control-allow-origin','*').set('access-control-allow-headers','Content-Type');  
        
        this.http.get('https://www.hmkalindojava.com/rwsystem/API.php?function=get_poin_id&id=' + this.settings.customer.id ).subscribe(data => {
            this.points = data;
			//console.log(this.points);
        }); 
    }

    getMembership(){
        this.http.get('https://www.hmkalindojava.com/rwsystem/API.php?function=get_member&id=' + this.settings.customer.id ).subscribe(data => {
            this.membership = data;
            //this.membership = JSON.parse(this.membership);
           // console.log(this.membership);
        }); 
    }

    goTo(path) {
        this.navCtrl.navigateForward(path);
    }
    //get customer
    ngOnInit  () {
        this.getCustomer();
        this.getWallet();
        this.getPoints();
        this.getMembership();
    } 
    
    async getCustomer  () {
        const loading = await this.loadingController.create({
            message: 'Loading...',
            translucent: true,
			spinner: 'circles',
            cssClass: 'custom-class custom-loading'
        });
        await loading.present();
        await this.api.getItem('customers/' + this.settings.customer.id).then(res => {
            this.settings.customer = res;
            loading.dismiss();
        }, err => {
            console.log(err);
            loading.dismiss();
        });
    }

    async getWallet() {
        await this.api.postItem('wallet').then(res => {
            this.wallet = res;
            console.log(res);
        }, err => {
            console.log(err);
        });
    }
    // end get customer
    exitApp(){
        navigator['app'].exitApp(); 
     }
    async log_out() {
        this.settings.customer.id = undefined;
        this.settings.vendor = false;
        this.settings.administrator = false;
        this.settings.wishlist = [];
        await this.api.postItem('logout').then(res => {}, err => {
            console.log(err);
            
        });
        
        if((<any>window).AccountKitPlugin)
        (<any>window).AccountKitPlugin.logout();
        
        this.exitApp();

    }
    rateApp() {
        if (this.platform.is('cordova')) {
            this.appRate.preferences.storeAppURL = {
                ios: this.settings.settings.rate_app_ios_id,
                android: this.settings.settings.rate_app_android_id,
                windows: 'ms-windows-store://review/?ProductId=' + this.settings.settings.rate_app_windows_id
            };
            this.appRate.promptForRating(false);
        }
    }
    shareApp() {
        if (this.platform.is('cordova')) {
            var url = '';
            if (this.platform.is('android')) url = this.settings.settings.share_app_android_link;
            else url = this.settings.settings.share_app_ios_link;
            var options = {
                message: '',
                subject: '',
                files: ['', ''],
                url: url,
                chooserTitle: ''
            }
            this.socialSharing.shareWithOptions(options);
        }
    }
    email(contact) {
        let email = {
            to: contact,
            attachments: [],
            subject: '',
            body: '',
            isHtml: true
        };
        this.emailComposer.open(email);
    }
   
    async login() {
        const modal = await this.modalController.create({
          component: LoginPage,
          componentProps: {
            path: 'tabs/account',
            },
          swipeToClose: true,
          //presentingElement: this.routerOutlet.nativeEl,
      });
      modal.present();
      const { data } = await modal.onWillDismiss();
      this.getCustomer();
    }
    
    
}