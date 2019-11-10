# yave

Yet Another Voxel Engine (written in TS).

## Goals

- Simple but powerful true [ECS (Entity-Component-Systems)](https://en.wikipedia.org/wiki/Entity_component_system) where components and systems are not coupled (unlike in Unity's current EC-system)
- Has all the basics to start making your own game, but is modular so you can replace things with your own systems
- Self-documenting code (along with generated docs) so you (almost) never have to meddle with the engine itself
- Uses modern ES standards for cleaner and fully-typed code
- Compiles to relatively new ES standards, I'm tired of supporting older browsers/versions

## TODO

- Fork `@trixt0r/ecs` b/c ECS systems need access to the engine itself, not just ECS
  - Also if I can integrate the "auto-setting UUID" that'd be better
- Might want to have both fixed timestep and frame-rate-based deltaTime (what I currently have) [See also](https://gafferongames.com/post/fix_your_timestep/)
  - Fixed timestep is useful for physics where you want movement to always be consistent (otherwise, your velocity will be dependent on how much your computer is lagging)
  - An article suggested two loops, one rendering which was based on requestForAnimationFrame and another that was fixed timestep for everything else.
- Add unit testing with jest
- Fix eslint/prettier ([maybe this](https://github.com/teppeis/eslint-config-teppeis))
- Create docs

## Research

- [ECS-TS by Trixt0r](https://github.com/Trixt0r/ecsts): Perhaps the best ECS system I've ever seen (although needs a bit of doc & typing corrections)
- [Nova Engine by holywyvern](https://github.com/nova-engine/ecs): Interesting TypeScript ECS System (with Family system) but somewhat lacking in docs
- [Blog Post by Stefan Valentin](http://ripplega.me/development/ecs-ez/) with great insight on extra features like assemblages
