# upshot-web

A robust and secure source of truth for a varienty of applications at the intersection of DeFi and NFTs.

## Design System link:

In development, you will want to link this repo with the one containing the Upshot component library, and you can do so with the following commands.

Note: To reset your yarn linking configuration, first remove the `link` directory at `~/.config/yarn`.

```bash
# Configure Upshot-Web
git clone https://github.com/upshot-tech/upshot-web.git
cd upshot-web && yarn
cd node_modules/react && yarn link
cd ../react-dom && yarn link
cd ../../..

# Configure Upshot-UI
git clone https://github.com/upshot-tech/upshot-ui.git
cd upshot-ui && yarn
yarn link react
yarn link react-dom
cd node_modules/@emotion/react && yarn link
cd ../styled && yarn link
cd ../../.. && yarn link
yarn build # Re-run to see latest upshot-ui version in upshot-web

# Link Upshot-UI <> Upshot-Web
cd ../upshot-web
yarn link @upshot-tech/upshot-ui
yarn link @emotion/react
yarn link @emotion/styled
```

### Install dependencies

```bash
yarn
```

### Start development server

```bash
yarn dev
```

### Fix code formatting

```bash
yarn lint
```

### Export Next.js SSG build

```bash
yarn build
```

### Shortcuts

Update the current branch and start development

```bash
yarn pulld
```

Checkout to the main branch of the repo, update, and start development

```bash
yarn maind
```

### ENV variables

You will need to copy the .env.example to a new .env file (these are ignored by the .gitignore list.)

In Next, all environment variables are bundled into the web app and should be considered public. We prefix these variables with NEXT_PUBLIC (see: https://nextjs.org/docs/basic-features/environment-variables#exposing-environment-variables-to-the-browser).

These are maintained by GitHub Actions: Repository secrets.

### GraphQL Playground

To explore the GraphQL API documentation and run queries to the staging and production environments, visit https://stage.api.upshot.io/graphql.

Staging:
https://stage.api.upshot.io/graphql

Production:
https://v2.client.upshot.io/graphql

### Deployments

We use GitHub Actions to deploy via Netlify. Previews are triggered by pull requests and updates to the main / staging branches.

The general recommended flow is to build the UI dependency first under a new version number. Once staging CI tests have passed and a manual audit has been performed, it can be queued for deployment to production via PR from staging to main.

### Rollbacks

Should a critical error be discovered immediately following deployment, navigate to the Production Deploys page for the app.upshot.xyz Site, select a previous (safe) build, then "Publish deploy."

