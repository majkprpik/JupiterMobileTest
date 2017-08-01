import {Component} from '@angular/core';
import {IonicPage, App} from 'ionic-angular';

import {FavoritesProvider} from '../../../../providers/favorites-provider';
import {GlobalProvider} from '../../../../providers/global-provider';

@IonicPage()
@Component({selector: 'page-core-cc-favorites', templateUrl: 'favorites.html'})
export class CoreCcFavoritesPage {
    constructor(private favoritesProvider : FavoritesProvider, private globalProvider : GlobalProvider, private app : App) {}

    openModule(item) {
        GlobalProvider.pushPage(item.page);
        this
            .app
            .getRootNav()
            .setRoot(item.page, {}, {
                animate: true,
                direction: 'forward'
            });
    }

    doubleTap() {
        this.closePage();
    }

    closePage() {
        this
            .globalProvider
            .closeCC();
    }

}