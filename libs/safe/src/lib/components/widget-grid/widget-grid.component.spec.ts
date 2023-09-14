import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { SafeWidgetGridComponent } from './widget-grid.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { LayoutModule } from '@progress/kendo-angular-layout';

describe('SafeWidgetGridComponent', () => {
  let component: SafeWidgetGridComponent;
  let fixture: ComponentFixture<SafeWidgetGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      declarations: [SafeWidgetGridComponent],
      imports: [DialogCdkModule, ApolloTestingModule, LayoutModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeWidgetGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
