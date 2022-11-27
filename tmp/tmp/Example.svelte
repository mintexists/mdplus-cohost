<script>
  import Preview from "./Preview.svelte";

  export let text;
</script>

<style>
  .preview {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    position: relative;
    border: 2px solid rgb(var(--text-color-secondary));
    border-radius: var(--border-radius);
    margin: 1em;
  }
  .left, .right {
    padding: var(--padding);
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    overflow-wrap: break-word;
    overflow: hidden;
    max-width: 100%;
  }
  .left {
    border-right: 2px solid rgb(var(--text-color-secondary));
  }
  .overlay {
    position: absolute;
    inset: 0;
    font-size: x-large;
    display: flex;
    justify-content: center;
    align-items: center;
    user-select: none;
    pointer-events: none;
  }
  .overlay.small {
    display: none;
  }
  @media (max-width: 720px) {
    .overlay {
      display: none;
    }
    .overlay.small {
      display: flex;
    }
    .preview {
      grid-auto-flow: row;
      grid-auto-rows: 1fr;
    }
    .left {
      border-right: none;
      border-bottom: 2px solid rgb(var(--text-color-secondary));
    }
  }
  .arrow {
    color: rgb(var(--accent-color));
    font-weight: bold;
    text-shadow:
      2px 2px 0 rgb(var(--background-color-brighter)),
      2px -2px 0 rgb(var(--background-color-brighter)),
      -2px 2px 0 rgb(var(--background-color-brighter)),
      -2px -2px 0 rgb(var(--background-color-brighter)),
      2px 0px 0 rgb(var(--background-color-brighter)),
      0px 2px 0 rgb(var(--background-color-brighter)),
      -2px 0px 0 rgb(var(--background-color-brighter)),
      0px -2px 0 rgb(var(--background-color-brighter));
  }
</style>

<div class="preview">
  <div class="left">
    <span>{text}</span>
  </div>
  <div class="right">
    <span>
      <Preview editorText={text}/>
    </span>
  </div>
  <div class="overlay">
    <span class="arrow">→</span>
  </div>
  <div class="overlay small">
    <span class="arrow">↓</span>
  </div>
</div>