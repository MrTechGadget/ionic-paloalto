import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { xml2js } from 'xml2js';
/*
  Generated class for the PalorestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PalorestProvider {
  baseUrl: string
  options
  data: any;
  networkData
  version: any;
  config: any;
  headers: Headers;
  username: string;
  password: string;
  host: string;
  authorization: string;
  secureStorage: SecureStorage;

  constructor(public http: HttpClient, private platform: Platform) {
    console.log('Hello PalorestProvider Provider');

    this.http = http;
    
    platform.ready().then(() => {

    this.secureStorage = new SecureStorage();
    this.secureStorage.create('soAdminKeychain')
      .then((storage: SecureStorageObject) => { 
      storage.get('username')
        .then(
          data => this.username = data,
          error => console.error(error)
      );
      storage.get('password')
        .then(
          data => this.password = data,
          error => console.error(error)
      );
      storage.get('host')
        .then(
          data => this.host = data,
          error => console.error(error)
        ).then ( () => this.baseUrl = "https://"+this.host+"/api/"
      );
      });
    });

    if(this.platform.is('core') || this.platform.is('mobileweb')) {
      this.http.get('assets/config.json')
      //.map(res => res.json())
      .subscribe(
        data => this.config = data, 
        err => console.log(err),
        () => {
          console.log("Retrieved Config");
          this.host = this.config.host;
          this.username = this.config.username;
          this.password = this.config.password;
          this.baseUrl = "https://"+this.host+"/API/";
        }
      );
    }
  }



}
