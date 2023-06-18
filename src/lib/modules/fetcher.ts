let cacheStore: { [key: string]: {response: any, validUntil: Date} } = {};

export async function fetchC(url: string, cacheSeconds: number): Promise<any> {
	if (url in cacheStore) {
		let cachedData = cacheStore[url];
		if (cachedData.validUntil.valueOf() > Date.now()) {
			console.log(`returning cached response for url ${url}`);
			return cachedData.response;
		}
	}
	console.log(`fetching new response for url ${url}`);
	let response: any = await fetch(url);
	let responseJson = await response.json();
	let cacheObj = {
		response: responseJson,
		validUntil: new Date(Date.now() + (cacheSeconds * 1000)),
	};
	cacheStore[url] = cacheObj;
	cleanCache();
	return responseJson;
}

function cleanCache() {
	const currentTime = Date.now();
	for (const key in cacheStore) {
		if (cacheStore[key].validUntil.valueOf() <= currentTime) {
			console.log(`removing expired cache entry for url ${key}`);
			delete cacheStore[key];
		}
	}
}
