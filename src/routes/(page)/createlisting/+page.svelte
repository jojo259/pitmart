<script lang="ts">
	import { goto } from "$app/navigation";
	import CenteredDiv from "$lib/components/page/CenteredDiv.svelte";
	import MinecraftItemCard from "$lib/components/minecraft/MinecraftItemCard.svelte";
	import { onMount } from "svelte";
	import type { Item } from "$lib/types";
	import { Currency } from "$lib/types";
	import { createTempNotification } from "$lib/util";
	import { clickCreateListingString } from "$lib/constants";

	export let data;

	let customListing = true;
	if (data.createListingParams.itemjson) {
		customListing = false;
	}

	let listingItem: Item;
	if (data.createListingParams.itemjson) {
		listingItem = JSON.parse(data.createListingParams.itemjson);
		if (listingItem.lore) {
			listingItem.lore = listingItem.lore.filter(line => line != clickCreateListingString);
		}
	}
	else {
		listingItem = {
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
		}
	}

	let loreString = listingItem.lore ? listingItem.lore.join('\n') : '';

	function handleLoreChange(event: Event) {
		const inputElement = event.target as HTMLInputElement;
		let newLoreVal: string[] = inputElement.value.split('\n');
		console.log(`setting new lore val (length ${newLoreVal.length}): ${newLoreVal}`)
		listingItem.lore = newLoreVal;
	}

	function setValues() {
		if (!document) {
			return;
		}
		for (let [key, val] of Object.entries(data.createListingParams)) {
			const inputElement = document.querySelector(`#${key}`);
			if (inputElement) {
				(inputElement as HTMLInputElement).value = val;
			}
		}
		for (let [key, val] of Object.entries(listingItem)) {
			console.log(`setting ${key} with type ${typeof val}`);
			if (key == "enchants" && val) {
				/*
				console.warn("doing enchants");
				val.forEach((enchantData: any, i: number) => {
					console.log(`enchant ${i} ${enchantData.key} ${enchantData.level}`);
				});
				continue;
				*/
			}
			const inputElement = document.querySelector(`#item-${key}`);
			if (inputElement) {
				if (["string", "number"].includes(typeof val)) {
					(inputElement as HTMLInputElement).value = val;
				}
				else if (Array.isArray(val)) {
					(inputElement as HTMLInputElement).value = val.join("\n");
				}
				else {
					continue;
				}
			}
		}
		//goto("/createlisting"); enable this later
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		const inputElements = document.querySelectorAll("input[type='text']");
		const selectElements = document.querySelectorAll("select");
		const formFields: { [key: string]: string } = {};

		inputElements.forEach((inputElement) => {
			const typedInputElement = inputElement as HTMLInputElement;
			if (typedInputElement.id) {
				formFields[typedInputElement.id] = typedInputElement.value;
			}
		});

		selectElements.forEach((selectElement) => {
			const typedSelectElement = selectElement as HTMLSelectElement;
			if (typedSelectElement.id) {
				formFields[typedSelectElement.id] = typedSelectElement.options[typedSelectElement.selectedIndex].value;
			}
		});

		let postData = {
			formFields: formFields,
			listingItem: listingItem,
		}

		console.log("submitting listing:");
		console.log(JSON.stringify(postData, null, 1));

		const req = await fetch("/api/listing/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(postData),
		});

		const resp = await req.json();

		if (resp.success) {
			console.log("listing created successfully");
		} else {
			console.error("error creating listing");
		}

		createTempNotification(resp.message);
	}


	onMount(() => {
		setValues();
	});
</script>

<CenteredDiv>
	<form on:submit={handleSubmit}>
		<label>
			Listing message
			<input id="message" type="text" />
		</label>
		<label>
			Username
			<input id="tag" type="text" />
		</label>
		<label>
			Currency
			<select id="currency">
				{#each Object.values(Currency) as currency}
					<option value={currency}>{currency}</option>
				{/each}
			</select>
		</label>
		<label>
			Price per
			<input id="pricePer" type="text" />
		</label>
		{#if customListing}
			<label>
				Item ID
				<input id="item-id" type="text" bind:value={listingItem.id} />
			</label>
			<label>
				Item name
				<input id="item-name" type="text" bind:value={listingItem.name} />
			</label>
			<label>
				Item description
				<textarea id="item-lore" style:width="300px" style:height="300px" bind:value={loreString} on:input={handleLoreChange} />
			</label>
			<label>
				Item nonce
				<input id="item-nonce" type="text" bind:value={listingItem.nonce} />
			</label>
		{/if}
		<button type="submit">Submit</button>
	</form>
	<MinecraftItemCard item={listingItem} show={true} useAbsolutePosition={false} />
</CenteredDiv>

<style>
	label {
		display: block;
	}
</style>
