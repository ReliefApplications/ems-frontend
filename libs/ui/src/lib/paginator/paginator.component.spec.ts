import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginatorComponent } from './paginator.component';
import { PaginatorModule } from './paginator.module';
import { TranslateTestingModule } from 'ngx-translate-testing';

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;
  let fixture: ComponentFixture<PaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaginatorComponent],
      imports: [
        PaginatorModule,
        TranslateTestingModule.withTranslations('en', {
          components: {
            paginator: {
              page: 'Page',
              of: 'of',
              items: 'items',
              itemsPerPage: 'items per page',
            },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
