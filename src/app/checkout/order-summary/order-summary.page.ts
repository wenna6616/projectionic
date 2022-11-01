import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController,AlertController,ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { Settings } from './../../data/settings';
import { Data } from '../../data';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';


import { HttpClient, HttpHeaders } from '@angular/common/http';
//import 'rxjs/add/operator/map';
@Component({
    selector: 'app-order-summary',
    templateUrl: './order-summary.page.html',
    styleUrls: ['./order-summary.page.scss'],
})
export class OrderSummaryPage implements OnInit {

    provinsi : any;
    caraBayar: any;
    cart: any = {};
    id: any;
    order: any;
    orderId: any;
    filter: any = {};
    
    constructor(public alertController:AlertController, public api: ApiService, public settings: Settings, public router: Router, public loadingController: LoadingController, public navCtrl: NavController, public route: ActivatedRoute,public toastController: ToastController,  public data: Data,private iab: InAppBrowser,public http: HttpClient) {

    }
    async getOrder() {
        const loading = await this.loadingController.create({
            message: 'Loading...',
            translucent: true,
            animated: true,
            backdropDismiss: true,
			spinner: 'circles',
        });
        await loading.present();
        await this.api.postItem('order', this.filter).then(res => {
            this.order = res;
            loading.dismiss();
			this.presentAlert();
        }, err => {
            console.log(err);
            loading.dismiss();
        });
    }
    ngOnInit() {
        this.filter.id = this.route.snapshot.paramMap.get('id');
        this.getOrder();
        this.getProvinsi();
        this.getcaraBayar();
		
    }

    getProvinsi(){
        this.http.get('./assets/kabupaten.json').subscribe(data => {
            //console.log(data);
            this.provinsi = data;
        }); 
    }
    getcaraBayar(){
        this.http.get('https://hmkalindojava.com/wp-json/wc/v3/payment_gateways/bacs?consumer_key=ck_36e98826cb3cf9e367436c839f761ce3200dc838&consumer_secret=cs_4256b907ed6d2c974c93fb82c6fe68578e579853').subscribe(data =>{
           
            this.caraBayar = data;
            //this.caraBayar = JSON.parse(this.caraBayar);
            this.caraBayar =Array.of(this.caraBayar);
            //console.log(this.caraBayar);
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
    continue () {
        //Clear Cart
        this.api.postItem('emptyCart').then(res => {}, err => {});
        this.getCart();
        //this.navCtrl.navigateRoot('/tabs/account/orders/order/' + this.order.id );
        this.navCtrl.navigateRoot('/tabs/account/orders');
        
    }

    async presentAlert() {
        const alert = await this.alertController.create({
        //header: 'Pemesanan Berhasil',
         // subHeader: 'Subtitle',
         message: `<img src="assets/image/check.gif">`+'<b>Pemesanan Berhasil</b> <br/>Mohon selesaikan pembayaran anda.',
		 buttons:['Ok']
       
      });
    
       await alert.present();
       //setTimeout(()=>{
        //alert.dismiss();
		this.api.postItem('emptyCart').then(res => {}, err => {});
        this.getCart();
        //this.navCtrl.navigateRoot('/tabs/account/orders/order/' + this.order.id );
    //},3000);
      }
    
    async getCart() {
        await this.api.postItem('cart').then(res => {
            this.cart = res;
            this.data.updateCart(this.cart.cart_contents);
        }, err => {
            console.log(err);
        });
    }
}