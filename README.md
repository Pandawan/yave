# yave

Yet Another Voxel Engine (written in TS).

## Goals

- Simple but powerful true [ECS (Entity-Component-Systems)](https://en.wikipedia.org/wiki/Entity_component_system) where components and systems are not coupled (unlike in Unity's current EC-system)
- Has all the basics to start making your own game, but is modular so you can replace things with your own systems
- Self-documenting code (along with generated docs) so you (almost) never have to meddle with the engine itself
- Uses modern ES standards for cleaner and fully-typed code
- Compiles to relatively new ES standards, I'm tired of supporting older browsers/versions
- Not restricted to working with voxels (I know it's in the name, but I want to support both 2D & 3D)

## TODO

- Standardize JSDoc, some have space before params, some have JSDoc typings, etc.
- Standardize variable names (privates are or are not \_name, etc.)
- Add an internal unit system (like Unity where 1 unit can be 16px or 32px or however many you want based on texture)
- Add assemblages
- Create docs

## Research

### Notes

- RenderSystems should be used for anything that requires buttersmooth movement, camera, graphics, rendering, etc.
  - One edge case is making an object follow the mouse. This should be a render system since the mouse moves much faster than the "ticking speed," BUT any other kind of movement that requires a "set speed" (like player movement speed) should be handled by a normal system in order to get better/more predictable results and to prevent lag from impacting the behavior too much.

### ECS

- [ECS-TS by Trixt0r](https://github.com/Trixt0r/ecsts): Perhaps the best ECS system I've ever seen (although needs a bit of doc & typing corrections)
- [Nova Engine by holywyvern](https://github.com/nova-engine/ecs): Interesting TypeScript ECS System (with Family system) but somewhat lacking in docs
- [Blog Post by Stefan Valentin](http://ripplega.me/development/ecs-ez/) with great insight on extra features like assemblages

### Game Loop

- [Anatomy of a Game on MDN](https://developer.mozilla.org/en-US/docs/Games/Anatomy): A great example on how to write a JS game engine loop
- [GameLoop by sethvincent](https://github.com/sethvincent/gameloop/blob/master/index.js): Implementation of game loop for inspiration

### Inputs

- [Game Inputs by andyhall](https://github.com/andyhall/game-inputs): Good library for game inputs although uses old JS
- [Keydrown by Jeremy Kahn](https://jeremyckahn.github.io/keydrown/): Cool library with an inventive way of getting faster response for inputs
