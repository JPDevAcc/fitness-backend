// Trim string to specified length, and add ellipsis if characters were removed
export function trimWithEllipsis(str, maxLen) {
	if (str.length <= maxLen) return str ;
	return str.substring(0, maxLen) + "..." ;
}

// Generate a zero-padded (non-cryptographic) random hex string of given length 
export function nonCryptoRandHexString(digits) {
	digits = Math.ceil(digits) ;
	if (digits >= 14) console.warn("Too many digits") ; // (can't calculate all values for 14 digits = 56 bits, or above)
	const randVal = getRandomInt(0, 16**digits) ;
	return randVal.toString(16).padStart(digits, '0') ;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min) ; // (max range without skipping values is -2^53 -> +2^53)
}