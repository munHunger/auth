<script context="module" lang="ts">
	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ page, fetch, session, context }) {
		let url = `/index.json`;
		const res = await fetch(url);
		if (res.ok) {
			let data = await res.json();
			return {
				props: {
					users: data
				}
			};
		}
		return {
			status: res.status,
			error: new Error(`Could not load ${url}`)
		};
	}
</script>

<script>
	import user from '$lib/user/user';
	import Nav from '../components/nav.svelte';

	export let users;
</script>

<div class="flex-auto relative p-4 bg-gray-100">
	<Nav current="users" />
	<div class="mt-4 flex flex-row flex-wrap">
		{#each users as user}
			<div class="flex flex-row rounded-md m-2 p-4 bg-white shadow-sm">
				<img
					src="https://s.gravatar.com/avatar/bc6099969d8870d939611562ea220a35?s=80"
					alt={user.email}
				/>
				<div class="w-52 p-2">
					<div class="text-lg font-bold">{user.username}</div>
					<div class="text-gray-800 font-mono">{user.email}</div>
				</div>
			</div>
		{/each}
	</div>
</div>
