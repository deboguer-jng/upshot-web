# upshot-web

A robust and secure source of truth for a varienty of applications at the intersection of DeFi and NFTs.

## Design System link:

In development, you will want to link this repo with the one containing the Upshot component library, and you can do so with the following commands. Note that the code example below assumes that `upshot-web` and `upshot-ui` both live in the same parent directory.

```bash
cd upshot-web
yarn install
cd node_modules/react
yarn link
cd ../react-dom
yarn link

cd ../../../upshot-ui
yarn link
yarn install
yarn link react
yarn link react-dom

cd ../upshot-web
yarn link @upshot-tech/upshot-ui
```

You should `yarn build` in `upshot-ui` before starting the `upshot-web` development server.

### Install dependencies

```bash
yarn
```

### Start development server

```bash
yarn dev
```

### Start storybook server

```bash
yarn storybook
```

### Fix code formatting

```bash
yarn lint
```

### Export Next.js SSG build

```bash
yarn build
```
