import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceDatasComponent } from './reference-datas.component';

describe('ReferenceDatasComponent', () => {
  let component: ReferenceDatasComponent;
  let fixture: ComponentFixture<ReferenceDatasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReferenceDatasComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceDatasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
