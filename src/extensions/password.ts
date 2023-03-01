import crypto from 'crypto'
import type { GenerateOptions } from '../types/password.type.js';

const RANDOM_BATCH_SIZE = 256;

var randomIndex: number | undefined;
var randomBytes: Buffer;


const strictRules = [
		{ name: 'lowercase', rule: /[a-z]/ },
		{ name: 'uppercase', rule: /[A-Z]/ },
		{ name: 'numbers', rule: /[0-9]/ },
		{ name: 'symbols', rule: /[!@#$%^&*()+_\-=}{[\]|:;"/?.><,`~]/ }
];


const defaultOptions = [
	{
	  id: 0,
	  value: "🔴Too weak",
	  minDiversity: 0,
	  minLength: 0
	},
	{
	  id: 1,
	  value: "🟠 Weak",
	  minDiversity: 2,
	  minLength: 6
	},
	{
	  id: 2,
	  value: "🟡 Medium",
	  minDiversity: 4,
	  minLength: 8
	},
	{
	  id: 3,
	  value: "🟢 Strong",
	  minDiversity: 4,
	  minLength: 10
	}
]

async function getNextRandomValue() {
    if (randomIndex === undefined || randomIndex >= randomBytes.length) {
		randomIndex = 0;
		randomBytes = crypto.randomBytes(RANDOM_BATCH_SIZE);
	}

	var result = randomBytes[randomIndex];
	randomIndex += 1;

	return result;
}

async function randomNumber(max: number) {
	// gives a number between 0 (inclusive) and max (exclusive)
	var rand = await getNextRandomValue();
	while (rand >= 256 - (256 % max)) {
		rand = await getNextRandomValue();
	}
	return rand % max;
};

export async function generate(options: GenerateOptions, pool: string): Promise<string> {
    var password = ''
	var optionsLength = options.length!
	var poolLength = pool.length

    for (var i = 0; i < optionsLength; i++) {
        password += pool[await randomNumber(poolLength)]
    }

    if (options.strict) {
        var fitsRules = strictRules.every(function(rule) {
			// If the option is not checked, ignore it.
            //@ts-ignore
			if (options[rule.name] == false) return true;

			// Treat symbol differently if explicit string is provided
			if (rule.name === 'symbols' && typeof options[rule.name] === 'string') {
				// Create a regular expression from the provided symbols
				var re = new RegExp('['+options[rule.name]+']');
				return re.test(password);
			}

			// Run the regex on the password and return whether
			// or not it matches.
			return rule.rule.test(password);
		});

        if (!fitsRules) return await generate(options, pool);
    }

    return password;
}

export async function checkPasswordStrength(password: string, options = defaultOptions, allowedSymbols="!\"#\$%&'\(\)\*\+,-\./:;<=>\?@\[\\\\\\]\^_`\{|\}~") {
	let passwordCopy = password || ''
  
	options[0].minDiversity = 0,
	options[0].minLength = 0
  
	const rules = [
	  {
		regex: "[a-z]",
		message: 'lowercase'
	  },
	  {
		regex: '[A-Z]',
		message: 'uppercase'
	  },
	  {
		regex: '[0-9]',
		message: 'number'
	  },
	]
  
	if (allowedSymbols) {
	  rules.push({
		regex: `[${allowedSymbols}]`,
		message: 'symbol'
	  })
	}
  
	let strength = {
		contains : rules.filter(rule => new RegExp(`${rule.regex}`).test(passwordCopy)).map(rule => rule.message),
		length: passwordCopy.length
	}
  
	let fulfilledOptions = options
	  .filter(option => strength.contains.length >= option.minDiversity)
	  .filter(option => strength.length >= option.minLength)
	  .sort((o1, o2) => o2.id - o1.id)
	  .map(option => ({id: option.id, value: option.value}))
  
	const passwordStrength = {
		contains: strength.contains,
		length: strength.length,
		id: fulfilledOptions[0].id,
		value: fulfilledOptions[0].value
	}
	return passwordStrength;
}