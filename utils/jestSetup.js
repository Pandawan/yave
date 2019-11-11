// Quick and Dirty setup to prevent pixijs from crashing jest
HTMLCanvasElement.prototype.getContext = jest.fn();
