// - Custom validators (with some wrapping of validator-library functions) -

import pkg from 'validator';
const { isAscii, isDecimal, isInt } = pkg;

// Any string
export function isString(value, minLen = 0, maxLen = +Infinity) {
	return ((typeof value) === 'string') && value.length >= minLen && value.length <= maxLen ;
}

// ASCII-only string
export function isAsciiString(value, minLen = 0, maxLen = +Infinity) {
	return isString(value, minLen, maxLen) && isAscii(value) ;
}

// E-mail address (permissive check)
export function isEmail(value, minLen = 0, maxLen = +Infinity) {
	return isString(value, minLen, maxLen) && (/[^\s]*@[a-z0-9.-]+/i.test(value)) ;
}

// String is one of the specified options (case sensitive)
export function isStringOneOf(value, opts) {
	return opts.includes(value) ;
}

// Number or numeric string
export function isNumeric(value, minValue = -Infinity, maxValue = +Infinity) {
	if ((typeof value) === 'number' && value >= minValue && value <= maxValue) return true ;
	if ((typeof value) !== 'string') return false ;

	if (isDecimal(value)) {
		const floatVal = parseFloat(value) ;
		if (floatVal >= minValue && floatVal <= maxValue) return true ;
	}
	return false ;
}

// Integer or integer string
export function isInteger(value, minValue = -Infinity, maxValue = +Infinity) {
	if ((typeof value) === 'number' && Math.floor(value) === value && value >= minValue && value <= maxValue) return true ;
	if ((typeof value) !== 'string') return false ;

	if (isInt(value)) {
		const intVal = parseInt(value) ;
		if (intVal >= minValue && intVal <= maxValue) return true ;
	}
	return false ;
}

// Boolean
export function isBoolean(value) {
	return ((typeof value) === 'boolean') ;
}

// Array of strings
export function isArrayOfStrings(arr) {
	if (!Array.isArray(arr)) return false ;

	for (const e of arr) {
		if (!isString(e)) return false ;
	}

	return true ;
}