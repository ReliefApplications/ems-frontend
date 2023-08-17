import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterService } from '@progress/kendo-angular-grid';
import { SafeDropdownFilterComponent } from './dropdown-filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

describe('SafeDropdownFilterComponent', () => {
  let component: SafeDropdownFilterComponent;
  let fixture: ComponentFixture<SafeDropdownFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [FilterService],
      declarations: [SafeDropdownFilterComponent],
      imports: [TranslateModule.forRoot(), DropDownsModule, ButtonsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeDropdownFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
