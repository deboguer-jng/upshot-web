# upshot-web

A robust and secure source of truth for a varienty of applications at the intersection of DeFi and NFTs.

## Design System link:

```bash
# From the upshot-ui directory
yarn link
cd node_modules/react
yarn link
cd ../react-dom
yarn link

# From the upshot-web directory
yarn link @upshot-tech/upshot-ui
yarn link react
yarn link react-doom
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
