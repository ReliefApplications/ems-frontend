import {
  Directive,
  ElementRef,
  OnDestroy,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { SpinnerComponent } from '@oort-front/ui';
import { EditorComponent } from 'ngx-monaco-editor-v2';
import { Subject, takeUntil } from 'rxjs';

/**
 * Async Monaco editor directive.
 * Indicates loading of monaco editor.
 */
@Directive({
  selector: '[sharedAsyncMonacoEditor]',
  standalone: true,
})
export class AsyncMonacoEditorDirective implements OnDestroy {
  /** Destroy subject */
  private destroy$ = new Subject<void>();
  /** HTML Spinner element */
  private spinner!: HTMLElement;

  /**
   * Async Monaco editor directive.
   * Indicates loading of monaco editor.
   *
   * @param el Element reference
   * @param renderer Angular renderer
   * @param editor Reference to monaco editor component
   * @param viewContainerRef View container ref
   */
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private editor: EditorComponent,
    private viewContainerRef: ViewContainerRef
  ) {
    this.renderer.addClass(this.el.nativeElement, 'relative');
    this.createSpinner();
    this.editor.onInit.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.spinner.remove();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Create spinner element and add it on top of editor.
   */
  private createSpinner(): void {
    const spinnerWrapper: HTMLDivElement = this.renderer.createElement('div');
    this.renderer.addClass(spinnerWrapper, 'absolute');
    this.renderer.addClass(spinnerWrapper, 'top-0');
    this.renderer.addClass(spinnerWrapper, 'h-full');
    this.renderer.addClass(spinnerWrapper, 'w-full');
    this.renderer.addClass(spinnerWrapper, 'flex');
    const spinnerElement =
      this.viewContainerRef.createComponent(SpinnerComponent);
    this.renderer.appendChild(
      spinnerWrapper,
      spinnerElement.location.nativeElement
    );
    this.renderer.addClass(spinnerElement.location.nativeElement, 'm-auto');
    this.renderer.appendChild(this.el.nativeElement, spinnerWrapper);
    this.spinner = spinnerWrapper;
  }
}
