import type { Listing, Item, Enchant } from "../../lib/types.ts";
import { Currency } from "../../lib/types.ts";
import { resolveEnchantAlias } from "./enchantaliasresolver.ts";
import { collections } from "../../lib/modules/database.ts";
import { sendDiscordMessage } from "../../lib/modules/discordmessagesender.ts";

export function ingestTradingMessage(messageContent: string, messageAuthorId: string) {

	// trash parser incoming

	let parsedAnyInfoAboutItem = false;
	let sellingFlag = false;
	let buyingFlag = false;

	let messageLines = messageContent.split("\n");

	for (let line of messageLines) {
		console.log(`at line: ${line}`);

		let listing: Listing = {
			discordId: messageAuthorId,
			owner: "",
			pricePer: 999999999,
			currency: Currency.Gold,
			message: line,
			buying: buyingFlag ? true : false,
			ownershipVerified: false,
			item: {
				id: 1,
				dataVal: null,
				count: 1,
				name: null,
				lore: null,
				nonce: null,
				tier: null,
				lives: null,
				maxLives: null,
				color: null,
				enchants: null,
			},
		};

		for (let word of line.split(/\s+/)) {
			word = word.toLowerCase();
			console.log(`at word: ${word}, sellingFlag ${sellingFlag}, buyingFlag ${buyingFlag}, parsedAnyInfoAboutItem ${parsedAnyInfoAboutItem}`);
			if (word.startsWith("sell")) {
				sellingFlag = true;
				buyingFlag = false;
				listing.buying = false;
			}
			else if (word.startsWith("buy")) {
				sellingFlag = false;
				buyingFlag = true;
				listing.buying = true;
			}
			else if (word.endsWith("x") && word != "phoenix") {
				listing.item.count = parseInt(word.split("x")[0]);
			}
			else if (word == "for" || word == "bin") {
				let priceStr = line.split(word)[1];
				console.log(`got price string: ${priceStr}`);
				let separatedPriceInfo = separatePriceInfo(priceStr.replaceAll(" ", ""));
				console.log(`got price info: ${JSON.stringify(separatedPriceInfo)}`);
				if (separatedPriceInfo) {
					listing.pricePer = separatedPriceInfo.numbers;
					let attemptMatchCurrency = matchCurrency(separatedPriceInfo.letters);
					if (attemptMatchCurrency) {
						listing.currency = attemptMatchCurrency;
						console.log(`matched currency successfully as ${attemptMatchCurrency}, breaking`);
						break;
					}
					else {
						console.log("failed to match currency");
					}
				}
			}
			else {
				let resolvedEnchantName = resolveEnchantAlias(stripNumbersFromEnd(word));
				if (resolvedEnchantName) {
					let enchantLevel = 0;
					let parsedEnchantLevel = getNumbersAtEndOfString(word);
					if (parsedEnchantLevel) {
						enchantLevel = parsedEnchantLevel;
					}
					let parsedEnchant = {
						key: resolvedEnchantName,
						level: enchantLevel,
					} as Enchant;
					if (listing.item.enchants == null) {
						listing.item.enchants = [];
					}
					listing.item.enchants.push(parsedEnchant);
					parsedAnyInfoAboutItem = true;
					console.log(`resolved enchant successfully as ${resolvedEnchantName} ${enchantLevel}`);
				}
			}
		}

		if (parsedAnyInfoAboutItem && (sellingFlag || buyingFlag)) {
			console.log("listing:");
			console.log(JSON.stringify(listing, null, 4));
			if (collections.listings && process.env.node_env == "production") {
				collections.listings.insertOne(listing);
				sendDiscordMessage("log-newlistings", "new listing from discord:\n```json\n" + JSON.stringify(listing, null, 4) + "```");
			}
		}
	}
}

function stripNumbersFromEnd(s: string): string {
	return s.replace(/\d+$/, '');
}

function getNumbersAtEndOfString(input: string): number | null {
	const match = input.match(/\d+$/);
	return match ? parseInt(match[0], 10) : null;
}

function matchCurrency(input: string): Currency | undefined {
	const normalizedInput = input.toLowerCase();

	let matchedKey = Object.keys(Currency).find(key => 
		Currency[key as keyof typeof Currency].toLowerCase() === normalizedInput
	);

	if (!matchedKey && normalizedInput.endsWith('s')) {
		const inputWithoutS = normalizedInput.slice(0, -1);
		matchedKey = Object.keys(Currency).find(key => 
			Currency[key as keyof typeof Currency].toLowerCase() === inputWithoutS
		);
	}

	return matchedKey ? Currency[matchedKey as keyof typeof Currency] : undefined;
}

function separatePriceInfo(input: string): { letters: string, numbers: number } | false {
	if (!/^([a-zA-Z]+[0-9]+|[0-9]+[a-zA-Z]+)$/.test(input)) {
		return false;
	}

	const lettersMatch = input.match(/[a-zA-Z]+/);
	const numbersMatch = input.match(/[0-9]+/);

	if (lettersMatch && numbersMatch) {
		return { letters: lettersMatch[0], numbers: parseInt(numbersMatch[0]) };
	}

	return false;
}
