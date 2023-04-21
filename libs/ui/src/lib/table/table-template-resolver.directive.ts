import { CommonModule } from '@angular/common';
import {
  Compiler,
  Component,
  ComponentRef,
  Directive,
  Input,
  ModuleWithComponentFactories,
  NgModule,
  OnChanges,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { get } from 'lodash';
import { TableColumnDefinition } from './interfaces/table-column.interface';

/**
 * Directive that resolves table custom components if string or TemplateRef
 */
@Directive({
  selector: '[uiTableTemplateResolver]',
})
export class TableTemplateResolverDirective implements OnChanges {
  @Input() uiTableTemplateResolver!: TableColumnDefinition;
  @Input() uiTableTemplateResolverContext: any;
  @Input() uiTableTemplateResolverElement: any;
  // private cleanCompileString!: string;
  compRef!: ComponentRef<any>;

  /**
   * Constructor for TableTemplateResolver directive
   *
   * @param vcRef ViewContainerREf
   * @param compiler Angular compiler
   */
  constructor(private vcRef: ViewContainerRef, private compiler: Compiler) {}

  ngOnChanges() {
    if (!this.uiTableTemplateResolver?.template) {
      if (this.compRef) {
        this.updateProperties();
        return;
      }
      throw Error('You forgot to provide template');
    }

    this.vcRef.clear();
    this.compRef = null as unknown as ComponentRef<any>;

    const component = this.createDynamicComponent(
      this.uiTableTemplateResolver,
      this.uiTableTemplateResolverElement
    );
    const module = this.createDynamicModule(component);
    this.compiler
      .compileModuleAndAllComponentsAsync(module)
      .then((moduleWithFactories: ModuleWithComponentFactories<any>) => {
        const compFactory = moduleWithFactories.componentFactories.find(
          (x) => x.componentType === component
        );
        if (compFactory) {
          this.compRef = this.vcRef.createComponent(compFactory);
          // this.updateProperties();
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  /**
   * Update instance properties
   */
  updateProperties() {
    for (const prop in this.uiTableTemplateResolverContext) {
      this.compRef.instance[prop] = this.uiTableTemplateResolverContext[prop];
    }
    this.compRef.instance['dataAccessor'] =
      this.uiTableTemplateResolver.dataAccessor;
    this.compRef.instance['element'] = this.uiTableTemplateResolverElement;
  }

  /**
   * Create dynamic ui-table-template to render html string
   *
   * @param column Column definition
   * @param elementData element containing  the data
   * @returns TableTemplateComponent
   */
  private createDynamicComponent(
    column: TableColumnDefinition,
    elementData: any
  ) {
    // eslint-disable-next-line jsdoc/require-jsdoc
    @Component({
      selector: 'ui-table-template',
      template: column.template as string,
    })
    class TableTemplateComponent {
      get = get;
      element = elementData;
      dataAccessor = column.dataAccessor;
    }
    return TableTemplateComponent;
  }

  /**
   * Creates module of the dynamic component
   *
   *@param component Dynamic table render component
   *@returns ngModule
   */
  private createDynamicModule(component: Type<any>) {
    // eslint-disable-next-line jsdoc/require-jsdoc
    @NgModule({
      // You might need other modules, providers, etc...
      // Note that whatever components you want to be able
      // to render dynamically must be known to this module
      imports: [CommonModule],
      declarations: [component],
    })
    class DynamicModule {}
    return DynamicModule;
  }
}
