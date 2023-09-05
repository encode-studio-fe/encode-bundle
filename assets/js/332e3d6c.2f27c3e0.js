"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[668],{9613:(e,n,t)=>{t.d(n,{Zo:()=>c,kt:()=>m});var r=t(9496);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function a(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var p=r.createContext({}),l=function(e){var n=r.useContext(p),t=n;return e&&(t="function"==typeof e?e(n):a(a({},n),e)),t},c=function(e){var n=l(e.components);return r.createElement(p.Provider,{value:n},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},f=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,p=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=l(t),f=i,m=u["".concat(p,".").concat(f)]||u[f]||d[f]||o;return t?r.createElement(m,a(a({ref:n},c),{},{components:t})):r.createElement(m,a({ref:n},c))}));function m(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,a=new Array(o);a[0]=f;var s={};for(var p in n)hasOwnProperty.call(n,p)&&(s[p]=n[p]);s.originalType=e,s[u]="string"==typeof e?e:i,a[1]=s;for(var l=2;l<o;l++)a[l]=t[l];return r.createElement.apply(null,a)}return r.createElement.apply(null,t)}f.displayName="MDXCreateElement"},4303:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>p,contentTitle:()=>a,default:()=>d,frontMatter:()=>o,metadata:()=>s,toc:()=>l});var r=t(8957),i=(t(9496),t(9613));const o={sidebar_position:7},a="\u4ee3\u7801\u5206\u9694",s={unversionedId:"basic/splittling",id:"basic/splittling",title:"\u4ee3\u7801\u5206\u9694",description:"\u5728runEsbuild\u65b9\u6cd5\u4e2d\uff0c\u9488\u5bf9 ESM \u7684\u6a21\u5757\uff0c\u9ed8\u8ba4\u8bbe\u7f6esplitting\u4e3atrue\u3002",source:"@site/docs/basic/splittling.md",sourceDirName:"basic",slug:"/basic/splittling",permalink:"/encode-bundle/docs/basic/splittling",draft:!1,tags:[],version:"current",sidebarPosition:7,frontMatter:{sidebar_position:7},sidebar:"tutorialSidebar",previous:{title:"\u6784\u5efa\u4ea7\u7269",permalink:"/encode-bundle/docs/basic/format"},next:{title:"\u76ee\u6807\u73af\u5883",permalink:"/encode-bundle/docs/basic/target"}},p={},l=[],c={toc:l},u="wrapper";function d(e){let{components:n,...t}=e;return(0,i.kt)(u,(0,r.Z)({},c,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"\u4ee3\u7801\u5206\u9694"},"\u4ee3\u7801\u5206\u9694"),(0,i.kt)("p",null,"\u5728",(0,i.kt)("inlineCode",{parentName:"p"},"runEsbuild"),"\u65b9\u6cd5\u4e2d\uff0c\u9488\u5bf9 ESM \u7684\u6a21\u5757\uff0c\u9ed8\u8ba4\u8bbe\u7f6e",(0,i.kt)("inlineCode",{parentName:"p"},"splitting"),"\u4e3a",(0,i.kt)("inlineCode",{parentName:"p"},"true"),"\u3002"),(0,i.kt)("p",null,"\u5426\u5219\uff0c\u6839\u636e CLI \u6307\u4ee4\u4f20\u7ed9",(0,i.kt)("inlineCode",{parentName:"p"},"esbuild"),"\u7684",(0,i.kt)("inlineCode",{parentName:"p"},"splitting"),"\u5c5e\u6027\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"const splitting =\n  format === 'iife'\n    ? false\n    : typeof options.splitting === 'boolean'\n    ? options.splitting\n    : format === 'esm'\n\nesbuild({\n  splitting,\n})\n")),(0,i.kt)("p",null,"\u9488\u5bf9",(0,i.kt)("inlineCode",{parentName:"p"},"CJS"),"\uff0c\u4f7f\u7528\u81ea\u5b9a\u4e49\u63d2\u4ef6\uff0c\u57fa\u4e8e",(0,i.kt)("inlineCode",{parentName:"p"},"sucrase"),"\u8fdb\u884c\u6784\u5efa\u3002"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"export const cjsSplitting = (): Plugin => {\n  return {\n    name: 'cjs-splitting',\n\n    async renderChunk(code, info) {\n      if (\n        !this.splitting ||\n        this.options.treeshake || // <-- handled by rollup\n        this.format !== 'cjs' ||\n        info.type !== 'chunk' ||\n        !/\\.(js|cjs)$/.test(info.path)\n      ) {\n        return\n      }\n\n      const { transform } = await import('sucrase')\n\n      const result = transform(code, {\n        filePath: info.path,\n        transforms: ['imports'],\n        sourceMapOptions: this.options.sourcemap\n          ? {\n              compiledFilename: info.path,\n            }\n          : undefined,\n      })\n\n      return {\n        code: result.code,\n        map: result.sourceMap,\n      }\n    },\n  }\n}\n")))}d.isMDXComponent=!0}}]);