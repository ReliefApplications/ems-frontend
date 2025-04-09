import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  ViewChild,
} from '@angular/core';
import { EditorControlComponent } from '../controls/public-api';
import { BehaviorSubject } from 'rxjs';
import { RawEditorOptions } from 'tinymce';

/**  */
@Component({
  selector: 'app-editor-question',
  standalone: true,
  imports: [EditorControlComponent],
  templateUrl: './editor-question.component.html',
  styleUrls: ['./editor-question.component.scss'],
})
export class EditorQuestionComponent implements AfterViewInit {
  /** Is readonly */
  @Input() readonly = false;
  /** configuration of the editor */
  @Input() config!: RawEditorOptions;
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
   * @param cdr Angular change detector ref
   */
  constructor(public cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.editor.registerOnChange(() => {
      this.html.next(this.editor.editor.editor.getContent());
    });
  }
}
