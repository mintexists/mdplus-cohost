// ==UserScript==
// @name        MarkdownPlus - cohost.org
// @namespace   Violentmonkey Scripts
// @match       https://cohost.org/*
// @grant       none
// @version     1.0
// @author      MD+ by oatmealine, made into a userscript by mintexists
// @description 11/22/2022, 2:13:56 PM
// @require     https://raw.githubusercontent.com/enbyautumn/mdplus-cohost/master/out.js
// @downloadURL https://github.com/enbyautumn/mdplus-cohost/raw/master/mdplus.user.js
// @updateURL   https://github.com/enbyautumn/mdplus-cohost/raw/master/mdplus.user.js
// ==/UserScript==

// saves text state before transforming
window.prev = ''

window.transform = (...args) => {
  // More functions could be addedf
  // console.log(args)
  if (args[1].tags.includes('md+')) {
    args[1].tags = args[1].tags.filter(tag => tag != 'md+')
    let combinedToString = args[0].markdownBlocks.map(e => e.markdown.content).join('\n\n')
    window.prev = combinedToString;

    // let transformed = combinedToString.split('').map((s, i) => i % 2 == 0 ? s.toUpperCase() : s.toLowerCase()).join('') // makes text sArCaStIc, was just a test function
    
    // this is from the import we did in the header
    let transformed = parse(combinedToString)
    // debugger;

    let unCombined = transformed.split('\n\n').map(e => {return {
      type: "markdown",
      markdown: {
        content: e
      }
    }})

    args[0].markdownBlocks = unCombined;
  }

  if (args[1].tags.includes('md-')) {
    args[1].tags = args[1].tags.filter(tag => tag != 'md-')

    if (window.prev != '') {
      let unCombined = window.prev.split('\n\n').map(e => {return {
        type: "markdown",
        markdown: {
          content: e
        }
      }})

      window.prev = ''

      args[0].markdownBlocks = unCombined;
    }
  }

  // console.log(args)
  return args;
}

window._newFunctionCode = (...args) => {
  if (args[0][0] == 6744) {
    // 1624, 21624 - numbers that get us the part of the webpack we want - these will likely change as updates occur

    let oldFn = args[0][1][99422]

    // Patch the tag adding event. This gets us the tags listed and also the current post state
    let re = /(([a-zA-Z])\.tags=([a-zA-Z])\.tags)/gm    
    let match = re.exec(oldFn.toString())
    let replaced = oldFn.toString().replace(re, `{window.transform(${match[2]}, ${match[3]}); return ${match[1]};}`)

    // add this to the webpack
    args[0][1][99422] = new Function('...args', `(${replaced})(...args)`)
  }
}

// this lets us modify the webpack things
let newFunctionCode = `
  // console.log(...args);
  window._newFunctionCode(...args)
  return window.oldFn(...args);
`

// This section patches the webpack chunk loading so we can modify chunks
// It was a mess to figure out, and if theres a better way please let me know <3
let doneAlready = false;
window.old__LOADABLE_LOADED_CHUNKS__ = window.__LOADABLE_LOADED_CHUNKS__ || []
window.__LOADABLE_LOADED_CHUNKS__ = new Proxy(window.old__LOADABLE_LOADED_CHUNKS__, {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    } else {
      return 0; // default value
    }
  },

  set: (target, prop, val) => {
    target[prop] = val
    if (prop == 'push' && !doneAlready) {
      doneAlready = true;
      window.oldFn = val;
      let newFn = new Function('...args', newFunctionCode)
      target[prop] = newFn
    }
    return true
  }
})
