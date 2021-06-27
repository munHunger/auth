<script context="module" lang="ts">
	import { setContext, getContext } from 'svelte';
	import { browser } from '$app/env';
	export const load = async ({ session, page, fetch }) => {
		let service = page.query.get('service');
		let token = page.query.get('token');
		let callback = page.query.get('callback');
		if (!browser) {
			if (session.authenticated) {
				if (!service)
					return {
						redirect: '/',
						status: 302
					};
				else {
					let login = await fetch(
						`/login.json?service=${service}&token=${encodeURIComponent(token)}`
					);
					if (login.status === 200) {
						let data = await login.json();
						return {
							redirect: `${callback}?token=${encodeURIComponent(data.serviceToken)}`,
							status: 302
						};
					}
				}
			}
		}
		if (token) {
			console.log('fetching auth request');
			let auth = await fetch(`/auth.json?service=${service}&token=${encodeURIComponent(token)}`);
			if (auth.status === 200)
				return {
					props: { service, callback, acl: (await auth.json()).acl }
				};
		}
		return { props: { service, callback } };
	};
</script>

<script lang="ts">
	import type Store from '$lib/store';
	import { User } from '$lib/user/userFrontend';
	import { goto } from '$app/navigation';
	import { AccessControl, AccessLevel } from '$lib/user/user';
	const store = getContext<Store>('store');
	export let service, callback;
	export let acl: Array<AccessControl>;
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
				if (data.serviceToken)
					(window as any).location = callback + '?token=' + encodeURIComponent(data.serviceToken);
				else goto('/');
			});
	}
</script>

<div class="text-xl">Welcome to <span class="text-blue-500">munhunger</span></div>
{#if service}
	<div class="text-sm text-gray-500">authenticating towards {service}</div>
	<div class="px-4">
		{#if acl}
			{#each acl as acl}
				<div class="text-sm text-gray-500 font-mono">
					<span class="font-bold">{AccessControl.accessLevelFromNumber(acl.level)}</span>
					{#if acl.service}
						{acl.service}{/if}
					{acl.property}
				</div>
			{/each}
		{/if}
	</div>
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
