import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import {
  SafeCheckboxTreeComponent,
  TreeItemNode,
} from './checkbox-tree.component';
import { CdkTreeModule } from '@angular/cdk/tree';

describe('SafeCheckboxTreeComponent', () => {
  let component: SafeCheckboxTreeComponent;
  let fixture: ComponentFixture<SafeCheckboxTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeCheckboxTreeComponent],
      imports: [CdkTreeModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeCheckboxTreeComponent);
    component = fixture.componentInstance;
    component.checklist = {
      data: [],
      dataChange: new BehaviorSubject<TreeItemNode[]>([]),
      initialize: jest.fn(),
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
