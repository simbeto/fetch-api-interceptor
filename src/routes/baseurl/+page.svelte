<script lang="ts">
	import http from '$lib/http/index.js'
	import { onMount } from 'svelte'

	let list = {}

	onMount(async () => {
		list = (await http.get('/baseurl', {}, { baseUrl: '' })).data
		console.log(list)
	})
</script>

<h2>This page should add the current URI as base url to the fetch request.</h2>

<h4>{@html list}</h4>
