import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DomService {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef,
    private injector: Injector
  ) { }

  appendComponentToBody(component: any, element: any): ComponentRef<any> {
    // create a component reference
    const componentRef = this.componentFactoryResolver.resolveComponentFactory(component)
      .create(this.injector);

    // attach component to the appRef so that so that it will be dirty checked.
    this.applicationRef.attachView(componentRef.hostView);

    // get DOM element from component
    const domElem = (componentRef.hostView as EmbeddedViewRef < any > )
      .rootNodes[0] as HTMLElement;

    element.appendChild(domElem);

    return componentRef;
  }

  removeComponentFromBody(componentRef: ComponentRef<any>): void {
    this.applicationRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}
