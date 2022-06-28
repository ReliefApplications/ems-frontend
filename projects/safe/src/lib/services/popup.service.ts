import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable,
  Injector,
} from '@angular/core';
import { SafeMapPopupComponent } from '../components/widgets/map/map-popup/map-popup.component';

/** Service for getting the HTML of a map popup */
@Injectable({
  providedIn: 'root',
})
export class PopupService {
  /**
   * Service for getting the HTML of a map popup
   *
   * @param injector Angular injector
   * @param applicationRef Angular application ref
   * @param componentFactoryResolver Angular component factory resolver
   */
  constructor(
    private injector: Injector,
    private applicationRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  /**
   * Gets the HTMLElement of the markers popup from it's input data
   *
   * @param data The data displayed in the popup component
   * @param displayFields The fields of the record that should be displayed in the popup
   * @returns The HTML for the popup
   */
  getPopupHTML(data: any, displayFields: string[]): HTMLElement {
    // Create element
    const popup = document.createElement('safe-map-popup');

    // Create the component and wire it up with the element
    const factory = this.componentFactoryResolver.resolveComponentFactory(
      SafeMapPopupComponent
    );
    const popupComponentRef = factory.create(this.injector, [], popup);

    // Attach to the view so that the change detector knows to run
    this.applicationRef.attachView(popupComponentRef.hostView);

    // Set the message
    popupComponentRef.instance.data = data;
    popupComponentRef.instance.displayFields = displayFields;

    // Return rendered Component
    return popup;
  }
}
