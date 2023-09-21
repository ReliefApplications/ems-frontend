import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebmapSelectComponent } from './webmap-select.component';

describe('WebmapSelectComponent', () => {
  let component: WebmapSelectComponent;
  let fixture: ComponentFixture<WebmapSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WebmapSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WebmapSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
