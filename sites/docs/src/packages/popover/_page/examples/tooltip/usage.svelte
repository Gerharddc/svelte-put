<script>
	import HintedText from './HintedText.svelte';
</script>

{#snippet hint()}
	<span class="m-0"
		>Built with ♡ using <code>@svelte-put/popover </code> and <code>@floating-ui</code></span
	>
{/snippet}

<p class="m-0">
	<span>Hover on</span>
	<HintedText {hint} class="hl-info cursor-help">this text ⓘ</HintedText>
	<span>for some hinting action (or focus it using keyboard).</span>
</p>
