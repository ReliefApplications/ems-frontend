import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormArray } from '@angular/forms';

import { QueryStyleListComponent } from './query-style-list.component';

describe('QueryStyleListComponent', () => {
  let component: QueryStyleListComponent;
  let fixture: ComponentFixture<QueryStyleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QueryStyleListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryStyleListComponent);
    component = fixture.componentInstance;
    component.form = new UntypedFormArray([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
