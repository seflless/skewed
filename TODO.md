- Flush out basics
  - Shape
    - Start with no matrix, just a position
  - Scene
  - Renderer
    - Render sorted by position
    - Use existing Camera -> point3DToIsometric for projection
    - Time willing, add Cabinet projection support
- V2
  - Matrix Class
    - Should we have a Matrix4x4 AND Matrix4x3 or just one?
  - Support more projections from
    - Cabinet for sure and maybe even the untilted version like in the Twitter thread I responded to recently

## Basic Architecture

- ViewPorts
  - Reference to Scene
  - Current Camera
- Scene
  - Camera
    - Owns Matrix
  - Shape
    - Owns Matrix
    - Owns Mesh
- Renderer
  - Reference to ViewPorts
- ECS / Physics (TBD)
