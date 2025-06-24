# @vehmloewff/server_method

A utility for creating server methods.

```ts
// do_some_normal_stuff.ts
import { serverMethod } from '@vehmloewff/server_method';

const sayHello = serverMethod('say_hello', {
	schema: z.object({
		name: z.string()
	}),
	async fn(_, input) => {
		return `Hello, ${input.name}!`;
	}
});

export async function doSomeNormalStuff() {
	console.log(await sayHello.run({ name: 'World' }))
}

// server.ts

import { callServerMethod } from '@vehmloewff/server_method';
import { serve } from 'bun'

serve({
	port: 5000,
	async fetch(request) {
		const methodName = new URL(request.url).pathname.slice(1);
		await callServerMethod(methodName, request);
		return new Response('Hello, World!');
	}
})
```
