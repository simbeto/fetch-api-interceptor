<script lang="ts">
	import http from '$lib/http/index.js'
	import { onMount } from 'svelte'

	let list = {}

	onMount(async () => {
		list = await http.get('https://dummyjson.com/products')
		console.log(http.settings)

		// console.log(list)
	})
</script>

<h1>Products</h1>
<h4 class="swapped">Swapped Products request with <em>'Posts'</em> via Request Interceptor</h4>

<pre>
{JSON.stringify(list, null, 2)}

</pre>
