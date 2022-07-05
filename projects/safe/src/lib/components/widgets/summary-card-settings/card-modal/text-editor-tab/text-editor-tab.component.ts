import { Component, Inject, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  EDITOR_LANGUAGE_PAIRS,
  WIDGET_EDITOR_CONFIG,
} from '../../../../../const/tinymce.const';

@Component({
  selector: 'safe-text-editor-tab',
  templateUrl: './text-editor-tab.component.html',
  styleUrls: ['./text-editor-tab.component.scss']
})
export class SafeTextEditorTabComponent implements OnInit {

  @Input() form: any;

  /** tinymce editor */
  public editor: any = WIDGET_EDITOR_CONFIG;

  constructor(
    @Inject('environment') environment: any,
    private translate: TranslateService
  ) {
    // Set the editor base url based on the environment file
    let url: string;
    if (environment.module === 'backoffice') {
      url = new URL(environment.backOfficeUri).pathname;
    } else {
      url = new URL(environment.frontOfficeUri).pathname;
    }
    if (url !== '/') {
      this.editor.base_url = url.slice(0, -1) + '/tinymce';
    } else {
      this.editor.base_url = '/tinymce'
    }
    // Set the editor language
    const lang = this.translate.currentLang;
    const editorLang = EDITOR_LANGUAGE_PAIRS.find((x) => x.key === lang);
    if (editorLang) {
      this.editor.language = editorLang.tinymceKey;
    } else {
      this.editor.language = 'en';
    }
  }

  ngOnInit(): void {
  }

}
