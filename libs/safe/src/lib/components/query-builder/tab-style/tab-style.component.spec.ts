import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeTabStyleComponent } from './tab-style.component';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { AlertModule, ButtonModule, TableModule } from '@oort-front/ui';
import { SafeQueryStyleListComponent } from './query-style-list/query-style-list.component';
import { UntypedFormArray } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

describe('SafeTabStyleComponent', () => {
  let component: SafeTabStyleComponent;
  let fixture: ComponentFixture<SafeTabStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [TranslateService],
      declarations: [SafeTabStyleComponent, SafeQueryStyleListComponent],
      imports: [
        AlertModule,
        ButtonModule,
        TableModule,
        DragDropModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTabStyleComponent);
    component = fixture.componentInstance;
    component.query = { fields: [] };
    component.form = new UntypedFormArray([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
