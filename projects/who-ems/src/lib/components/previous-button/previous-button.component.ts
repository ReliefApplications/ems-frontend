import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'who-previous-button',
  templateUrl: './previous-button.component.html',
  styleUrls: ['./previous-button.component.scss']
})
export class WhoPreviousButtonComponent implements OnInit {

  @Input() path: string;

  constructor(private router: Router) { }

  ngOnInit(): void {}

  onPrevious(): void {
    this.router.navigate([this.path]);
  }
}
