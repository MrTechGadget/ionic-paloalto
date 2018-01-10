import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PalorestProvider } from '../../providers/palorest/palorest';
import { DevicePage } from '../device/device';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  public users: any;
  selectedItem: any;
  icons: string[];
  items: Array<{title: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private restService: PalorestProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    //this.selectedItem = navParams.get('item');
    this.loadUsers()
    
    // Let's populate this page with some filler content for funzies
    this.icons = ['flask', 'wifi', 'beer', 'football', 'basketball', 'paper-plane',
        'american-football', 'boat', 'bluetooth', 'build'];

    this.items = [];
    for (let i = 1; i < 11; i++) {
      this.items.push({
        title: 'Item ' + i,
        note: 'This is item #' + i,
        icon: this.icons[Math.floor(Math.random() * this.icons.length)]
      });
    }
  }

  loadUsers() {
    this.restService.getUsers().then((data) => {
      try {
        this.users = data;
        console.log("Got Users Results List");
        console.log(this.users);
      } catch (error) {
        console.log("Failed to find devices"); 
      }
    });
  }

  itemTapped(event, user) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(DevicePage, {
      user: user
    });
  }
}
