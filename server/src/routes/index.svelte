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
	import domain from 'auth-domain';
	const { user } = domain;

	export let users;
</script>

<div class="absolute left-0 top-0 w-full h-full flex justify-center items-center">
	<div class="flex shadow-lg m-8 max-w-5xl">
		<div class="bg-gradient-to-b from-gray-700 to-gray-900 p-8 text-gray-200 relative">
			<div class="text-3xl font-bold">Authentication</div>
			<div class="font-mono text-blue-500">home server SSO</div>

			<div class="absolute bottom-8">munhunger</div>
		</div>
		<div class="flex-auto p-4 bg-gray-100">
			<div class="mt-4 flex flex-row flex-wrap">
				{#each users as user}
					<div class="flex flex-row rounded-md m-2 p-4 bg-white shadow-sm">
						<img
							src="https://s.gravatar.com/avatar/bc6099969d8870d939611562ea220a35?s=80"
							alt={user.email}
						/>
						<div class="w-52 p-2">
							<div class="text-lg font-bold">{user.email}</div>
							<div class="text-gray-800 font-mono">{user.username}</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
