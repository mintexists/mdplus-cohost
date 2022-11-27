<script>
  import Preview from "./Preview.svelte";

  export let code;
</script>

<style>
  .preview {
    box-shadow:0 4px 5px #19191924,0 1px 10px #1919191f,0 2px 4px #0003;
    max-width:65ch;
    border-radius:.5em;
    width:100%;
    margin:0 auto;
    font-family:Atkinson Hyperlegible,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,segoe ui,Roboto,helvetica neue,Arial,noto sans,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol,noto color emoji;
    font-size: 16px;
    background-color: #fff9f2;
  }
  .preview header {
    padding:.75em;
    background-color:#fff9f2;
    border-top-left-radius:.5em;
    border-top-right-radius:.5em;
    justify-content:space-between;
    align-items:center;
    flex-direction:row;
    display:flex
  }
  .preview header > div {
    gap:.5em;
    align-items:center;
    flex-direction:row;
    width:100%;
    display:flex
  }
  .preview .headerInfo {
    line-height:1;
    gap:.5em;
    align-items:center;
    flex-wrap:wrap;
    flex-direction:row;
    flex:1 1 0%;
    display:flex
  }
  .preview .authorName {
    color:#191919;
    font-weight:700;
    text-overflow:ellipsis;
    white-space:nowrap;
    flex-shrink:1;
    max-width:100%;
    display:block
  }
  .preview .authorAt {
    color:#686664;
    font-weight:400;
    display:block
  }
  /*
  .preview .menu {
    width:1.6em;
    height:1.6em;
    position:relative
  }
  */
  .preview .menu svg {
    position:absolute;
    top:0;
    right:0
  }
  .preview hr {
    box-sizing:border-box;
    border-width:0;
    border-style:solid;
    height:0;
    color:inherit;
    border-top-width:1px;
    margin:0;
    margin-left:.75em;
    margin-right:.75em;
    border-color:#bfbab5
  }
  .preview .contentOuter {
    padding-left:.75em;
    padding-right:.75em;
    position:relative;
    overflow:hidden;
    background-color: #fff;
  }
  .preview .contentInner {
    overflow-wrap:break-word;
    margin:1em 0
  }
  .preview footer {
    max-width:100%;
    border-bottom-right-radius:.5em;
    border-bottom-left-radius:.5em;
    background-color:#fff9f2;
    padding:.75em
  }
  .preview footer > div {
    display:flex;
    justify-content:space-between;
    vertical-align:middle
  }
  .preview .comments {
    width:max-content;
    flex:none;
    color:#a09c98;
    line-height:1;
    font-size:.875em
  }
  .preview .footerIcons {
    display:flex;
    justify-content:flex-end;
    gap:.75em;
    background-color:#fff9f2;
    color:#191919
  }
  .preview svg {
    width:1.5em;
    height:1.5em;
    display:block
  }
</style>

<div>
  <article class="preview">
    <header>
      <div>
        <div class="headerInfo">
          <span class="authorName">Eggbug</span><span class="authorAt">@eggbug</span>
        </div>
      </div>
    </header>
    <hr />
    <div class="contentOuter">
      <div class="contentInner">
        <Preview editorText={code} />
      </div>
    </div>
    <hr />
    <footer>
      <div style="align-items: center">
        <div class="comments">0 comments</div>
        <div class="footerIcons">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" class="h-6 w-6 text-notBlack" ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" class="absolute top-0 left-0"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" class="edit"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
        </div>
      </div>
    </footer>
  </article>
</div>
