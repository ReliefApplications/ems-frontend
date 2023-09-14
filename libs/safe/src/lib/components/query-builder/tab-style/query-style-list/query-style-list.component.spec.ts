import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormArray } from '@angular/forms';
import { SafeQueryStyleListComponent } from './query-style-list.component';
import { TableModule } from '@oort-front/ui';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';

describe('SafeQueryStyleListComponent', () => {
  let component: SafeQueryStyleListComponent;
  let fixture: ComponentFixture<SafeQueryStyleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeQueryStyleListComponent],
      imports: [TableModule, DragDropModule, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeQueryStyleListComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormArray([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
