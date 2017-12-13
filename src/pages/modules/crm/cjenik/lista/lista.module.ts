import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { CRMCjenikListaPage } from './lista';
import { ComponentsModule } from '../../../../../components/components.module';

@NgModule({
  declarations: [
    CRMCjenikListaPage,
  ],
  imports: [
    IonicPageModule.forChild(CRMCjenikListaPage),
    ComponentsModule
  ],
  exports: [
    CRMCjenikListaPage
  ]
})
export class CRMCjenikListaPageModule {}