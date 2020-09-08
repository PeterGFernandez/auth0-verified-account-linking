# Auth0 Tenant Configuration

This section of the repository contains files for [Auth0 Tenant](https://auth0.com/docs/getting-started/the-basics#account-and-tenants) configuration and asset definition. The files are organized to be used with the [Auth0 Deploy CLI tooling](https://auth0.com/docs/extensions/deploy-cli) using Directory format specification. Prior to deployment, there are aspects of configuration that will need to be customized and for each asset the specifics are discussed in the relevant section below. In general we also recommend that asset naming and/or associated asset description is also reviewed prior to deployment. **Note: depending on the age of your Auth0 Tenant you may also need to [Enabled seamless SSO](https://auth0.com/docs/dashboard/guides/tenants/enable-sso-tenant) in your Auth0 Tenant Settings**

## [`clients`](./clients)

This folder contains the [Auth0 Application](https://auth0.com/docs/applications) (a.k.a. Client) definitions, for the _Profile Managemnt_ client implemented external (to Auth0) as part of Verified Account Linking, and as described in the associated [design document](https://docs.google.com/document/d/149DypzRAUDK4ag4wzYBbL0_PwF9INcMkIBbfHkyKZNQ). Prior to deployment there are a number of specific aspects for each client definition that should be reviewed and customized:

- _**Allowed Callback URLs**_ (`callbacks`; see [Application Settings](https://auth0.com/docs/dashboard/reference/settings-application) for further details) should be modified, and `localhost` definitions should be replaced with the respective domain where each asset is hosted.

- _**Allowed Logout URLs**_ (`allowed_logout_urls`; see [Application Settings](https://auth0.com/docs/dashboard/reference/settings-application) for further details) should be modified, and `localhost` definitions should be replaced with the respective domain where each asset is hosted.

- _**Allowed Web Origins**_ (`allowed_origins`; see [Application Settings](https://auth0.com/docs/dashboard/reference/settings-application) for further details) should be modified, and `localhost` definitions should be replaced with the respective domain where each asset is hosted.

## [`resource-servers`](./resource-servers)

This folder contains the [Auth0 API](https://auth0.com/docs/apis) definition for the _Profile Managemnt API_ route(s) that forms part of the Profile Management for Verified Account Linking as described in the associated [design document](https://docs.google.com/document/d/149DypzRAUDK4ag4wzYBbL0_PwF9INcMkIBbfHkyKZNQ). Prior to deployment there is one specific aspect for the reseource server definition that should be reviewed and customized:

- _**Identifier**_ (`identifier`; see [API Settings](https://auth0.com/docs/dashboard/reference/settings-api) for further details) should be modified, and `localhost` definitions should be replaced. The identifier for an API is in URI format - this is not a URL to the API - and the recommendation would be to use your organizations domain name here as the replacement.


## [`rules`](./rules)

This folder contains the [Auth0 Rule](https://auth0.com/docs/rules) that essentially drives just-in-time Verified Account Linking as part of sign-in/sign-up, and described in the associated [design document](https://docs.google.com/document/d/149DypzRAUDK4ag4wzYBbL0_PwF9INcMkIBbfHkyKZNQ/edit#bookmark=id.2zd5mvs4taxv). Once deployed, the following Rule [Settings](https://auth0.com/docs/rules/guides/configuration#configure-values) will nedd to be configued:

- `DEBUG` (optional): set to `true` te enable debug logging via use of the Auth0 [Real-time Webtask Logs Extension](https://auth0.com/docs/extensions/realtime-webtask-logs).

- `PROFILE_CLIENT`: set to the **Client ID** of the _Profile Management_ Application definition in Auth0.

- `PROFILE_AUDIENCE`: set to the **API Audience** of the _Profile Management API_ definition in Auth0. Implementation will also use this value as the Namespace for the Profile Management [Custom Claims](https://auth0.com/docs/tokens/guides/create-namespaced-custom-claims) added to the [ID Token](https://auth0.com/docs/tokens/concepts/id-tokens) and [Access Token](https://auth0.com/docs/tokens/concepts/access-tokens).

- `PROFILE_REDIRECT`: set to the base URL of the proprietry Profile Management functionality implemented outside of Auth0 (e.g. `https://hipster.cevolution.co.uk/Profile`). Reference implementation expects the following organization of functionality under this URL (see [Profile Management](../Profile) for further details)

	- `client`: the [Profile Management Client](../Profile/client) 

## Issue Reporting

If you have found a bug or if you have a feature request, please report them via the issues section of this repository. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## License

This project is licensed under an MIT LICENSE. Please see the [LICENSE](../LICENSE) file for more info.

