import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PalorestProvider } from '../../providers/palorest/palorest'

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  data: any;
  public gateways: any;
  totalCurrentUsers: any;
  totalPreviousUsers: any;

  constructor(public navCtrl: NavController, public restService: PalorestProvider) {
    //this.restService.generateKey();
  }

  gotoSettings() {
    this.navCtrl.push(LoginPage);
  }

  getGateways() {
    this.restService.command("&type=op&cmd=<show><global-protect-gateway><statistics><%2Fstatistics><%2Fglobal-protect-gateway><%2Fshow>")
    .then(response => this.data = response)
    .then(() => {
      this.totalCurrentUsers = this.data.TotalCurrentUsers;
      this.totalPreviousUsers - this.data.TotalPreviousUsers;
      this.gateways = this.data.Gateway;
      console.log(this.gateways);
    })

  }
  ionViewDidLoad() {
    
  }
}
