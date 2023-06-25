export async function load({ url }) {
	let params = url.searchParams;

	const paramsObject: { [key: string]: string } = {};
	for (const [key, value] of params.entries()) {
		paramsObject[key] = value;
	}

	return {createListingParams: paramsObject};
}
