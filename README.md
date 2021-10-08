# upshot-web

A robust and secure source of truth for a varienty of applications at the intersection of DeFi and NFTs.

## Design System link:

In development, you will want to link this repo with the one containing the Upshot component library, and you can do so with the following commands.

Note: To reset your yarn linking configuration, first remove the `link` directory at `~/.config/yarn`.

```bash
git clone https://github.com/upshot-tech/upshot-web.git
cd upshot-web
yarn
cd node_modules/react
yarn link
cd ../react-dom
yarn link

cd ../../..
git clone https://github.com/upshot-tech/upshot-ui.git
cd upshot-ui
yarn link
yarn
yarn link react
yarn link react-dom
yarn build
```

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
