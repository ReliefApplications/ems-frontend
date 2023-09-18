import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import {
  CheckboxTreeComponent,
  TreeItemNode,
} from './checkbox-tree.component';

describe('CheckboxTreeComponent', () => {
  let component: CheckboxTreeComponent;
  let fixture: ComponentFixture<sharedCheckboxTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckboxTreeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxTreeComponent);
    component = fixture.componentInstance;
    component.checklist = {
      data: [],
      dataChange: new BehaviorSubject<TreeItemNode[]>([]),
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      initialize: () => {},
      buildFileTree: () => {
        const rst: TreeItemNode[] = [];
        return rst;
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
