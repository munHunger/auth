<script lang="ts">
	export let current: string;
</script>

<div
	class="flex flex-row uppercase font-mono font-bold text-gray-300 cursor-pointer transition-all"
>
	<a href="/"
		><div class="mr-4 {current === 'users' ? 'text-gray-400' : ''} hover:text-gray-500">
			users
		</div></a
	>
	<a href="services"
		><div class="mr-4 {current === 'services' ? 'text-gray-400' : ''} hover:text-gray-500">
			services
		</div></a
	>
</div>
