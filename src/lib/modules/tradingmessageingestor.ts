import type { Listing, Item, Enchant } from "../../lib/types.ts";
import { Currency } from "../../lib/types.ts";
import { resolveEnchantAlias } from "./enchantaliasresolver.ts";
import { collections } from "../../lib/modules/database.ts";
import { sendDiscordMessage } from "../../lib/modules/discordmessagesender.ts";

export function ingestTradingMessage(messageContent: string, messageAuthorId: string) {

	// trash parser incoming

	let sellingFlag = false;
	let buyingFlag = false;

	let messageLines = messageContent.split("\n");

	for (let line of messageLines) {
		console.log(`at line: ${line}`);

		let currentParam = "";

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
			console.log(`at word: ${word}, currentParam ${currentParam}, sellingFlag ${sellingFlag}`);
			if (currentParam == "") {
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
					currentParam = "forPrice";
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
						console.log(`resolved enchant successfully as ${resolvedEnchantName} ${enchantLevel}`);
					}
				}
			}
			else if (currentParam == "forPrice") {
				listing.pricePer = parseInt(word);
				currentParam = "currencyName";
			}
			else if (currentParam == "currencyName") {
				let attemptMatchCurrency = matchCurrency(word);
				if (attemptMatchCurrency) {
					listing.currency = attemptMatchCurrency;
					console.log(`matched currency successfully as ${attemptMatchCurrency}, breaking`);
					break;
				}
			}
		}

		if (sellingFlag || buyingFlag) {
			console.log("listing:");
			console.log(JSON.stringify(listing, null, 4));
			if (collections.listings) {
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
	const matchedKey = Object.keys(Currency).find(key => 
		Currency[key as keyof typeof Currency].toLowerCase() === normalizedInput
	);
	return matchedKey ? Currency[matchedKey as keyof typeof Currency] : undefined;
}
