<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';
	import { quintOut } from 'svelte/easing';
	import type { HTMLFieldsetAttributes } from 'svelte/elements';
	import { fly } from 'svelte/transition';

	let { class: cls, ...rest }: HTMLFieldsetAttributes = $props();

	let enabled = $state(true);
	let parent: Element | undefined = $state(undefined);
	let click = $state(0);

	function onClickOutside() {
		click++;
	}
	function toggleEnabled(e: Event) {
		e.stopPropagation();
		enabled = !enabled;
	}
</script>

<fieldset
	class="border-error-fg hl-error select-none border-4 p-10 {cls}"
	bind:this={parent}
	{...rest}
>
	<legend class="text-error-fg font-bold">&nbsp; Limit &nbsp;</legend>

	<div
		class="border-suscess-fg hl-success grid border-2 p-6"
		use:clickoutside={{ enabled, limit: { parent } }}
		onclickoutside={onClickOutside}
	>
		<p>
			<code>use:clickoutside</code> is registered for this <strong>green box</strong>. Try these:
		</p>
		<ol>
			<li>
				Click within this <strong>green</strong> zone => <strong>won't </strong> trigger
				<code>onclickoutside</code>
			</li>
			<li>
				Click on the <strong>red</strong> zone => <strong>will</strong> trigger
				<code>onclickoutside</code>
			</li>
			<li>
				Click outside the <strong>red</strong> limit => <strong>won't</strong> trigger
				<code>onclickoutside</code>
			</li>
			<li>Enable/disable <code>use:clickoutside</code> with button below, then try (2) again</li>
		</ol>
	</div>
	<div class="flex items-center justify-between">
		<p class="">
			<code>onclickoutside</code> counter:
			{#key click}
				<strong in:fly={{ y: 8, duration: 250, easing: quintOut }} class="inline-block"
					>{click}</strong
				>
			{/key}
		</p>
		<button class="c-btn" onclick={toggleEnabled}>
			{#if enabled}
				Disable
			{:else}
				Enable
			{/if}
		</button>
	</div>
</fieldset>
