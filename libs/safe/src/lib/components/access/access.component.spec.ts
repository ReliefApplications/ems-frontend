import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeAccessComponent } from './access.component';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, TooltipModule } from '@oort-front/ui';

describe('SafeAccessComponent', () => {
  let component: SafeAccessComponent;
  let fixture: ComponentFixture<SafeAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeAccessComponent],
      imports: [
        DialogCdkModule,
        ButtonModule,
        TooltipModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
