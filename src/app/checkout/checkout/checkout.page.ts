import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../api.service';
import { CheckoutData } from '../../data/checkout';
import { Settings } from './../../data/settings';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Data } from '../../data';

import { HttpClient, HttpHeaders } from '@angular/common/http';
//import 'rxjs/add/operator/map';


//import { Http, Response } from '@angular/http';
//import { HttpClient } from '@angular/common/http';


//import { CardIO } from '@ionic-native/card-io/ngx';
//import { Braintree, ApplePayOptions, PaymentUIOptions, PaymentUIResult } from '@ionic-native/braintree/ngx';
declare var Stripe;
@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.page.html',
    styleUrls: ['./checkout.page.scss'],
})
export class CheckoutPage implements OnInit {
    stripe: any;
    card: any;
    cardElement: any;
    stripeStatus: any = {};
    provinsi : any;
    cart: any = {};

    loading: any;
    buttonSubmit: boolean = false;
    PlaceOrder: any; //May not be used

    orderReview: any;
    results: any = {};
    disableButton: boolean = true;
    errorMessage: any;
    errorShipping: any;
    orderId: any;
    cardResponse: any = {};
    stripeForm: any = {};
  
	isLoading = false;
    wallet: any = {};
    constructor(private oneSignal: OneSignal, public toastController: ToastController, public platform: Platform, public api: ApiService, public checkoutData: CheckoutData, public settings: Settings, public router: Router, public iab: InAppBrowser, public loadingController: LoadingController, public navCtrl: NavController, public route: ActivatedRoute,public data: Data, public http: HttpClient) {}
    ngOnInit() {
        this.updateOrder();

        this.checkoutData.form.billing_numero_rue = '543254';
        this.checkoutData.form.billing_commune = '23543254';
        this.checkoutData.form.shipping_numero_rue = '3254';
        this.checkoutData.form.shipping_commune = '23543254';
        this.getWallet();
        this.getProvinsi();
        
    }

    getProvinsi(){
        this.http.get('./assets/kabupaten.json').subscribe(data => {
            //console.log(data);
            this.provinsi = data;
        }); 
    }
   
    async getWallet() {
        await this.api.postItem('wallet').then(res => {
            this.wallet = res;
            //console.log(res);
        }, err => {
            console.log(err);
        });
    }

    async getCart() {
        await this.api.postItem('cart').then(res => {
            this.cart = res;
            this.data.updateCart(this.cart.cart_contents);
        }, err => {
            console.log(err);
        });
    }
  

    async updateOrder() {
        this.checkoutData.form.security = this.checkoutData.form.nonce.update_order_review_nonce;
        this.checkoutData.form['woocommerce-process-checkout-nonce'] = this.checkoutData.form._wpnonce;
        this.checkoutData.form['wc-ajax'] = 'update_order_review';
        this.setOldWooCommerceVersionData();
        await this.api.updateOrderReview('update_order_review', this.checkoutData.form).then(res => {
            this.orderReview = res;
            if(this.orderReview.payment && this.orderReview.payment.stripe) {
                this.stripe = Stripe(this.orderReview.payment.stripe.publishable_key);
            }
        }, err => {
            console.log(err);
        });
    }
    async updateOrderReview() {
        this.checkoutData.form.shipping_method = [];
        this.orderReview.shipping.forEach((item, index) => {
            this.checkoutData.form['shipping_method[' + index + ']'] = item.chosen_method;
        })
        this.checkoutData.form.security = this.checkoutData.form.nonce.update_order_review_nonce;
        this.checkoutData.form['woocommerce-process-checkout-nonce'] = this.checkoutData.form._wpnonce;
        this.checkoutData.form['wc-ajax'] = 'update_order_review';
        this.setOldWooCommerceVersionData();
        await this.api.updateOrderReview('update_order_review', this.checkoutData.form).then(res => {
            this.handleData(res);
        }, err => {
            console.log(err);
        });
    }
    setOldWooCommerceVersionData(){
        this.checkoutData.form.city = this.checkoutData.form.billing_city;
        this.checkoutData.form.postcode = this.checkoutData.form.billing_postcode;
        this.checkoutData.form.country = this.checkoutData.form.billing_country;
        this.checkoutData.form.address = this.checkoutData.form.billing_address_1;
        this.checkoutData.form.address_2 = this.checkoutData.form.billing_address_2;
        this.checkoutData.form.s_city = this.checkoutData.form.shipping_city;
        this.checkoutData.form.s_postcode = this.checkoutData.form.shipping_postcode;
        this.checkoutData.form.s_country = this.checkoutData.form.shipping_country;
        this.checkoutData.form.s_address = this.checkoutData.form.shipping_address_1;
        this.checkoutData.form.s_address_2 = this.checkoutData.form.shipping_address_2;
        this.checkoutData.form.has_full_address = true;
        this.checkoutData.form.customer_note = this.checkoutData.form.customer_note;
    }
    handleData(results) {
        console.log(results);
        //
    }
    deleteErorr(){
        this.errorMessage = undefined;
        this.disableButton = true;
    }
	
	async showLoading() {
		this.isLoading = true;
		const loading = await this.loadingController.create({
		message: 'Loading...',
		translucent: true,
		animated: true,
		spinner: 'circles',
    });

     loading.present();
  }
  
  async loadingDismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss();
  }
   
    async placeOrder() {
        this.disableButton = true;
		this.showLoading();
        /* const loading = await this.loadingController.create({
            message: 'Loading...',
            translucent: true,
            animated: true,
            backdropDismiss: true
        });
        await loading.present();
		//const { role, data } = await loading.onDidDismiss();
       this.errorMessage = undefined;

        /** Comment this if not using OneSignal Push notification ***/
        if (this.platform.is('cordova') && this.settings.settings.onesignal_app_id && this.settings.settings.google_project_id) {
            await this.oneSignal.getIds().then((data: any) => {
                this.checkoutData.form.onesignal_user_id = data.userId; 
				//this.loadingDismiss();
				//loading.dismiss();
            });
        }
            
        if (this.checkoutData.form.payment_method == 'authnet'){
            this.checkoutData.form['authnet-card-expiry'] = this.checkoutData.form.expiryMonth + ' / ' + this.checkoutData.form.expiryYear; 
			//loading.dismiss();
			//this.loadingDismiss();
        }

        if (this.checkoutData.form.payment_method == 'stripe'){
            this.setStripeForm(); 
			//loading.dismiss();
			//this.loadingDismiss();
            await this.api.getExternalData('https://api.stripe.com/v1/tokens', this.stripeForm).then(res => {
                this.handleStipeToken(res);
            }, err => { 
                if(err.error.error.message)
				this.loadingDismiss();
                //loading.dismiss();
			this.loadingDismiss();
                this.errorMessage = err.error.error.message;
                this.disableButton = false;
                });
        } /*else if (this.checkoutData.form.payment_method == 'braintree_credit_card'){
            this.brainTreePayment();
        }*/
        else {
            await this.api.ajaxCall('/checkout?wc-ajax=checkout', this.checkoutData.form).then(res => {
                this.results = res;
                this.handleOrder();
                //loading.dismiss();
				//this.loadingDismiss();
            }, err => {
                this.disableButton = false;
                console.log(err);
				this.loadingDismiss();
                //this.loadingDismiss();
            });
          
            
            
        }   
    }
    handleOrder() {
        if (this.results.result == 'success') {
            if (this.checkoutData.form.payment_method == 'wallet' || this.checkoutData.form.payment_method == 'paypalpro' || this.checkoutData.form.payment_method == 'stripe' || this.checkoutData.form.payment_method == 'bacs' || this.checkoutData.form.payment_method == 'cheque' || this.checkoutData.form.payment_method == 'cod' || this.checkoutData.form.payment_method == 'authnet' ) {
                this.orderSummary(this.results.redirect);
            } else if (this.checkoutData.form.payment_method == 'midtrans') {
                this.handleMidtrans();
                this.loadingDismiss();
                //this.orderSummary(this.results.result);
            }
            else this.handlePayment();
        } 
        else if (this.results.result == 'failure') {
            this.disableButton = false;
			this.loadingDismiss();
            this.errorMessage = 'Maaf terjadi kesalahan, mohon untuk cek:<ul><li>Jika <b>"No Shipping Available"</b>, Mohon lengkapi alamat pengiriman Anda dan pengisian kota harus benar.</li><li>Jika menggunakan pembayaran <b>Kalindopay</b>, pastikan saldo Kalindopay Anda mencukupi atau gunakan pembayaran <b>Bank Transfer</b>.</li><li>Cek produk dikeranjang Anda, beberapa produk dikhususkan untuk Member atau akun tertentu.</li></ul> ';
        }
    
    }
    async handleMidtrans(){
        this.disableButton = true;
        const loading = await this.loadingController.create({
            message: 'Loading...',
            translucent: true,
            animated: true,
            spinner: 'circles',
            backdropDismiss: true
        });

        await loading.present();
        let str = this.results.redirect;
        var pos1 = str.lastIndexOf("/order-pay/");
        var pos2 = str.lastIndexOf("/?key=wc_order");
        var pos3 = pos2 - (pos1 + 11);
        this.orderId = str.substr(pos1 + 11, pos3);  

        setTimeout(()=>{
            loading.dismiss();
            this.navCtrl.navigateRoot('/order-summary/' + this.orderId);
            
        },3000);
       
        
    }
    
    orderSummary(address) {
        var str = address;
        var order_id;
        if (str.indexOf('/order-received/') != -1) {
            var pos1 = str.lastIndexOf("-received/");
            var pos2 = str.lastIndexOf("/?key=wc_order");
            var pos3 = pos2 - (pos1 + 10);
            order_id = str.substr(pos1 + 10, pos3);
        } else if(str.indexOf('order-received=') != -1) {
            var pos1 = str.lastIndexOf("order-received=");
            var pos2 = str.lastIndexOf("&key=wc_order");
            var pos3 = pos2 - (pos1 + 15);
            order_id = str.substr(pos1 + 15, pos3);
        }
		this.loadingDismiss();
        this.navCtrl.navigateRoot('/order-summary/' + order_id); 
      //this.navCtrl.navigateRoot('/tabs/account/orders');
        
    }
    async handlePayment() {
        
        var options = "location=no,hidden=yes,footer=yes,footercolor=#3880ff,toolbar=no,hidespinner=yes,closebuttoncaption=Exit";
        let browser = this.iab.create(this.results.redirect, '_blank', options);
        browser.show();
        browser.on('loadstart').subscribe(data => {
            if (data.url.indexOf('/order-received/') != -1  && data.url.indexOf('key=wc_order_') != -1) {
                this.orderSummary(data.url);
                //this.addOrderNote();
                browser.hide();
            } else if (data.url.indexOf('cancel_order=true') != -1 || data.url.indexOf('cancelled=1') != -1 || data.url.indexOf('cancelled') != -1) {
                browser.close();
                this.getCart();
                this.navCtrl.navigateRoot('/tabs/account/orders');
                this.disableButton = false;
            }
        });
        browser.on('exit').subscribe(data => {
            browser.close();
            this.getCart();
            this.navCtrl.navigateRoot('/tabs/home');
            this.disableButton = false;
        });
    }
    

    
    onChangePayment(){
        this.disableButton = false;
        if((/*this.checkoutData.form.payment_method == 'stripe' || */this.checkoutData.form.payment_method == 'paypalpro') && this.platform.is('cordova')){
           // this.enterCard();
        }
    }
    setStripeForm(){
        this.stripeForm.key = this.orderReview.payment.stripe.publishable_key;
        this.stripeForm.payment_user_agent = 'stripe.js/6ea8d55';
        this.stripeForm['card[number]'] = this.cardResponse.cardNumber;//'4242424242424242';//this.cardResponse.cardNumber;
        this.stripeForm['card[exp_month]'] = this.cardResponse.expiryMonth;//'04';//this.cardResponse.expiryMonth;
        this.stripeForm['card[exp_year]'] = this.cardResponse.expiryYear;////this.cardResponse.expiryYear;
        this.stripeForm['card[cvc]'] = this.cardResponse.cvv;//this.cardResponse.cvc;
        this.stripeForm['card[name]'] = this.checkoutData.form.billing_first_name + this.checkoutData.form.billing_last_name;
        this.stripeForm['card[address_line1]'] = this.checkoutData.form.billing_address_1;
        this.stripeForm['card[address_line2]'] = this.checkoutData.form.billing_address_2;
        this.stripeForm['card[address_state]'] = this.checkoutData.form.billing_state;
        this.stripeForm['card[address_city]'] = this.checkoutData.form.billing_city;
        this.stripeForm['card[address_zip]'] = this.checkoutData.form.billing_postcode;
        this.stripeForm['card[address_country]'] = this.checkoutData.form.billing_country;
        return true;
    }
    handleStipeToken(token){
        if(token && token.id){
            var form = { type: 'card', token: '', key: ''};
            form.type = 'card';
            form.token = token.id;
            form.key = this.orderReview.payment.stripe.publishable_key;
            this.checkoutData.form['wc-stripe-payment-token'] = token.id; //For Existing Cards add api
            this.api.getExternalData('https://api.stripe.com/v1/sources', form).then(res => {
                this.stripePlaceOrder(res);
            }, err => { 
                if(err.error.error.message)
                this.errorMessage = err.error.error.message;
                this.disableButton = false;
            });
        } else {
            this.disableButton = false;
            this.errorMessage = 'Cannot handle payment, Please check card details';
        }
    }
    stripePlaceOrder(src){
        if(src && src.id){
            this.checkoutData.form['stripe_source'] = src.id;
            this.api.ajaxCall('/checkout?wc-ajax=checkout', this.checkoutData.form).then(res => {
                this.results = res;
                this.handleOrder();
            }, err => {
                this.disableButton = false;
                console.log(err);
            });
        } else {
            this.disableButton = false;
            this.errorMessage = 'Cannot handle payment, Please check card details';
        }
    }
    isEmptyObject(obj) {
        
        return Object.keys(obj).length === 0;
        
    }
    onUseNewCard(){
        this.setupStripe();
    }
    setupStripe() {
        var style = {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        };
        var elements = this.stripe.elements();
        this.cardElement = elements.create('card', {
            hidePostalCode: true,
            style: style
        });
        this.cardElement.mount('#card-element');
        
        //this.card.mount('#card-element');
        var form = document.getElementById('payment-form');
        console.log('test start');
        form.addEventListener('submit', event => {
            console.log('loading start');
            event.preventDefault();
            /*this.stripe.createToken(this.cardElement).then((result) => {
              console.log(result.token.id);

                this.service.getStripeSource(this.form, result.token)
                    .then((results) => {
                    console.log(results)
                });

            });*/
            var ownerInfo = {
                owner: {
                    name: this.checkoutData.form.billing_first_name + '' + this.checkoutData.form.billing_last_name,
                    address: {
                        line1: this.checkoutData.form.billing_address_1,
                        city: this.checkoutData.form.billing_city,
                        postal_code: this.checkoutData.form.billing_postcode,
                        country: 'US',
                    },
                    email: this.checkoutData.form.billing_email
                },
            };
            if (!this.checkoutData.form.shipping) {
                this.checkoutData.form.shipping_first_name = this.checkoutData.form.billing_first_name;
                this.checkoutData.form.shipping_last_name = this.checkoutData.form.billing_last_name;
                this.checkoutData.form.shipping_company = this.checkoutData.form.billing_company;
                this.checkoutData.form.shipping_address_1 = this.checkoutData.form.billing_address_1;
                this.checkoutData.form.shipping_address_2 = this.checkoutData.form.billing_address_2;
                this.checkoutData.form.shipping_city = this.checkoutData.form.billing_city;
                this.checkoutData.form.shipping_country = this.checkoutData.form.billing_country;
                this.checkoutData.form.shipping_state = this.checkoutData.form.billing_state;
                this.checkoutData.form.shipping_postcode = this.checkoutData.form.billing_postcode;
            }
            
            this.loading = this.loadingController.create({});
            this.loading.present();
            this.buttonSubmit = true;
            this.PlaceOrder = "Placing Order";
            this.stripe.createSource(this.cardElement, ownerInfo).then((result) => {
                if (result.error) {
                    this.loading.dismiss();
                    // Inform the user if there was an error
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    this.checkoutData.form.stripe_source = result.source.id;
                    this.stripNewPayment();
                }
            });
            /*    */
        });
    }
    async onClickStripeSubmit() {
        var ownerInfo = {
            owner: {
                name: this.checkoutData.form.billing_first_name + '' + this.checkoutData.form.billing_last_name,
                address: {
                    line1: this.checkoutData.form.billing_address_1,
                    city: this.checkoutData.form.billing_city,
                    postal_code: this.checkoutData.form.billing_postcode,
                    country: 'US',
                },
                email: this.checkoutData.form.billing_email
            },
        };
        if (!this.checkoutData.form.shipping) {
                this.checkoutData.form.shipping_first_name = this.checkoutData.form.billing_first_name;
                this.checkoutData.form.shipping_last_name = this.checkoutData.form.billing_last_name;
                this.checkoutData.form.shipping_company = this.checkoutData.form.billing_company;
                this.checkoutData.form.shipping_address_1 = this.checkoutData.form.billing_address_1;
                this.checkoutData.form.shipping_address_2 = this.checkoutData.form.billing_address_2;
                this.checkoutData.form.shipping_city = this.checkoutData.form.billing_city;
                this.checkoutData.form.shipping_country = this.checkoutData.form.billing_country;
                this.checkoutData.form.shipping_state = this.checkoutData.form.billing_state;
                this.checkoutData.form.shipping_postcode = this.checkoutData.form.billing_postcode;
            }
            this.buttonSubmit = true;
            this.PlaceOrder = "Placing Order";
            this.loading = await this.loadingController.create({
                message: 'Loading...',
                translucent: true,
                animated: true,
                backdropDismiss: true
            });
            await this.loading.present();
            this.stripe.createSource(this.cardElement, ownerInfo).then((result) => {
                if (result.error) {
                    this.loading.dismiss();
                    // Inform the user if there was an error
                    var errorElement = document.getElementById('card-errors');
                    errorElement.textContent = result.error.message;
                } else {
                    this.checkoutData.form.stripe_source = result.source.id;
                    this.stripNewPayment();
                }
            });
    }
    async stripNewPayment() {

        //IF for new Card Payment
        if(this.checkoutData.form.card){
            this.checkoutData.form['wc-stripe-payment-token'] = 'new';
        }

        //For Existing Card
        //if(!form.card)
        //this.checkoutData.form['wc-stripe-payment-token'] = form.payment_token);

        this.api.ajaxCall('/checkout?wc-ajax=checkout', this.checkoutData.form).then(res => {
            this.stripeStatus = res;
            if (this.stripeStatus.result == 'success') {
                if (this.stripeStatus.redirect.indexOf('confirm-pi-') != -1) {
                    // PI from resuct redirect text
                    var clientSecret = this.stripeStatus.redirect.substring(this.stripeStatus.redirect.lastIndexOf("confirm-pi-") + 11, this.stripeStatus.redirect.lastIndexOf(":%2F"));
                    //var clientSecret = 'pi_1EqKUlAMZtK61uwq79jdiVMt_secret_DitxeVf8vWt05K6kUS71alvrS';
                    this.stripe.handleCardPayment(clientSecret, this.cardElement, {
                        payment_method_data: {
                            billing_details: {
                                name: this.checkoutData.form.billing_first_name + ' ' + this.checkoutData.form.billing_last_name,
                                address: {
                                    line1: this.checkoutData.form.billing_address_1,
                                    city: this.checkoutData.form.billing_city,
                                    postal_code: this.checkoutData.form.billing_postcode,
                                    country: 'GB',
                                },
                                email: this.checkoutData.form.billing_email
                            }
                        }
                    }).then((result) => {
                        this.loading.dismiss();
                        if (result.error) {
                            this.buttonSubmit = false;
                            // Display error.message in your UI.
                            
                        } else {
                            this.buttonSubmit = false;
                            var str = this.stripeStatus.redirect;
                            var pos1 = str.lastIndexOf("received%252F");
                            var pos2 = str.lastIndexOf("%252F%253Fkey");
                            var pos3 = pos2 - (pos1 + 13);
                            var order_id = str.substr(pos1 + 13, pos3);
                            this.api.ajaxCall('/?wc-ajax=wc_stripe_verify_intent&order=' + order_id + '&nonce=' + this.checkoutData.form.stripe_confirm_pi + '&redirect_to=').then(res => {
                                this.navCtrl.navigateRoot('/order-summary/' + order_id);
                            }, err => { 
                                
                            });
                            
                        }
                    });
                } else if (this.stripeStatus.redirect.indexOf('order-received') != -1 && this.stripeStatus.redirect.indexOf('key=wc_order') != -1) {
                    var str = this.stripeStatus.redirect;
                    var pos1 = str.lastIndexOf("/order-received/");
                    var pos2 = str.lastIndexOf("/?key=wc_order");
                    var pos3 = pos2 - (pos1 + 16);
                    var order_id = str.substr(pos1 + 16, pos3);
                    this.buttonSubmit = false;
                    this.loading.dismiss();
                    this.navCtrl.navigateRoot('/order-summary/' + order_id);
                }
            } else if (this.stripeStatus.result == 'failure') {
                this.presentToast(this.stripeStatus.messages);
                this.buttonSubmit = false;
                this.loading.dismiss();
            }
        }, err => {
            this.disableButton = false;
            console.log(err);
        });

    
    }
async presentToast(message) {
        const toast = await this.toastController.create({
          message: message,
          duration: 2000,
          position: 'top'
        });
        toast.present();
    }
    brainTreePayment(){

        /*console.log('Braintree payment.......');
        
        const BRAINTREE_TOKEN = 'sandbox_7b74zrbp_zm8j7dwnjqqzzgxn';
        
        const appleOptions: ApplePayOptions = {
          merchantId: 'zm8j7dwnjqqzzgxn',
          currency: 'USD',
          country: 'US'
        }

        const paymentOptions: PaymentUIOptions = {
          amount: '14.99',
          primaryDescription: 'Your product or service (per /item, /month, /week, etc)',
        }

        this.braintree.initialize(BRAINTREE_TOKEN)
          .then(() => this.braintree.setupApplePay(appleOptions))
          .then(() => this.braintree.presentDropInPaymentUI(paymentOptions))
          .then((result: PaymentUIResult) => {
            if (result.userCancelled) {
              console.log("User cancelled payment dialog.");
            } else {
              console.log("User successfully completed payment!");
              console.log("Payment Nonce: " + result.nonce);
              console.log("Payment Result.", result);
            }
          })
          .catch((error: string) => console.error(error));*/
    }
}