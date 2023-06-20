- Flush out basics
  - Shape
    - Start with no matrix, just a position
  - Scene
  - Renderer
    - Render sorted by position
    - Use existing Camera -> point3DToIsometric for projection
    - Time willing, add Cabinet projection support
- V2
  - Figure out the Typescript generics to get my new-free style working for all classes like I do for Vector3
    - Started conversation with GPT-4 [here](https://chat.openai.com/c/8123a35d-6a57-4529-b274-533849ace3f6), copy/pasted the first suggestion into utils/Newless.ts, but haven't tested it out
  - Matrix Class
    - Should we have a Matrix4x4 AND Matrix4x3 or just one?
  - Support more projections from
    - Cabinet for sure and maybe even the untilted version like in the Twitter thread I responded to recently
- V3
- Get serializing in early. Make basic tool to serialize a scene or object and make it easy to load in whole scenes, viewports, or object-level snapshots.

## Basic Architecture

- ViewPorts
  - Reference to Scene
  - Current Camera
- Frames
  - Should have a concept of Frames ala Figma, that you use to indicate export bounds? ViewPorts maybe suffice for now?
- Boards
  - Should we have a zoomable interface container officially supported?
- Scene
  - Camera
    - Owns Matrix
  - Shape
    - Owns Matrix
    - Owns Mesh
  - Group
    - For now I'm going to make Shapes and Groups distinct, as in Shapes are leaf nodes. This may not be worth breaking convention where everything can be nested in many engines.
- Renderer
  - Reference to ViewPorts
- ECS / Physics (TBD)