import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PalorestProvider } from '../../providers/palorest/palorest';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private restService: PalorestProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login($event, domain, username, password, host) {
    if (domain) {
      this.restService.domain = domain;
    }
    if (username) {
      this.restService.username = username;
    }
    if (password) {
      this.restService.password = password;
    }
    if (host) {
      this.restService.host = host;
    }

    if (this.restService.saveSettings()) {
      console.log('Settings Saved')
      this.navCtrl.pop();
    } else {
      console.log('Did not save');
      this.navCtrl.pop();
    }
  }
}
