import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmsTemplateComponent } from './ems-template.component';

describe('EmailTemplateComponent', () => {
  let component: EmsTemplateComponent;
  let fixture: ComponentFixture<EmsTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmsTemplateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
