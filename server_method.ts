import { OnetimeCacheReader, OnetimeCacheWriter } from './onetime_cache'
import type { GenericContext } from './generic_context'
import type { MatchesSchema, Schema } from 'spartan-schema'

const cacheReaderSymbol = Symbol('reader')
const cacheWriterSymbol = Symbol('writer')

export type ServerMethodParams<S extends Schema, ResponseData> = {
	match: S
	fn(ctx: GenericContext, request: MatchesSchema<S>): Promise<ResponseData>
}

export type ServerMethodFn = <S extends Schema, ResponseData>(
	id: string,
	params: ServerMethodParams<S, ResponseData>
) => ServerMethod<MatchesSchema<S>, ResponseData>

export type GenericServerMethodFn = <RequestData, ResponseData>(
	id: string,
	fn: (ctx: GenericContext, request: RequestData) => Promise<ResponseData>
) => ServerMethod<RequestData, ResponseData>

export type ServerMethod<RequestData, ResponseData> = {
	id: string
	call(ctx: GenericContext, input: RequestData): Promise<ResponseData>
}

export const createGenericServerMethod: GenericServerMethodFn = (id, fn) => {
	return {
		id,
		async call(ctx, input) {
			const reader = ctx.get<OnetimeCacheReader>(cacheReaderSymbol)
			if (reader) return reader.take(id)

			const result = await fn(ctx, input)

			const writer = ctx.get<OnetimeCacheWriter>(cacheWriterSymbol)
			if (writer) writer.add(id, result)

			return result
		},
	}
}

export function startRecording(ctx: GenericContext) {
	ctx.set(cacheWriterSymbol, new OnetimeCacheWriter())
}

export function stopRecordingGetCacheData(ctx: GenericContext) {
	const writer = ctx.get<OnetimeCacheWriter>(cacheWriterSymbol)
	if (!writer) throw new Error('Recording was never started on the server method context')

	const html = writer.getCacheData()
	ctx.set(cacheWriterSymbol, null)

	return html
}

export function startBrowserReplay(ctx: GenericContext, cacheData: string) {
	ctx.set(cacheReaderSymbol, new OnetimeCacheReader(cacheData))
}

export function stopBrowserReplay(ctx: GenericContext) {
	const reader = ctx.get<OnetimeCacheReader>(cacheReaderSymbol)
	if (!reader) throw new Error('Replay was never started on the server method context')

	ctx.set(cacheReaderSymbol, null)
}
