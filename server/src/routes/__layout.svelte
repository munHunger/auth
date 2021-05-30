<script context="module" lang="ts">
	import Store from '$lib/store';
	import { setContext } from 'svelte';
</script>

<script lang="ts">
	import Home from '../components/home.svelte';
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';
	const store = new Store($session);
	setContext<Store>('store', store);
	function logout() {
		document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
		goto('login');
	}
</script>

<Home>
	<div class="flex-auto relative p-4 bg-gray-100">
		<button
			class="text-gray-300 hover:text-gray-700 transition absolute right-0 top-0"
			on:click={logout}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
				/>
			</svg>
		</button>
		<slot />
	</div>
</Home>

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
