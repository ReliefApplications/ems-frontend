import {
  LocalizedInputComponent,
  SUPPORTED_LOCALES,
  getContentLocales,
} from './localized-input.component';

describe('getContentLocales', () => {
  it('only offers the supported locales enabled in the environment', () => {
    expect(
      getContentLocales({ availableLanguages: ['en', 'test', 'uk'] })
    ).toEqual(['en', 'uk']);
  });

  it('offers every supported locale without a usable environment', () => {
    expect(getContentLocales(null)).toEqual(SUPPORTED_LOCALES);
    expect(getContentLocales({ availableLanguages: ['test'] })).toEqual(
      SUPPORTED_LOCALES
    );
  });
});

describe('LocalizedInputComponent', () => {
  it('hides disabled locales but keeps their stored values on save', () => {
    const component = new LocalizedInputComponent({
      availableLanguages: ['uk', 'en'],
    });
    const onChange = jest.fn();
    component.registerOnChange(onChange);

    expect(component.locales).toEqual(['en', 'uk']);
    expect(component.activeLocale).toBe('en');

    component.writeValue({ en: 'Title', fr: 'Titre' });
    component.onInput('New title');

    expect(onChange).toHaveBeenCalledWith({ en: 'New title', fr: 'Titre' });
  });
});
