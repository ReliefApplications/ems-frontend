import { CommonModule } from '@angular/common';
import {
  Compiler,
  Component,
  ComponentFactoryResolver,
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
  compRef!: ComponentRef<any>;

  /**
   * Constructor for TableTemplateResolver directive
   *
   * @param cfr ComponentFactoryResolver
   * @param vcRef ViewContainerRef
   * @param compiler Angular compiler
   */
  constructor(
    private cfr: ComponentFactoryResolver,
    private vcRef: ViewContainerRef,
    private compiler: Compiler
  ) {}

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
    this.resolveStringTemplateOrComponent();
  }

  /**
   * Resolve the component creation and compile for literal strings of Angular components
   */
  resolveStringTemplateOrComponent() {
    let module: any;
    if (typeof this.uiTableTemplateResolver?.template === 'string') {
      const component = this.createDynamicComponent(
        this.uiTableTemplateResolver,
        this.uiTableTemplateResolverElement
      );
      module = this.createDynamicModule(component);
    } else {
      module = this.uiTableTemplateResolver?.template;
    }
    this.compiler
      .compileModuleAndAllComponentsAsync(module)
      .then((moduleWithFactories: ModuleWithComponentFactories<any>) => {
        const compFactory = moduleWithFactories.componentFactories[0];
        if (compFactory) {
          this.compRef = this.vcRef.createComponent(compFactory);
          this.updateProperties();
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  /**
   * Update instance properties
   *
   * @ TODO Only literal string templates are currently been updated, we have to add the @Inputs Angular components if needed
   */
  updateProperties() {
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
    // Remove any dangerous script tags from the template
    const cleanedTemplate = (column.template as string).replace(
      /<script>.*<\/script>/gi,
      ''
    );
    // eslint-disable-next-line jsdoc/require-jsdoc
    @Component({
      selector: 'ui-table-template',
      template: cleanedTemplate,
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
    /**
     * All the literal string templates given we assume that they only would
     * handle logics, directives and bindings from the Angular CommonModule
     *
     * If the literal strings contain more that that, related module should be placed here
     * Anyway, that should not happen, for more complex templates we can send a Component instance in the template
     */
    @NgModule({
      imports: [CommonModule],
      declarations: [component],
    })
    class DynamicModule {}
    return DynamicModule;
  }
}
