import { Component, ComponentFactory, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { QueryBuilderService } from '../../services/query-builder.service';
import { MatAutocompleteSelectedEvent, MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import {FormControl} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

@Component({
  selector: 'safe-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss'],
  providers: [
    		{ provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] }
    	]
})
export class SafeQueryBuilderComponent implements OnInit {

  // === QUERY BUILDER ===
  public availableQueries?: Observable<any[]>;
  public availableFields: any[] = [];
  public availableFilters: any[] = [];
  public factory?: ComponentFactory<any>;

  public myControl = new FormControl();
  public listAvailableQueries: any[] = [];
  public filteredAvailableQueries?: Observable<string[]>;

  get availableScalarFields(): any[] {
    return this.availableFields.filter(x => x.type.kind === 'SCALAR');
  }

  @Input() form: FormGroup = new FormGroup({});
  @Input() settings: any;
  @Input() canExpand = true;

  // === FIELD EDITION ===
  public isField = false;
  @Output() closeField: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private formBuilder: FormBuilder,
    private queryBuilder: QueryBuilderService
  ) { }

  ngOnInit(): void {
    console.log(this.queryBuilder.availableQueries);
    // this.listAvailableQueries = [...this.queryBuilder.availableQueries]
    this.queryBuilder.availableQueries.forEach(element => this.listAvailableQueries.push(element));
    this.listAvailableQueries = this.listAvailableQueries[0];
    for (let i = 0; i < this.listAvailableQueries.length; i++){
      console.log(this.listAvailableQueries[i].name);
    //   let temp = this.listAvailableQueries[i].name;
      // this.listAvailableQueries[i] = "test";
    }
    console.log(this.listAvailableQueries);

    this.factory = this.componentFactoryResolver.resolveComponentFactory(SafeQueryBuilderComponent);
    if (this.form.value.type) {
      this.isField = true;
      this.availableFields = this.queryBuilder.getFieldsFromType(this.form.value.type)
        .filter(x => this.canExpand || x.type.kind !== 'LIST');
      if (this.form.get('filter')) {
        this.availableFilters = this.queryBuilder.getFilterFromType(this.form.value.type);
        this.form.setControl('filter',
          this.queryBuilder.createFilterGroup(this.form.value.filter, this.availableFilters));
      }
    } else {
      this.availableQueries = this.queryBuilder.availableQueries;
      this.availableQueries.subscribe((res) => {
        if (res) {
          this.availableFields = this.queryBuilder.getFields(this.form.value.name);
          this.availableFilters = this.queryBuilder.getFilter(this.form.value.name);
          this.form.setControl('filter', this.queryBuilder.createFilterGroup(this.form.value.filter, this.availableFilters));
        }
      });
      this.form.controls.name.valueChanges.subscribe((res) => {
        this.availableFields = this.queryBuilder.getFields(res);
        this.availableFilters = this.queryBuilder.getFilter(res);
        this.form.setControl('filter', this.queryBuilder.createFilterGroup(null, this.availableFilters));
        this.form.setControl('fields', this.formBuilder.array([]));
        this.form.setControl('sort', this.formBuilder.group({
          field: [''],
          order: ['asc']
        }));
      });
    }

      // this.availableQueries?.forEach(element => this.listAvailableQueries.push(element));
      // this.listAvailableQueries = this.listAvailableQueries[0];
      // // this.availableQueries?.forEach(element => console.log(element));
      // for (let i = 0; i < this.listAvailableQueries.length; i++){
      //   this.listAvailableQueries[i] = this.listAvailableQueries[i].name
      // }
      // console.log(this.listAvailableQueries);

      // this.filteredAvailableQueries = this.myControl.valueChanges.pipe(
      //   startWith(''),
      //   map(value => this._filter(value))
      // );
      // // console.log(this.form);
      // // console.log(this.form.controls.name)
      // // console.log(this.availableQueries?.source.BehaviourSubject)
      // console.log(this.form.get("name"));
      // this.myControl.valueChanges.subscribe(value => {
      //   // console.log(this.form.get("name"));
      //   this.form.get("name")?.setValue(String(value))
      //   console.log(this.form.get("name"));
      // });
  }

  onCloseField(): void {
    this.closeField.emit(true);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listAvailableQueries.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event);
  }

}





// import { Component, ComponentFactory, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output } from '@angular/core';
// import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
// import { Observable } from 'rxjs';
// import { QueryBuilderService } from '../../services/query-builder.service';
// import { map, startWith, filter } from 'rxjs/operators';
// import { MatAutocompleteSelectedEvent, MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
// import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
// import { element } from 'protractor';
// export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
//   return () => overlay.scrollStrategies.block();
// }

// export interface availableQ {
//   name: string;
// }

// @Component({
//   selector: 'safe-query-builder',
//   templateUrl: './query-builder.component.html',
//   styleUrls: ['./query-builder.component.scss'],
//   providers: [
// 		{ provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] }
// 	]
// })
// export class SafeQueryBuilderComponent implements OnInit {

//   // === QUERY BUILDER ===
//   public availableQueries?: Observable<any[]>;
//   public availableFields: any[] = [];
//   public availableFilters: any[] = [];
//   public factory?: ComponentFactory<any>;

//   public myControl = new FormControl();
//   public options: string[] = ['One', 'Two', 'Three'];
//   public filteredAvailableQueries?: Observable<any[]>;
//   public listAvailableQueries: any[] = [];

//   get availableScalarFields(): any[] {
//     return this.availableFields.filter(x => x.type.kind === 'SCALAR');
//   }

//   @Input() form: FormGroup = new FormGroup({});
//   @Input() settings: any;
//   @Input() canExpand = true;

//   // === FIELD EDITION ===
//   public isField = false;
//   @Output() closeField: EventEmitter<boolean> = new EventEmitter();

//   constructor(
//     private componentFactoryResolver: ComponentFactoryResolver,
//     private formBuilder: FormBuilder,
//     private queryBuilder: QueryBuilderService
//   ) { }

//   ngOnInit(): void {
//     this.factory = this.componentFactoryResolver.resolveComponentFactory(SafeQueryBuilderComponent);
//     if (this.form.value.type) {
//       this.isField = true;
//       this.availableFields = this.queryBuilder.getFieldsFromType(this.form.value.type)
//         .filter(x => this.canExpand || x.type.kind !== 'LIST');
//       if (this.form.get('filter')) {
//         this.availableFilters = this.queryBuilder.getFilterFromType(this.form.value.type);
//         this.form.setControl('filter',
//           this.queryBuilder.createFilterGroup(this.form.value.filter, this.availableFilters));
//       }
//     } else {
//       this.availableQueries = this.queryBuilder.availableQueries;
//       this.availableQueries.subscribe((res) => {
//         if (res) {
//           this.availableFields = this.queryBuilder.getFields(this.form.value.name);
//           this.availableFilters = this.queryBuilder.getFilter(this.form.value.name);
//           this.form.setControl('filter', this.queryBuilder.createFilterGroup(this.form.value.filter, this.availableFilters));
//         }
//       });
//       this.form.controls.name.valueChanges.subscribe((res) => {
//         this.availableFields = this.queryBuilder.getFields(res);
//         this.availableFilters = this.queryBuilder.getFilter(res);
//         this.form.setControl('filter', this.queryBuilder.createFilterGroup(null, this.availableFilters));
//         this.form.setControl('fields', this.formBuilder.array([]));
//         this.form.setControl('sort', this.formBuilder.group({
//           field: [''],
//           order: ['asc']
//         }));
//       });
//     }
//     this.availableQueries?.forEach(element => this.listAvailableQueries.push(element))
//     this.listAvailableQueries = this.listAvailableQueries[0]
//     console.log(this.availableQueries)
//     console.log(this.availableFields)
//     console.log(this.availableFilters)
//     console.log(this.availableScalarFields)
//     console.log(this.listAvailableQueries)
//     this.filteredAvailableQueries = this.myControl.valueChanges
//       .pipe(
//         startWith(''),
//         map(value => typeof value === 'string' ? value : value.name),
//         map(name => name ? this._filter(name) : this.options.slice())
//       );
//   }

//   displayFn(value: any): string {
//     return value && value.name ? value.name : '';
//   }

//   private _filter(name: string): any[] {
//     const filterValue = name.toLowerCase();
//     return this.options.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
//   }

//   selected(event: MatAutocompleteSelectedEvent): void {
//     console.log(event)
//   }


//   onCloseField(): void {
//     this.closeField.emit(true);
//   }
// }
