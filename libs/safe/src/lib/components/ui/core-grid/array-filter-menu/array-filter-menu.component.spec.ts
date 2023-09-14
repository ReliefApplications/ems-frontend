import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeArrayFilterMenuComponent } from './array-filter-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('SafeArrayFilterMenuComponent', () => {
  let component: SafeArrayFilterMenuComponent;
  let fixture: ComponentFixture<SafeArrayFilterMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeArrayFilterMenuComponent],
      imports: [
        TranslateModule.forRoot(),
        DropDownsModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeArrayFilterMenuComponent);
    component = fixture.componentInstance;
    component.filter = {
      logic: null,
      filters: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
