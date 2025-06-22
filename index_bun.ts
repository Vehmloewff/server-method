import { createGenericServerMethod, type ServerMethodFn } from './server_method'
import { addToServerRegistry } from './server_registry'

export const serverMethod: ServerMethodFn = (id, params) => {
	// First we register the server method for being called from outside the returned instance.
	addToServerRegistry(id, async (ctx, input) => {
		// direct call for now, register later
		const data = params.schema.parse(input)

		return await params.fn(ctx, data)
	})

	// Then we return something just in case it is called directly
	return createGenericServerMethod(id, async (ctx, input) => {
		return await params.fn(ctx, input)
	})
}

export * from './index_shared'
