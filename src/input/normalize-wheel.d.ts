declare module 'normalize-wheel' {
  /**
   * Get normalized values of the scrollwheel event to be consistent between browsers and input device.
   * This code tries to resolve a single slow step on a wheel to 1. (This does not mean the result will be between -1 and 1, simply that a reasonably slow scroll will be approximately 1).
   *
   * @see {@link https://github.com/basilfx/normalize-wheel/blob/master/src/normalizeWheel.js Source Code on GitHub} for more info
   * @param event The wheel event to process.
   */
  function normalizeWheel(
    event: WheelEvent
  ): {
    /**
     * Normalized horizontal spin speed (use for zoom).
     * Positive is right; negative is left.
     */
    spinX: number;
    /**
     * Normalized vertical spin speed (use for zoom).
     * Positive is down; negative is up.
     */
    spinY: number;
    /**
     * Normalized horizontal distance (to pixels).
     * Positive is right; negative is left.
     */
    pixelX: number;
    /**
     * Normalized vertical distance (to pixels).
     * Positive is down; negative is up.
     */
    pixelY: number;
  };

  namespace normalizeWheel {
    /**
     * The best combination if you prefer spinX + spinY normalization.  It favors
     * the older DOMMouseScroll for Firefox, as FF does not include wheelDelta with
     * 'wheel' event, making spin speed determination impossible.
     */
    function getEventType(): 'wheel' | 'mousewheel' | 'DOMMouseScroll';
  }

  export = normalizeWheel;
}
