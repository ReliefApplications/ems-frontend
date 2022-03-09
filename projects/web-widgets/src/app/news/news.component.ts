import { Component, OnInit } from '@angular/core';

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
      title: 'test',
      description: 'test',
      url: 'myurl.org',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
