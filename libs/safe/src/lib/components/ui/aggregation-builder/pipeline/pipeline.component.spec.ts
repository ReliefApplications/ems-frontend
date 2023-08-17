import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormArray, UntypedFormBuilder } from '@angular/forms';
import { SafePipelineComponent } from './pipeline.component';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MenuModule } from '@oort-front/ui';
import { Observable } from 'rxjs';
import { CdkAccordionModule } from '@angular/cdk/accordion';

describe('SafePipelineComponent', () => {
  let component: SafePipelineComponent;
  let fixture: ComponentFixture<SafePipelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [UntypedFormBuilder, { provide: 'environment', useValue: {} }],
      declarations: [SafePipelineComponent],
      imports: [
        CdkAccordionModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        MenuModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafePipelineComponent);
    component = fixture.componentInstance;
    component.fields$ = new Observable();
    component.metaFields$ = new Observable();
    component.metaFields$ = new Observable();
    component.pipelineForm = new UntypedFormArray([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
