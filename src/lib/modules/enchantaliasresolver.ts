interface EnchantAliases {
	[enchantment: string]: string[];
}

import * as enchantAliasesData from "../../lib/assets/enchantaliases.json" assert { type: 'json' };
const enchantAliases = enchantAliasesData as EnchantAliases;

export function resolveEnchantAlias(str: string): string | null {
	for (const [key, aliases] of Object.entries(enchantAliases.default)) { // dont know why .default needed
		if (aliases.includes(str)) { // idk why all needed
			return key;
		}
	}
	return null;
}
