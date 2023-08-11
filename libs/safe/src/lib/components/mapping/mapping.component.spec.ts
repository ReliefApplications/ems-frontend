import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeMappingComponent } from './mapping.component';
import { ButtonModule, DialogModule, TableModule } from '@oort-front/ui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UntypedFormArray } from '@angular/forms';

describe('SafeMappingComponent', () => {
  let component: SafeMappingComponent;
  let fixture: ComponentFixture<SafeMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [TranslateService],
      imports: [
        DialogModule,
        ButtonModule,
        TranslateModule.forRoot(),
        TableModule,
      ],
      declarations: [SafeMappingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeMappingComponent);
    component = fixture.componentInstance;
    component.mappingForm = new UntypedFormArray([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
