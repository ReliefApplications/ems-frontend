import { init as initDropdown } from './dropdown-widget';
import { init as initTagbox } from './tagbox-widget';

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
