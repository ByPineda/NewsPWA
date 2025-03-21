import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Article } from 'src/app/interfaces';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {
  // El viewChild es para poder acceder a los elementos del html desde el ts
  // En este caso se accede al ion-infinite-scroll
  //Digamos que es como un document.getElementById pero de angular

  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll!: IonInfiniteScroll;

  public categories: string[] = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology',
  ];

  public selectedCategory: string = this.categories[1];
  public articles: Article[] = [];
  constructor(private newsService: NewsService) {}
  ngOnInit(): void {
    console.log(this.infiniteScroll);
    this.newsService
      .getTopHeadLinesByCategory(this.selectedCategory)
      .subscribe((articles) => {
        this.articles = [...articles];
      });
  }

  segmentChanged(event: CustomEvent) {
    this.selectedCategory = (event as CustomEvent).detail.value;
    this.newsService
      .getTopHeadLinesByCategory(this.selectedCategory)
      .subscribe((articles) => {
        this.articles = [...articles];
      });
    console.log(this.articles);
  }

  loadData() {
    this.newsService
      .getTopHeadLinesByCategory(this.selectedCategory, true)
      .subscribe((articles) => {
        if (articles.length === this.articles.length) {
          this.infiniteScroll.disabled = true;
          return;
        }
        this.articles = articles;
        this.infiniteScroll.complete();
      });
  }
}
