// Trim string to specified length, and add ellipsis if characters were removed
export function trimWithEllipsis(str, maxLen) {
	if (str.length <= maxLen) return str ;
	return str.substring(0, maxLen) + "..." ;
}