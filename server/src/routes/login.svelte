<script context="module" lang="ts">
	import { setContext, getContext } from 'svelte';
	import { browser } from '$app/env';
	export const load = async ({ session, page }) => {
		let service = page.query.get('service');
		let callback = page.query.get('callback');
		console.log(page);
		console.log(service);
		if (!browser) {
			if (session.authenticated) {
				if (!service)
					return {
						redirect: '/',
						status: 302
					};
				else {
					console.log(callback);
					return {
						redirect: `callback?token=osdufhdfjgb`,
						status: 302
					};
				}
			}
		}
		return { props: { service, callback } };
	};
</script>

<script lang="ts">
	import type Store from '$lib/store';
	import { User } from '$lib/user/userFrontend';
	import { goto } from '$app/navigation';
	const store = getContext<Store>('store');
	export let service, callback;
	import Home from '../components/home.svelte';
	let email, password;
	function login() {
		let user = new User({ email, password } as User);
		user
			.authenticate(service)
			.then((res) => {
				if (res.status === 200) return res.json();
				throw Error('Not authenticated');
			})
			.then((data) => {
				console.log('authenticated: ' + data.jwt);
				store.changeAuthenticationState(data);
				(window as any).location = callback + '?token=' + data.serviceToken;
			});
	}
</script>

<div class="text-xl">Welcome to <span class="text-blue-500">munhunger</span></div>
{#if service}
	<div class="text-sm text-gray-500">authenticating towards {service}</div>
{/if}
<form class="mt-4" on:submit|preventDefault={login}>
	<div class="mb-4">
		<label class="block text-gray-700 text-sm font-normal mb-2" for="email"> Email </label>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			name="email"
			type="email"
			required
			autofocus
			placeholder="Email"
			bind:value={email}
		/>
	</div>
	<div class="mb-4">
		<label class="block text-gray-700 text-sm font-normal mb-2" for="password"> password </label>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			name="password"
			type="password"
			required
			placeholder="******"
			bind:value={password}
		/>
	</div>
	<div class="flex items-center justify-between">
		<button
			class="px-4 py-2 rounded text-white inline-block shadow-lg bg-blue-500 hover:bg-blue-600 focus:bg-blue-700"
			on:click={login}>Sign In</button
		>
		<a
			class="inline-block align-baseline font-normal text-sm text-blue-500 hover:text-blue-800"
			href="register"
		>
			create account
		</a>
	</div>
</form>
