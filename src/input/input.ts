import normalizeWheel from 'normalize-wheel';

interface KeyBindings {
  /**
   * Binding of keycode to an array of [ virtualKeyCodes ]
   */
  [keyCode: string]: string[];
}

interface KeyStates {
  /**
   * State of given key (true for active)
   */
  [virtualKeyCode: string]: {
    /**
     * Whether or not the key is currently being pressed.
     */
    down: boolean;

    /**
     * Whether or not the key is currently being held down instead of just pressed.
     */
    held: boolean;
  };
}

interface CursorState {
  // TODO: Make x, y, dx, dy based on in-game positions but also provide a non-game version
  // TODO: Improve performance!
  /**
   * Current horizontal position (in pixels) of the cursor relative to the game container.
   */
  x: number;
  /**
   * Current vertical position (in pixels) of the cursor relative to the game container.
   */
  y: number;
  /**
   * Change in horizontal position of the cursor (since last render frame) relative to the game container.
   */
  dx: number;
  /**
   * Change in vertical position of the cursor (since last render frame) relative to the game container.
   */
  dy: number;
  /**
   * Change in horizontal scrolling (since last update frame).
   * A reasonably slow scroll will be approximately 1.
   * Positive is right; negative is left.
   */
  scrollx: number;
  /**
   * Change in vertical scrolling (since last update frame).
   * A reasonably slow scroll will be approximately 1.
   * Positive is down; negative is up.
   */
  scrolly: number;
  /**
   * Whether or not the pointer is currently locked.
   */
  locked: boolean;
}

export class YaveInput {
  /**
   * Whether or not YaveInput should try to lock the cursor.
   */
  public lockCursor: boolean;

  private readonly _bindings: KeyBindings;

  private readonly _keys: KeyStates;

  private readonly _cursor: CursorState;
  // TODO: Touch events (simply add an extra set of event listeners)

  private _container: HTMLElement;

  /**
   * Current keys state.
   * Use this to get the current input state of registered key binds.
   */
  public get keys(): Readonly<KeyStates> {
    return this._keys;
  }

  /**
   * Current cursor state.
   */
  public get cursor(): Readonly<CursorState> {
    return this._cursor;
  }

  /**
   * Create an Input manager.
   * @param containerId The HTML #id of the container to handle input events from.
   * @param lockCursor Whether or not to automatically lock the cursor when clicking the game view.
   */
  constructor(containerId: string, lockCursor = true) {
    const container = document.getElementById(containerId);
    if (container === null)
      throw new Error(`Could not find an element with id ${containerId}`);
    this._container = container;

    this._bindings = {};
    this._keys = {};
    this.lockCursor = lockCursor;
    this._cursor = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      scrollx: 0,
      scrolly: 0,
      locked: false,
    };

    this.onKeyDownEvent = this.onKeyDownEvent.bind(this);
    this.onKeyUpEvent = this.onKeyUpEvent.bind(this);
    this.onMouseDownEvent = this.onMouseDownEvent.bind(this);
    this.onMouseUpEvent = this.onMouseUpEvent.bind(this);
    this.onMouseMoveEvent = this.onMouseMoveEvent.bind(this);
    this.onMouseWheelEvent = this.onMouseWheelEvent.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
    this.onClickContainer = this.onClickContainer.bind(this);
  }

  /**
   * Initialize the input system, registering all key event listeners.
   */
  public init(): void {
    window.addEventListener('keydown', this.onKeyDownEvent, false);
    window.addEventListener('keyup', this.onKeyUpEvent, false);
    // All mouse events are relative to this._container so that mouse x/y isn't offset if container isn't full screen
    this._container.addEventListener('mousedown', this.onMouseDownEvent, false);
    this._container.addEventListener('mouseup', this.onMouseUpEvent, false);
    this._container.addEventListener('mousemove', this.onMouseMoveEvent, false);
    this._container.addEventListener(
      normalizeWheel.getEventType() as any, // TypeScript doesn't like mousewheel & DOMMouseScroll
      this.onMouseWheelEvent
    );
    this._container.oncontextmenu = this.onContextMenu;
    this._container.addEventListener('click', this.onClickContainer, false);
  }

  /**
   * Update event, cleans up update-related values
   */
  public update(): void {
    this._cursor.scrollx = 0;
    this._cursor.scrolly = 0;
  }

  /**
   * Render event, cleans up rendering-related values
   */
  public render(): void {
    // If currently locked, but don't want it locked, stop it immediately
    if (this._cursor.locked === true && this.lockCursor === false) {
      document.exitPointerLock();
    }

    // Cursor movement is more "visible" so it's updated on render
    this._cursor.dx = 0;
    this._cursor.dy = 0;
  }

  /**
   * Clean up the input system, disabling all key event listeners.
   */
  public stop(): void {
    window.removeEventListener('keydown', this.onKeyDownEvent);
    window.removeEventListener('keyup', this.onKeyUpEvent);
    this._container.removeEventListener('mousedown', this.onMouseDownEvent);
    this._container.removeEventListener('mousemove', this.onMouseMoveEvent);
    this._container.removeEventListener(
      normalizeWheel.getEventType() as any, // TypeScript doesn't like mousewheel & DOMMouseScroll
      this.onMouseWheelEvent
    );
    this._container.oncontextmenu = null;
    this._container.removeEventListener('click', this.onClickContainer);
  }

  //#region Event Handler

  private getKeyCode(event: KeyboardEvent | MouseEvent): string {
    // Keyboard Press
    if (event instanceof KeyboardEvent) {
      // Space bar is weird and returns an actual space character
      if (event.key === ' ' || event.key === 'Spacebar') return 'space';

      return event.key.toLowerCase();
    }
    // Mouse Button Press
    else if (event instanceof MouseEvent) {
      return `mouse${event.button + 1}`;
    }

    return '';
  }

  private onKeyDownEvent(event: KeyboardEvent): boolean {
    const keyCode = this.getKeyCode(event);
    this.handleKeyEvent(keyCode, true);

    // TODO: Find a way to detect if modifier (meta/shift/alt) keys are being held down

    // Don't want to move between elements
    if (keyCode === 'tab') {
      event.preventDefault();
      return false;
    }
    return true;
  }

  private onKeyUpEvent(event: KeyboardEvent): boolean {
    const keyCode = this.getKeyCode(event);
    this.handleKeyEvent(keyCode, false);

    // Don't want to move between elements
    if (keyCode === 'tab') {
      event.preventDefault();
      return false;
    }
    return true;
  }

  private onMouseDownEvent(event: MouseEvent): void {
    const keyCode = this.getKeyCode(event);
    this.handleKeyEvent(keyCode, true);
  }

  private onMouseUpEvent(event: MouseEvent): void {
    const keyCode = this.getKeyCode(event);
    this.handleKeyEvent(keyCode, false);
  }

  private onMouseWheelEvent(event: WheelEvent | MouseWheelEvent): boolean {
    const wheelData = normalizeWheel(event);
    this._cursor.scrollx = wheelData.spinX;
    this._cursor.scrolly = wheelData.spinY;

    // Prevent scroll event from scrolling through webpage (rubberbanding and such)
    event.preventDefault();
    return false;
  }

  /**
   * Handle the state change of the key.
   * @param keyCode The key that is being modified.
   * @param state The state of the key being modified.
   */
  private handleKeyEvent(keyCode: string, state: boolean): void {
    const virtualKeyCodes = this._bindings[keyCode];

    if (virtualKeyCodes === undefined) return;

    for (const virtualKeyCode of virtualKeyCodes) {
      const previouslyDown = this._keys[virtualKeyCode].down;
      this._keys[virtualKeyCode] = {
        down: state,
        // Held only if it was previously down and it currently is down
        held: previouslyDown && state,
      };
    }
  }

  private onContextMenu(): boolean {
    // Cancel context menu if there's a binding for right mouse button
    if (this._bindings['mouse3'] !== undefined) {
      return false;
    }
    return true;
  }

  private onMouseMoveEvent(event: MouseEvent): void {
    this._cursor.dx += event.movementX ?? (event as any).mozMovementX ?? 0;
    this._cursor.dy += event.movementY ?? (event as any).mozMovementY ?? 0;
    this._cursor.x = event.clientX;
    this._cursor.y = event.clientY;
  }

  private onClickContainer(_event: MouseEvent): void {
    // When click game view & want pointer lock but not locked yet, try to lock
    if (this.lockCursor === true && this._cursor.locked === false) {
      this._container.requestPointerLock();
    }
  }

  //#endregion Event Handler

  /**
   * Register default key bindings.
   */
  public registerDefaultBindings(): void {
    this.addBinding('up', 'w', 'arrowup')
      .addBinding('down', 's', 'arrowdown')
      .addBinding('left', 'a', 'arrowleft')
      .addBinding('right', 'd', 'arrowright')
      .addBinding('fire', 'mouse1')
      .addBinding('alt', 'mouse3');
  }

  /**
   * Add a key binding.
   * @param name The name of the input binding.
   * @param keyCodes The keycodes for the keys that should trigger this binding.
   * @returns The current YaveInput object.
   */
  public addBinding(name: string, ...keyCodes: string[]): YaveInput {
    for (const keyCode of keyCodes.map((code: string) => code.toLowerCase())) {
      if (this._bindings[keyCode] === undefined) this._bindings[keyCode] = [];

      if (this._bindings[keyCode].indexOf(name) !== -1)
        throw new Error(
          `Input binding ${name} already exists for key ${keyCode}`
        );

      this._bindings[keyCode].push(name);
    }

    this._keys[name] = { down: false, held: false };

    return this;
  }

  /**
   * Remove an existing key binding.
   * @param name The name of the input binding to remove.
   * @returns The current YaveInput object.
   */
  public removeBinding(name: string): YaveInput {
    for (const virtualKeyCodes of Object.values(this._bindings)) {
      const index = virtualKeyCodes.indexOf(name);
      if (index !== -1) virtualKeyCodes.splice(index, 1);
    }

    delete this._keys[name];

    return this;
  }
}
