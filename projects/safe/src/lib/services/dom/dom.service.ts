import {
  ApplicationRef,
  ComponentRef,
  EmbeddedViewRef,
  Injectable,
  Injector,
  ViewContainerRef,
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
   * @param applicationRef Angular application ref
   * @param injector Angular injector
   * @param vcr view container ref
   */
  constructor(
    private applicationRef: ApplicationRef,
    private injector: Injector,
    private vcr: ViewContainerRef
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
    const componentRef = this.vcr.createComponent(component, {
      injector: this.injector,
    });

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
