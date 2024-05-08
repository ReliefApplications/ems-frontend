import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { WIDGET_EDITOR_CONFIG } from '../../const/tinymce.const';
import { EditorService } from '../../services/editor/editor.service';
import { EditorControlComponent } from '../controls/public-api';
import { BehaviorSubject } from 'rxjs';

/**  */
@Component({
  selector: 'app-editor-question',
  standalone: true,
  imports: [EditorControlComponent],
  templateUrl: './editor-question.component.html',
  styleUrls: ['./editor-question.component.scss'],
})
export class EditorQuestionComponent implements AfterViewInit {
  /** configuration of the editor */
  public config = WIDGET_EDITOR_CONFIG;
  /** editor */
  @ViewChild(EditorControlComponent)
  public editor!: EditorControlComponent;
  /** html content */
  public html = new BehaviorSubject<string | undefined>(undefined);

  /**
   * Editor question component
   *
   * @param editorService shared editor service
   */
  constructor(editorService: EditorService) {
    this.config.base_url = editorService.url;
    this.config.language = editorService.language;
  }

  ngAfterViewInit() {
    this.editor.registerOnChange(() => {
      this.html.next(this.editor.editor.editor.getContent());
    });
  }
}
