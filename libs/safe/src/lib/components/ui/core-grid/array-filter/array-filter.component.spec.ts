import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterService } from '@progress/kendo-angular-grid';
import { SafeArrayFilterComponent } from './array-filter.component';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

describe('SafeArrayFilterComponent', () => {
  let component: SafeArrayFilterComponent;
  let fixture: ComponentFixture<SafeArrayFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [FilterService],
      declarations: [SafeArrayFilterComponent],
      imports: [TranslateModule.forRoot(), DropDownsModule, ButtonsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeArrayFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
