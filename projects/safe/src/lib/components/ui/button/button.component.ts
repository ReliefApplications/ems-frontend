import { Component, Input, OnInit } from '@angular/core';
import { ButtonCategory } from './button-category.enum';
import { ButtonSize } from './button-size.enum';

@Component({
  selector: 'safe-button',
  templateUrl: './button.component.html',
  styleUrls: [
    './button.component.scss'
  ]
})
export class SafeButtonComponent implements OnInit  {

  @Input() category: ButtonCategory = ButtonCategory.PRIMARY;

  @Input() size: ButtonSize = ButtonSize.MEDIUM;

  @Input() block = false;

  @Input() disabled = false;

  @Input() icon = '';

  ngOnInit(): void {}
}
