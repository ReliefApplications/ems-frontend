import { DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NewsComponent } from './news/news.component';
import { ApplicationWidgetComponent } from './widgets/application-widget/application-widget.component';
import { ApplicationWidgetModule } from './widgets/application-widget/application-widget.module';
import { DashboardWidgetComponent } from './widgets/dashboard-widget/dashboard-widget.component';
import { DashboardWidgetModule } from './widgets/dashboard-widget/dashboard-widget.module';
import { FormWidgetComponent } from './widgets/form-widget/form-widget.component';
import { FormWidgetModule } from './widgets/form-widget/form-widget.module';
import { WorkflowWidgetComponent } from './widgets/workflow-widget/workflow-widget.component';
import { WorkflowWidgetModule } from './widgets/workflow-widget/workflow-widget.module';

@NgModule({
  declarations: [AppComponent, NewsComponent],
  imports: [
    BrowserModule,
    DashboardWidgetModule,
    FormWidgetModule,
    WorkflowWidgetModule,
    ApplicationWidgetModule,
  ],
  providers: [],
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {}

  ngDoBootstrap(): void {
    // Dashboard
    const dashboard = createCustomElement(DashboardWidgetComponent, {
      injector: this.injector,
    });
    customElements.define('dashboard-widget', dashboard);
    // Form
    const form = createCustomElement(FormWidgetComponent, {
      injector: this.injector,
    });
    customElements.define('form-widget', form);
    // Workflow
    const workflow = createCustomElement(WorkflowWidgetComponent, {
      injector: this.injector,
    });
    customElements.define('workflow-widget', workflow);
    // Application
    const application = createCustomElement(ApplicationWidgetComponent, {
      injector: this.injector,
    });
    customElements.define('application-widget', application);
  }
}
