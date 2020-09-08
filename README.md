# Auth0 Verified Account Linking

Consumer type scenarios often involve providing users with more than one option to authenticate. This offers customers great flexibility, and serves to reduce friction by mitigating the need to repetitively enter (personal) information. Use of social providers such as Facebook, Twitter or Google, will typically result in a smoother sign-up or sign-in (a.k.a. login) experience but can lead to frustration for a user if their account/profile changes depending on which provider they choose. Further, self-service typically provides users with the ability to change one or more aspects of their user profile (through some _MyAccount_/_MyProfile_ functionality, say) and providing some capability for some self-serviced account/profile association could, without the proper control, potentially lead to security vulnerabilities which could be exploited. 

Verified Account Linking workflow is provided as a customized extensibility solution, that leverages Auth0 functionality to address the sort of problems that can occur in unverified account link scenarios. For further information regarding this, or any other Auth0 customized extensibility provided, please feel free to get in touch. 

<div style="background-color:#fff7c9; color:#786600; margin-bottom:20px; padding:1rem 1.25rem">
	<div >
		<p>The Auth0 <a href="https://auth0.com/docs/extensions/account-link-extension">Account Link Extension</a> is provided out-of-box to handle the most typical workflow - which provides for the linking of user accounts during sign-up/sign-in. Use of the Account Link Extension is the recommended best practice, .</p>
</div></div>

## Design documentation

[Custom Implementation Services](https://auth0.com/docs/services/packages#-custom-implementation-package-) to support functionality not supported out-of-the-box are provided by Auth0 Professional Services, and a wide variety of services are offered to help address a number of use case scenarios. These services can be leveraged to provide you with a complete solution for Verified Account Linking - in either a stand-alone fashion or in conjunction with other customization. However we also provide you with full design documentation (see below) if you prefer to implement yourself.  

<div align="center">
  <a href="https://docs.google.com/document/d/149DypzRAUDK4ag4wzYBbL0_PwF9INcMkIBbfHkyKZNQ"><img src="./Verified%20Account%20Linking%20esign.png" alt="Verified Account Linking workflow in Auth0 - Design Document"></a>
</div>

Detailed design documentation (follow link above to access) provides you with a comprehensive set of information that is implementation agnostic. Using this, you and your team can implement Verified Account Linking workflow whatever the technology stack you currently, or indeed plan, to utilize. The information is provided free of charge and without warranty (either explicit or implied).    

## Reference implementation

This repository also contains reference implementation developed using [Node.js](https://nodejs.org/en/), and is provided to accelerate development. This implementation is provided free of charge and without warranty either explicit or implied.

### Profile Management

The [Profile](Profile) folder contains reference Node.js implementation that can be used as a basis to build out Profile Management functionality in order to support Verified Account Linking. For further details please refer to the [readme](Profile) contained in the folder.

### Auth0 Configuration

The [Tenant](tenant) folder contains reference Auth0 Tenant configuration and asset definitions that can be used as a basis to build out functionality in order to support Verified Account Linking. For further details please refer to the [readme](Tenant) contained in the folder.

## About Auth0

Auth0 is the flagship Platform-as-a-Service (PaaS) Identity and Access Management service from the company of the same name. Auth0 helps you to easily:

- authenticate using multiple identity providers, including social (e.g. Google, Facebook, Microsoft, LinkedIn, GitHub, Twitter, etc), or enterprise (e.g. Windows Azure AD, Google Apps, Active Directory, ADFS, SAML, etc),
- authenticate users via username/password, or passwordless mechanisms,
- implement multi-factor authentication,
- link multiple user identities to a single user account, 
- generate signed JSON Web Tokens to authorize API calls and flow user identity securely,
- access demographics and analytics, detailing how, when, and where users are logging in
- enrich user profiles from other data sources using customizable JavaScript Rules,
- and much, much more.
 
Go to [Auth0](https://auth0.com) and click Sign Up to create a free account.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them via the issues section of this repository. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## License

This project is licensed under an MIT LICENSE. Please see the [LICENSE](LICENSE) file for more info.

