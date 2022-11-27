// ==UserScript==
// @name        MarkdownPlus - cohost.org
// @namespace   Violentmonkey Scripts
// @match       https://cohost.org/*
// @grant       none
// @version     1.0
// @author      MD+ by oatmealine, made into a userscript by mintexists
// @description 11/22/2022, 2:13:56 PM
// @require     https://gist.githubusercontent.com/enbyautumn/e451c13316f1ae654dd2d271b7cdb120/raw/c1c72d4af9ea6a9f3cbff3bfe89de74d964c9dbe/out.js
// ==/UserScript==

window.prev = ''

window.transform = (...args) => {
  console.log(args)
  if (args[1].tags.includes('md+')) {
    args[1].tags = args[1].tags.filter(tag => tag != 'md+')
    let combinedToString = args[0].markdownBlocks.map(e => e.markdown.content).join('\n\n')
    window.prev = combinedToString;

    // let transformed = combinedToString.split('').map((s, i) => i % 2 == 0 ? s.toUpperCase() : s.toLowerCase()).join('')
    let transformed = parse(combinedToString)
    debugger;

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
    // 1624, 21624
    // console.log('meowmeow')
    let oldFn = args[0][1][99422]
    // console.log(oldFn, oldFn.toString())
    // let re = /(?<=validatePost:([a-zA-Z])=>{)const [a-zA-Z]=/gm
    let re = /(?<=tags:\(([a-zA-Z]),([a-zA-Z])\)=>).+?(?=,)/gm
    let match = re.exec(oldFn.toString())
    let substring = match[0]
    let replaced = oldFn.toString().replace(re, `{window.transform(${match[1]}, ${match[2]}); return ${match[0]};}`)
    // replaced = oldFn.toString();
    args[0][1][99422] = new Function('...args', `(${replaced})(...args)`)
    // window.newFn =
    // args[0][1][21624] =
    // console.log(replaced, oldFn.toString())
  }
}

let newFunctionCode = `
  // console.log(...args);
  window._newFunctionCode(...args)
  return window.oldFn(...args);
`

let doneAlready = false;

window.old__LOADABLE_LOADED_CHUNKS__ = window.__LOADABLE_LOADED_CHUNKS__ || []
window.__LOADABLE_LOADED_CHUNKS__ = new Proxy(window.old__LOADABLE_LOADED_CHUNKS__, {
  // push(target, prop, receiver) {
  //   console.log(target, prop, receiver)
  // },
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    } else {
      return 0; // default value
    }
  },

  set: (target, prop, val) => {
    // console.log(prop, "mutated to", val.toString(), val)
    target[prop] = val
    if (prop == 'push' && !doneAlready) {
      doneAlready = true;
      // console.log("MEOW")
      // debugger
      window.oldFn = val;
      let newFn = new Function('...args', newFunctionCode)
      // let newFn = new Function('...args', `return window.oldFn(...args);`)
      target[prop] = newFn
    }
    // debugger;
    // if (val[0] == 6744) {
    //   let fn = val[1][99422]
    //   let newFn = new Function('e', 't', 'n', `console.log('meow');return (${fn.toString()})(e, t, n)`)
    //   newFn = console.log;
    //   val[1][99422] = newFn;
    //   target[prop] = val
    //   console.log(newFn)
    // }
    return true
  }
})
