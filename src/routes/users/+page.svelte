<script lang="ts">
	import http from '$lib/http/index.js'
	import { onMount } from 'svelte'

	let list = {}

	onMount(async () => {
		// base url should get prefixed to it and get the data
		list = (await http.get('/users')).data
		console.log(list)
	})
</script>

<h2>
	This page should add the base url as set in the http options and fetch the users data from `dummyjson.com`
	external API.
</h2>

<pre> 
{JSON.stringify(list, null, 2)} 
</pre>
