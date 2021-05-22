<script lang="ts">
	import { User } from '$lib/user/userFrontend';

	import Home from '../components/home.svelte';
	let email, password;
	function login() {
		let user = new User({ email, password } as User);
		user.authenticate().then((res) => console.log(res));
	}
</script>

<Home>
	<div class="mt-4">
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
				href="#"
			>
				Forgot Password?
			</a>
		</div>
	</div>
</Home>
