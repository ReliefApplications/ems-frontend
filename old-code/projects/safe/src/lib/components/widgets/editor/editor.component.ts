import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Text widget component using KendoUI
 */
@Component({
  selector: 'safe-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class SafeEditorComponent implements OnInit {
  // === WIDGET CONFIGURATION ===
  @Input() header = true;
  @Input() public title = '';
  @Input() public text = '';

  // === TEXT SANITIZED ===
  public safeText: SafeHtml = '';

  /**
   * Contructor for safe-editor component
   *
   * @param sanitizer Dom sanitizer instance
   */
  constructor(private sanitizer: DomSanitizer) {}

  /** Sanitize the text. */
  ngOnInit(): void {
    this.safeText = this.sanitizer.bypassSecurityTrustHtml(this.text);
  }
}
