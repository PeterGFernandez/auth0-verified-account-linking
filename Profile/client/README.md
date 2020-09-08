# Profile Management Client

This section of the repository contains reference implementation for the Profile Management client functionality to be implemented external to Auth0. You can use this implementation as-is, or incorporate as part of your own/existing functionality in order to support Verfiried Account Linking in Auth0. Client reference implemetation is built as a [Node.js](https://nodejs.org/en/) application using [React](https://reactjs.org/). For a general overview of Profile Management functionality see the readme in the containing [folder](..) **Note: all implementation provided has been built and tested using Node.js version 12.18**

## Environment

The reference implementation provided is designed to be deployed within your own infrastructure - or at least within an infrastructure that is external to Auth0. Designed to be a executed as a client side app (i.e. run as a Single Page Application in the browser), reference implementation can be built using a Node.js build environment and then hosted using any CDN (Content Delivery Network) provider.

### Environment Variables

Whatever you choose to utilize, before building the reference implementation provided you will need to setup the Node.js build environment with the following environment variables, and support is provided for utilizing a [`.env`](https://www.npmjs.com/package/dotenv) file within your build environment. A sample environment has also been provided for convenience, which can also be used to populate the contents of an `.env` file:

```
REACT_APP_DEBUG=true
REACT_APP_AUTH0_DOMAIN=mytenant.eu.auth0.com
REACT_APP_AUTH0_CLIENTID=PmoGgLicuAYTXKS6bFqYl6e1Ui2t4utE
REACT_APP_PROFILE_AUDIENCE=https://myorg.com/profile
```

- `REACT_APP_DEBUG` (optional): set to `true` te enable debug logging via the Browser console.

- `REACT_APP_AUTH0_DOMAIN`: set to the **Domain** name of your Auth0 Tenant. If you are using a [Custom Domain](https://auth0.com/docs/custom-domains) for your Auth0 Tenant then it should be set this value. 

- `REACT_APP_AUTH0_CLIENTID`: set to the **Client ID** of the _Profile Management_ Application definition in Auth0 (see [Auth0 Tenant Configuration](../../Tenant) for more detais). 

- `REACT_APP_PROFILE_AUDIENCE`: set to the **API Audience** of the _Profile Management API_ definition in Auth0 (see [Auth0 Tenant Configuration](../../Tenant) for more detais). 

## Styling

The files [`src/index.css`](src/index.css), [`src/App.css`](src/App.css) and [`public/index.html`](public/index.html) can all be modified do customize the look and feel of the client SPA (Single Page Application). Changes should be made to these prior to performing a build. Use is also made of the [`react-stepzilla`](https://www.npmjs.com/package/react-stepzilla) component which supports a number of styling options and, additionally, the following files can be utilizied too:   

### `background.png`

A `background.png` file can also be placed into the [`public`](public) folder prior to build, which will allow you to customize the page background of the SPA (Single Page Application). Alternatively, the [`index`](public/index.html) file contained in the `public` folder can be modified and the HTML body style updated to reference an externally hosted background image. 

### `logo.png`

A `logo.png` file can also be placed into the [`public`](public) folder prior to build, which will allow you to customize the logo used on the SPA (Single Page Application) page. Alternatively, the [`index`](public/index.html) file contained in the `public` folder can be modified and the logo `div` in the HTML body updated to reference an externally hosted image.

### `favicon.ico`

A `favicon.ico` file can also be placed into the [`public`](public) folder prior to build, which will allow you to customize the shotcut icon used by the SPA (Single Page Application). Alternatively, the [`index`](public/index.html) file contained in the `public` folder can be modified and the shortcut icon link in the HTML header updated to reference an externally hosted icon.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them via the issues section of this repository. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## License

This project is licensed under an MIT LICENSE. Please see the [LICENSE](../LICENSE) file for more info.
