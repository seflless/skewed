# Skewed

Easily create 3D SVG elements.

- Camera Projections
  - Isometric
- Built in shapes:
  - Box
  - Cylinder

<img width="50%" src="./docs/images/isometric.png" style="margin: 0px 25%"/>

# Usage

```sh
npm install skewed
```

**Coordinate System**

<img width="256" src="./docs/images/coordinate-system.png"/>

```ts
// TBD
```

## Contributing

#### Setup

```
git clone git@github.com:seflless/skewed.git
cd skewed
```

#### Watching

```
yarn dev
# Open the workbench page at http://localhost:3000/
```

#### Building

```
yarn build
```

#### Testing

**TBD**

#### Publishing to NPM

Do the usual npm version bump then publish.

```
npm version <major|minor|patch>
git push; git push --tags
npm publish
```

#### Test

Using vitest, the test are rerun whenever you change related code.

```
yarn test
```

#### Watch Tests

TODO: Do we need to put in a difference command for the CLI?

# Todo

- Move to using Github project planning
- Add more core

  - Mesh
    - Points
    - Face (Indices)
    - How will we do colors or generalized material?
      - Start with a fixed color per Face and Shape Level
      - Maybe we don't go material style
    - Add more shapes
      - Create generators
        - Prismatics
          - Triangular Prism
          - Cylinder
            - Should we support arcs/donut hole ala what Figma does for ellipses?
        - Flat
          -
        - Conics (or is this just a pristmatic with a scalar for the top face's points)
          - Cone
  - Bounding primitives (stored in Mesh's coordinate system)
    - BoundingBox first
  - Add proper render loop
    - Add render sorting (initially just sort by center depth)
    - Figure out how we cache a Mesh transform?
  - Figure out how stroke/fill will work?
    - Different styles like: outline, wireframe, edges, and none?
  - Matrix and Group (alt name Frame)
  - How is lighting going to work
  - Lighting?

  - Camera
  - Viewport (vs default one)
  - Quaternion?

- Figure out react basics
  - Codevelop react approach with imperative API internals
  - Resolve type naming issues
    - Ie. Can't have Box type used like `<Box/>` and `Box()`. Should we use a built-in like `<box .../>` instead?
- Add more projection styles

  <img src="docs/images/types-of-projection.png"/>

- Utilities for
  - Transform 3D points to 2D ones (**TODO**)
  - Simple camera model and control scheme for navigating and zooming in/out (**TODO**)
- React support coming soon, core will be a Vanillar HTML/JS API (unless I change my mind and go React only) (**TODO**)
