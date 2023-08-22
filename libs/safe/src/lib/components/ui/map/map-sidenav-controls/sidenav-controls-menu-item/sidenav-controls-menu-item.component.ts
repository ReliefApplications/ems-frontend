import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ButtonModule, CheckboxModule } from '@oort-front/ui';

/** item for the layer menu */
@Component({
  selector: 'safe-sidenav-controls-menu-item',
  templateUrl: './sidenav-controls-menu-item.component.html',
  styleUrls: ['./sidenav-controls-menu-item.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule, CheckboxModule],
})
export class SidenavControlsMenuItemComponent implements OnInit, OnDestroy {
  // Declare variables to store the event listeners
  private addLayerListener!: L.LeafletEventHandlerFn;
  private removeLayerListener!: L.LeafletEventHandlerFn;
  @ViewChildren(SidenavControlsMenuItemComponent)
  childrenComponents: QueryList<SidenavControlsMenuItemComponent> =
    new QueryList();

  @Input() item!: L.Control.Layers.TreeObject;
  @Input() map!: L.Map;
  @Output() checkedChange = new EventEmitter();
  expanded = false;
  checked = false;
  indeterminate = false;

  ngOnInit(): void {
    if (this.item.children) {
      this.handleCheckedChange();
    } else
      this.checked =
        this.item.layer != null && this.map.hasLayer(this.item.layer);
    // Assign the event listeners to the variables
    this.addLayerListener = () => this.onAddLayer();
    this.removeLayerListener = () => this.onRemoveLayer();
    // Attach the event listeners
    this.item.layer?.on('add', this.addLayerListener);
    this.item.layer?.on('remove', this.removeLayerListener);
  }

  /**
   * Handle add layer event.
   */
  public onAddLayer() {
    this.checked = true;
    this.checkedChange.emit();
  }

  /**
   * Handle remove layer event.
   */
  public onRemoveLayer() {
    this.checked = false;
    this.checkedChange.emit();
  }

  handleCheckedChange = () => {
    const layers = this.getChildrenLayers();
    this.checked = layers.every((layer) => this.map.hasLayer(layer));
    if (!this.checked)
      this.indeterminate = layers.some((layer) => this.map.hasLayer(layer));
    if (this.checked) this.indeterminate = false;
    this.checkedChange.emit();
  };

  /** toggles expansion for menus with children */
  toggleExpansion() {
    this.expanded = !this.expanded;
  }

  /** ability to check/uncheck all children */
  updateChildren() {
    this.checked = !this.checked;

    this.updateChildrenCheckboxes();

    const layers = this.getChildrenLayers();
    if (this.checked) {
      layers.forEach((layer) => {
        (layer as any).shouldDisplay = true;
        this.map.addLayer(layer);
      });
    } else {
      layers.forEach((layer) => {
        (layer as any).shouldDisplay = false;
        this.map.removeLayer(layer);
      });
    }
    this.checkedChange.emit();
  }

  /** updates all children checkboxes for children */
  updateChildrenCheckboxes() {
    this.childrenComponents.forEach((childComponent) => {
      childComponent.updateChildrenCheckboxes();
    });
  }

  /**
   * extracts children layers from the node
   *
   * @returns the list of all extracted layers
   */
  getChildrenLayers() {
    const layers: L.Layer[] = [];

    /**
     * recursive to get the children
     *
     * @param layer layer to use either to add or to get children from
     */
    function traverse(layer: L.Control.Layers.TreeObject) {
      if (!layer.children) {
        if (layer.layer) {
          layers.push(layer.layer);
        }
      } else {
        layer.children.forEach((child) => {
          traverse(child);
        });
      }
    }

    traverse(this.item);
    return layers;
  }

  /**
   * toggles visibility of target layer
   *
   * @param layer layer to be toggled
   */
  updateLayer(layer: any) {
    if (layer) {
      // Manually set visibility of the layer
      // It has to be set BEFORE we call onAdd / onRemove methods of the layer
      // By doing that, we ensure that when zooming in / out, we keep the visibility status of the layer, regardless of its configuration
      layer.shouldDisplay = !this.checked;
      if (this.checked) {
        this.map.removeLayer(layer);
      } else {
        this.map.addLayer(layer);
      }
      this.checkedChange.emit();
    }
  }

  /**
   * Destroy subscriptions on leaflet events.
   */
  ngOnDestroy(): void {
    // Remove the event listeners
    this.item.layer?.off('add', this.addLayerListener);
    this.item.layer?.off('remove', this.removeLayerListener);
  }
}
