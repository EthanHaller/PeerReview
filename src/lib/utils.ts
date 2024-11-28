import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getFirebaseErrorMessage = (code: string): string => {
	const errorMessages: Record<string, string> = {
		"auth/claims-too-large": "The claims payload provided exceeds the maximum allowed size of 1000 bytes.",
		"auth/email-already-in-use": "The provided email is already in use by an existing user.",
		"auth/email-already-exists": "The provided email is already in use by an existing user.",
		"auth/id-token-expired": "The provided Firebase ID token is expired.",
		"auth/id-token-revoked": "The Firebase ID token has been revoked.",
		"auth/insufficient-permission": "The credential used has insufficient permission to access the requested resource. Check your Firebase project setup.",
		"auth/internal-error": "The Authentication server encountered an unexpected error. Please try again later or report the issue.",
		"auth/invalid-argument": "An invalid argument was provided. Check the error details for more information.",
		"auth/invalid-claims": "The custom claim attributes provided are invalid.",
		"auth/invalid-continue-uri": "The continue URL must be a valid URL string.",
		"auth/invalid-creation-time": "The creation time must be a valid UTC date string.",
		"auth/invalid-credential": "Incorrect username or password.",
		"auth/invalid-disabled-field": "The value for the 'disabled' user property is invalid. It must be a boolean.",
		"auth/invalid-display-name": "The value for the displayName user property is invalid. It must be a non-empty string.",
		"auth/invalid-dynamic-link-domain": "The provided dynamic link domain is not configured or authorized for the project.",
		"auth/invalid-email": "The provided email address is invalid.",
		"auth/invalid-email-verified": "The value for the emailVerified user property is invalid. It must be a boolean.",
		"auth/invalid-hash-algorithm": "The hash algorithm must match one of the supported algorithms.",
		"auth/invalid-hash-block-size": "The hash block size must be a valid number.",
		"auth/invalid-hash-derived-key-length": "The hash derived key length must be a valid number.",
		"auth/invalid-hash-key": "The hash key must be a valid byte buffer.",
		"auth/invalid-hash-memory-cost": "The hash memory cost must be a valid number.",
		"auth/invalid-hash-parallelization": "The hash parallelization must be a valid number.",
		"auth/invalid-hash-rounds": "The hash rounds must be a valid number.",
		"auth/invalid-hash-salt-separator": "The hashing algorithm salt separator must be a valid byte buffer.",
		"auth/invalid-id-token": "The provided ID token is not a valid Firebase ID token.",
		"auth/invalid-last-sign-in-time": "The last sign-in time must be a valid UTC date string.",
		"auth/invalid-page-token": "The next page token in listUsers() is invalid. It must be a valid non-empty string.",
		"auth/invalid-password": "The provided password is invalid. It must have at least six characters.",
		"auth/invalid-password-hash": "The password hash must be a valid byte buffer.",
		"auth/invalid-password-salt": "The password salt must be a valid byte buffer.",
		"auth/invalid-phone-number": "The provided phone number is invalid. It must be a non-empty string in E.164 format.",
		"auth/invalid-photo-url": "The provided photoURL user property is invalid. It must be a string URL.",
		"auth/invalid-provider-data": "The providerData must be a valid array of UserInfo objects.",
		"auth/invalid-provider-id": "The providerId must be a valid supported provider identifier string.",
		"auth/invalid-oauth-responsetype": "Only one OAuth responseType should be set to true.",
		"auth/invalid-session-cookie-duration": "The session cookie duration must be a valid number between 5 minutes and 2 weeks.",
		"auth/invalid-uid": "The uid must be a non-empty string with at most 128 characters.",
		"auth/invalid-user-import": "The user record to import is invalid.",
		"auth/maximum-user-count-exceeded": "The maximum number of users to import has been exceeded.",
		"auth/missing-android-pkg-name": "An Android Package Name must be provided if the Android App is required.",
		"auth/missing-continue-uri": "A valid continue URL must be provided.",
		"auth/missing-hash-algorithm": "Importing users with password hashes requires the hashing algorithm to be provided.",
		"auth/missing-ios-bundle-id": "The request is missing a Bundle ID.",
		"auth/missing-uid": "A uid identifier is required for the operation.",
		"auth/missing-oauth-client-secret": "The OAuth client secret is required for OIDC code flow.",
		"auth/operation-not-allowed": "The sign-in provider is disabled for your project. Enable it in the Firebase console.",
		"auth/phone-number-already-exists": "The provided phone number is already in use by an existing user.",
		"auth/project-not-found": "No Firebase project was found for the provided credential. Check your project setup.",
		"auth/reserved-claims": "One or more custom claims are reserved and cannot be used.",
		"auth/session-cookie-expired": "The session cookie is expired.",
		"auth/session-cookie-revoked": "The session cookie has been revoked.",
		"auth/too-many-requests": "The number of requests exceeds the allowed limit. Please try again later.",
		"auth/uid-already-exists": "The provided uid is already in use by an existing user.",
		"auth/unauthorized-continue-uri": "The domain of the continue URL is not whitelisted. Add it in the Firebase console.",
		"auth/user-not-found": "No user record exists for the provided identifier.",
	}

	return errorMessages[code] || "An unknown error occurred. Please try again."
}
