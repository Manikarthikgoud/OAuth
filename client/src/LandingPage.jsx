import React from 'react'

export default function LandingPage() {
    return (
        <div>
            <h1 className='welcome-title'>
                Welcome to OAuth 2.0
            </h1>
            <div className='landingpage-container'>
                <h1 className='title'>
                    Authorizing for Web
                </h1>
                <p>
                    Web apps must obtain an access token to securely call Google APIs.
                </p>
                <p>
                    The Google Identity Services JavaScript library supports both authentication for user sign-in and authorization to obtain an access token for use with Google APIs. The library is intended only for use in browsers.
                </p>
                <p>
                    Authentication establishes who someone is, and is commonly referred to as user sign-up or sign-in. Authorization is the process of granting or rejecting access to data or resources. It includes obtaining and managing user consent, limiting the amount of data or resources shared with scopes, and retrieving an access token for use with Google APIs.
                </p>
                <p>
                    These guides cover authorization and data sharing topics.
                </p>
                <p>
                    How user authorization works describes the individual steps of user authorization in detail and includes user dialog examples.
                </p>
                <p>
                    If you are looking for help with authentication and how to implement user sign-up and sign-in see Sign In With Google.
                </p>

            </div>
            <div className='landingpage-container'>
                <h1 className='title'>
                    How user authorization works
                </h1>
                <p>
                    If you are new or unfamiliar with Google Identity Services or authorization, start by reading the Overview.
                </p>
                <p>
                    Google offers a JavaScript library which includes authorization features to help you to manage scopes, obtain user consent, and more easily work with standard OAuth 2.0 flows. Your web application, running in the user's browser, uses this library to manage the OAuth 2.0 implicit flow, or to start the authorization code flow which finishes on your backend platform.
                </p>

                <h2 className='sub-title'>
                    Authentication only scopes
                </h2>
                <p>
                    Several scopes are used only for user authentication: email, profile, and openid. If your app only uses these scopes, consider if a JWT ID Token and Sign In With Google for user sign-up and sign-in meets your needs. In most cases, this is the most straightforward and simple method available for user authentication.
                </p>
            </div>
        </div >
    )
}
