<script lang="ts">
	import http from '$lib/http/index.js'
	import { onMount } from 'svelte'

	let list = {}

	onMount(async () => {
		list = await http.get('https://dummyjson.com/quotes', {}, { debug: false })
		console.log(http.settings)

		// console.log(list)
	})
</script>

<h1>Quotes</h1>
<h4 class="swapped">Swapped Quotes request with <em>'Products'</em> via Request Interceptor</h4>

<pre>
{JSON.stringify(list, null, 2)}

</pre>
