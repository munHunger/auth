<script context="module" lang="ts">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
		let url = `/service.json`;
		const res = await fetch(url);
		if (res.ok) {
			let data = await res.json();
			return {
				props: {
					services: data
				}
			};
		}
		return {
			status: res.status,
			error: new Error(`Could not load ${url}`)
		};
	}
</script>

<script lang="ts">
	import service from '$lib/service/service';
	import Nav from '../components/nav.svelte';

	export let services;
</script>

<div class="flex-auto relative p-4 bg-gray-100">
	<Nav current="services" />
	<div class="mt-4 flex flex-row flex-wrap">
		{#each services || [] as service}
			<div class="flex flex-row rounded-md m-2 p-4 bg-white shadow-sm">
				<img
					src="https://s.gravatar.com/avatar/bc6099969d8870d939611562ea220a35?s=80"
					alt="service"
				/>
				<div class="w-52 p-2">
					<div class="text-lg font-bold">{service.name}</div>
				</div>
			</div>
		{/each}
	</div>
</div>
