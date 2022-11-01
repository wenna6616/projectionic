import { Component } from '@angular/core';
import { Data } from '../data';
import { Settings } from '../data/settings';
import { Subscription, timer } from 'rxjs';

import { LoadingController, NavController, ModalController } from '@ionic/angular';
import { LoginPage } from './../account/login/login.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  tombolBawah = true; 
	constructor(public navCtrl: NavController, public modalController: ModalController, public data: Data, public settings: Settings){
    timer(3000).subscribe(()=> this.tombolBawah = false)
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
  
}

checkLogin() {
  //this.settings.customer.id
// = this.status.ID;
if (  this.settings.customer.id) {
  this.navCtrl.navigateForward('/tabs/home') ;
  
  }
  else this.login();
}

}
