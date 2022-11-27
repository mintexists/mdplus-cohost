<script>
  import { fade } from "svelte/transition";
  import { parse } from "./converter";
  import { Diamonds } from 'svelte-loading-spinners';

  export let editorText = '';
  export let appendPlaintext = true;
  export let inline = false;

  let compiledText;
  let error;
  let loading = false;
  (async () => {
    loading = true;
    try {
      compiledText = await parse(editorText, appendPlaintext, inline);
    } catch(err) {
      error = err;
    } finally {
      loading = false;
    }
  })();
</script>

<style>
  .error {
    padding: var(--padding);
    background-color: rgba(var(--accent-color), 0.2);
    border-radius: var(--border-radius);
  }
  .loader {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

{#if loading}
  <div in:fade={{duration: 100}} class="loader">
    <Diamonds color="rgb(39, 183, 145)"/>
  </div>
{:else if !error}
  {@html compiledText}
{:else}
  <div class="error">
    ⚠️ <b>uh oh!! error</b><br><br>
    {error.message}
  </div>
{/if}