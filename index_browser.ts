import { callServerMethodBrowserHandler } from './browser_handler'
import { createGenericServerMethod, type ServerMethodFn } from './server_method'

export const serverMethod: ServerMethodFn = id =>
	// @ts-ignore
	createGenericServerMethod(id, async (ctx, input) => await callServerMethodBrowserHandler(ctx, id, input))

export * from './index_shared'
