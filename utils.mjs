export function ensurePresent(data, fields) {
	for (const field of fields) {
		if (data[field] === undefined || data[field] === null) return false ;
	}
	return true ;
}