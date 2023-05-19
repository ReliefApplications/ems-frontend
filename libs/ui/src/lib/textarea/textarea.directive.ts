import { Directive, Self, Optional, Input, AfterViewInit } from '@angular/core';
import { FocusableDirective } from '@progress/kendo-angular-grid';

/**
 * UI Textarea directive
 *
 * Inject kendoGridFocusable
 */
@Directive({
    selector: '[uiTextareaDirective]',
})
export class TextareaDirective {
    @Input() uiTextareaDirective!: void;
    constructor(@Self() @Optional() private kendoFocus: FocusableDirective){}
}