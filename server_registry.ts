import type { GenericContext } from './generic_context'

type UnknownFn = (ctx: GenericContext, input: unknown) => Promise<unknown>

const registry = new Map<string, UnknownFn>()

export function addToServerRegistry(id: string, fn: UnknownFn) {
	registry.set(id, fn)
}

export function serverMethodExists(id: string): boolean {
	return registry.has(id)
}

export async function callServerMethod(id: string, ctx: GenericContext, input: unknown): Promise<unknown> {
	const method = registry.get(id)
	if (!method) throw new Error(`Server method '${id}' not found`)

	return await method(ctx, input)
}
