import {
	gravatar as constructGravatarUrl,
	uiAvatar as constructUIAvatarUrl,
} from './avatar.helpers.js';

/**
 * @package
 * @param {string} url - expect `...?(s|size)=...`
 * @returns {number | undefined}
 */
function getSizeFromUrl(url) {
	const matchS = url.match(/s=(\d+)/g) ?? [];
	const matchSize = url.match(/size=(\d+)/g) ?? [];
	const match = [...matchS, ...matchSize].filter((m) => url[url.indexOf(m) - 1] !== '-');
	if (match) {
		return Number(match[0].split('=')[1]);
	}
	return undefined;
}

/**
 * @package
 * @param {string} url - expect `...?(name|email)=...`
 * @returns {string}
 */
function getAltFromUrl(url) {
	// match "name" or "email" query param from url
	const match = url.match(/(name|email)=([^&]+)/);
	if (match) {
		return match[2];
	}
	return '';
}

/**
 * @package
 * @template TValue
 * @param {TValue | null | undefined} value - value to check
 * @returns {value is TValue}
 */
function nonNullableFilter(value) {
	if (value === null || value === undefined) return false;
	return true;
}

/**
 * @package
 * @param {string | undefined} alt
 * @param {import('./types.public').AvatarProps['gravatar'] | undefined} gravatar
 * @param {import('./types.public').AvatarProps['uiAvatar'] | undefined} uiAvatar
 * @param {string | undefined } src
 * @returns {string}
 */
export function resolveAlt(
	alt = undefined,
	gravatar = undefined,
	uiAvatar = undefined,
	src = undefined,
) {
	if (alt) return alt;
	if (typeof gravatar === 'object' && gravatar.email) return gravatar.email;
	if (typeof gravatar === 'string' && gravatar) return gravatar;
	if (typeof uiAvatar === 'object' && uiAvatar.name) return uiAvatar.name;
	if (typeof uiAvatar === 'string') return uiAvatar;
	if (src) return getAltFromUrl(src);
	return '';
}

/**
 * @package
 * @param {number} fallback
 * @param {number | undefined} size
 * @param {string | undefined} src
 * @param {import('./types.public').AvatarProps['gravatar'] | undefined} gravatar
 * @param {import('./types.public').AvatarProps['uiAvatar'] | undefined} uiAvatar
 * @returns {number}
 */
export function resolveSize(
	fallback,
	size = undefined,
	src = undefined,
	gravatar = undefined,
	uiAvatar = undefined,
) {
	try {
		if (size) return size;
		if (gravatar && typeof gravatar === 'object' && gravatar.size) return gravatar.size;
		if (uiAvatar && typeof uiAvatar === 'object' && uiAvatar.size) return uiAvatar.size;
		if (src) return getSizeFromUrl(src) || fallback;
		return fallback;
	} catch (error) {
		console.error('[@svelte-put/avatar] error resolving avatar size', error);
		return fallback;
	}
}

/** @package */
export const DEFINITIVE_FALLBACK = 'https://www.gravatar.com/avatar?d=mp';
/**
 * @package
 * @param {string | undefined} src
 * @param {import('./types.public').AvatarProps['gravatar'] | undefined} gravatar
 * @param {import('./types.public').AvatarProps['uiAvatar'] | undefined} uiAvatar
 * @param {string | undefined} fallback
 * @returns {string[]}
 */
export function resolveSrc(
	src = undefined,
	gravatar = undefined,
	uiAvatar = undefined,
	fallback = undefined,
) {
	const rUIAvatar = uiAvatar ? constructUIAvatarUrl(uiAvatar) : null;
	/** @type {string | null} */
	let rGravatar = null;
	if (gravatar) {
		if (rUIAvatar || fallback) {
			if (typeof gravatar === 'object' && !gravatar.default) {
				gravatar.default = '404';
			} else {
				gravatar = /** @type {typeof gravatar} */ ({
					email: gravatar,
					default: '404',
				});
			}
		}
		rGravatar = constructGravatarUrl(gravatar);
	}

	return [src, rGravatar, rUIAvatar, fallback].filter(nonNullableFilter);
}
