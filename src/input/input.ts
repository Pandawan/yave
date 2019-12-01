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
  [virtualKeyCode: string]: boolean;
}

interface CursorState {
  x: number;
  y: number;
  dx: number;
  dy: number;
  scrollx: number;
  scrolly: number;
}

export class YaveInput {
  // TODO: Pointer lock & scrolling
  private readonly _bindings: KeyBindings;

  private readonly _keys: KeyStates;

  private readonly _cursor: CursorState;

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
   */
  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (container === null)
      throw new Error(`Could not find an element with id ${containerId}`);
    this._container = container;

    this._bindings = {};
    this._keys = {};
    this._cursor = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      scrollx: 0,
      scrolly: 0,
    };
  }

  /**
   * Initialize the input system, registering all key event listeners.
   */
  public init(): void {
    window.addEventListener('keydown', this.onKeyDownEvent.bind(this));
    window.addEventListener('keyup', this.onKeyUpEvent.bind(this));
    // All mouse events are relative to this._container so that mouse x/y isn't offset if container isn't full screen
    this._container.addEventListener(
      'mousedown',
      this.onMouseDownEvent.bind(this)
    );
    this._container.addEventListener('mouseup', this.onMouseUpEvent.bind(this));
    this._container.addEventListener(
      'mousemove',
      this.onMouseMoveEvent.bind(this)
    );
    this._container.oncontextmenu = this.onContextMenu.bind(this);
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
    this._container.removeEventListener('mouseup', this.onMouseUpEvent);
    this._container.removeEventListener('mousemove', this.onMouseMoveEvent);
    this._container.oncontextmenu = null;
  }

  private onKeyDownEvent(event: KeyboardEvent): void {
    const keyCode = event.key.toLowerCase();
    this.handleKeyEvent(keyCode, true);
  }

  private onKeyUpEvent(event: KeyboardEvent): void {
    const keyCode = event.key.toLowerCase();
    this.handleKeyEvent(keyCode, false);
  }

  private onMouseDownEvent(event: MouseEvent): void {
    const keyCode = `mouse${event.button + 1}`;
    this.handleKeyEvent(keyCode, true);
  }

  private onMouseUpEvent(event: MouseEvent): void {
    const keyCode = `mouse${event.button + 1}`;
    this.handleKeyEvent(keyCode, false);
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
      this._keys[virtualKeyCode] = state;
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

    this._keys[name] = false;

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
