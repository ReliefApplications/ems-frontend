import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { UploadEvent } from '@progress/kendo-angular-upload';

@Component({
  selector: 'app-upload-menu',
  templateUrl: './upload-menu.component.html',
  styleUrls: ['./upload-menu.component.scss'],
})
export class UploadMenuComponent implements OnInit {
  @Output() upload = new EventEmitter<UploadEvent>();
  @Output() download = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close: EventEmitter<null> = new EventEmitter();

  private show = true;

  @HostListener('click')
  clickInside() {
    this.show = true;
  }

  @HostListener('document:click')
  clickout() {
    if (!this.show) {
      this.close.emit();
    }
    this.show = false;
  }

  constructor() {}

  ngOnInit(): void {}

  onUpload(e: UploadEvent): void {
    e.preventDefault();
    this.upload.emit(e);
  }

  onDownloadTemplate(e: any): void {
    this.download.emit();
  }
}
