import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { xml2js } from 'xml2js';
//import { panxapi } from 'panxapi'
/*
  Generated class for the PalorestProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PalorestProvider {
  client: any
  baseUrl: string
  options
  data: any;
  networkData
  version: any;
  config: any;
  headers: Headers;
  protocol="https";
  username: string;
  password: string;
  key: string;
  host: string;
  authorization: string;


  constructor(public http: HttpClient, private platform: Platform, public secureStorage: SecureStorage) {
    console.log('Hello PalorestProvider Provider');

    this.http = http;
    
    
    platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.secureStorage.create('paloKeychain')
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
              ).then(() => this.baseUrl = "https://" + this.host + "/api/"
              ).then(() => this.generateKey()
              );
          });
      } else console.warn('Cannot retrieve settings, Secure Storage not available on this device')
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
          console.log(this.username);
        }
      );
    }
  }

//cmd for gateway stats &type=op&cmd=<show><global-protect-gateway><statistics><%2Fstatistics><%2Fglobal-protect-gateway><%2Fshow>
//cmd for gateway config &type=op&cmd=<show><global-protect-gateway><gateway><%2Fgateway><%2Fglobal-protect-gateway><%2Fshow>
//cmd for current-users &type=op&cmd=<show><global-protect-gateway><current-user><%2Fcurrent-user><%2Fglobal-protect-gateway><%2Fshow>
//cmd for Panorama status &type=op&cmd=<show><panorama-status><%2Fpanorama-status><%2Fshow>
//cmd for DNS-proxy status &type=op&cmd=<show><dns-proxy><statistics><all><%2Fall><%2Fstatistics><%2Fdns-proxy><%2Fshow>



  generateKey() {
    if (this.key) {
      //already loaded data
      console.log("cached version")
      return Promise.resolve(this.key);
    }

    // don't have the data yet
    return new Promise(resolve => {
      let headers = new Headers();
      //let options = new RequestOptions({ headers: headers });
      this.http.get(this.baseUrl + "?type=keygen&user=" + this.username + "&password=" + this.password, )//options)
        .subscribe(data => {
          this.key = data.toString();
          resolve(this.key);
        }, error => {
          console.log(error);
          if (error.status > 299) {
            console.log("bad creds, de-auth");
          }
        });
    });
  }

  getVersion() {
    if (this.version) {
      //already loaded data
      console.log("cached version")
      return Promise.resolve(this.version);
    }

    // don't have the data yet
    return new Promise(resolve => {
      let headers = new Headers();
      //let options = new RequestOptions({ headers: headers });
      this.http.get(this.baseUrl + "system/info", )//options)
        .subscribe(data => {
          this.version = data;
          resolve(this.version);
        }, error => {
          console.log(error);
          if (error.status > 299) {
            console.log("bad creds, de-auth");
          }
        });
    });
  }


}
