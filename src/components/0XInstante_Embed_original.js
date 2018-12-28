export const replaceZeroExContainer = (): void => {
    const originalContainer = document.querySelector('.zeroExInstantMainContainer');
  
    if (originalContainer) {
      const wrapper = document.getElementById(ZEROEX_CONTAINER_ID);
      const grandparent = originalContainer.parentNode!.parentNode;
  
      wrapper!.appendChild(originalContainer);
  
      (grandparent as any).remove();
    }
  };
  // The ID of the DOM element in which the `@0x/instant` widget should be mounted.
export const ZEROEX_CONTAINER_ID = 'ZeroEx';
private renderZeroExInstant() {
    const { zeroExInstant } = window as any;

    if (zeroExInstant) {
      zeroExInstant.render(
        {
          orderSource: ZEROEX_RELAYER
        },
        `#${ZEROEX_CONTAINER_ID}`
      );

      replaceZeroExContainer();
    }
  }