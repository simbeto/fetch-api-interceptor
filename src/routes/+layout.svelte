<script lang="ts">
</script>

<div id="top-bar">
	<ul>
		<li><a href="/">Posts</a></li>
		<li><a href="/products">Products</a></li>
		<li><a href="/quotes">Quotes</a></li>
		<li><a href="/baseurl">Base Url Override</a></li>
		<li><a href="/users">Base Url Users API</a></li>
	</ul>
</div>

<div id="content">
	<slot />
</div>

<style>
	#content {
		padding-left: 30px;
	}
	ul {
		list-style-type: none;
		height: 100%;
		margin: 0;

		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
	}
	#top-bar {
		background-color: goldenrod;
		height: 60px;
		font-weight: bold;
	}

	/* .swapped :global() { */
	/* padding: 6px; */
	/* } */

	:global(h1) {
		margin-bottom: 0px;
	}

	:global(.swapped) {
		padding: 6px;
		margin-left: 40px;
		margin-top: 0px;
	}

	:global(.swapped em) {
		background-color: bisque;
		padding: 0 8px;
		border-radius: 3px;
	}
</style>
