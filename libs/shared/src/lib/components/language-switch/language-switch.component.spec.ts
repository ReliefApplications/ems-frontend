import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LanguageSwitchComponent } from './language-switch.component';

describe('LanguageSwitchComponent', () => {
  let component: LanguageSwitchComponent;
  let fixture: ComponentFixture<LanguageSwitchComponent>;
  let translate: TranslateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [TranslateService],
      imports: [
        LanguageSwitchComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    translate = TestBed.inject(TranslateService);
    translate.addLangs(['en', 'fr', 'test']);
    translate.setDefaultLang('en');
  });

  beforeEach(() => {
    localStorage.clear();
    fixture = TestBed.createComponent(LanguageSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should only show other languages in the switcher', () => {
    expect(component.currentLanguage).toEqual('en');
    expect(component.languageOptions.map((option) => option.code)).toEqual([
      'fr',
      'test',
    ]);
  });

  it('should save selected language and reload the page', () => {
    const reloadSpy = jest
      .spyOn(component, 'reloadPage')
      .mockImplementation(() => undefined);

    component.onSelectLanguage('fr');

    expect(localStorage.getItem('lang')).toEqual('fr');
    expect(component.currentLanguage).toEqual('fr');
    expect(component.languageOptions.map((option) => option.code)).toEqual([
      'en',
      'test',
    ]);
    expect(reloadSpy).toHaveBeenCalledTimes(1);
  });

  it('should restrict the list to allowedLanguages plus the default language', () => {
    component.allowedLanguages = ['fr'];
    component.ngOnChanges({
      allowedLanguages: {
        previousValue: null,
        currentValue: ['fr'],
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    expect(component.languages).toEqual(['en', 'fr']);
    expect(component.languageOptions.map((option) => option.code)).toEqual([
      'fr',
    ]);
  });

  it('should show every language when allowedLanguages is not set', () => {
    expect(component.allowedLanguages).toBeNull();
    expect(component.languages).toEqual(['en', 'fr', 'test']);
  });

  it('should hide the switcher when only the default language is allowed', () => {
    component.allowedLanguages = [];
    component.ngOnChanges({
      allowedLanguages: {
        previousValue: null,
        currentValue: [],
        firstChange: false,
        isFirstChange: () => false,
      },
    });
    expect(component.languages).toEqual(['en']);
  });
});
