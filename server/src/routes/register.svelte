<script lang="ts">
	import { User } from '$lib/user/userFrontend';
	import { goto } from '$app/navigation';

	import Home from '../components/home.svelte';

	let email, username, password, repeatPassword;
	function register() {
		if (password === repeatPassword) {
			let user = new User({ email, username, password } as User);
			user.register().then(() => goto('/login'));
		}
	}
</script>

<div class="text-xl">Welcome to <span class="text-blue-500">munhunger</span></div>
<form class="mt-4" on:submit|preventDefault={register}>
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
		<label class="block text-gray-700 text-sm font-normal mb-2" for="username"> Username </label>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			name="username"
			type="text"
			required
			placeholder="username"
			bind:value={username}
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
	<div class="mb-4">
		<label class="block text-gray-700 text-sm font-normal mb-2" for="password">
			repeat password
		</label>
		<input
			class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
			name="password"
			type="password"
			required
			placeholder="******"
			bind:value={repeatPassword}
		/>
	</div>
	<div class="flex items-center justify-between">
		<button
			class="px-4 py-2 rounded text-white inline-block shadow-lg bg-blue-500 hover:bg-blue-600 focus:bg-blue-700"
			on:click={register}>Sign up</button
		>
	</div>
</form>
