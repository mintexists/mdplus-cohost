<!-- like a <details> tag but #girlbossed -->

<script>
  import { slide } from "svelte/transition";

  export let open = false;

  function toggleOpen() {
    open = !open;
  }
</script>

<style>
  .container {
    margin: var(--padding) 0.5em;
  }
  .container.open .summary-container {
    background-color: rgb(var(--background-color-brighter));
    border-radius: var(--border-radius) var(--border-radius) 0 0;
  }
  .summary {
    background-color: rgb(var(--background-color-brighter));
    border-radius: var(--border-radius);
    padding: var(--padding);
    cursor: pointer;
    transition: 0.1s background-color;
    line-height: 1;
  }
  .summary-icon {
    user-select: none;
    margin-right: 0.25em;
  }
  .summary:hover {
    background-color: rgb(var(--background-color-brighter-2));
  }
  .container .inner {
    padding: var(--padding);
    display: block;
    background-color: rgb(var(--background-color-brighter));
    border-radius: 0 0 var(--border-radius) var(--border-radius);
  }
</style>

<div class="container" class:open={open}>
  <div class="summary-container">
    <div class="summary" on:click={toggleOpen} on:keydown={toggleOpen} aria-pressed={open}>
      <span class="summary-icon" aria-hidden="true">
        {open ? '▾' : '▸'}
      </span>
      <slot name="summary">Something is inside here..........</slot>
    </div>
  </div>
  {#if open}
    <div class="inner" transition:slide="{{duration: 200}}">
      <slot/>
    </div>
  {/if}
</div>