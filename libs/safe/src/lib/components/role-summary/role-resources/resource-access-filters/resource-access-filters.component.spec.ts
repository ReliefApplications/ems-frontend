import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeRoleResourceFiltersComponent } from './resource-access-filters.component';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule, IconModule } from '@oort-front/ui';

describe('SafeRoleResourceFiltersComponent', () => {
  let component: SafeRoleResourceFiltersComponent;
  let fixture: ComponentFixture<SafeRoleResourceFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      declarations: [SafeRoleResourceFiltersComponent],
      imports: [
        TranslateModule.forRoot(),
        HttpClientModule,
        ButtonModule,
        IconModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeRoleResourceFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
