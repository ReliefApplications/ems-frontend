import { Component, Input, OnInit } from '@angular/core';
import { ButtonCategory } from './button-category.enum';

@Component({
  selector: 'safe-button',
  templateUrl: './button.component.html',
  styleUrls: [
    './button.component.scss'
  ]
})
export class SafeButtonComponent implements OnInit  {

  @Input() category: ButtonCategory = ButtonCategory.PRIMARY;

  @Input() block = false;

  @Input() disabled = false;

  @Input() icon = '';

  ngOnInit(): void {}
}
