import type { GenericContext } from './generic_context'

export type ServerMethodBrowserHandler = (ctx: GenericContext, input: unknown) => Promise<unknown>

let stashedHandler: ServerMethodBrowserHandler | null = null

export function setServerMethodBrowserHandler(handler: ServerMethodBrowserHandler) {
	stashedHandler = handler
}

export async function callServerMethodBrowserHandler(ctx: GenericContext, input: unknown): Promise<unknown> {
	if (!stashedHandler) throw new Error('No server method browser handler set')

	return await stashedHandler(ctx, input)
}
