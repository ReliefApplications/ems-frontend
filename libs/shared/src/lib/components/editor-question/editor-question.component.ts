import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FIELD_EDITOR_CONFIG } from '../../const/tinymce.const';
import { EditorService } from '../../services/editor/editor.service';
import { EditorControlComponent } from '../controls/public-api';
import { BehaviorSubject } from 'rxjs';
import { cloneDeep } from 'lodash';

/**  */
@Component({
  selector: 'app-editor-question',
  standalone: true,
  imports: [EditorControlComponent],
  templateUrl: './editor-question.component.html',
  styleUrls: ['./editor-question.component.scss'],
})
export class EditorQuestionComponent implements AfterViewInit, OnInit {
  /** Is readonly */
  @Input() readonly = false;
  /** Is display mode */
  @Input() displayMode = false;
  /** configuration of the editor */
  public config = cloneDeep(FIELD_EDITOR_CONFIG);
  /** editor */
  @ViewChild(EditorControlComponent)
  public editor!: EditorControlComponent;
  /** html content */
  public html = new BehaviorSubject<string | undefined>(undefined);
  /** editor loaded */
  public editorLoaded = new EventEmitter<boolean>();

  /**
   * Editor question component
   *
   * @param editorService shared editor service
   * @param cdr Angular change detector ref
   */
  constructor(editorService: EditorService, public cdr: ChangeDetectorRef) {
    this.config.base_url = editorService.url;
    this.config.language = editorService.language;
  }

  ngOnInit(): void {
    if (this.displayMode) {
      this.config.toolbar = false;
      this.config.menubar = false;
    } else {
      this.config.toolbar = FIELD_EDITOR_CONFIG.toolbar;
      this.config.menubar = FIELD_EDITOR_CONFIG.menubar;
    }
  }

  ngAfterViewInit() {
    this.editor.registerOnChange(() => {
      this.html.next(this.editor.editor.editor.getContent());
    });
  }
}
