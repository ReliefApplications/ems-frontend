import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeTabPaginationComponent } from './tab-pagination.component';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '@progress/kendo-angular-icons';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { TooltipModule } from '@oort-front/ui';

describe('SafeTabPaginationComponent', () => {
  let component: SafeTabPaginationComponent;
  let fixture: ComponentFixture<SafeTabPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeTabPaginationComponent],
      imports: [
        TranslateModule.forRoot(),
        IconModule,
        FormsModule,
        ReactiveFormsModule,
        TooltipModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTabPaginationComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormGroup({ first: new UntypedFormControl() });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
