import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PalorestProvider } from '../../providers/palorest/palorest'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public restService: PalorestProvider) {

  }

}
