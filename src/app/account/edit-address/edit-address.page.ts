import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, NavParams} from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { Settings } from './../../data/settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import 'rxjs/add/operator/map';

@Component({
    selector: 'app-edit-address',
    templateUrl: './edit-address.page.html',
    styleUrls: ['./edit-address.page.scss'],
})
export class EditAddressPage implements OnInit {
    address: any = [];
    countries: any;
    states: any;
    billingStates: any;
    shippingStates: any;
    billingCitys: any;
    shippingCitys: any;
    status: any;
    disableButton: boolean = false;
    billingKabupaten: any;
    shippingKabupaten: any;
	linkweb = "https://www.hmkalindojava.com/";

    constructor(public alertController:AlertController ,public api: ApiService, public settings: Settings, public router: Router, public navCtrl: NavController, public route: ActivatedRoute, public navController: NavController, public http: HttpClient) {
    }
    ngOnInit() {
        this.getCountries();
        this.getBillingKabupaten();
        this.getShippingKabupaten();
    }
    
    getBillingKabupaten(){
        this.http.get(this.linkweb+'rwsystem/API.php?function=get_Kabkot&id='+ this.settings.customer.billing.state).subscribe(data => {
            //console.log(data);
            this.billingKabupaten = data;
        }); 
  
    }

    getShippingKabupaten(){
        this.http.get(this.linkweb+'rwsystem/API.php?function=get_Kabkot&id='+ this.settings.customer.shipping.state).subscribe(data => {
            //console.log(data);
            this.shippingKabupaten = data;
        }); 
  
    }
    async getCountries() {
        await this.api.postItem('countries').then(res => {
            console.log(res);
            this.countries = res;
           // console.log(res);
            if(this.countries && this.countries.length == 1) {
                this.address['billing_country'] = this.countries[0].value;
                this.address['shipping_country'] = this.countries[0].value;
                this.billingStates = this.countries.find(item => item.value == this.address['billing_country']);
                this.shippingStates = this.countries.find(item => item.value == this.address['billing_country']);
            } else {
                this.billingStates = this.countries.find(item => item.value == this.settings.customer.billing.country);
                this.shippingStates = this.countries.find(item => item.value == this.settings.customer.shipping.country);  
            }
        }, err => {
            console.log(err);
        });
    }

    processAddress() {
        for (var key in this.settings.customer.billing) {
            this.address['billing_' + key] = this.settings.customer.billing[key];
        }
        for (var key in this.settings.customer.shipping) {
            this.address['shipping_' + key] = this.settings.customer.shipping[key];
        }
        this.updateAddress();
        this.presentAlert();
    }

    async updateAddress() {
        this.disableButton = true;
        await this.api.postItem('update-address', this.address).then(res => {
            this.status = res;
           // this.navCtrl.pop();
            this.disableButton = false;
        }, err => {
            this.disableButton = false;
        });
    }

    getBillingCity(){
        this.billingCitys = this.billingStates.find(item => item.value == this.settings.customer.billingStates);
        this.settings.customer.billing.city ='';
    }

    getBillingRegion() {
        this.billingStates = this.countries.find(item => item.value == this.settings.customer.billing.country);
        this.settings.customer.billing.state = '';

    }

    getShippingRegion() {
        this.shippingStates = this.countries.find(item => item.value == this.settings.customer.shipping.country);
        this.settings.customer.shipping.state = '';
    }
    
    async presentAlert() {
        const alert = await this.alertController.create({
          // header: 'Pemesanan Berhasil',
         // subHeader: 'Subtitle',
          message: `<img src="assets/image/check.gif">`+'<b>Simpan Berhasil.</b>',
          buttons: [{
        text: 'OK',
        handler: () => {
            this.navCtrl.navigateRoot('/tabs/account/address' );
        }
      }]
        });
    
        await alert.present();
      }

}