import {Storage} from '@ionic/storage';
import {Injectable} from '@angular/core';
import {App, ToastController} from 'ionic-angular';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/Rx';

import {GlobalProvider} from './core/global-provider';

import * as ICore from '../interfaces/ICore';

@Injectable()
export class OsobainfoProvider {
    private storage : Storage;

    // private storageRoot : any[]; private storageRoot : Array < StorageRoot > =
    // new Array < StorageRoot > ();
    private storageHistoryRoot : Array <any>;
    private storageHistory : Array <any>;

    public firmeCnt : number = 0;

    public items : any = {};
    public firme : Array <any>;


    public loading : boolean = false;

    public naziv : string = "...";


    private storageKeys : {
        history: string
    } = {
        history: "info.osoba.history.001",
    };

    constructor(public http : Http, private app : App, private toastCtrl : ToastController, private global: GlobalProvider) {
        this.storage = new Storage({});
        this.getDataFromStorage();
    }

    InitStorage(id) {
        this.loading = true;
        this.naziv = "...";
        //setTimeout(() => {

        Promise
            .resolve()
            .then(() => {
                if (this.storageHistoryRoot != null) {
                    return this.getItemFromData(this.storageHistoryRoot, id);
                }
            })
            //set data
            .then((val) => {
                if (val != null) {
                    this.setData(val, id);
                }
                return val;
            })
            // ako je value iz nekog razloga null (u pravilu ne bi trebalo biti) dohvati
            // podatke iz baze
            .then((val) => {
                if (val == null) {
                    this
                        .getServerData(id)
                        .then(data => {
                            this.setData(data, id);
                        })
                }
            })
            .then(() => this.loading = false);
        //}, 3000);
    }

    clearData() {
        this.storageHistoryRoot = new Array < any > ();
        this.storageHistory = new Array < any > ();
    }

    

    getDataFromStorage() {
        this
            .storage
            .ready()
            .then(() => {
                return this
                    .storage
                    .get(this.storageKeys.history)
                    .then(val => {
                        let data = JSON.parse(val);
                        this.storageHistoryRoot = data;
                        return data;
                    }) 
                    .then(val => {
                        if (val == null) {
                            this.clearData();
                        }
                    }).catch(ex => this.global.logError(ex, true));
            })
    }


    getItemFromData(data, id) {
        let filterData = this.getOsobaData(data, id);
        if (filterData.length > 0) {
            return filterData[0];
        }
        return null;
    }

    getItemFromStorage(id) {
        return this
            .storage
            .get(this.storageKeys.history)
            .then(val => {
                let obj = JSON.parse(val);
                if (obj != null) {
                    //return obj.filter(x => x.partneriId == id); this.SetData(test[0]);
                    return this.getOsobaData(obj, id);
                }
            });
    }

    setData(data, id) {
        this.items = data;
        this.firme = data.firme;
        this.naziv = data.prezime + ' ' + data.ime;

        this.firmeCnt = this.firme.length;

        this.addToStorage(data, id);

        this.getDataFromStorage();
    }

    addToStorage(data, id) {
        //prvo provjeri da li postoji u storageu
        let checkData = this.getOsobaData(this.storageHistoryRoot, id);

        if (checkData.length == 0) {
            //ako ne postoji insertiraj
            this
                .storageHistoryRoot
                .push(data);
            //this.sortData(this.storageHistoryRoot);
            this
                .storage
                .set(this.storageKeys.history, JSON.stringify(this.storageHistoryRoot));
            
        }
    }


    getOsobaData(obj, id) {
        return obj.filter(x => x.osobeid == id);
    }

    getServerData(id) {
        

        let data : ICore.IData = {
            "queries": 
            [
               {
                    "query": "spMobInfoOsoba",
                    "params": {
                        "action": "osobaInfo",
                        "id": id
                    },
                    "singlerow": true
                },
               {
                    "query": "spMobInfoOsoba",
                    "params": {
                        "action": "osobaFirme",
                        "id": id
                    },
                    "tablename": "firme"
                    
                } 
            ]
        }
        return this
            .global
            .getData(data, true);
     
    }

    public presentToastError(message : string) {
        let toast = this
            .toastCtrl
            .create({message: message, duration: 5000, position: 'bottom', cssClass: "toast-error"});

        toast.onDidDismiss(() => {});
    }

    close() {
        this
            .app
            .getRootNav()
            .setRoot('OsobaSearchPage', {}, {
                animate: true,
                direction: 'backward'
            });
    }


    handleError(error) {
        return Observable.throw(error.json().error || 'Server error');
    }
}