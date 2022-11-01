import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, ToastController , AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { Settings } from './../../data/settings';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { Clipboard } from '@ionic-native/clipboard/ngx';
//import 'rxjs/add/operator/map';


@Component({
    selector: 'app-order',
    templateUrl: './order.page.html',
    styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
    filter: any = {};
    caraBayar: any;
    provinsi: any;
    order: any;
    refundKeys: any = {};
    refund: any = {};
    showRefund: boolean = false;
    disableRefundButton: boolean = false;
    refundResponse: any = {};
    lan: any = {};
    wallet: any = {};
    gettes: any = {};
    baseUrl : any;
    dataMeta : any;
    InputText: string = "";
    constructor(public alertController: AlertController, public translate: TranslateService, public api: ApiService, public settings: Settings, public toastController: ToastController, public router: Router, public loadingController: LoadingController, public navCtrl: NavController, public route: ActivatedRoute, public httpClient: HttpClient, private iab: InAppBrowser,private clipboard: Clipboard) {
    }
    
    async refundKey() {
        await this.api.postItem('woo_refund_key').then(res => {
            this.refundKeys = res;
            console.log(this.refundKeys);
        }, err => {
            console.log(err);
        });
        
    }
 
    public linkBayar (url : string) {
        const options : InAppBrowserOptions ={
            location:'yes',
            hideurlbar:'yes',
            closebuttoncaption:'Exit',
            closebuttoncolor:'#ffffff',
            hidenavigationbuttons:'yes',
            toolbarcolor:'#32ad4a'
        }

        const browser = this.iab.create(url,'_blank',options);
        browser.on('exit').subscribe(event => {
                    this.navCtrl.navigateRoot('/tabs/account/orders' );
                    browser.close();   
            });
    }

    async copyresi (text : string) {
        const toast = await this.toastController.create({
            message: 'Berhasil disalin',
            duration: 2000
          });
        toast.present();
        this.clipboard.copy(text);
    }

    getcaraBayar(){
        this.httpClient.get('https://hmkalindojava.com/wp-json/wc/v3/payment_gateways/bacs?consumer_key=ck_36e98826cb3cf9e367436c839f761ce3200dc838&consumer_secret=cs_4256b907ed6d2c974c93fb82c6fe68578e579853').subscribe(data =>{
           
            this.caraBayar = data;
            //this.caraBayar = JSON.parse(this.caraBayar);
            this.caraBayar =Array.of(this.caraBayar);
            //console.log(this.caraBayar);
        });
    }

    getProvinsi(){
        this.httpClient.get('../assets/kabupaten.json').subscribe(data => {
            //console.log(data);
            this.provinsi = data;
        }); 
    }

    async getWallet() {
        await this.api.postItem('wallet').then(res => {
            this.wallet = res;
            //console.log(res);
        }, err => {
           // console.log(err);
        });
    }

    ngOnInit() {
        this.translate.get(['Refund request submitted!', 'Unable to submit the refund request']).subscribe(translations => {
            this.lan.refund = translations['Refund request submitted!'];
            this.lan.unable = translations['Unable to submit the refund request'];
        });
        this.filter.id = this.route.snapshot.paramMap.get('id');
        this.route.queryParams.subscribe(params => {
            if(params["order"])
            this.order = params["order"];
            else this.getOrder();
        });
        this.refundKey();
       // this.presentAlert();
       this.getWallet();
       this.getcaraBayar();
       this.getProvinsi();
    }

    showField() {
      this.showRefund = !this.showRefund;
    }

    async requestRefund(){
        this.disableRefundButton = true;
        this.refund.ywcars_form_order_id = this.filter.id;
        this.refund.ywcars_form_whole_order = '1';
        this.refund.ywcars_form_product_id = '';

        this.refund.ywcars_form_line_total = this.order.total;
        this.refund.ywcars_form_reason = this.refund.ywcars_form_reason;
        this.refund.action = 'ywcars_submit_request';
        this.refund.security = this.refundKeys.ywcars_submit_request;

        await this.api.postItem('woo_refund_key', this.refund).then(res => {
            this.refundResponse = res;
            this.disableRefundButton = false;
            if(this.refundResponse.success)
            this.presentToast(this.lan.refund);
            else
            this.presentToast(this.lan.unable);
        }, err => {
            console.log(err);
            this.disableRefundButton = false;
        });
    }
    async presentToast(message) {
        const toast = await this.toastController.create({
          message: message,
          duration: 2000
        });
        toast.present();
    }

    
    async getOrder() {
        const loading = await this.loadingController.create({
            message: 'Loading...',
            translucent: true,
            animated: true,
            backdropDismiss: true
        });
        await loading.present();
        await this.api.postItem('order', this.filter).then(res => {
            this.order = res;
            loading.dismiss();
        }, err => {
            //console.log(err);
            loading.dismiss();
        });
    }

    
}