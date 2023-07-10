import { Component, OnInit, Injector } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { NgElement, WithProperties } from '@angular/elements';
import { FormWidgetComponent } from './widgets/form-widget/form-widget.component';

/**
 * Root component of Web Widgets project.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'web-widgets';

  constructor(injector: Injector) {
    const form = createCustomElement(FormWidgetComponent, {
      injector: injector,
    });
    customElements.define('form-widget', form);
  }

  ngOnInit(): void {
    const formWidget = document.createElement('form-widget') as NgElement &
      WithProperties<{ id: string }>;
    document.getElementById('bodyPlaceholder')?.appendChild(formWidget);
  }
}
