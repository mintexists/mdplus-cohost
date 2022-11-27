import MarkdownIt from 'markdown-it';
import plainText from 'markdown-it-plain-text';

import Color from 'color';

const STRIP_ELEMENTS = [
  'address',
  'applet',
  'area',
  'article',
  'base',
  'bdi',
  'button',
  'canvas',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dialog',
  'embed',
  'header',
  'fieldset',
  'footer',
  'form',
  'frame',
  'iframe',
  'label',
  'legend',
  'link',
  'main',
  'map',
  'menu',
  'meta',
  'meter',
  'nav',
  'nobr',
  'noscript',
  'object',
  'optgroup',
  'option',
  'output',
  'portal',
  'progress',
  'script',
  'section',
  'select',
  'slot',
  'style',
  'svg',
  'template',
  'textarea',
  'title',
];

const md = new MarkdownIt({
  html:         true,         // Enable HTML tags in source
  xhtmlOut:     false,        // Use '/' to close single tags (<br />).
                              // This is only for full CommonMark compatibility.
  breaks:       false,        // Convert '\n' in paragraphs into <br>
  langPrefix:   'language-',  // CSS language prefix for fenced blocks. Can be
                              // useful for external highlighters.
  linkify:      true,         // Autoconvert URL-like text to links
});

md.linkify.set({
  fuzzyEmail: false,
});
md.use(plainText);

function getTextWidth(text, font) {
  // re-use canvas object for better performance
  // @ts-ignore
  let canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  let context = canvas.getContext("2d");
  context.font = font;
  let metrics = context.measureText(text);
  return metrics.width;
}

function getCssStyle(element, prop) {
  return window.getComputedStyle(element, null).getPropertyValue(prop);
}

function getCanvasFont(el) {
  const fontWeight = getCssStyle(el, 'font-weight') || 'normal';
  const fontSize = getCssStyle(el, 'font-size') || '16px';
  const fontFamily = getCssStyle(el, 'font-family') || 'Times New Roman';

  return `${fontWeight} ${fontSize} ${fontFamily}`;
}

function rand() {
  return Math.floor(Math.random() * 100) / 100;
}
function srand() {
  return rand() * 2 - 1;
}
function small(n) {
  return Math.floor(n * 100) / 100;
}

function getWidthEm(text) {
  const app = document.querySelector('#app');
  const font = getCanvasFont(app);
  const width = getTextWidth(text, font);
  const widthEm = width / parseInt(getCssStyle(app, 'font-size').replace('px','')); // stupid. dumb. stupid
  return widthEm;
}

function widen(multiplier) {
  return (v, i) => {
    const width = getWidthEm(v);
    return [
      {
        display: 'inline-block',
        transform: `scale(${multiplier},1)`,
        'transform-origin': 'left'
      },
      {
        display: 'inline-block',
        width: `${width * multiplier}em`
      }
    ];
  }
}

function allMatch(arr, cond) {
  return arr.length === arr.filter(cond).length;
}

function validateColor(c) {
  try {
    let parsed = Color(c);
    return true;
  } catch(err) {
    return false;
  }
}

function lerp(a, b, t) {
  return (1 - t) * a + t * b;
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

// utf8
function toChars(str) {
  return [...str];
}
function len(str) {
  return toChars(str).length;
}


function createEscapedMap(text) {
  let chars = toChars(text);
  let escaped = Array(chars.length).fill(false);

  const isEscaped = (i, accum = 0) => {
    if (chars[i - 1] === '/') return [!isEscaped(i - 1), accum + 1];
    return [false, accum];
  }

  for (let i = chars.length - 1; i >= 0; i--) {
    let [escaped, removeChars] = isEscaped(i);
    if (escaped) {
      escaped[i] = true;
      i -= removeChars;
      escaped.splice(i - removeChars, removeChars);
      chars.splice(i - removeChars, removeChars);
    }
  }

  return [chars, escaped];
}

function parse(text, addPlaintext = true, inline = false) {
  const [escapedChars, escapedMap] = createEscapedMap(text);
  //text = escapedChars.join('');

  let charStyleMap = {};

  const setStyle = (index, style) => {
    if (style === null || charStyleMap[index] === null) return charStyleMap[index] = null;
    charStyleMap[index] = charStyleMap[index] || [];
    charStyleMap[index].push(style);
  };

  const replaceStyle = (regex, start, end, style) => {
    console.log(regex);
    let r = new RegExp(regex);
    let match;
    while ((match = r.exec(text)) !== null) {
      const unicodeOffset = match[0].length - len(match[0]);
      const startContent = r.lastIndex - match[0].length + start;
      const endContent = r.lastIndex - end - unicodeOffset;

      let mayOverrideShit = false;
      for (let i = r.lastIndex - match[0].length; i < startContent; i++) {
        if (charStyleMap[i] === null) mayOverrideShit = true;
        setStyle(i, null);
      }
      for (let i = endContent; i < r.lastIndex - unicodeOffset; i++) {
        if (charStyleMap[i] === null) mayOverrideShit = true;
        setStyle(i, null);
      }
      if (mayOverrideShit) continue;
      for (let i = startContent; i < endContent; i++) {
        const res = style(match[1], i - startContent);
        if (res[0]) { // is array
          res.forEach(v => setStyle(i, v));
        } else {
          setStyle(i, res);
        }
      }
    }
  }

  let colorRegex = /\[([^\[\]]+?)\]/ug;
  let match;
  while ((match = colorRegex.exec(text)) !== null) {
    if (match[1].startsWith('/')) continue;
    if (match[1] !== 'rainbow' && match[1] !== '<rainbow>' && !allMatch(match[1].replace(/^<(.+)>$/, '$1').split(':'), validateColor)) continue;

    let matchStart = colorRegex.lastIndex - match[0].length;
    let startSearch = colorRegex.lastIndex;
    let endMatch;
    let colorRegex2 = /\[([^\[\]]+?)\]/ug;
    while ((endMatch = colorRegex2.exec(text.slice(startSearch))) !== null) {
      if (!endMatch[1].startsWith('/')) continue;
      if (endMatch[1] !== 'rainbow' && match[1] !== '<rainbow>' && endMatch[1] !== '/' && !allMatch(endMatch[1].slice(1).replace(/^<(.+)>$/, '$1').split(':'), validateColor)) continue;

      if (endMatch[1] === '/' || endMatch[1].slice(1) === match[1]) {
        let col = match[1];
        let glowy = false;
        if (col.startsWith('<') && col.endsWith('>')) {
          glowy = true;
          col = col.slice(1, -1);
        }
        let colors;
        if (col === 'rainbow') {
          colors = Array(32).fill(0).map((_, i) => Color.hsl(i/32 * 360, 80, 50));
        } else {
          colors = col.split(':').map(s => Color(s));
        }

        const inner = text.slice(startSearch, colorRegex2.lastIndex + startSearch - endMatch[0].length);
        const unicodeOffset = inner.length - len(inner);
        const end = colorRegex2.lastIndex + startSearch - unicodeOffset;
        const endContent = colorRegex2.lastIndex + startSearch - endMatch[0].length - unicodeOffset;

        for (let i = matchStart; i < startSearch; i++) setStyle(i, null);
        for (let i = endContent; i < end; i++) setStyle(i, null);
        for (let i = startSearch; i < endContent; i++) {
          if (colors.length > 1) {
            let a = (i - startSearch) / (endContent - startSearch);
            if (isNaN(a)) a = 0;

            const segment = 1 / (colors.length - 1);
            const from = Math.min(Math.floor(a / segment), colors.length - 1);
            const to = Math.min(Math.ceil(a / segment), colors.length - 1);
            const transition = (a % segment) / segment;

            const smoothedColor = Color.rgb(
              lerp(colors[from].red(),   colors[to].red(),   transition),
              lerp(colors[from].green(), colors[to].green(), transition),
              lerp(colors[from].blue(),  colors[to].blue(),  transition)
            );

            const s = smoothedColor.hex().toString();
            setStyle(i, {
              color: s,
              'text-shadow': glowy ? `0 0 0.5em ${s}` : null
            });
          } else {
            const s = colors[0].hex().toString();
            setStyle(i, {
              color: s,
              'text-shadow': glowy ? `0 0 0.5em ${s}` : null
            });
          }
        }
        break;
      }
    }
  }

  replaceStyle(/\^\^\^\^\^(.+?)\^\^\^\^\^/ug, 5, 5, (v, i) => ([
    {
      display: 'inline-block',
      animation: `0.2s spin ease-in-out infinite ${small((-len(v) + i) * 0.159)}s alternate`,
      transform: 'translateY(-40%)'
    },
    {
      display: 'inline-block',
      animation: `0.2s spin ease-in-out infinite ${small((-len(v) + i) * 0.059) + 0.1}s alternate`,
      transform: 'translateX(-35%)'
    }
  ]));

  replaceStyle(/\^\^\^\^(.+?)\^\^\^\^/ug, 4, 4, (v, i) => ([
    {
      display: 'inline-block',
      animation: `0.25s spin ease-in-out infinite ${small((-len(v) + i) * 0.159)}s alternate`,
      transform: 'translateY(-20%)'
    },
    {
      display: 'inline-block',
      animation: `0.25s spin ease-in-out infinite ${small((-len(v) + i) * 0.059) + 0.125}s alternate`,
      transform: 'translateX(-30%)'
    }
  ]));

  replaceStyle(/\^\^\^(.+?)\^\^\^/ug, 3, 3, (v, i) => ([
    {
      display: 'inline-block',
      animation: `0.5s spin ease-in-out infinite ${small((-len(v) + i) * 0.159)}s alternate`,
      transform: 'translateY(-20%)'
    },
    {
      display: 'inline-block',
      animation: `0.5s spin ease-in-out infinite ${small((-len(v) + i) * 0.159) + 0.25}s alternate`,
      transform: 'translateX(-30%)'
    }
  ]));

  replaceStyle(/\^\^(.+?)\^\^/ug, 2, 2, (v, i) => ({
    display: 'inline-block',
    animation: `0.5s spin ease-in-out infinite ${small((-len(v) + i) * 0.159)}s alternate`,
    transform: 'translate(-20%,-20%)'
  }));

  replaceStyle(/\^(.+?)\^/ug, 1, 1, (v, i) => ({
    display: 'inline-block',
    animation: '1s bounce linear infinite',
    'animation-delay': `${small((-len(v) + i) * 0.2019)}s`
  }));

  replaceStyle(/~(.+?)~/ug, 1, 1, (v, i) => ({
    display: 'inline-block',
    animation: `1.2s spin ease-in-out infinite ${small((-len(v) + i) * 0.2019)}s alternate`,
    transform: 'translateY(-25%)'
  }));

  replaceStyle(/\?\((.+?)\)\?/ug, 2, 2, (v, i) => ({
    filter: 'blur(1px);'
  }));

  let rands = {};
  replaceStyle(/!!\((.+?)\)!!/ug, 3, 3, v => {
    rands[v] = rands[v] || [];
    const r = rands[v];
    const iter = 10;
    let styles = [];
    for (let i = 0; i < iter; i++) {
      styles.push({
        display: 'inline-block',
        animation: `${(r[0+i*4] || (r[0+i*4] = rand())) * 0.4}s spin linear infinite ${-(r[1+i*4] || (r[1+i*4] = rand())) * 0.2}s alternate`,
        transform: `translate(${(r[2+i*4] || (r[2+i*4] = srand()))*0.09}em,${(r[3+i*4] || (r[3+i*4] = srand()))*0.09}em)`
      });
    }
    return styles;
  });

  replaceStyle(/!\((.+?)\)!/ug, 2, 2, () => {
    const iter = 5;
    let styles = [];
    for (let i = 0; i < iter; i++) {
      styles.push({
        display: 'inline-block',
        animation: `${rand() * 0.4}s spin linear infinite ${-rand() * 0.2}s alternate`,
        transform: `translate(${srand()*13}%,${srand()*13}%)`
      });
    }
    return styles;
  });

  replaceStyle(/<\?!>(.+?)<\?!>/ug, 4, 4, () => {
    const iter = 3;
    let styles = [];
    for (let i = 0; i < iter; i++) {
      styles.push({
        display: 'inline-block',
        animation: `${rand() * 0.8+0.2}s spin steps(2,jump-none) infinite ${-rand()}s alternate`,
        transform: `translate(${srand()*10}%,${srand()*10}%) scale(${rand() * 0.2 + 1},${rand() * 0.2 + 1}) skewX(${srand() * 10}deg) skewY(${srand() * 10}deg)`
      });
    }
    return styles;
  });

  replaceStyle(/\/\/(.+?)\/\//ug, 2, 2, () => [
    {
      display: 'inline-block',
      transform: 'rotateZ(-345deg)'
    },
    {
      display: 'inline-block',
      transform: 'rotateZ(330deg)',
      animation: '1s spin infinite ease-in-out 0s alternate'
    }
  ]);

  replaceStyle(/\[\[\[\[\[\[\[\[(.+?)\]\]\]\]\]\]\]\]/ug, 8, 8, widen(5));
  replaceStyle(/\[\[\[\[\[\[\[(.+?)\]\]\]\]\]\]\]/ug, 7, 7, widen(4.5));
  replaceStyle(/\[\[\[\[\[\[(.+?)\]\]\]\]\]\]/ug, 6, 6, widen(4));
  replaceStyle(/\[\[\[\[\[(.+?)\]\]\]\]\]/ug, 5, 5, widen(3.5));
  replaceStyle(/\[\[\[\[(.+?)\]\]\]\]/ug, 4, 4, widen(3));
  replaceStyle(/\[\[\[(.+?)\]\]\]/ug, 3, 3, widen(2.5));
  replaceStyle(/\[\[(.+?)\]\]/ug, 2, 2, widen(2));

  let oldStyle = '!';
  let openSpans = 0;
  let unclosed = false;
  let processedText = toChars(text).map((l, i) => {
    let map = charStyleMap[i];
    if (map === null) {
      return '';
    } else {
      let t = l;
      let stringifiedStyle = JSON.stringify(map);
      if (stringifiedStyle !== oldStyle) {
        if (map && map.filter(m => m && m.display === 'inline-block').length > 0 && t === ' ') t = '&nbsp;';
        let oldUnclosed = unclosed;
        let oldOpenSpans = openSpans;
        if (map) {
          for (let style of map) {
            t = `<span style="${Object.entries(style).filter(([k, v]) => v !== null).map(([k, v]) => k + ':' + v).join(';')}">${t}`;
          }
          openSpans = map.length;
          unclosed = true;
        } else {
          unclosed = false;
        }
        if (oldUnclosed) for (let i = 0; i < oldOpenSpans; i++) t = '</span>' + t;
      }
      oldStyle = stringifiedStyle;
      return t;
    }
  }).join('');
  if (unclosed) for (let i = 0; i < openSpans; i++) processedText += '</span>';

  processedText = processedText.replace(/\|\|(.+?)\|\|/ug, (_, v) =>
    `<details style="background-color:#000;cursor:pointer;display:inline-block;position:relative;height:1.4em"><summary style="color:rgba(0,0,0,0);display:flex" aria-hidden="true">${v}</summary><span style="position:absolute;inset:0;pointer-events:none;background-color:#111;color:#fff">${v}</span></details>`
  );

  processedText = inline ? md.renderInline(processedText) : md.render(processedText);

  const forbidden = STRIP_ELEMENTS.filter(elem => processedText.includes(`<${elem}>`));
  if (forbidden.length > 0) {
    throw new Error(`${forbidden.map(l => `<${l}>`).join(', ')} not allowed in cohost`)
  }

  let plaintext = toChars(text).map((l, i) => {
    if (charStyleMap[i] === null) {
      return '';
    } else {
      return l;
    }
  }).join('');

  md.renderInline(plaintext);
  // @ts-ignore
  plaintext = md.plainText;

  if (addPlaintext) {
    return `<span style="position:absolute;height:1px;width:1px;overflow:hidden;clip:rect(1px, 1px, 1px, 1px);white-space: nowrap">${plaintext}</span><span aria-hidden="true">${processedText}</span>`;
  } else {
    return `<span role="text">${processedText}</span>`;
  }
}

window.parse = parse;

// build with `./node_modules/.bin/esbuild converter.js --bundle --outfile=out.js --format=esm`