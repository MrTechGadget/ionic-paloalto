import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PalorestProvider } from '../../providers/palorest/palorest';

/**
 * Generated class for the DevicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-device',
  templateUrl: 'device.html',
})
export class DevicePage {
  user: any;
  publicIp: any;
  tunnelType: any;
  loginTime: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public restService: PalorestProvider) {
    this.user = navParams.get('user')

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DevicePage');
    this.publicIp = this.user['public-ip'];
    this.tunnelType = this.user['tunnel-type'];
    this.loginTime = this.user['login-time'];
  }

}
