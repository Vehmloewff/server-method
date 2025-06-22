export class GenericContext {
	#items = new Map<symbol, unknown>()

	get<T>(key: symbol): T | null {
		const value = this.#items.get(key)
		if (value === undefined) return null

		return value as T
	}

	set(key: symbol, value: unknown): void {
		this.#items.set(key, value)
	}
}
