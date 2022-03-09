import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';

interface Article {
  title: string;
  url: string;
  description: string;
}

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit {
  public articles: Article[] = [
    {
      title: environment.module,
      description: 'test',
      url: environment.apiUrl,
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
