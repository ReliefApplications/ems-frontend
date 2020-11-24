import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-preview-toolbar',
  templateUrl: './preview-toolbar.component.html',
  styleUrls: ['./preview-toolbar.component.scss']
})
export class PreviewToolbarComponent implements OnInit {

  @Input() title: string;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onClose(): void {
    this.router.navigate(['/applications']);
  }
}
