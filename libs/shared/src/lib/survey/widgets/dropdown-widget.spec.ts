import { Subject, of } from 'rxjs';
import { init as initDropdown } from './dropdown-widget';
import { init as initTagbox } from './tagbox-widget';
import { setChoicesLoader } from './utils/choices-loader';

/**
 * Captures the widget object passed to a custom widget collection so its
 * lifecycle hooks ( afterRender / willUnmount ) can be exercised in isolation.
 *
 * @param initFn Widget init function ( dropdown or tagbox )
 * @returns The captured widget and the fake DomService it was given
 */
const captureWidget = (
  initFn: (domService: any, collection: any, document: any) => void
) => {
  const domService = { removeComponentFromBody: jest.fn() } as any;
  let widget: any;
  const collection = {
    // dropdown registers with addCustomWidget, tagbox with add
    addCustomWidget: (w: any) => (widget = w),
    add: (w: any) => (widget = w),
  } as any;
  initFn(domService, collection, document);
  return { widget, domService };
};

describe('select widgets willUnmount', () => {
  describe.each([
    ['dropdown', initDropdown],
    ['tagbox', initTagbox],
  ])('%s widget', (_name, initFn) => {
    it('destroys the Kendo ComponentRef appended through DomService', () => {
      const { widget, domService } = captureWidget(initFn as any);
      const componentRef = { id: 'kendo-ref' };
      const question: any = {
        destroy$: { next: jest.fn(), complete: jest.fn() },
        abortSignal: { abort: jest.fn() },
        _componentRef: componentRef,
      };

      widget.willUnmount(question);

      expect(domService.removeComponentFromBody).toHaveBeenCalledTimes(1);
      expect(domService.removeComponentFromBody).toHaveBeenCalledWith(
        componentRef
      );
      // The handle is cleared so a later unmount cannot double-destroy it.
      expect(question._componentRef).toBeUndefined();
    });

    it('does not throw when there is no ComponentRef to release', () => {
      const { widget, domService } = captureWidget(initFn as any);
      const question: any = {
        destroy$: { next: jest.fn(), complete: jest.fn() },
      };

      expect(() => widget.willUnmount(question)).not.toThrow();
      expect(domService.removeComponentFromBody).not.toHaveBeenCalled();
    });

    it('still clears the ComponentRef when removal throws', () => {
      const { widget, domService } = captureWidget(initFn as any);
      domService.removeComponentFromBody.mockImplementation(() => {
        throw new Error('already detached');
      });
      const question: any = {
        destroy$: { next: jest.fn(), complete: jest.fn() },
        _componentRef: { id: 'kendo-ref' },
      };

      expect(() => widget.willUnmount(question)).not.toThrow();
      expect(question._componentRef).toBeUndefined();
    });
  });
});

describe('dropdown widget with a choices loader', () => {
  /**
   * Builds a fake dropdown question, exposing what the widget relies on.
   *
   * @returns Fake question
   */
  const createFakeQuestion = () => {
    const callbacks: Record<string, () => void> = {};
    const properties: Record<string, any> = {};
    return {
      value: null,
      isReadOnly: false,
      isPrimitiveValue: true,
      visibleChoices: [],
      choices: [],
      placeholder: '',
      survey: { locale: '' },
      registerFunctionOnPropertyValueChanged: jest.fn(
        (name: string, func: () => void) => {
          callbacks[name] = func;
        }
      ),
      unRegisterFunctionOnPropertyValueChanged: jest.fn(),
      getPropertyValue: (name: string) => properties[name],
      setPropertyValue: (name: string, value: any) => {
        properties[name] = value;
        callbacks[name]?.();
      },
    } as any;
  };

  it('switches to server-side choices when the loader is set after the render', () => {
    const { widget, domService } = captureWidget(initDropdown as any);
    const combobox: any = {
      data: [],
      loading: true,
      disabled: true,
      filterChange: new Subject<string>(),
      opened: new Subject<void>(),
      registerOnChange: jest.fn(),
      wrapper: { nativeElement: { querySelector: () => null } },
    };
    domService.appendComponentToBody = jest.fn(() => ({ instance: combobox }));
    const question = createFakeQuestion();
    const parent = document.createElement('div');
    const el = document.createElement('div');
    parent.appendChild(el);

    // Rendered before the resource of the question is known
    widget.afterRender(question, el);
    expect(question._remoteChoices).toBeUndefined();
    expect(combobox.disabled).toBe(true);

    const loader = {
      load: jest.fn(() =>
        of({ items: [{ value: '1', text: 'One' }], totalCount: 1 })
      ),
      loadByValues: jest.fn(() => of([])),
    };
    setChoicesLoader(question, loader);

    expect(question._remoteChoices).toBeDefined();
    expect(loader.load).toHaveBeenCalledTimes(1);
    expect(combobox.data).toEqual([{ value: '1', text: 'One' }]);
    expect(combobox.disabled).toBe(false);
    expect(combobox.loading).toBe(false);
  });
});
