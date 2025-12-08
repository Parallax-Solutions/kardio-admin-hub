/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddBankDto } from '../models/AddBankDto';
import type { SyncOptionsDto } from '../models/SyncOptionsDto';
import type { ToggleBankDto } from '../models/ToggleBankDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ConnectionAccountsService {
    /**
     * Initiate OAuth flow to connect email account
     *
     * Starts the OAuth flow to connect a user's email account for transaction syncing.
     *
     * **Supported Providers**:
     * - `GMAIL` - Google Gmail accounts
     * - `OUTLOOK` - Microsoft Outlook/Office 365 accounts
     *
     * **Prerequisites**:
     * - User must be logged in (JWT token required via cookie or Authorization header)
     * - At least one bank ID must be provided
     *
     * **Flow**:
     * 1. Call this endpoint with provider and bankIds query params
     * 2. User is redirected to OAuth consent (Google or Microsoft)
     * 3. After authorization, provider redirects to /callback
     * 4. Connection account is created with encrypted tokens
     *
     * **Example URLs**:
     * - Gmail: `/api/connection-accounts/connect?provider=GMAIL&bankIds=bank_bac_cr`
     * - Outlook: `/api/connection-accounts/connect?provider=OUTLOOK&bankIds=bank_bac_cr`
     *
     * @param provider
     * @param bankIds
     * @returns void
     * @throws ApiError
     */
    public static connectionAccountsControllerInitiateConnect(
        provider: string,
        bankIds: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/connection-accounts/connect',
            query: {
                'provider': provider,
                'bankIds': bankIds,
            },
            errors: {
                302: `Redirects to OAuth consent (Google or Microsoft)`,
                400: `Missing required parameters`,
                401: `Unauthorized - Login required`,
            },
        });
    }
    /**
     * OAuth callback
     * Handles the OAuth callback from the email provider (Google or Microsoft). This endpoint is called after user authorization.
     * @param code
     * @param state
     * @param error
     * @returns any Connection account created successfully
     * @throws ApiError
     */
    public static connectionAccountsControllerOauthCallback(
        code: string,
        state: string,
        error: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/connection-accounts/callback',
            query: {
                'code': code,
                'state': state,
                'error': error,
            },
            errors: {
                400: `OAuth error, invalid state, invalid bank IDs, or email already connected to another account`,
            },
        });
    }
    /**
     * Get all connection accounts for current user
     *
     * Returns all email accounts (Gmail, Outlook) connected by the authenticated user.
     *
     * **Sorting**:
     * - `sortBy`: Field to sort by (email, provider, createdAt) - default: createdAt
     * - `sortOrder`: Sort order (asc, desc) - default: desc
     *
     * **Filters**:
     * - `provider`: Filter by email provider (gmail, outlook)
     * - `status`: Filter by connection status (active, inactive, error)
     * - `search`: Search by email address (partial match)
     *
     * **Response**: Wrapped in `ApiSuccessResponse` envelope with:
     * - `data`: Array of connection accounts
     * - `pagination`: null (connection accounts is a small list)
     * - `meta`: Applied filters and sort options
     *
     * @param sortBy Field to sort by
     * @param sortOrder Sort order
     * @param provider Filter by provider (e.g., gmail, outlook)
     * @param status Filter by connection status
     * @param search Search by email address (partial match)
     * @returns any List of connection accounts
     * @throws ApiError
     */
    public static connectionAccountsControllerFindAll(
        sortBy?: 'email' | 'provider' | 'createdAt',
        sortOrder: 'asc' | 'desc' = 'desc',
        provider?: string,
        status?: 'active' | 'inactive' | 'error',
        search?: string,
    ): CancelablePromise<{
        statusCode?: number;
        message?: string;
        data?: Array<{
            id?: string;
            email?: string;
            provider?: string;
            status?: string;
            createdAt?: string;
        }>;
        pagination?: null | null;
        meta?: {
            filters?: {
                provider?: string | null;
                status?: string | null;
                search?: string | null;
            };
            sort?: {
                sortBy?: string;
                sortOrder?: 'asc' | 'desc';
            };
        };
        path?: string;
        timestamp?: string;
        correlationId?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/connection-accounts',
            query: {
                'sortBy': sortBy,
                'sortOrder': sortOrder,
                'provider': provider,
                'status': status,
                'search': search,
            },
        });
    }
    /**
     * Get connection account by ID
     * Returns a single connection account by its ID.
     * @param id
     * @returns any Connection account details
     * @throws ApiError
     */
    public static connectionAccountsControllerFindOne(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/connection-accounts/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Connection account not found`,
            },
        });
    }
    /**
     * Delete connection account
     * Permanently deletes a connection account and revokes email access.
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static connectionAccountsControllerRemove(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/connection-accounts/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Connection account not found`,
            },
        });
    }
    /**
     * Trigger async sync for connection account
     *
     * Starts a background sync job to fetch transaction emails from the connected email provider (Gmail or Outlook).
     *
     * **How it works**:
     * 1. Call this endpoint to start syncing
     * 2. Returns immediately with status `SYNCING`
     * 3. Poll `GET :id/sync-status` to check progress
     * 4. When status is `COMPLETED`, transactions are available
     *
     * **Optional filters** (in request body):
     * - `afterDate`: Only sync emails after this date (ISO format)
     * - `beforeDate`: Only sync emails before this date (ISO format)
     *
     * @param id
     * @param requestBody
     * @returns any Sync started
     * @throws ApiError
     */
    public static connectionAccountsControllerSync(
        id: string,
        requestBody: SyncOptionsDto,
    ): CancelablePromise<{
        success?: boolean;
        data?: {
            status?: string;
            syncStartedAt?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/connection-accounts/{id}/sync',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get sync status for connection account
     *
     * Returns the current sync status. Poll this endpoint after triggering a sync.
     *
     * **Status values**:
     * - `IDLE`: No sync in progress
     * - `SYNCING`: Sync is running
     * - `COMPLETED`: Last sync completed successfully
     * - `FAILED`: Last sync failed (check syncError field)
     *
     * @param id
     * @returns any Sync status
     * @throws ApiError
     */
    public static connectionAccountsControllerGetSyncStatus(
        id: string,
    ): CancelablePromise<{
        success?: boolean;
        data?: {
            status?: string;
            syncStartedAt?: string;
            syncFinishedAt?: string;
            syncError?: string | null;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/connection-accounts/{id}/sync-status',
            path: {
                'id': id,
            },
        });
    }
    /**
     * List all banks for connection account
     * Returns all banks associated with this connection account, including their active status.
     * @param id
     * @returns any List of banks
     * @throws ApiError
     */
    public static connectionAccountsControllerListBanks(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/connection-accounts/{id}/banks',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Add bank to connection account
     * Associates a new bank with the connection account. The bank will be monitored for transaction emails during sync.
     * @param id
     * @param requestBody
     * @returns any Bank added successfully
     * @throws ApiError
     */
    public static connectionAccountsControllerAddBank(
        id: string,
        requestBody: AddBankDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/connection-accounts/{id}/banks',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bank already added or invalid bank ID`,
                404: `Bank not found`,
            },
        });
    }
    /**
     * Remove bank from connection account
     * Removes a bank from the connection account. Cannot remove the last bank.
     * @param id
     * @param bankId
     * @returns void
     * @throws ApiError
     */
    public static connectionAccountsControllerRemoveBank(
        id: string,
        bankId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/connection-accounts/{id}/banks/{bankId}',
            path: {
                'id': id,
                'bankId': bankId,
            },
            errors: {
                400: `Cannot remove the last bank`,
                404: `Bank not found in this connection account`,
            },
        });
    }
    /**
     * Toggle bank active status
     * Enables or disables a bank without removing it. Inactive banks are not synced.
     * @param id
     * @param bankId
     * @param requestBody
     * @returns any Bank status toggled
     * @throws ApiError
     */
    public static connectionAccountsControllerToggleBankStatus(
        id: string,
        bankId: string,
        requestBody: ToggleBankDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/connection-accounts/{id}/banks/{bankId}',
            path: {
                'id': id,
                'bankId': bankId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Initiate mobile OAuth flow to connect email account
     *
     * Starts the OAuth flow for mobile applications to connect a user's email account.
     *
     * **How it works**:
     * 1. Mobile app builds a base64-encoded state parameter containing userId, provider, and bankIds
     * 2. Mobile app opens this URL in a browser/WebView
     * 3. User is redirected to OAuth consent (Google or Microsoft)
     * 4. After authorization, user is redirected back to the mobile app via deep link
     *
     * **State Parameter**:
     * The state must be a base64-encoded JSON object:
     * ```json
     * {
         * "userId": "user_abc123",
         * "provider": "GMAIL",
         * "bankIds": ["bank_bac_cr", "bank_bncr"]
         * }
         * ```
         *
         * **JavaScript Example**:
         * ```javascript
         * const state = btoa(JSON.stringify({
             * userId: 'user_abc123',
             * provider: 'GMAIL',
             * bankIds: ['bank_bac_cr']
             * }));
             * const url = `/api/connection-accounts/mobile/connect?state=${encodeURIComponent(state)}`;
             * ```
             *
             * **Supported Providers**:
             * - `GMAIL` - Google Gmail accounts
             * - `OUTLOOK` - Microsoft Outlook/Office 365 accounts
             *
             * @param state Base64-encoded JSON containing userId, provider, and bankIds.
             *
             * Example decoded:
             * ```json
             * {
                 * "userId": "user_abc123",
                 * "provider": "GMAIL",
                 * "bankIds": ["bank_bac_cr"]
                 * }
                 * ```
                 * @returns void
                 * @throws ApiError
                 */
                public static connectionAccountsControllerMobileConnect(
                    state: string,
                ): CancelablePromise<void> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/connection-accounts/mobile/connect',
                        query: {
                            'state': state,
                        },
                        errors: {
                            302: `Redirects to OAuth consent (Google or Microsoft)`,
                        },
                    });
                }
                /**
                 * Mobile OAuth callback
                 *
                 * Handles the OAuth callback from the email provider for mobile applications.
                 *
                 * **This endpoint is NOT called directly by mobile apps** - it's the redirect URI registered with Google/Microsoft.
                 *
                 * **Success Response**:
                 * Redirects to deep link:
                 * ```
                 * kardio://connection-callback?status=success&connectionAccountId=conn_xyz&provider=GMAIL&email=user@gmail.com
                 * ```
                 *
                 * **Error Response**:
                 * Redirects to deep link:
                 * ```
                 * kardio://connection-callback?status=error&errorCode=OAUTH_ACCESS_DENIED&errorMessage=User%20denied%20access
                 * ```
                 *
                 * **Error Codes**:
                 * | Code | Description |
                 * |------|-------------|
                 * | `MISSING_STATE` | State parameter was not provided |
                 * | `INVALID_STATE` | State parameter could not be decoded |
                 * | `MISSING_AUTH_CODE` | OAuth provider didn't return an authorization code |
                 * | `OAUTH_ACCESS_DENIED` | User denied access |
                 * | `OAUTH_INVALID_REQUEST` | Invalid OAuth request |
                 * | `OAUTH_SERVER_ERROR` | OAuth provider server error |
                 * | `CONNECTION_FAILED` | Failed to create connection account |
                 *
                 * @param code Authorization code from OAuth provider
                 * @param state State parameter with encoded user info
                 * @param error Error code if OAuth failed
                 * @param errorDescription Error description from OAuth provider
                 * @returns void
                 * @throws ApiError
                 */
                public static connectionAccountsControllerMobileCallback(
                    code?: string,
                    state?: string,
                    error?: string,
                    errorDescription?: string,
                ): CancelablePromise<void> {
                    return __request(OpenAPI, {
                        method: 'GET',
                        url: '/api/connection-accounts/mobile/callback',
                        query: {
                            'code': code,
                            'state': state,
                            'error': error,
                            'error_description': errorDescription,
                        },
                        errors: {
                            302: `Redirects to success deep link (kardio://connection-callback?status=success&...)`,
                        },
                    });
                }
            }
