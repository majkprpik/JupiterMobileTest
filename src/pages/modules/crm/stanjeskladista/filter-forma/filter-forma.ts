import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';

import {BasePage} from '../../../../../providers/base/base-page';
//import * as ICore from '../../../../../interfaces/iCore';

import { Storage } from '@ionic/storage';
import { ItemSliding } from 'ionic-angular';



@IonicPage()
@Component({
  selector: 'page-stanjeskladista-filter-forma',
  templateUrl: 'filter-forma.html',
})
export class CRMStanjeSkladistaFilterFormaPage extends BasePage {
  
  parametriupita={
                      action:0,
                       skladisteid:null
                      ,skladistenaziv:''
                      ,robaid:null
                      ,robanaziv:''
                      ,klmasterrobaid:null
                      ,klmasterrobanaziv:''
                      ,partneriid: null
                      ,partnerinaziv:''
                      ,cjenikid:null
                      ,cjeniknaziv:''                      
                      ,naziv:''
                    };
  

  

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController, public storage: Storage) {
  
  super();
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterFormaPage');
    this.storage.get('jm_crm_stanjeskladista_parametriupita').then(val => {
      if (val) {
        this.parametriupita = val;
        console.log('parametri upita na ionViewDidLoad: ',this.parametriupita);
      }
      else{
        console.log('nema parametara');

      //   this.parametriupita ={
      //     action:0,
      //      skladisteid:null
      //     ,skladistenaziv:''
      //     ,robaid:null
      //     ,robanaziv:''
      //     ,klmasterrobaid:null
      //     ,klmasterrobanaziv:''
      //     ,naziv:''
      //   };
      //   this.storage.set('jm_crm_stanjeskladista_parametriupita', this.parametriupita); 

      }
  });
  }

 

  izaberi(action){
    this.parametriupita.action=action;
    console.log(' this.parametriupita prije trazilice',   this.parametriupita);
    
    
    this.global.modal  = this.modalCtrl.create('CRMKonsolidacijaTrazilicaPage', 
    //this.parametriupita
    {'action':action, 'skladisteid':this.parametriupita.skladisteid, 'robaid': this.parametriupita.robaid, 'klmasterrobaid':this.parametriupita.klmasterrobaid
    , 'partneriid':this.parametriupita.partneriid, 'cjenikid':this.parametriupita.cjenikid }
  );
  this.global.modal.present();
    this.global.modal.onDidDismiss(data => {
      if(data==null){
        console.log('data je null');
        data={action:0};
        console.log('data: ', data);
      }
      if(typeof data != 'undefined'){
        if(data.action==6){
          this.parametriupita.skladisteid=data.id;
          this.parametriupita.skladistenaziv=data.naziv;
        }
        if(data.action==11){
          this.parametriupita.klmasterrobaid=data.id;
          this.parametriupita.klmasterrobanaziv=data.naziv;
        }
        if(data.action==8){
          this.parametriupita.robaid=data.id;
          this.parametriupita.robanaziv=data.naziv;
        }
        
 
      }

      console.log(' this.parametriupita nakon traziice',  this.parametriupita);
      this.global.modal = null;
      });
  }

  brisiSkladiste(slidingItem: ItemSliding){
    this.parametriupita.skladisteid=null;
    this.parametriupita.skladistenaziv='';
    try{
      slidingItem.close();
    }catch(error){
      //
    }

  }
  brisiKlasuRobe(slidingItem: ItemSliding){
    this.parametriupita.klmasterrobaid=null;
    this.parametriupita.klmasterrobanaziv='';
    try{
      slidingItem.close();
    }catch(error){
      //
    }
  }
  brisiRobu(slidingItem: ItemSliding){
    this.parametriupita.robaid=null;
    this.parametriupita.robanaziv='';
    try{
      slidingItem.close();
    }catch(error){
      //
    }
  }
  brisiNaziv(slidingItem: ItemSliding){
    this.parametriupita.naziv='';
    try{
      slidingItem.close();
    }catch(error){
      //
    }
  }
  ocistiSve(){
    this.brisiSkladiste(undefined);
    this.brisiKlasuRobe(undefined);
    this.brisiRobu(undefined);
    this.brisiNaziv(undefined);
  }

  spremiParametreUpita(){
   // try {
      this.storage.set('jm_crm_stanjeskladista_parametriupita', this.parametriupita);  
    // } catch (error) {
    //   console.log("greška  spremiParametreUpita",error);
    // }
    
  }

  prikazi(){

  
    console.log("parametriupita: ",this.parametriupita);

    if( this.parametriupita.skladisteid==null && this.parametriupita.klmasterrobaid==null && this.parametriupita.robaid==null && this.parametriupita.naziv==''){
      let alert = this.alertCtrl.create({
        title: 'Upozorenje',
        subTitle: 'Molimo izaberite najmanje jedan parametar izvještaja!',
        buttons: ['OK']
      });
      alert.present();
      
    }
    else{
      console.log("spremiParametreUpita: ",this.parametriupita);
    
      this.spremiParametreUpita();

      console.log("push CRMListaPage: ",this.parametriupita);
           
      this.navCtrl.push('CRMListaPage', this.parametriupita);
      
    }
   
    
  }



}
