import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesSettingsComponent } from './categories-settings.component';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '@oort-front/ui';
import { UntypedFormArray } from '@angular/forms';

describe('CategoriesSettingsComponent', () => {
  let component: CategoriesSettingsComponent;
  let fixture: ComponentFixture<CategoriesSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoriesSettingsComponent],
      imports: [TranslateModule.forRoot(), IconModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesSettingsComponent);
    component = fixture.componentInstance;
    component.formArray = new UntypedFormArray([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
