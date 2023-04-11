import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextDatasourceComponent } from './context-datasource.component';

describe('ContextDatasourceComponent', () => {
  let component: ContextDatasourceComponent;
  let fixture: ComponentFixture<ContextDatasourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextDatasourceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContextDatasourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
