import { Component, Input, OnInit } from '@angular/core';
import { Article } from 'src/app/interfaces';
import { Browser } from '@capacitor/browser';
import {
  ActionSheetController,
  AlertController,
  Platform,
} from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
  standalone: false,
})
export class ArticleComponent {
  @Input() article!: Article;
  @Input() index!: number;

  constructor(
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private socialSharing: SocialSharing,
    private platform: Platform,
    private storageService: StorageService
  ) {}

  openArticle() {
    console.log('Open article');
    this.openCapacitorSite();
  }

  async onOpenMenu() {
    const normalButtons = [
      {
        text: 'Favorite',
        icon: 'heart-outline',
        handler: () => this.onToggleFavorite(),
      },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
      },
    ];
    const share = {
      text: 'Share',
      icon: 'share-outline',
      handler: () => this.shareArticle(),
    };
    if (this.platform.is('capacitor')) {
      normalButtons.unshift(share);
    }

    const actionSheet = await this.actionSheetController.create({
      header: 'Article Options',
      buttons: normalButtons,
    });

    await actionSheet.present();
  }

  openCapacitorSite = async () => {
    const url = this.article.url ?? '';
    if (url) {
      console.log('Opening article', url);
      await Browser.open({ url: url });
    } else {
      console.error('Article URL is invalid.');
    }
  };

  shareArticle() {
    if (this.platform.is('cordova')) {
      this.socialSharing.share(
        this.article.title ?? '',
        this.article.source.name ?? '',
        '',
        this.article.url ?? undefined
      );
    } else {
      if (navigator['share']) {
        navigator['share']({
          title: this.article.title ?? '',
          text: this.article.description ?? '',
          url: this.article.url ?? undefined,
        })
          .then(() => console.log('Successful share'))
          .catch((error) => console.log('Error sharing', error));
      } else {
        console.log('No se pudo compartir porque no se soporta');
      }
    }
  }
  onToggleFavorite() {
    console.log('Toggle favorite');
    this.storageService.saveRemoveArticle(this.article);
  }
}
