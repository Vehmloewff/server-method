import { createGenericServerMethod, type ServerMethodFn } from './server_method'
import { addToServerRegistry } from './server_registry'
import { matchesSchema, type ValidationError } from 'spartan-schema'

export const serverMethod: ServerMethodFn = (id, params) => {
	// First we register the server method for being called from outside the returned instance.
	addToServerRegistry(id, async (ctx, input) => {
		const errors: ValidationError[] = []
		const matches = matchesSchema(params.match)(input, errors)
		if (!matches) throw new Error(`Input data does not match the desired schema: ${JSON.stringify(errors, null, '\t')}`)

		return await params.fn(ctx, input)
	})

	// Then we return something just in case it is called directly
	return createGenericServerMethod(id, async (ctx, input) => {
		return await params.fn(ctx, input)
	})
}

export * from './index_shared'
