/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminLoginDto } from '../models/AdminLoginDto';
import type { AdminRegisterDto } from '../models/AdminRegisterDto';
import type { ChangePasswordDto } from '../models/ChangePasswordDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Initiate Google OAuth login
     *
     * Redirects to Google OAuth consent screen. After user authorizes, they are redirected to /api/auth/google/callback.
     *
     * **Usage**: Open this URL in a browser window to start the login flow.
     *
     * **Flow**:
     * 1. User clicks "Login with Google" in frontend
     * 2. Frontend redirects to this endpoint
     * 3. User completes Google OAuth consent
     * 4. Google redirects to /callback with auth code
     * 5. Backend exchanges code for tokens and sets cookies
     *
     * @returns void
     * @throws ApiError
     */
    public static authControllerGoogleAuth(): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/google',
            errors: {
                302: `Redirects to Google OAuth consent screen`,
            },
        });
    }
    /**
     * Google OAuth callback
     * Handles the OAuth callback from Google. Sets JWT tokens as HTTP-only cookies.
     * @returns any Authentication successful
     * @throws ApiError
     */
    public static authControllerGoogleAuthCallback(): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            accessToken?: string;
            refreshToken?: string;
            user?: {
                id?: string;
                email?: string;
                name?: string;
            };
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/google/callback',
        });
    }
    /**
     * Refresh access token
     *
     * Exchanges a valid refresh token for a new access token. The refresh token is read from the `refreshToken` HTTP-only cookie.
     *
     * **Note**: This endpoint reads the refresh token from cookies automatically. No request body needed.
     *
     * @returns any Token refreshed successfully
     * @throws ApiError
     */
    public static authControllerRefresh(): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/refresh',
            errors: {
                401: `Invalid or missing refresh token`,
            },
        });
    }
    /**
     * Get current user profile
     * Returns the authenticated user's profile information. Requires valid JWT token.
     * @returns any User profile retrieved successfully
     * @throws ApiError
     */
    public static authControllerGetCurrentUser(): CancelablePromise<{
        success?: boolean;
        data?: {
            id?: string;
            email?: string;
            name?: string;
            image?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/me',
            errors: {
                401: `Unauthorized - Invalid or missing token`,
            },
        });
    }
    /**
     * Logout user
     * Clears the access and refresh token cookies, effectively logging out the user.
     * @returns any Logged out successfully
     * @throws ApiError
     */
    public static authControllerLogout(): CancelablePromise<{
        success?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/logout',
        });
    }
    /**
     * Exchange Google token for JWT (Testing only)
     *
     * ⚠️ **TESTING ONLY**: This endpoint exchanges a Google access token for Kardio JWT tokens.
     *
     * **Important limitations**:
     * - Does NOT create a ConnectionAccount (no Gmail sync capability)
     * - Only creates/updates the User entity
     * - For full OAuth flow with Gmail access, use: `GET /api/auth/google`
     *
     * **Usage**: Send Google access token in Authorization header.
     *
     * @returns any Token exchange successful
     * @throws ApiError
     */
    public static authControllerExchangeGoogleToken(): CancelablePromise<{
        success?: boolean;
        message?: string;
        data?: {
            accessToken?: string;
            refreshToken?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/google/token',
            errors: {
                400: `Google token required`,
                401: `Invalid Google token`,
            },
        });
    }
    /**
     * Initiate mobile Google OAuth (Login)
     *
     * Redirects to Google OAuth consent screen for mobile app authentication (user login).
     *
     * **Flow**:
     * 1. Mobile app opens this URL in a browser/webview
     * 2. User completes Google OAuth consent
     * 3. Google redirects to `/google/mobile/callback`
     * 4. Backend redirects to mobile deep link with JWT tokens or error
     *
     * **JavaScript Example**:
     * ```javascript
     * // Simple usage (no state needed for login)
     * const url = '/api/auth/google/mobile';
     * Linking.openURL(url);
     * ```
     *
     * **Deep Link Response**:
     * - Success: `kardio://oauth-callback?status=success&accessToken=...&refreshToken=...&userId=...&email=...`
     * - Error: `kardio://oauth-callback?status=error&errorCode=...&errorMessage=...`
     *
     * @param state Optional state parameter passed to Google OAuth. Note: This is NOT returned in the callback deep link.
     * @returns void
     * @throws ApiError
     */
    public static authControllerGoogleMobileAuth(
        state?: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/auth/google/mobile',
            query: {
                'state': state,
            },
            errors: {
                302: `Redirects to Google OAuth consent screen`,
            },
        });
    }
    /**
     * Mobile Google OAuth callback
     *
     * Handles the OAuth callback from Google for mobile clients.
     *
     * **This endpoint is NOT called directly by mobile apps** - it's the redirect URI registered with Google.
     *
     * **Always responds with a 302 redirect** to the mobile deep link URL configured via `MOBILE_OAUTH_DEEP_LINK_URL` environment variable.
     *
     * **Success redirect**:
     * ```
     * kardio://oauth-callback?status=success&accessToken=...&refreshToken=...&userId=...&email=...
     * ```
     *
     * **Error redirect**:
     * ```
     * kardio://oauth-callback?status=error&errorCode=...&errorMessage=...
     * ```
     *
     * **React Native Example** (handling deep link):
     * ```javascript
     * import { Linking } from 'react-native';
     *
     * Linking.addEventListener('url', ({ url }) => {
         * if (url.startsWith('kardio://oauth-callback')) {
             * const params = new URL(url).searchParams;
             * if (params.get('status') === 'success') {
                 * const accessToken = params.get('accessToken');
                 * const refreshToken = params.get('refreshToken');
                 * // Store tokens and navigate to app
                 * } else {
                     * const errorCode = params.get('errorCode');
                     * // Handle error
                     * }
                     * }
                     * });
                     * ```
                     *
                     * **Error codes**:
                     * | Code | Description |
                     * |------|-------------|
                     * | `GOOGLE_ACCESS_DENIED` | User denied access |
                     * | `GOOGLE_AUTH_FAILED` | Authentication failed |
                     * | `MISSING_AUTH_CODE` | No authorization code received |
                     * | `GOOGLE_INVALID_REQUEST` | Invalid OAuth request |
                     * | `GOOGLE_SERVER_ERROR` | Google server error |
                     * | `GOOGLE_TEMPORARILY_UNAVAILABLE` | Google temporarily unavailable |
                     *
                     * @param code Authorization code from Google
                     * @param error Error code if OAuth failed
                     * @param errorDescription Error description from Google
                     * @returns void
                     * @throws ApiError
                     */
                    public static authControllerGoogleMobileCallback(
                        code?: string,
                        error?: string,
                        errorDescription?: string,
                    ): CancelablePromise<void> {
                        return __request(OpenAPI, {
                            method: 'GET',
                            url: '/api/auth/google/mobile/callback',
                            query: {
                                'code': code,
                                'error': error,
                                'error_description': errorDescription,
                            },
                            errors: {
                                302: `Redirects to mobile deep link with success status.
                                 **Deep link format**: \`kardio://oauth-callback?status=success&accessToken=...&refreshToken=...&userId=...&email=...\`
                                The mobile app should intercept this deep link and extract the JWT tokens for authentication.`,
                            },
                        });
                    }
                    /**
                     * Admin login with email/password
                     *
                     * Authenticate an admin user with email and password.
                     *
                     * **Important**: Only users with role=ADMIN can login via this endpoint.
                     * Regular users (CLIENT) should use OAuth via `GET /auth/google`.
                     *
                     * Returns JWT access and refresh tokens on successful authentication.
                     *
                     * @param requestBody
                     * @returns any Login successful
                     * @throws ApiError
                     */
                    public static adminAuthControllerLogin(
                        requestBody: AdminLoginDto,
                    ): CancelablePromise<{
                        success?: boolean;
                        message?: string;
                        data?: {
                            accessToken?: string;
                            refreshToken?: string;
                            user?: {
                                id?: string;
                                email?: string;
                                name?: string;
                                role?: 'ADMIN';
                            };
                        };
                    }> {
                        return __request(OpenAPI, {
                            method: 'POST',
                            url: '/api/auth/admin/login',
                            body: requestBody,
                            mediaType: 'application/json',
                            errors: {
                                401: `Invalid credentials`,
                                403: `User is not an admin`,
                            },
                        });
                    }
                    /**
                     * Register new admin (ADMIN only)
                     *
                     * Create a new admin user with email and password.
                     *
                     * **Requires**: Authenticated admin user (Bearer token).
                     *
                     * This endpoint is used from the admin dashboard to create new administrators.
                     *
                     * @param requestBody
                     * @returns any Admin created successfully
                     * @throws ApiError
                     */
                    public static adminAuthControllerRegister(
                        requestBody: AdminRegisterDto,
                    ): CancelablePromise<{
                        success?: boolean;
                        message?: string;
                        data?: {
                            accessToken?: string;
                            refreshToken?: string;
                            user?: {
                                id?: string;
                                email?: string;
                                name?: string;
                                role?: 'ADMIN';
                            };
                        };
                    }> {
                        return __request(OpenAPI, {
                            method: 'POST',
                            url: '/api/auth/admin/register',
                            body: requestBody,
                            mediaType: 'application/json',
                            errors: {
                                401: `Unauthorized`,
                                403: `Forbidden - requires ADMIN role`,
                                409: `Email already registered`,
                            },
                        });
                    }
                    /**
                     * Change admin password
                     *
                     * Change the password for the currently authenticated admin user.
                     *
                     * **Requires**: Authenticated admin user (Bearer token).
                     *
                     * This endpoint is used when:
                     * - Admin logs in for the first time with temporary password (mustChangePassword = true)
                     * - Admin wants to change their password voluntarily
                     *
                     * After successful password change, `mustChangePassword` is set to `false`.
                     *
                     * @param requestBody
                     * @returns any Password changed successfully
                     * @throws ApiError
                     */
                    public static adminAuthControllerChangePassword(
                        requestBody: ChangePasswordDto,
                    ): CancelablePromise<{
                        success?: boolean;
                        message?: string;
                    }> {
                        return __request(OpenAPI, {
                            method: 'POST',
                            url: '/api/auth/admin/change-password',
                            body: requestBody,
                            mediaType: 'application/json',
                            errors: {
                                401: `Current password is incorrect`,
                                403: `Forbidden - requires ADMIN role`,
                            },
                        });
                    }
                }
