_Todo: Move to using Linear or Github project to track tasks_

- ~~Flush out basics~~
  - ~~Shape~~
    - ~~Start with no matrix, just a position~~
  - ~~Scene~~
  - ~~Renderer~~
    - ~~Render sorted by position~~
    - ~~Use existing Camera -> point3DToIsometric for projection~~
    - ~~Time willing, add Cabinet projection support~~
- V2

  - Make Meshes dynamic and not shared
    - ~~BoxMesh takes width/height/depth~~
    - CylinderMesh
  - Add basic 3D arrow (arch like Tldraw)
  - Pause on worrying about lighting, just add strokes to add more clarity of shape

  - Figure out the Typescript generics to get my new-free style working for all classes like I do for Vector3
    - Started conversation with GPT-4 [here](https://chat.openai.com/c/8123a35d-6a57-4529-b274-533849ace3f6), copy/pasted the first suggestion into utils/Newless.ts, but haven't tested it out
  - Matrix Class
    - Should we have a Matrix4x4 AND Matrix4x3 or just one?
  - Add hierarchy support (Create Group class, let's distinguish between containers and elements)
  - Create a better example, like an office scene made out of all the components we have now (computer screen, keyboard), and etc
  - Flush out camera more
    - Proper projections of points
    - Get basic camera controls in (zoom/pan for fun)
    - RayCast basics
  - Support more projections from
    - Cabinet for sure and maybe even the untilted version like in the Twitter thread I responded to recently

- V3
  - Get serializing in early. Make basic tool to serialize a scene or object and make it easy to load in whole scenes, viewports, or object-level snapshots.
- Future versions
- create react renderer. ensure it works as a server component.

## Design Goals

- Makes 3D less intimidating by
  - Having opinionated visuals
    - Built in colors (for surfaces and lighting)
    - Built in lighting rigs (or just one)
    - Pre-made lighting
    - Sensible defaults
    - Built in shapes
      - Rect (with rounded corners)
      - Box
      - Arrows (3D and 2D)
        - Curved like Tldraw's
        - I'm interested in like surface sticking ones or even ones that hug walls like tape. Maybe Tape should be a type of thing.
      - Stickies
      - Cylinder
      - Cone
      - Sphere
      - Text (2D and 3D)
      - Icons
      - Embeddable SVG containers
      - Embeddable HTML containers (this might be a bad idea, but super helpful for integration into apps. Need to figure out if this is a renderer specific thing, and how does it play with exporters/renderers/interaction/file-format/editors model)
      - Extrusion support for 2D shapes
      - Easy way to attached
      - Billboards
      - Speech bubbles (type of billboard or 2D AND 3D?)
    - Cameras (orthographic only)
      - Cabinet
      - Isometric
    - Event system
    - Controls utils
      - Make a screen relative utility (make it easy to control characters relative to screen orientation, making 3D feel like 2D)
    - Simple math utils
      - Vector3
      - Matrix
      - Bezier
      - etc
      - Basic ray intersect at a minimum
    - Viewports
    - Board (Container of Viewports/Scenes? Maybe just use <Skewed>)
    - Clip/mask
    - Built in organizers/containers
      - Group (the usual)
      - Splat-likes (way to attach 2D/3D objects to other ones, maybe limited to only convex so that sort order is intuitive/easy-to-implement/performant)
      - Layers (container for 2D objects that you want to control the render order of as a group)
    - Basic 3D file format importer (with limits like only supporting flat shaded materials)
  - Great documentation
    - Lots of example code and pre-built components
  - Easy to reuse designs by others
  - Will include a really basic 3D editor where you can export/import simple designs
- Has a file format that is well designed and will be the basis of our editor and others
- Is headless by design but co-developed with the following renderers
  - canvas renderer (better for dynamically rendering)
  - imperative svg renderer (for use as internals of wrappers like react, vue, etc)
  - react based svg renderer
    - Ideally supporting server components (maybe no one wants this, if not, don't bother unless it's something we get mostly for free)
  - svg exporter
    - Generates clean SVG files that you'd want to use as is and/or edit after
    - Generates Figma compatible SVG (even better would be if we could support vector networks)
- Small foot print (generated svg wise and runtime size)

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

# Archived Todo

- Switch to focusing on imperative core that is react independent
  - Add sorting first and just of boxes initially
- Move to using Github project planning
- Add more core

  - Mesh
    - Points
    - Face
      - Indices
      - Fill? (Fallback to using parent's if not provided)
      - Normal?
      - Single/double-sided flag
    - How will we do colors or generalized material?
      - Start with a fixed color per Face and Shape Level
      - Maybe we don't go material style
    - Add more shapes
      - Rounded corner boxes
      - Floor
        - Grid, flat, invisible or what modes? Or should a grid be flexible and a Floor not exist or just be a wrapper around a Plane
        - Special case? Where it's just an infinite texture that we only have to transform 4 points of?
      - Create generators
        - Prismatics
          - Triangular Prism
          - Cylinder
            - Should we support arcs/donut hole ala what Figma does for ellipses?
        - Flat
          - Support rectangle, ellipse at a minimum
          - Text would be awesome, but should be deffered and be handled at the same time we add prismatic support too.
        - Conics (or is this just a pristmatic with a scalar for the top face's points)
          - Cones. (Do cones similarly to below)
            - https://twitter.com/kaihenthoiwane/status/1667122834060242945?s=46
  - Pick better colors for demoing/screenshots once mesh/face fill si in
  - Bounding primitives (stored in Mesh's coordinate system)
    - BoundingBox first
  - Basic collision utilities
    - Ray casting first. Use to demo an object picker
  - Add proper render loop
    - Add render sorting (initially just sort by center depth)
    - Figure out how we cache a Mesh transform?
  - Figure out how stroke/fill will work?
    - Different styles like: outline, wireframe, edges, and none?
  - Matrix and Group (alt name Frame)
  - Viewport (vs default one)
  - Lighting?
  - Camera

    - Input ray functionality
    - Add more projection styles
      <img src="docs/images/types-of-projection.png"/>

  - Quaternion?

- Move to pnpm and a monorepo
- Figure out react basics

  - Codevelop react approach with imperative API internals
  - Resolve type naming issues
    - Ie. Can't have Box type used like `<Box/>` and `Box()`. Should we use a built-in like `<box .../>` instead?

- Utilities for
  - Transform 3D points to 2D ones (**TODO**)
  - Simple camera model and control scheme for navigating and zooming in/out (**TODO**)
- React support coming soon, core will be a Vanillar HTML/JS API (unless I change my mind and go React only) (**TODO**)
