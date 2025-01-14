// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"mydom.js":[function(require,module,exports) {
window.dom = {
  create: function create(node) {
    var temp = document.createElement('template');
    temp.innerHTML = node.trim();
    return temp.content.firstChild; //返回获得的元素
  },
  before: function before(node1, node2) {
    node1.parentNode.insertBefore(node2, node1.nextSibling); //这里是把node2插入到node1前面
  },
  after: function after(node1, node2) {
    node2.parentNode.insertBefore(node1, node2); //这里是把node2插到node1的后面
  },
  append: function append(parent, node) {
    parent.appendChild(node);
  },
  wrap: function wrap(node, parentNode) {
    //插入一个新的父元素
    dom.before(node, parentNode);
    dom.append(parentNode, node);
  },
  remove: function remove(node) {
    node.parentNode.removeChild(node);
    return node; //将移除的node节点进行删除
  },
  // empty(node){
  //     let {childNodes} = node //获取所有的子节点
  //     console.log(childNodes);
  //     let emptyArray = []
  //     for(let item of childNodes){
  //         emptyArray.push(item)
  //     }
  //     node.innerHTML='' //清空node
  //     return emptyArray;
  // },
  empty: function empty(node) {
    //以上方法好像有点问题？？,但是我感觉其实是可以进行使用的，这里绕过了对length的获取
    var emptyArray = [];
    var first = node.firstChild;

    while (first) {
      //动态进行push，每次将之前的node进行运算
      emptyArray.push(dom.remove(first)); //调用之前的算法，将前面的东西进行push
      // node.removeChild(node.firstChild)

      first = node.firstChild;
    }

    return emptyArray;
  },
  attr: function attr(node, name, value) {
    //读写dom节点的属性
    if (arguments.length === 3) {
      node.setAttribute(name, value);
    } else if (arguments.length === 2) {
      return node.getAttribute(name);
    }
  },
  text: function text(node, string) {
    if (arguments.length === 2) {
      if ('innerText' in node) {
        //适配ie
        node.innerText = string;
      } else {
        node.textContent = string;
      }
    } else {
      if ('innerText' in node) {
        //适配ie
        return node.innerText;
      } else {
        return node.textContent;
      }
    }
  },
  html: function html(node, string) {
    if (arguments === 2) {
      node.innerHTML = string;
    } else {
      return node.innerHTML;
    }
  },
  style: function style(node, name, value) {
    if (arguments.length === 3) {
      node.style[name] = value;
    } else if (arguments.length === 2) {
      if (name instanceof Object) {
        for (var key in name) {
          node.style[key] = name[key];
        }

        return node;
      } else if (typeof name == 'string') {
        return node.style[name];
      }
    }
  },
  class: {
    add: function add(node, string) {
      node.classList.add(string);
    },
    remove: function remove(node, string) {
      node.classList.remove(string);
    },
    has: function has(node, string) {
      return node.classList.contains(string); //返回true或者是false
    }
  },
  on: function on(node, eventName, callback) {
    node.addEventListener(eventName, callback);
  },
  off: function off(node, eventName, callback) {
    node.removeEventListener(eventName, callback);
  },
  find: function find(selector, scope) {
    // if(arguments.length===2){
    //     return scope.querySelectorAll(selector)
    // }else if(arguments.length===1){
    //     return document.querySelectorAll(selector)
    // }
    //使用短路运算符进行处理
    return (scope || document).querySelectorAll(selector);
  },
  parent: function parent(node) {
    return node.parentNode;
  },
  children: function children(node) {
    return node.children;
  },
  siblings: function siblings(node) {
    return Array.from(node.parentNode.children).filter(function (item) {
      return item !== node;
    });
  },
  //这种是利用parentNode来进行选取
  // next(node){
  //     let nodearray = Array.from(node.parentNode.children)
  //     let conutNumber 
  //     for(let i = 0; i<nodearray.length;i++){
  //         if(node === nodearray[i]){
  //             conutNumber=i
  //         }
  //         if(conutNumber===nodearray.length){
  //             return null
  //         }else{
  //             return nodearray[i+1]
  //         }
  //     }
  // }
  next: function next(node) {
    var x = node.nextSibling;

    while (x && x.nodeType === 3) {
      x = x.nextSibling;
    }

    return x;
  },
  previous: function previous(node) {
    var x = node.previousSibling;

    while (x && x.nodeType === 3) {
      x = x.previousSibling;
    }

    return x;
  },
  each: function each(nodeList, callback) {
    for (var i = 0; i < nodeList.length; i++) {
      console.log(nodeList[i]); // nodeList[i]

      callback.call(null, nodeList[i]); // 这里使用call来重定向函数，将前方的函数带入后面第一个参数进行执行
      //后面的参数为前方函数的参数
    }
  },
  index: function index(node) {
    //返回在兄弟中的位置
    //let parentNode = node.parentNode.children
    var list = dom.children(node.parentNode);

    for (var i = 0; i < list.length; i++) {
      if (node === list[i]) {
        return i;
      }
    }
  }
};
},{}],"../../../../../.config/yarn/global/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "55501" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../.config/yarn/global/node_modules/parcel/src/builtins/hmr-runtime.js","mydom.js"], null)
//# sourceMappingURL=/mydom.4b293f93.js.map