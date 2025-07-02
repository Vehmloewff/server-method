type OneTimeCacheEntry = {
	methodId: string
	data: unknown
}

const ONETIME_CACHE_SCRIPT_ID = 'onetime-cache'

export class OnetimeCacheWriter {
	#items: OneTimeCacheEntry[] = []

	add(methodId: string, data: unknown) {
		this.#items.push({ methodId, data })
	}

	getCacheData() {
		return JSON.stringify(this.#items.reverse())
	}
}

export class OnetimeCacheReader {
	#items: OneTimeCacheEntry[]

	constructor(cacheData: string) {
		try {
			this.#items = JSON.parse(cacheData) as OneTimeCacheEntry[]
		} catch (error) {
			throw new Error('Failed to parse onetime cache data')
		}
	}

	take<T>(methodId: string): T {
		const helpText = 'Your initial client use of the server methods must be identical to the server use'
		const entry = this.#items.pop()
		if (!entry) throw new Error(`Cached serverMethod data not found. ${helpText}`)

		if (entry.methodId !== methodId) {
			throw new Error(
				`The next cached server method call was expected to be from '${methodId}', but the data was from a different method ('${entry.methodId}'). ${helpText}`
			)
		}

		// We're just going to trust the user here
		return entry.data as T
	}
}
