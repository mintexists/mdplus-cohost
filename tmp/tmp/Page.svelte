<script>
  import 'modern-normalize';
  import '@fontsource/atkinson-hyperlegible';
  import 'tippy.js/dist/tippy.css';

  import ultralightCopy from 'copy-to-clipboard-ultralight';
  import prettyBytes from 'pretty-bytes';
  import { tippy } from 'svelte-use-tippy.js';
  import { getContext } from 'svelte';
  import { writable, get } from 'svelte/store';
  import { parse } from './lib/converter';

  const { open } = getContext('simple-modal');

  import sourcemapImg from './assets/sourcemap.png';
  import Preview from './lib/Preview.svelte';
  import Collapsible from './lib/Collapsible.svelte';
  import Example from './lib/Example.svelte';
  import CohostPreview from './lib/CohostPreview.svelte';

  const presets = [
    'In publishing and graphic design, **Lorem** **ipsum** is a **placeholder** text commonly used to **demonstrate** the **visual** form of a document or a typeface **without** relying on **meaningful** content. **Lorem** **ipsum** may be used as a **placeholder** before **final** copy is available. It is **also** used to **temporarily** replace text in a process called **greeking,** which allows **designers** to consider the form of a **webpage** or **publication,** **without** the meaning of the text influencing the **design**.',
    '**Among** **Us** is a 2018 online multiplayer social deduction game developed and published by American game studio **Innersloth**. The game was inspired by the party game **Mafia** and the science fiction horror film The **Thing**. The game allows for **cross-platform** play, first released on **iOS** and **Android** devices in June 2018 and on **Windows** later that year in November. The game was then ported to the **Nintendo** **Switch** in December 2020, and on the **PlayStation** **4,** **PlayStation** **5,** **Xbox** **One** and **Xbox** Series **X/S** in December 2021. While the game was initially released in 2018 to **little** mainstream attention, it received a **massive** influx of popularity in 2020 due to **many** **well-known** **Twitch** streamers and **YouTubers** playing it. A separate **VR** version of the game, **Among** **Us** **VR,** was released in November 2022.',
    '**J,** or **j,** is the **tenth** letter in the **Latin** alphabet, used in the modern **English** alphabet, the alphabets of **other** western **European** languages and **others** worldwide. Its usual name in **English** is **jay** (pronounced /ˈdʒeɪ/), with a now-uncommon variant **jy** /ˈdʒaɪ/. When used in the **International** **Phonetic** **Alphabet** for the **y** sound, it **may** be called **yod** or **jod** (pronounced /ˈjɒd/ or /ˈjoʊd/).',
    '**owo**'
  ];

  const filters = [
    '^$1^',
    '^^$1^^',
    '^^^$1^^^',
    '^^^^$1^^^^',
    '~$1~',
    '!($1)!',
    '!!($1)!!',
    '<?!>$1<?!>',
    '?($1)?',
    '[[$1]]',
    '//$1//',
    '[<rainbow>]$1[/]'
  ]

  let editorText = writable(presets[Math.floor(Math.random() * presets.length)].trim().split(' ').map((w,i,a) => {
    const custom = a.join('').includes('**');
    let cond = false;
    if (custom) {
      cond = w.startsWith('**') && w.endsWith('**');
      if (cond) w = w.slice(2, -2);
    } else {
      const chance = 1 / 5;
      const roll = Math.random(); 
      cond = roll < chance;
    }
    if (cond) {
      return filters[Math.floor(Math.random() * filters.length)].replace('$1', w);
    } else {
      return w;
    }
  }).join(' '));
  let compiledText = '';
  let appendPlaintext = writable(true);

  async function build() {
    try {
      compiledText = await parse(get(editorText), get(appendPlaintext));
    } catch(err) {}
  }

  editorText.subscribe(build);
  appendPlaintext.subscribe(build);

  let copied = false;
  let copiedError = false;
  let cohost = false;

  function copy() {
    if (ultralightCopy(compiledText)) {
      copied = true;
    } else {
      copiedError = false;
    }
  }
</script>

<style>
  app {
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: stretch;
    gap: 1em;
    margin: 1em;
  }
  .horiz {
    min-width: 350px;
    flex: 1 1 0;
    min-height: 450px;
  }
  .full-width {
    width: 100%;
  }

  .textarea, .bottom, .result {
    background-color: rgb(var(--background-color));
    border-radius: var(--border-radius);
  }

  textarea, .textarea-bottom, .result-preview, .result-bottom, .bottom {
    padding: var(--padding);
  }

  header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 1.5em;
    margin-bottom: 1.5em;
  }

  .textarea {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow: hidden;
  }
  .result {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow: hidden;
    transition: 0.2s color, 0.2s background-color;
  }
  .result.cohost {
    color: #191919;
    background-color: #fff;
  }
  .result-preview {
    flex: 1 1 auto;
    overflow: hidden;
    overflow-wrap: break-word;
    position: relative;
  }
  .result-bottom {
    flex: 0 0 auto;
    background-color: rgb(var(--background-color-brighter));
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    gap: 1em;
    transition: 0.2s background-color;
  }
  .result-bottom.cohost {
    background-color: rgb(255 249 242);
  }

  textarea {
    background: none;
    border: none;
    resize: vertical;
    flex: 1 1 auto;
    outline: none;
  }
  .textarea-bottom {
    flex: 0 0 auto;
    background-color: rgb(var(--background-color-brighter));
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  button {
    outline: none;
    border: none;
    padding: 0.3em;
    border-radius: var(--border-radius);
    background-color: rgb(var(--accent-color));
    transition: 0.1s background-color;
    cursor: pointer;
    position: relative;
  }

  button:hover {
    background-color: rgb(var(--accent-color-bright));
  }

  button:active {
    background-color: rgb(var(--accent-color-bright));
  }

  button.copied::after, button.copiedError::after {
    position: absolute;
    inset: 0;
    padding: 0.3em;
    background-color: rgb(var(--accent-color-bright));
    border-radius: var(--border-radius);
    content: 'owob';
  }
  button.copiedError::after {
    content: 'NOT owob?!?';
  }

  .warning {
    padding: var(--padding);
    border-left: 4px solid rgb(var(--accent-color));
    background-color: rgba(var(--accent-color), 0.2);
    border-radius: var(--border-radius);
  }

  .result-bottom.cohost button {
    background-color: rgb(131 37 79);
  }
  .result-bottom.cohost button:hover, .result-bottom.cohost button::after, .result-bottom.cohost button:active {
    background-color: rgb(103 26 61);
  }

  .char-count {
    color: rgb(var(--text-color-secondary));
    transition: 0.2s color;
  }
  .result-bottom.cohost .char-count {
    color: #4a4847;
  }
  .char-count.error {
    color: #f66;
  }

  .bottom {
    overflow-wrap: break-word;
  }

  img.wide {
    width: 100%;
    height: auto;
  }

  .logo {
    max-width: 400px;
    width: 90%;
    aspect-ratio: 165 / 64;
    position: relative;
    margin-bottom: 0.5em;
  }

  .logo-img {
    width: 100%;
    height: auto;
    position: absolute;
  }
  .logo-plus {
    position: absolute;
    transform: translate(140%, 10%) scale(1.3) rotate(-12deg);
    image-rendering: pixelated;
  }
</style>

<app>
  <header class="full-width">
    <div class="logo">
      <img src="logo_back.png" class="logo-img" alt="the markdown logo">
      <img src="plus.gif" class="logo-plus" alt="a shitty flaming text gif saying 'plus', revealing the full title of the logo to be 'markdown plus'">
    </div>
    <i>by <a href="https://cohost.org/oatmealine">oatmealine</a></i>
  </header>
  <div class="textarea horiz">
    <textarea id="editor" bind:value={$editorText} placeholder="type Some Thing.."></textarea>
    <div class="textarea-bottom">
      <div>
        <input type="checkbox" id="plaintext" bind:checked={$appendPlaintext}>
        <label for="plaintext" use:tippy={{content: 'lets screenreaders read the plain version, however a little experimental'}}>add plaintext version</label>
      </div>
    </div>
  </div>
  <div class="result horiz" class:cohost={cohost}>
    <div class="result-preview">
      {#key $editorText + $appendPlaintext}
        <Preview editorText={$editorText} appendPlaintext={$appendPlaintext}/>
      {/key}
    </div>
    <div class="result-bottom" class:cohost={cohost}>
      <div class="char-count" use:tippy={{content: 'cohost\'s limit is ~200KB, but please keep your posts lower than that'}} class:error={compiledText.length > 200_000}>{prettyBytes(compiledText.length).replace(' ','') + (compiledText.length > 100_000 ? '?!' : '')}</div>
      <button on:click={() => {open(CohostPreview, {code: get(editorText)})}}>preview as post</button>
      <button class:copied={copied} class:copiedError={copiedError} on:click={() => {copy()}} on:mouseleave={() => {copied = false; copiedError = false}}>copy to clipboard</button>
    </div>
  </div>

  <div class="bottom full-width">
    <p><b>markdown PLUS</b> is an "alternative" to markdown for cohost which lets you use fucked-up text in your everyday
    posts.</p>

    <p>The intended usage is to speak like an RPG NPC, with the ability to express emotion in text quirks that cohost kindly
    allows us to do. Want to make your text wide? Go ahead! Make it wavy or shaky? Why not!</p>

    <p>All <a target="_blank" rel="noreferrer" href="https://www.markdownguide.org/cheat-sheet/">regular markdown</a> is supported, in addition to:</p>

    <Collapsible>
      <big slot="summary">Spoilered text</big>

      Have something CW-worthy but not big enough to warrant hiding the entire post behind one? Wrap it in a quick spoiler, Discord-style:

      <Example text={
        `cw me being nice to you ||did you know that you're cute? just a fact||`
      }/>

      Might act weirdly with text wrapping; simply a quirk with how it's handled (I can't do it any other way, else cohost will yell at me).
    </Collapsible>

    <Collapsible>
      <big slot="summary"><Preview appendPlaintext={false} inline={true} editorText="^Bouncy^"/> text</big>

      <Example text={
        `^weeeeeeeeeeeeeeeeeeee^`
      }/>
    </Collapsible>

    <Collapsible>
      <big slot="summary"><Preview appendPlaintext={false} inline={true} editorText="^^Alternate^^ ^^^bouncy^^^ text"/></big>
      <i>Suggested by <a target="_blank" rel="noreferrer" href="https://cohost.org/ewie">@ewie</a></i><br><br>

      <div class="warning">
        Will not work for people w/ <a target="_blank" rel="noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion#user_preferences">reduced motion</a> on
      </div><br>

      Stack bouncy text twice to get text bouncing in a different way:

      <Example text={
        `(JRPG boss voice) [#759]^^Well, well, well...^^[/]`
      }/>

      Keep stacking it, and you'll get:

      <Example text={
        `^^^eeeeeeeeeeeeeeeeee^^^\n\n^^^^aaaaaaaaaaaaaaaaaa^^^^\n\n^^^^^eeeeeeeeeee!!!!!!^^^^^`
      }/>
    </Collapsible>

    <Collapsible>
      <big slot="summary"><Preview appendPlaintext={false} inline={true} editorText="~Wavy~"/> text</big>

      <div class="warning">
        Will not work for people w/ <a target="_blank" rel="noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion#user_preferences">reduced motion</a> on
      </div>

      <Example text={
        `~oooooooooooooooo~`
      }/>
    </Collapsible>

    <Collapsible>
      <big slot="summary"><Preview appendPlaintext={false} inline={true} editorText="!!(Shaky)!!"/> text</big>

      <div class="warning">
        Will not work for people w/ <a target="_blank" rel="noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion#user_preferences">reduced motion</a> on
      </div><br>

      Shakes each letter a lot! Surround in <pre>!(</pre> and <pre>)!</pre>:

      <Example text={
        `!(aaaaaaahhhhhh!!!!!)!!!!!`
      }/>

      Or, if you want to moreso express derangement than screaming, you can make the whole block shake in
      unison with <pre>!!(</pre> and <pre>)!!</pre>:

      <Example text={
        `i am !!(normal)!! and can be !!(trusted)!! around !!(HTML access)!!`
      }/>
    </Collapsible>

    <Collapsible>
      <big slot="summary"><Preview appendPlaintext={false} inline={true} editorText="<?!>Glitchy<?!>"/> text</big>
      <i>Suggested by <a target="_blank" rel="noreferrer" href="https://cohost.org/junebug">@junebug</a></i><br><br>

      <div class="warning">
        Will not work for people w/ <a target="_blank" rel="noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion#user_preferences">reduced motion</a> on
      </div><br>

      Surround your text in <pre>&lt;?!&gt;</pre> to a]]]$]]*⎱≫⨪**⫖*** ;;(==⃏⧢⿿⟦⥢⃎⾹&gt;&gt;&gt;&gt;♨⋂⥪⍾₡

      <Example text={
        `<?!>uh oh oh no uh oh oh uh uhm oh oh no no uh OH<?!>`
      }/>
    </Collapsible>

    <Collapsible>
      <big slot="summary">Blurry text</big>

      <i>Suggested by <a target="_blank" rel="noreferrer" href="https://cohost.org/catmap">@catmap</a></i><br><br>

      For when you want to make people feel like they forgot their glasses, I guess?

      <Example text={
        `?([rainbow]blurry text[/])?`
      }/>
    </Collapsible>

    <Collapsible>
      <big slot="summary"><Preview appendPlaintext={false} inline={true} editorText="[[Wide]]"/> text</big>

      fuckign wide

      <Example text={
        `[[womp]]`
      }/>

      wider...

      <Example text={
        `[[[womp]]]`
      }/>

      yes...... Yes

      <Example text={
        `[[[[womp]]]]`
      }/>
    </Collapsible>

    <Collapsible>
      <big slot="summary"><Preview appendPlaintext={false} inline={true} editorText="//Wagging//"/> text</big>

      <div class="warning">
        Will not work for people w/ <a target="_blank" rel="noreferrer" href="https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion#user_preferences">reduced motion</a> on
      </div><br>

      Make your text rotate right and left with a little bit of <pre>//</pre> on both sides:

      <Example text={
        `//wag//`
      }/>

      <small>This previously used to be <pre>/</pre>, but this caused issues in HTML block parsing and link parsing.</small>
    </Collapsible>

    <Collapsible>
      <big slot="summary">Custom colors</big>

      Specify colors by wrapping them into blocks with the hex code like this:

      <Example text={
        `[#ff3333]Evil text[/#ff3333], in addition to [#33ff33]good text[/#33ff33] and [#555555]morally questionable[/#555555] text`
      }/>

      As a shorthand, you can close the most recently-opened color tag with <pre>[/]</pre>:

      <Example text={
        `[#b00b69]haha boob69[/]`
      }/>

      Colors can accept any HTML valid color:

      <Example text={
        `[#f00]Three[/] [rgb(255,0,0)]different[/] [red]ways[/] to make a red!`
      }/>
    </Collapsible>

    <Collapsible>
      <big slot="summary"><Preview appendPlaintext={false} inline={true} editorText="[#eeaaff:#b00b69]Gradients[/]"/></big>

      <i>Suggested by <a target="_blank" rel="noreferrer" href="https://cohost.org/quat">@quat</a></i><br><br>

      Similar to colors, you can also define gradients by seperating colors with <pre>:</pre>

      <Example text={
        `[#ff0000:#00ff00:#0000ff]this gradient is fucking ugly[/]`
      }/>

      Additionally: rainbow text

      <Example text={
        `[rainbow][epicly dances] aw yeah... This is what i'm talking about!![/]`
      }/>
    </Collapsible>

    <Collapsible>
      <big slot="summary"><Preview appendPlaintext={false} inline={true} editorText="[<#fff>]Glowy text[/]"/></big>

      If you surround your color in <pre>&lt;&gt;</pre>, you'll get a shiny piece of text

      <Example text={
        `[<#e22>]Reconsider.[/]`
      }/>

      Works with gradients!!!

      <Example text={
        `[<rainbow>]AAAAAAAAAAAAAAAA!!!!!!![/]`
      }/>
    </Collapsible>
  </div>

  <div class="bottom full-width">
    <h2>markdown PLUS goes hand-in-hand with:</h2>

    <el>
      <li><a href="https://cohost.org/nex3">@nex3</a>'s <a href="https://nex3.github.io/cohost-highlight/" target="_blank" rel="noreferrer">syntax highlighter</a></li>
      <li><a href="https://cohost.org/nex3">@nex3</a>'s <a href="https://nex3.github.io/cohost-image-grid/" target="_blank" rel="noreferrer">image grid generator</a></li>
      <li><a href="https://cohost.org/pommicket">@pommicket</a>'s <a href="https://pommicket.com/tex2html/" target="_blank" rel="noreferrer">LaTeX generator</a> <small>(for math nerds)</small></li>
      <li><a href="https://cohost.org/a2aaron">@a2aaron</a>'s <a href="https://a2aaron.github.io/Cohoard/" target="_blank" rel="noreferrer">cohoard</a> for formatting chatlogs</li>
    </el>

    <br>

    Implementing these in markdown PLUS is out of scope, and therefore I highly recommend you instead use these tools to generate HTML, and then put it into the input here. <b>This will work, <a href="https://howto.smooch.computer/i/ntqk2.png">trust me.</a></b>
  </div>

  <div class="bottom full-width">
    <h2>Source code</h2>

    I haven't open sourced this because I'm too lazy to keep a git repo up to date but I've left the sourcemaps open, you can view them like this<br><br>

    <img class="wide" src={sourcemapImg} alt="Debugger tab open in Firefox">
  </div>
</app>