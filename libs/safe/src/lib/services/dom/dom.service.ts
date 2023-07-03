import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
} from '@angular/core';

/**
 * Shared DOM service. Dom service is used to inject component on the go ( meaning without putting them in template directly ).
 * TODO: prefix
 */
@Injectable({
  providedIn: 'root',
})
export class DomService {
  /**
   * Shared DOM service. Dom service is used to inject component on the go ( meaning without putting them in template directly ).
   * TODO: prefix
   *
   * @param componentFactoryResolver Angular component factory resolver
   * @param applicationRef Angular application ref
   * @param injector Angular injector
   */
  constructor(
    // Needed as alternatives are either to provide viewContainerRef in app modules, or use it per component.
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector
  ) {}

  /**
   * Appends a component to html body.
   *
   * @param component Component to inject
   * @param parent parent element
   * @returns Ref of the new component
   */
  appendComponentToBody(component: any, parent: any): ComponentRef<any> {
    // create a component reference
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(component)
      .create(this.injector);

    // attach component to the appRef so that so that it will be dirty checked.
    this.applicationRef.attachView(componentRef.hostView);

    // get DOM element from component
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    parent.appendChild(domElem);
    return componentRef;
  }

  /**
   * Removes a component from the html body.
   *
   * @param componentRef Ref of the component to remove
   */
  removeComponentFromBody(componentRef: ComponentRef<any>): void {
    this.applicationRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}
