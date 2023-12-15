<script lang="ts">
	import http, { type FinalResponse } from '$lib/http/index.js'
	import { onMount } from 'svelte'

	let res: Awaited<FinalResponse>

	let list: string = '[]'
	onMount(async () => {
		res = await http.get('https://dummyjson.com/posts', {}, { debug: true })
		console.log(http.settings)

		console.log(res)
		// list = await list.response.json()

		// for json data
		list = res.data

		// for blob data
		// console.log(res.data.type)
		// list = JSON.parse(await res.data.text())

		// for text data
		// list = JSON.parse(res.data)

		// console.log(list)

		// console.log(res.data)
		// console.log(res)
	})
</script>

<h1>Home: Posts</h1>

<h4 class="swapped">Swapped Posts request with <em>'Quotes'</em> via Request Interceptor</h4>

<!-- <pre> {JSON.parse(list)} </pre> -->
<pre> {JSON.stringify(list, null, 2)} </pre>
