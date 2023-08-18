import { Component, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from './table.module';
import { TableWrapperDirective } from './table-wrapper.directive';
import { CellDirective } from './cell.directive';
import { CellHeaderDirective } from './cell-header.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { TableHeaderSortDirective } from './table-header-sort.directive';
import { By } from '@angular/platform-browser';

/**
 * Component for testing purposes
 */
@Component({
  standalone: true,
  template: `<table cdk-table uiTableWrapper [dataSource]="data">
    <ng-container cdkColumnDef="title">
      <th uiCellHeader *cdkHeaderCellDef scope="col">
        {{ 'common.title' | translate }}
      </th>
      <td uiCell *cdkCellDef="let element" class="!text-gray-900 !font-medium">
        {{ element.name }}
      </td>
    </ng-container>
    <ng-container cdkColumnDef="subscribedRoles">
      <th uiCellHeader *cdkHeaderCellDef scope="col">
        {{ 'common.role.few' | translate }}
      </th>
      <td uiCell *cdkCellDef="let element">
        <span> {{ element.lastName }} </span>
      </td>
    </ng-container>

    <ng-container cdkColumnDef="recordsCount">
      <th uiTableHeaderSort="count" uiCellHeader *cdkHeaderCellDef scope="col">
        Count
      </th>
      <td uiCell *cdkCellDef="let element">{{ element.count }}</td>
    </ng-container>

    <tr cdk-header-row *cdkHeaderRowDef="displayedColumns"></tr>
    <tr *cdkRowDef="let row; columns: displayedColumns" cdk-row></tr>
  </table>`,
  imports: [TranslateModule, TableModule],
})
class TestingComponent {
  @ViewChild(TableWrapperDirective)
  tableWrapperDirective!: TableWrapperDirective;
  @ViewChild(TableHeaderSortDirective)
  tableHeaderSortDirective!: TableHeaderSortDirective;
  @ViewChild(CellDirective) cellDirective!: CellDirective;
  @ViewChild(CellHeaderDirective) cellHeaderDirective!: CellHeaderDirective;

  public data: { name: string; lastName: string; count: number }[] = [
    { name: 'name1', lastName: 'lastName1', count: 1 },
    { name: 'name2', lastName: 'lastName2', count: 2 },
    { name: 'name3', lastName: 'lastName3', count: 3 },
  ];
  public displayedColumns: string[] = [
    'title',
    'subscribedRoles',
    'recordsCount',
  ];
}

describe('UI Table', () => {
  let fixture!: ComponentFixture<TestingComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestingComponent,
        TranslateTestingModule.withTranslations('en', {
          common: {
            title: 'Title',
            role: { few: 'Roles' },
          },
        }),
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(TestingComponent);
    fixture.detectChanges();
  });

  const CheckDirective = (directive: any) => {
    expect(directive).not.toBeNull();
    expect(directive).toBeTruthy();
  };

  it('should create an instance of TableWrapperDirective\n', () => {
    const directive = fixture.debugElement.query(
      By.directive(TableWrapperDirective)
    );
    CheckDirective(directive);
  });
  it('should create an instance of CellHeaderDirective\n', () => {
    const directive = fixture.debugElement.query(
      By.directive(CellHeaderDirective)
    );
    CheckDirective(directive);
  });
  it('should create an instance of CellDirective\n', () => {
    const directive = fixture.debugElement.query(By.directive(CellDirective));
    CheckDirective(directive);
  });
  it('should create an instance of TableHeaderSortDirective\n', () => {
    const directive = fixture.debugElement.query(
      By.directive(TableHeaderSortDirective)
    );
    CheckDirective(directive);
  });
});
