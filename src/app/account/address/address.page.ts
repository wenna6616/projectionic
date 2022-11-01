import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController, Platform } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { Settings } from './../../data/settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//import 'rxjs/add/operator/map';

@Component({
    selector: 'app-address',
    templateUrl: './address.page.html',
    styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {
   provinsi : any;
   
    constructor(public platform: Platform, public api: ApiService, public settings: Settings, public router: Router, public loadingController: LoadingController, public navCtrl: NavController, public route: ActivatedRoute, public http: HttpClient) {}
    ngOnInit() {
        this.getCustomer();
        this.getProvinsi();
    }
  
    async getCustomer() {
        const loading = await this.loadingController.create({
            message: 'Loading...',
            translucent: true,
            cssClass: 'custom-class custom-loading'
        });
        await loading.present();
        await this.api.getItem('customers/' + this.settings.customer.id).then(res => {
            this.settings.customer = res;
            console.log(res);
            loading.dismiss();
        }, err => {
            console.log(err);
            loading.dismiss();
        });
    }
    editAddress() {
        this.navCtrl.navigateForward('/tabs/account/address/edit-address');
    }

    getProvinsi(){
        this.http.get('./assets/kabupaten.json').subscribe(data => {
            console.log(data);
            this.provinsi = data;

            
        }); 
    }
}