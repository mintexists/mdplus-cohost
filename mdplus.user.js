// ==UserScript==
// @name        MarkdownPlus - cohost.org
// @namespace   Violentmonkey Scripts
// @match       https://cohost.org/*
// @grant       none
// @version     1.6
// @author      MD+ by oatmealine, made into a userscript by mintexists
// @description 11/22/2022, 2:13:56 PM
// @require     https://raw.githubusercontent.com/enbyautumn/mdplus-cohost/master/out.js
// @downloadURL https://github.com/enbyautumn/mdplus-cohost/raw/master/mdplus.user.js
// @updateURL   https://github.com/enbyautumn/mdplus-cohost/raw/master/mdplus.user.js
// @run-at      document-start
// ==/UserScript==

const realDefineProperty = Object.defineProperty.bind(Object);
Object.defineProperty = function (object, key, descriptor) {
  return realDefineProperty(object, key, {
    ...descriptor,
    configurable:
      typeof descriptor.configurable === "boolean"
        ? descriptor.configurable
        : key !== "prototype",
  });
};
const promises = [];
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.type === "childList") {
      for (const node of mutation.addedNodes) {
        if (node.nodeName === "SCRIPT" && node.dataset.chunk) {
          promises.push(
            new Promise((resolve, reject) => {
              node.addEventListener("load", resolve);
              node.addEventListener("error", reject);
            })
          );
        }
      }
    }
  }
});
observer.observe(document, { childList: true, subtree: true });
window.addEventListener("load", async (e) => {
  observer.disconnect();
  await Promise.all(promises);
  if (!window.__LOADABLE_LOADED_CHUNKS__) return;
  window.__LOADABLE_LOADED_CHUNKS__.push([
    [1870097963],
    {
      1870097963: (module, exports, require) => {
        const findLoadedModules = (check) =>
          window.__LOADABLE_LOADED_CHUNKS__
            .map((e) => Object.keys(e[1]))
            .flat()
            .map((e) => require(e))
            .filter(check);
        const React = (window.React = findLoadedModules(
          (e) => e && e.createElement && e.useState
        )[0]);
        const patched = new WeakSet();
        const refMap = new WeakMap();
        const realCreateElement = React.createElement;
        Object.defineProperty(React, "createElement", {
          value(type, props, ...children) {
            if (
              typeof type === "object" &&
              type &&
              type["$$typeof"] &&
              type["$$typeof"].toString() === "Symbol(react.provider)" &&
              typeof props === "object" &&
              props &&
              typeof props.value === "object" &&
              props.value &&
              props.value.id === "editor"
            ) {
              const realChildren = children;
              children = [
                realCreateElement.call(
                  React,
                  "div",
                  {
                    ref: node => refMap.set(props.value, node),
                    class: "mdplus",
                  },
                  ...realChildren
                ),
              ];
              if (!patched.has(props.value)) {
                let prev = "";
                const realSend = props.value.send;
                function newSend(...args) {
                  if (
                    args[0] &&
                    args[0].type &&
                    args[0].type === "TAGS_INPUT"
                  ) {
                    const tags = args[0].tags;
                    const input = this.state.context.markdownBlocks.map(x => x.markdown.content).join('\n\n');
                    if (tags.includes("md+")) {
                      args[0].tags = tags.filter((tag) => tag != "md+");
                      prev = input;

                      // this is from the import we did in the header
                      let transformed = parse(input);
                      // debugger;
                      realSend.call(this, {
                        type: "BODY_INPUT",
                        body: transformed,
                      });
                    } else if (tags.includes("md-")) {
                      args[0].tags = tags.filter((tag) => tag != "md-");

                      if (prev != "") {
                        realSend.call(this, {
                          type: "BODY_INPUT",
                          body: prev,
                        });

                        prev = "";
                      }
                    }
                  }
                  return realSend.call(this, ...args);
                }
                patched.add(props.value);
                Object.defineProperty(props.value, "send", {
                  value: newSend,
                });
              }
            }
            return realCreateElement.call(React, type, props, ...children);
          },
        });
      },
    },
    (r) => r(1870097963),
  ]);
});
