import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoQueryBuilderComponent } from './query-builder.component';

describe('WhoQueryBuilderComponent', () => {
  let component: WhoQueryBuilderComponent;
  let fixture: ComponentFixture<WhoQueryBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WhoQueryBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoQueryBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
