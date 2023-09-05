"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[69],{9613:(e,n,t)=>{t.d(n,{Zo:()=>p,kt:()=>m});var r=t(9496);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var l=r.createContext({}),c=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},p=function(e){var n=c(e.components);return r.createElement(l.Provider,{value:n},e.children)},u="mdxType",f={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},d=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=c(t),d=a,m=u["".concat(l,".").concat(d)]||u[d]||f[d]||o;return t?r.createElement(m,i(i({ref:n},p),{},{components:t})):r.createElement(m,i({ref:n},p))}));function m(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=d;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s[u]="string"==typeof e?e:a,i[1]=s;for(var c=2;c<o;c++)i[c]=t[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}d.displayName="MDXCreateElement"},5118:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>f,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var r=t(8957),a=(t(9496),t(9613));const o={sidebar_position:12},i="Tree Shaking",s={unversionedId:"basic/tree_shaking",id:"basic/tree_shaking",title:"Tree Shaking",description:"\u5728\u63d2\u4ef6\u521d\u59cb\u5316\u65f6\uff0c\u8bbe\u7f6e treeShaking \u63d2\u4ef6",source:"@site/docs/basic/tree_shaking.md",sourceDirName:"basic",slug:"/basic/tree_shaking",permalink:"/encode-bundle/docs/basic/tree_shaking",draft:!1,tags:[],version:"current",sidebarPosition:12,frontMatter:{sidebar_position:12},sidebar:"tutorialSidebar",previous:{title:"\u538b\u7f29\u4ee3\u7801",permalink:"/encode-bundle/docs/basic/minify"}},l={},c=[],p={toc:c},u="wrapper";function f(e){let{components:n,...t}=e;return(0,a.kt)(u,(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"tree-shaking"},"Tree Shaking"),(0,a.kt)("p",null,"\u5728\u63d2\u4ef6\u521d\u59cb\u5316\u65f6\uff0c\u8bbe\u7f6e treeShaking \u63d2\u4ef6"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"treeShakingPlugin({\n  treeshake: options.treeshake,\n  name: options.globalName,\n  silent: options.silent,\n}),\n")),(0,a.kt)("p",null,"\u9488\u5bf9\u8bbe\u7f6e",(0,a.kt)("inlineCode",{parentName:"p"},"terser"),"\u914d\u7f6e\uff0c\u901a\u8fc7\u81ea\u5b9a\u4e49\u63d2\u4ef6\uff0c\u4f7f\u7528",(0,a.kt)("inlineCode",{parentName:"p"},"rollup"),"\u8fdb\u884c ",(0,a.kt)("inlineCode",{parentName:"p"},"tree-shaking"),"\u3002"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"export const treeShakingPlugin = ({\n  treeshake,\n  name,\n  silent,\n}: {\n  treeshake?: TreeshakingStrategy\n  name?: string\n  silent?: boolean\n}): Plugin => {\n  return {\n    name: 'tree-shaking',\n\n    async renderChunk(code, info) {\n      if (!treeshake || !/\\.(cjs|js|mjs)$/.test(info.path)) return\n\n      const bundle = await rollup({\n        input: [info.path],\n        plugins: [\n          hashbang(),\n          {\n            name: 'encode-bundle',\n            resolveId(source) {\n              if (source === info.path) return source\n              return false\n            },\n            load(id) {\n              if (id === info.path) return code\n            },\n          },\n        ],\n        treeshake: treeshake,\n        makeAbsoluteExternalsRelative: false,\n        preserveEntrySignatures: 'exports-only',\n        onwarn: silent ? () => {} : undefined,\n      })\n\n      const result = await bundle.generate({\n        interop: 'auto',\n        format: this.format,\n        file: 'out.js',\n        sourcemap: !!this.options.sourcemap,\n        name,\n      })\n\n      for (const file of result.output) {\n        if (file.type === 'chunk') {\n          if (file.fileName.endsWith('out.js')) {\n            return {\n              code: file.code,\n              map: file.map,\n            }\n          }\n        }\n      }\n    },\n  }\n}\n")))}f.isMDXComponent=!0}}]);