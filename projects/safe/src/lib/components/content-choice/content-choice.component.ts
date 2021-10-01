import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'safe-content-choice',
  templateUrl: './content-choice.component.html',
  styleUrls: ['./content-choice.component.scss']
})
export class SafeContentChoiceComponent implements OnInit {

  @Input() contentTypes?: any;
  @Input() form?: any;
  @Input() assetsPath = '';

  constructor() { }

  ngOnInit(): void {}

}
