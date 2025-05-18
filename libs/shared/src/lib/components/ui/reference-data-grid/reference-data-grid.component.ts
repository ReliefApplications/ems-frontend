import { Component, Inject, Input, OnInit, Optional } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  CardT,
  SummaryCardComponent,
} from '../../widgets/summary-card/summary-card.component';
import { PageChangeEvent } from '@progress/kendo-angular-pager';
import { SortDescriptor } from '@progress/kendo-data-query';
import { sortBy } from 'lodash';
import { CommonServicesService } from '../../../services/common-services/common-services.service';
import get from 'lodash/get';

/**
 * Default file name when exporting grid data.
 */
const DEFAULT_FILE_NAME = 'Common Services';

/**
 * Shared reference data grid component.
 */
@Component({
  selector: 'shared-reference-data-grid',
  templateUrl: './reference-data-grid.component.html',
  styleUrls: ['./reference-data-grid.component.scss'],
})
export class ReferenceDataGridComponent implements OnInit {
  /** Grid settings */
  @Input() settings: any = null;
  /** Data for the grid */
  public gridData: GridDataResult = { data: [], total: 0 };
  /** Available cards */
  public cards: CardT[] = [];
  /** Fields for the grid */
  public fields: any[] = [];
  /** Pagination: page size */
  public pageSize = 10;
  /** Pagination: skip number */
  public skip = 0;
  /** If the grid settings are loading */
  public loadingSettings = true;
  /** If the grid records are loading */
  public loadingRecords = true;
  /** Sort descriptor */
  public sort: SortDescriptor[] = [];
  /** Data for the gridData */
  private data: any[] = [];
  /** Can reference data be exported */
  public canExport = false;

  /** @returns current field used for sorting */
  get sortField(): string | null {
    return this.sort.length > 0 && this.sort[0].dir ? this.sort[0].field : null;
  }

  /** @returns current sorting order */
  get sortOrder(): string {
    return this.sort.length > 0 && this.sort[0].dir ? this.sort[0].dir : '';
  }

  /** @returns filename, from widget title, or default filename, and current date */
  get fileName(): string {
    const today = new Date();
    const formatDate = `${today.toLocaleString('en-us', {
      month: 'short',
      day: 'numeric',
    })} ${today.getFullYear()}`;
    const title = get(this.summaryCardComponent, 'widget.settings.title');
    return `${title ? title : DEFAULT_FILE_NAME} ${formatDate}`;
  }

  /**
   * Shared reference data grid component.
   *
   * @param summaryCardComponent Reference to parent summary card component
   * @param cs Common Services connector
   * @param environment Environment configuration
   */
  constructor(
    @Optional() public summaryCardComponent: SummaryCardComponent,
    private cs: CommonServicesService,
    @Inject('environment') private environment: any
  ) {}

  ngOnInit(): void {
    if (this.settings && this.settings.refDataCards) {
      this.cards = this.settings.refDataCards;
      //  Get fields
      this.settings.refDataCards[0].metadata.forEach((field: any) =>
        this.fields.push({
          // Remove white spaces to avoid kendo warnings
          name: field.name.replace(/\s/g, ''),
          title: field.name,
          type: field.type,
          meta: {
            type: this.getMetaTypeFromJson(field.type),
          },
          disabled: true,
          hidden: false,
          canSee: true,
        })
      );
      this.setGridData();
      // Set can export. Ref data must use CS & be of type graphql & use auth code connection
      this.canExport =
        (this.summaryCardComponent.refData?.type === 'graphql' &&
          this.summaryCardComponent.refData.apiConfiguration?.authType ===
            'authorizationCode' &&
          this.summaryCardComponent.refData.apiConfiguration?.endpoint?.startsWith(
            this.environment.csApiUrl
          )) ||
        false;
      this.loadingSettings = false;
    }
  }

  /**
   * Get meta type for grid based on json type
   *
   * @param type json type
   * @returns meta type
   */
  private getMetaTypeFromJson(type: string): string {
    switch (type) {
      case 'string':
        return 'text';
      case 'integer':
      case 'number':
        return 'numeric';
      case 'boolean':
        return 'boolean';
      default:
        return type;
    }
  }

  /**
   * Set grid data with the cards values
   */
  private setGridData(): void {
    this.data = this.cards.map((card: CardT) => {
      const rawValue = card.rawValue;
      const values: any = {};
      for (const key in rawValue) {
        values[key.replace(/\s/g, '')] = rawValue[key];
      }
      const cardData = {
        ...values,
        ...{ text: values },
      };
      return cardData;
    });
    const sortField = this.sortField;
    const sortOrder = this.sortOrder;
    if (sortField) {
      this.gridData = {
        data: (sortOrder === 'asc'
          ? sortBy(this.data, sortField)
          : sortBy(this.data, sortField).reverse()
        ).slice(0, this.pageSize),
        total: this.cards.length,
      };
    } else {
      this.gridData = {
        data: this.data.slice(0, this.pageSize),
        total: this.cards.length,
      };
    }
    this.loadingRecords = false;
  }

  /**
   * Detects pagination events and update the items loaded.
   *
   * @param event Page change event.
   */
  public onPageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageSize = event.take;
    const startIndex = event.skip;
    const endIndex = startIndex + event.take;
    const sortField = this.sortField;
    const sortOrder = this.sortOrder;
    if (sortField) {
      this.gridData = {
        data: (sortOrder === 'asc'
          ? sortBy(this.data, sortField)
          : sortBy(this.data, sortField).reverse()
        ).slice(startIndex, endIndex),
        total: this.cards.length,
      };
    } else {
      this.gridData = {
        data: this.data.slice(startIndex, endIndex),
        total: this.cards.length,
      };
    }
  }

  /**
   * Detects sort events and update the items loaded.
   *
   * @param sort Sort event.
   */
  public onSortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.skip = 0;
    this.onPageChange({ skip: this.skip, take: this.pageSize });
  }

  /**
   * On Export
   */
  public onExport() {
    if (this.summaryCardComponent) {
      if (
        this.summaryCardComponent.refData &&
        this.summaryCardComponent.refData.type === 'graphql'
      ) {
        const query = this.summaryCardComponent.refData.query;
        if (query) {
          const queryParams = this.summaryCardComponent.queryParams ?? {};
          this.cs.graphqlToExcel(`${this.fileName}.xlsx`, query, queryParams);
        }
      }
    }
  }
}
