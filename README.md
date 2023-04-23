# Skewed

Easily create pseudo 3D SVG elements.

- Supports the following styles of pseudo 3D
- Isometric
  - Other pseudo styles coming soon. (**TODO**)
- Built-in standard 3D shapes (**TODO**)
- Typescript-first package
- Utilities for
  - Transform 3D points to 2D ones (**TODO**)
  - Simple camera model and control scheme for navigating and zooming in/out (**TODO**)
- React support coming soon, core will be a Vanillar HTML/JS API (unless I change my mind and go React only) (**TODO**)

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
