import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import xml2js from 'xml2js';

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
  domain:string
  username: string;
  password: string;
  key: string;
  host: string;
  authorization: string;
  users: any;


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
            storage.get('domain')
              .then(
              data => this.domain = data,
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
          this.domain = this.config.domain;
          this.baseUrl = this.protocol+"://"+this.host+"/api/";
          console.log(this.username);
          this.generateKey();
        }
      );
    }
  }

//cmd for gateway stats &type=op&cmd=<show><global-protect-gateway><statistics><%2Fstatistics><%2Fglobal-protect-gateway><%2Fshow>
//cmd for gateway config &type=op&cmd=<show><global-protect-gateway><gateway><%2Fgateway><%2Fglobal-protect-gateway><%2Fshow>
//cmd for current-users &type=op&cmd=<show><global-protect-gateway><current-user><%2Fcurrent-user><%2Fglobal-protect-gateway><%2Fshow>
//cmd for Panorama status &type=op&cmd=<show><panorama-status><%2Fpanorama-status><%2Fshow>
//cmd for DNS-proxy status &type=op&cmd=<show><dns-proxy><statistics><all><%2Fall><%2Fstatistics><%2Fdns-proxy><%2Fshow>
//?type=op&cmd=<request><global-protect-gateway><client-logout><gateway>this.gateway<%2Fgateway><user>this.user.username<%2Fuser><reason>force-logout<%2Freason><computer>this.user.computer<%2Fcomputer><%2Fclient-logout><%2Fglobal-protect-gateway><%2Frequest>&key=apikey'

saveSettings() {
  console.log('Saving Settings')
  if (this.platform.is('cordova')) {
    console.log('Is Cordova, trying secureStorage')
    this.secureStorage.create('paloKeychain')
      .then((storage: SecureStorageObject) => { 
        storage.set('domain', this.domain)
          .then(
            () => console.log('Stored domain'),
            error => console.error('Error storing domain', error)
          );
        storage.set('username', this.username)
          .then(
            () => console.log('Stored username'),
            error => console.error('Error storing username', error)
          );
        storage.set('password', this.password)
          .then(
            () => console.log('Stored password'),
            error => console.error('Error storing password', error)
          );
        storage.set('host', this.host)
          .then(
            () => console.log('Stored host'),
            error => console.error('Error storing host', error)
          )
          .then(
              () => this.baseUrl = "https://"+this.host+"/API/",
              error => console.error('Error setting baseUrl')
          );
      });
  } else console.warn('Cannot Save Settings, Secure Storage not available on this device')
}

  generateKey() {
    if (this.key) {
      //already loaded data
      console.log("cached version");
      return Promise.resolve(this.key);
    }

    // don't have the data yet
    return new Promise(resolve => {
      let headers = new Headers();
      //let options = new RequestOptions({ headers: headers });
      this.http.get(this.baseUrl + "?type=keygen&user=" + this.username + "&password=" + this.password, { headers: new HttpHeaders({ 'Accept': 'application/xml' }), responseType: 'text' })//options)
        .subscribe(data => {
          let json:any = this.convertToJson(data);
          this.key = json.response.result.key;
          resolve(this.key);
        }, error => {
          console.log(error);
          if (error.status > 299) {
            console.log("bad creds, de-auth");
          }
        });
    });
  }

  command(command:string) {
    return new Promise(resolve => {
      let header = new HttpHeaders({ 'Accept': 'application/xml' });
      //let options = new RequestOptions({ headers: headers });
      this.http.get(this.baseUrl + "?key="+this.key + command, { headers: header, responseType: 'text' })
        .subscribe(data => {
          let json:any = this.convertToJson(data);
          let result = json.response.result;
          resolve(result);
        }, error => {
          console.log(error);
          if (error.status > 299) {
            console.log("bad creds, de-auth");
          }
        });
    });
  }

  getUsers() {
    return new Promise(resolve => {
      let headers = new Headers();
      //let options = new RequestOptions({ headers: headers });
      this.http.get(this.baseUrl + "?key="+this.key+"&type=op&cmd=<show><global-protect-gateway><current-user><domain>"+this.domain+"<%2Fdomain><%2Fcurrent-user><%2Fglobal-protect-gateway><%2Fshow>", { headers: new HttpHeaders({ 'Accept': 'application/xml' }), responseType: 'text' })//options)
        .subscribe(data => {
          let json:any = this.convertToJson(data);
          console.log(json);
          this.users = json.response.result.entry;
          resolve(this.users);
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


  convertToJson(data: string): Object {
    let res: string;
    // setting the explicitArray option prevents a array structure
    // where every node/element is always wrapped inside an array
    // set it to true, and see for yourself what changes
    xml2js.parseString(data, { explicitArray: false }, (error, result) => {
      
      if (error) {
        throw new Error(error);
      } else {
        res = result;
      }
    });
    return res;
  }

}
