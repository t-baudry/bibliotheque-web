(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,236726,908035,t=>{"use strict";var e=t.i(500932),n=t.i(843476);function i(t){return"span"===t._type&&"text"in t&&"string"==typeof t.text&&(void 0===t.marks||Array.isArray(t.marks)&&t.marks.every(t=>"string"==typeof t))}function r(t){return"string"==typeof t._type&&"@"!==t._type[0]&&(!("markDefs"in t)||!t.markDefs||Array.isArray(t.markDefs)&&t.markDefs.every(t=>"string"==typeof t._key))&&"children"in t&&Array.isArray(t.children)&&t.children.every(t=>"object"==typeof t&&"_type"in t)}function o(t){return r(t)&&"listItem"in t&&"string"==typeof t.listItem&&(void 0===t.level||"number"==typeof t.level)}function l(t){return"@list"===t._type}function s(t){return"@span"===t._type}function a(t){return"@text"===t._type}let c=["strong","em","code","underline","strike-through"];function u(t,e,n){if(!i(t)||!t.marks||!t.marks.length)return[];let r=t.marks.slice(),o={};return r.forEach(t=>{o[t]=1;for(let r=e+1;r<n.length;r++){let e=n[r];if(e&&i(e)&&Array.isArray(e.marks)&&-1!==e.marks.indexOf(t))o[t]++;else break}}),r.sort((t,e)=>(function(t,e,n){let i=t[e],r=t[n];if(i!==r)return r-i;let o=c.indexOf(e),l=c.indexOf(n);return o===l?e.localeCompare(n):o-l})(o,t,e))}function h(t){let{children:e}=t,n=t.markDefs??[];if(!e||!e.length)return[];let r=e.map(u),o={_type:"@span",children:[],markType:"<unknown>"},l=[o];for(let t=0;t<e.length;t++){let o=e[t];if(!o)continue;let s=r[t]||[],a=1;if(l.length>1)for(;a<l.length;a++){let t=s.indexOf(l[a]?.markKey||"");if(-1===t)break;s.splice(t,1)}let c=(l=l.slice(0,a))[l.length-1];if(c){for(let t of s){let e=n?.find(e=>e._key===t),i={_type:"@span",_key:o._key,children:[],markDef:e,markType:e?e._type:t,markKey:t};c.children.push(i),l.push(i),c=i}if(i(o)){let t=o.text.split("\n");for(let e=t.length;e-- >1;)t.splice(e,0,"\n");c.children=c.children.concat(t.map(t=>({_type:"@text",text:t})))}else c.children=c.children.concat(o)}}return o.children}function p(t,e){let n=[],i;for(let s=0;s<t.length;s++){let a=t[s];if(a){var r,l;if(!o(a)){n.push(a),i=void 0;continue}if(!i){let t=f(a,s,e,0);i=t.current,n.push(t.root);continue}if(r=a,l=i,(r.level||1)===l.level&&r.listItem===l.listItem){i.children.push(a);continue}if((a.level||1)>i.level){let t=f(a,s,e,i.level);g(i,t.root),i=t.current;continue}if((a.level||1)<i.level){let t=n[n.length-1],r=t&&y(t,a);if(r){(i=r).children.push(a);continue}let o=f(a,s,e,0);i=o.current,n.push(o.root);continue}if(a.listItem!==i.listItem){let t=n[n.length-1],r=t&&y(t,{level:a.level||1});if(r&&r.listItem===a.listItem){(i=r).children.push(a);continue}{let t=f(a,s,e,0);i=t.current,n.push(t.root);continue}}console.warn("Unknown state encountered for block",a),n.push(a)}}return n}function d(t,e,n,i,r){let o=i===(t.level||1)?"":`-${i}`;return{_type:"@list",_key:`${t._key||`${e}`}-parent${o}`,mode:n,level:i,listItem:t.listItem,children:r}}function f(t,e,n,i){let r=t.level||1,o=i+1,l=d(t,e,n,o,m(t,e,n,o,r)),s=l;for(let i=o+1;i<=r;i++){let o=d(t,e,n,i,m(t,e,n,i,r));g(s,o),s=o}return{root:l,current:s}}function m(t,e,n,i,r){var o,l,s;return i===r?[t]:"html"===n?[(o=t,l=e,s=i,{...o,_key:`${o._key||`${l}`}-placeholder-${s}`,children:[],level:s})]:[]}function g(t,e){if("html"===t.mode&&"html"===e.mode){let n=t.children.length-1,i=t.children[n];if(!i)return;t.children[n]={...i,children:[...i.children,e]};return}"direct"===t.mode&&"direct"===e.mode&&t.children.push(e)}function y(t,e){let n=e.level||1,r=e.listItem||"normal",o="string"==typeof e.listItem;if(l(t)&&(t.level||1)===n&&o&&(t.listItem||"normal")===r)return t;if(!("children"in t))return;let s=t.children[t.children.length-1];return s&&!i(s)?y(s,e):void 0}function x(t){let e="";return t.children.forEach(t=>{a(t)?e+=t.text:s(t)&&(e+=x(t))}),e}let w=/^\s/,b=/\s$/,$="html";t.s(["LIST_NEST_MODE_HTML",0,$,"buildMarksTree",0,h,"isPortableTextBlock",0,r,"isPortableTextListItemBlock",0,o,"isPortableTextToolkitList",0,l,"isPortableTextToolkitSpan",0,s,"isPortableTextToolkitTextNode",0,a,"nestLists",0,p,"spanToPlainText",0,x,"toPlainText",0,function(t){let e=Array.isArray(t)?t:[t],n="";return e.forEach((t,o)=>{if(!r(t))return;let l=!1;t.children.forEach(t=>{i(t)?(n+=l&&n&&!b.test(n)&&!w.test(t.text)?" ":"",n+=t.text,l=!1):l=!0}),o!==e.length-1&&(n+="\n\n")}),n}],908035);let k={textDecoration:"underline"},v=(t,e)=>`[@portabletext/react] Unknown ${t}, specify a component for it in the \`components.${e}\` prop`,I=t=>v(`block type "${t}"`,"types");function j(t){console.warn(t)}let _={display:"none"},O={types:{},block:{normal:function(t){let i=(0,e.c)(2),{children:r}=t,o;return i[0]===r?o=i[1]:(o=(0,n.jsx)("p",{children:r}),i[0]=r,i[1]=o),o},blockquote:function(t){let i=(0,e.c)(2),{children:r}=t,o;return i[0]===r?o=i[1]:(o=(0,n.jsx)("blockquote",{children:r}),i[0]=r,i[1]=o),o},h1:function(t){let i=(0,e.c)(2),{children:r}=t,o;return i[0]===r?o=i[1]:(o=(0,n.jsx)("h1",{children:r}),i[0]=r,i[1]=o),o},h2:function(t){let i=(0,e.c)(2),{children:r}=t,o;return i[0]===r?o=i[1]:(o=(0,n.jsx)("h2",{children:r}),i[0]=r,i[1]=o),o},h3:function(t){let i=(0,e.c)(2),{children:r}=t,o;return i[0]===r?o=i[1]:(o=(0,n.jsx)("h3",{children:r}),i[0]=r,i[1]=o),o},h4:function(t){let i=(0,e.c)(2),{children:r}=t,o;return i[0]===r?o=i[1]:(o=(0,n.jsx)("h4",{children:r}),i[0]=r,i[1]=o),o},h5:function(t){let i=(0,e.c)(2),{children:r}=t,o;return i[0]===r?o=i[1]:(o=(0,n.jsx)("h5",{children:r}),i[0]=r,i[1]=o),o},h6:function(t){let i=(0,e.c)(2),{children:r}=t,o;return i[0]===r?o=i[1]:(o=(0,n.jsx)("h6",{children:r}),i[0]=r,i[1]=o),o}},marks:{em:function(t){let i=(0,e.c)(2),{children:r}=t,o;return i[0]===r?o=i[1]:(o=(0,n.jsx)("em",{children:r}),i[0]=r,i[1]=o),o},strong:function(t){let i=(0,e.c)(2),{children:r}=t,o;return i[0]===r?o=i[1]:(o=(0,n.jsx)("strong",{children:r}),i[0]=r,i[1]=o),o},code:function(t){let i=(0,e.c)(2),{children:r}=t,o;return i[0]===r?o=i[1]:(o=(0,n.jsx)("code",{children:r}),i[0]=r,i[1]=o),o},underline:function(t){let i=(0,e.c)(2),{children:r}=t,o;return i[0]===r?o=i[1]:(o=(0,n.jsx)("span",{style:k,children:r}),i[0]=r,i[1]=o),o},"strike-through":function(t){let i=(0,e.c)(2),{children:r}=t,o;return i[0]===r?o=i[1]:(o=(0,n.jsx)("del",{children:r}),i[0]=r,i[1]=o),o},link:function(t){let i=(0,e.c)(3),{children:r,value:o}=t,l=o?.href,s;return i[0]!==r||i[1]!==l?(s=(0,n.jsx)("a",{href:l,children:r}),i[0]=r,i[1]=l,i[2]=s):s=i[2],s}},list:{number:function(t){let i=(0,e.c)(2),{children:r}=t,o;return i[0]===r?o=i[1]:(o=(0,n.jsx)("ol",{children:r}),i[0]=r,i[1]=o),o},bullet:function(t){let i=(0,e.c)(2),{children:r}=t,o;return i[0]===r?o=i[1]:(o=(0,n.jsx)("ul",{children:r}),i[0]=r,i[1]=o),o}},listItem:function(t){let i=(0,e.c)(2),{children:r}=t,o;return i[0]===r?o=i[1]:(o=(0,n.jsx)("li",{children:r}),i[0]=r,i[1]=o),o},hardBreak:function(){let t=(0,e.c)(1),i;return t[0]===Symbol.for("react.memo_cache_sentinel")?(i=(0,n.jsx)("br",{}),t[0]=i):i=t[0],i},unknownType:function(t){let i=(0,e.c)(5),{value:r,isInline:o}=t,l;i[0]===r._type?l=i[1]:(l=I(r._type),i[0]=r._type,i[1]=l);let s=l,a;return i[2]!==o||i[3]!==s?(a=(0,n.jsx)(o?"span":"div",{style:_,children:s}),i[2]=o,i[3]=s,i[4]=a):a=i[4],a},unknownMark:function(t){let i=(0,e.c)(3),{markType:r,children:o}=t,l=`unknown__pt__mark__${r}`,s;return i[0]!==o||i[1]!==l?(s=(0,n.jsx)("span",{className:l,children:o}),i[0]=o,i[1]=l,i[2]=s):s=i[2],s},unknownList:function(t){let i=(0,e.c)(2),{children:r}=t,o;return i[0]===r?o=i[1]:(o=(0,n.jsx)("ul",{children:r}),i[0]=r,i[1]=o),o},unknownListItem:function(t){let i=(0,e.c)(2),{children:r}=t,o;return i[0]===r?o=i[1]:(o=(0,n.jsx)("li",{children:r}),i[0]=r,i[1]=o),o},unknownBlockStyle:function(t){let i=(0,e.c)(2),{children:r}=t,o;return i[0]===r?o=i[1]:(o=(0,n.jsx)("p",{children:r}),i[0]=r,i[1]=o),o}};function A(t,e,n){let i=e[n],r=t[n];return"function"==typeof i||i&&"function"==typeof r?i:i?{...r,...i}:r}function T(t){let{node:e,index:n,isInline:i,renderNode:r}=t,o=h(e).map((t,e)=>r({node:t,isInline:!0,index:e,renderNode:r}));return{_key:e._key||`block-${n}`,children:o,index:n,isInline:i,node:e}}function S(){}t.s(["PortableText",0,function(t){let i,c=(0,e.c)(10),{value:u,components:h,listNestingMode:d,onMissingComponent:f}=t,m=(void 0===f?j:f)||S,g;if(Array.isArray(u))g=u;else if(null==u){let t;c[0]===Symbol.for("react.memo_cache_sentinel")?(t=[],c[0]=t):t=c[0],g=t}else{let t;c[1]===u?t=c[2]:(t=[u],c[1]=u,c[2]=t),g=t}if(c[3]!==g||c[4]!==h||c[5]!==m||c[6]!==d){var y,w;let t=p(g,d||$),e=(y=h?function(t,e){let{block:n,list:i,listItem:r,marks:o,types:l,...s}=e;return{...t,block:A(t,e,"block"),list:A(t,e,"list"),listItem:A(t,e,"listItem"),marks:A(t,e,"marks"),types:A(t,e,"types"),...s}}(O,h):O,w=m,function t(e){var i,c,u,h,p,d,f,m;let g,b,{node:$,index:k,isInline:j}=e,_=$._key||`node-${k}`;return l($)?function(e,i,r){let o=e.children.map((e,n)=>t({node:e._key?e:{...e,_key:`li-${i}-${n}`},index:n,isInline:!1,renderNode:t})),l=y.list,s=("function"==typeof l?l:l[e.listItem])||y.unknownList;if(s===y.unknownList){let t=e.listItem||"bullet";w(v(`list style "${t}"`,"list"),{nodeType:"listStyle",type:t})}return(0,n.jsx)(s,{value:e,index:i,isInline:!1,renderNode:t,children:o},r)}($,k,_):o($)?function(e,i,r){let o=T({node:e,index:i,isInline:!1,renderNode:t}),l=y.listItem,s=("function"==typeof l?l:l[e.listItem])||y.unknownListItem;if(s===y.unknownListItem){let t=e.listItem||"bullet";w(v(`list item style "${t}"`,"listItem"),{type:t,nodeType:"listItemStyle"})}let a=o.children;if(e.style&&"normal"!==e.style){let{listItem:n,...r}=e;a=t({node:r,index:i,isInline:!1,renderNode:t})}return(0,n.jsx)(s,{value:e,index:i,isInline:!1,renderNode:t,children:a},r)}($,k,_):s($)?function(e,i){let{markDef:r,markType:o,markKey:l}=e,s=y.marks[o]||y.unknownMark,a=e.children.map((e,n)=>t({node:e,index:n,isInline:!0,renderNode:t}));return s===y.unknownMark&&w(v(`mark type "${o}"`,"marks"),{nodeType:"mark",type:o}),(0,n.jsx)(s,{text:x(e),value:r,markType:o,markKey:l,renderNode:t,children:a},i)}($,_):$._type in y.types?(i=$,c=k,u=_,h=j,(g=y.types[i._type])?(0,n.jsx)(g,{value:i,isInline:h,index:c,renderNode:t},u):null):r($)?function(e,i,r,o){let{_key:l,...s}=T({node:e,index:i,isInline:o,renderNode:t}),a=s.node.style||"normal",c=("function"==typeof y.block?y.block:y.block[a])||y.unknownBlockStyle;return c===y.unknownBlockStyle&&w(v(`block style "${a}"`,"block"),{nodeType:"blockStyle",type:a}),(0,n.jsx)(c,{...s,value:s.node,renderNode:t},r)}($,k,_,j):a($)?function(t,e){if("\n"===t.text){let t=y.hardBreak;return t?(0,n.jsx)(t,{},e):"\n"}return t.text}($,_):(p=$,d=k,f=_,m=j,w(I(p._type),{nodeType:"block",type:p._type}),b=y.unknownType,(0,n.jsx)(b,{value:p,isInline:m,index:d,renderNode:t},f))});i=t.map((t,n)=>e({node:t,index:n,isInline:!1,renderNode:e})),c[3]=g,c[4]=h,c[5]=m,c[6]=d,c[7]=i}else i=c[7];let b=i,k;return c[8]===b?k=c[9]:(k=(0,n.jsx)(n.Fragment,{children:b}),c[8]=b,c[9]=k),k}],236726)},273299,t=>{"use strict";var e;let n="image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg";function i(t){return`image-${t.split("/").slice(-1)[0]}`.replace(/\.([a-z]+)$/,"-$1")}let r=[["width","w"],["height","h"],["format","fm"],["download","dl"],["blur","blur"],["sharpen","sharp"],["invert","invert"],["orientation","or"],["minHeight","min-h"],["maxHeight","max-h"],["minWidth","min-w"],["maxWidth","max-w"],["quality","q"],["fit","fit"],["crop","crop"],["saturation","sat"],["auto","auto"],["dpr","dpr"],["pad","pad"],["frame","frame"]],o=["clip","crop","fill","fillmax","max","scale","min"],l=["top","bottom","left","right","center","focalpoint","entropy"],s=["format"];function a(t){let{apiHost:e,projectId:n,dataset:i}=t,r={baseUrl:(e||"https://api.sanity.io").replace(/^https:\/\/api\./,"https://cdn.")},o=t.resource??t["~experimental_resource"];if(o?.type==="media-library"){if("string"!=typeof o.id||0===o.id.length)throw Error('Media library clients must include an id in "resource"');return{...r,mediaLibraryId:o.id}}if(o?.type==="canvas"){if("string"!=typeof o.id||0===o.id.length)throw Error('Canvas clients must include an id in "resource"');return{...r,canvasId:o.id}}if(o?.type==="dataset"){if("string"!=typeof o.id||0===o.id.length)throw Error('Dataset clients must include an id in "resource"');let[t,e]=o.id.split(".");if(!t||!e)throw Error('Dataset resource id must be in the format "projectId.dataset", got: '+o.id);return{...r,projectId:t,dataset:e}}return{...r,projectId:n,dataset:i}}function c(t){return t&&"config"in t&&"function"==typeof t.config?a(t.config()):t&&"clientConfig"in t&&"object"==typeof t.clientConfig?a(t.clientConfig):t||{}}class u{options;constructor(t,e){this.options=t?{...t.options||{},...e||{}}:{...e||{}}}withOptions(t){return new u(this,function(t,e){let n=e.baseUrl||t.baseUrl,i={baseUrl:n};for(let t in e)e.hasOwnProperty(t)&&(i[function(t){for(let e of r){let[n,i]=e;if(t===n||t===i)return n}return t}(t)]=e[t]);return{baseUrl:n,...i}}(this.options,t))}image(t){return this.withOptions({source:t})}dataset(t){return this.withOptions({dataset:t})}projectId(t){return this.withOptions({projectId:t})}withClient(t){let e=c(t),n={...this.options};return delete n.baseUrl,delete n.projectId,delete n.dataset,delete n.mediaLibraryId,delete n.canvasId,new u(null,{...e,...n})}bg(t){return this.withOptions({bg:t})}dpr(t){return this.withOptions(t&&1!==t?{dpr:t}:{})}width(t){return this.withOptions({width:t})}height(t){return this.withOptions({height:t})}focalPoint(t,e){return this.withOptions({focalPoint:{x:t,y:e}})}maxWidth(t){return this.withOptions({maxWidth:t})}minWidth(t){return this.withOptions({minWidth:t})}maxHeight(t){return this.withOptions({maxHeight:t})}minHeight(t){return this.withOptions({minHeight:t})}size(t,e){return this.withOptions({width:t,height:e})}blur(t){return this.withOptions({blur:t})}sharpen(t){return this.withOptions({sharpen:t})}rect(t,e,n,i){return this.withOptions({rect:{left:t,top:e,width:n,height:i}})}format(t){return this.withOptions({format:t})}invert(t){return this.withOptions({invert:t})}orientation(t){return this.withOptions({orientation:t})}quality(t){return this.withOptions({quality:t})}forceDownload(t){return this.withOptions({download:t})}flipHorizontal(){return this.withOptions({flipHorizontal:!0})}flipVertical(){return this.withOptions({flipVertical:!0})}ignoreImageParams(){return this.withOptions({ignoreImageParams:!0})}fit(t){if(-1===o.indexOf(t))throw Error(`Invalid fit mode "${t}"`);return this.withOptions({fit:t})}crop(t){if(-1===l.indexOf(t))throw Error(`Invalid crop mode "${t}"`);return this.withOptions({crop:t})}saturation(t){return this.withOptions({saturation:t})}auto(t){if(-1===s.indexOf(t))throw Error(`Invalid auto mode "${t}"`);return this.withOptions({auto:t})}pad(t){return this.withOptions({pad:t})}vanityName(t){return this.withOptions({vanityName:t})}frame(t){if(1!==t)throw Error(`Invalid frame value "${t}"`);return this.withOptions({frame:t})}url(){return function(t){let e={...t||{}},o=e.source;delete e.source;let l=function(t){var e;let n;if(!t)return null;if("string"==typeof t&&(e=t,/^https?:\/\//.test(`${e}`)))n={asset:{_ref:i(t)}};else if("string"==typeof t)n={asset:{_ref:t}};else if(t&&"string"==typeof t._ref)n={asset:t};else if(t&&"string"==typeof t._id)n={asset:{_ref:t._id||""}};else if(t&&t.asset&&"string"==typeof t.asset.url)n={asset:{_ref:i(t.asset.url)}};else{if("object"!=typeof t.asset)return null;n={...t}}return t.crop&&(n.crop=t.crop),t.hotspot&&(n.hotspot=t.hotspot),function(t){if(t.crop&&t.hotspot)return t;let e={...t};return e.crop||(e.crop={left:0,top:0,bottom:0,right:0}),e.hotspot||(e.hotspot={x:.5,y:.5,height:1,width:1}),e}(n)}(o);if(!l){if(o&&"object"==typeof o&&null!==o&&o._upload&&(!o.asset||!o.asset._ref))return"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8HwQACfsD/QNViZkAAAAASUVORK5CYII=";throw Error(`Unable to resolve image URL from source (${JSON.stringify(o)})`)}let s=function(t){let[,e,i,r]=t.split("-");if(!e||!i||!r)throw Error(`Malformed asset _ref '${t}'. Expected an id like "${n}".`);let[o,l]=i.split("x"),s=+o,a=+l;if(!(isFinite(s)&&isFinite(a)))throw Error(`Malformed asset _ref '${t}'. Expected an id like "${n}".`);return{id:e,width:s,height:a,format:r}}(l.asset._ref||l.asset._id||""),a=Math.round(l.crop.left*s.width),c=Math.round(l.crop.top*s.height),u={left:a,top:c,width:Math.round(s.width-l.crop.right*s.width-a),height:Math.round(s.height-l.crop.bottom*s.height-c)},h=l.hotspot.height*s.height/2,p=l.hotspot.width*s.width/2,d=l.hotspot.x*s.width,f=l.hotspot.y*s.height;return e.rect||e.focalPoint||e.ignoreImageParams||e.crop||(e={...e,...function(t,e){let n,i=e.width,r=e.height;if(!(i&&r))return{width:i,height:r,rect:t.crop};let o=t.crop,l=t.hotspot,s=i/r;if(o.width/o.height>s){let t=Math.round(o.height),e=Math.round(t*s),i=Math.max(0,Math.round(o.top)),r=Math.max(0,Math.round(Math.round((l.right-l.left)/2+l.left)-e/2));r<o.left?r=o.left:r+e>o.left+o.width&&(r=o.left+o.width-e),n={left:r,top:i,width:e,height:t}}else{let t=o.width,e=Math.round(t/s),i=Math.max(0,Math.round(o.left)),r=Math.max(0,Math.round(Math.round((l.bottom-l.top)/2+l.top)-e/2));r<o.top?r=o.top:r+e>o.top+o.height&&(r=o.top+o.height-e),n={left:i,top:r,width:t,height:e}}return{width:i,height:r,rect:n}}({crop:u,hotspot:{left:d-p,top:f-h,right:d+p,bottom:f+h}},e)}),function(t){let e,n=(t.baseUrl||"https://cdn.sanity.io").replace(/\/+$/,""),i=t.vanityName?`/${t.vanityName}`:"",o=`${t.asset.id}-${t.asset.width}x${t.asset.height}.${t.asset.format}${i}`;e=t.mediaLibraryId?`${n}/media-libraries/${t.mediaLibraryId}/images/${o}`:t.canvasId?`${n}/images/canvases/${t.canvasId}/${o}`:`${n}/images/${t.projectId}/${t.dataset}/${o}`;let l=[];if(t.rect){let{left:e,top:n,width:i,height:r}=t.rect;(0!==e||0!==n||r!==t.asset.height||i!==t.asset.width)&&l.push(`rect=${e},${n},${i},${r}`)}t.bg&&l.push(`bg=${t.bg}`),t.focalPoint&&(l.push(`fp-x=${t.focalPoint.x}`),l.push(`fp-y=${t.focalPoint.y}`));let s=[t.flipHorizontal&&"h",t.flipVertical&&"v"].filter(Boolean).join("");return s&&l.push(`flip=${s}`),r.forEach(e=>{let[n,i]=e;"u">typeof t[n]?l.push(`${i}=${encodeURIComponent(t[n])}`):"u">typeof t[i]&&l.push(`${i}=${encodeURIComponent(t[i])}`)}),0===l.length?e:`${e}?${l.join("&")}`}({...e,asset:s})}(this.options)}toString(){return this.url()}}e=["The default export of @sanity/image-url has been deprecated. Use the named export `createImageUrlBuilder` instead."],t.s(["createImageUrlBuilder",0,function(t){return new u(null,c(t))}])},64064,t=>{"use strict";var e=t.i(843476),n=t.i(500932),i=t.i(156569),r=t.i(800147),o=t.i(189897),l=t.i(494473),s=t.i(575509),a=t.i(212960),c=t.i(997053);let u=(0,c.default)(s.Div).attrs({as:"section"}).withConfig({componentId:"sc-e23cbf24-0"})(()=>c.css`
		position: relative;
		z-index: 1;

		background: ${(0,s.getBrand)("bc1")};
		padding-top: 50dvh;

		/* NOTE • LastUpdated is position: fixed, which #page's transform turns into
		   "bottom of the page". Containing it here pins each document's date to the
		   bottom of that document — the same spot on a single legal page, and no
		   pile-up where /legal/ stacks three. */
		contain: layout;

		/* A hairline between documents where /legal/ stacks them, inset to the
		   grid's margins. Drawn from the grid, where --grid-margin is defined. */
		& + & > waffl-grid::before {
			content: '';
			position: absolute;
			top: 0;
			left: var(--grid-margin);
			right: var(--grid-margin);
			height: 1px;
			background: ${(0,s.getBrand)("bc5",10)};
		}

		${s.bp.l`padding-top: 0;`}
	`),h=(0,c.default)(s.Div).withConfig({componentId:"sc-e23cbf24-1"})(()=>c.css`
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-start;

		gap: ${(0,s.getGap)("m")};

		${s.bp.l`
			position: sticky;
			top: 0;
			height: 100dvh;
		`}

	`),p=c.default.h1.withConfig({componentId:"sc-e23cbf24-2"})(()=>c.css`
		${a.displayL}

		color: ${(0,s.getBrand)("bc5")};
	`),d=c.default.nav.withConfig({componentId:"sc-e23cbf24-3"})(()=>c.css`
		display: flex;
		flex-wrap: wrap;
		gap: ${(0,s.getGap)("xs")} ${(0,s.getGap)("m")};

		a {
			${a.titleS}

			color: ${(0,s.getBrand)("bc5",55)};
			transition: color ${(0,s.getTime)("s")} ${(0,s.getEase)("ease")};

			&[aria-current] {
				color: ${(0,s.getBrand)("bc5")};
			}

			@media (hover: hover) and (pointer: fine) {
				&:hover {
					color: ${(0,s.getBrand)("bc5")};
				}
			}
		}
	`),f=c.default.p.withConfig({componentId:"sc-e23cbf24-4"})(()=>c.css`
		display: flex;
		flex-direction: column;
		width: max-content;

		${s.bp.l`
			position: fixed;
			bottom: ${(0,s.getGap)("xl")};
			left: ${(0,s.getGap)("xl")};
		`}

		span {
			${a.captionL}
			color: ${(0,s.getBrand)("bc5",100)};
		}

		span:first-child {
			color: ${(0,s.getBrand)("bc5",55)};
		}
	`),m=(0,c.default)(s.Div).withConfig({componentId:"sc-e23cbf24-5"})(()=>c.css`
		display: flex;
		flex-direction: column;
		padding-bottom: ${(0,s.getGap)("huge")};

		${s.bp.l`
			padding-bottom: ${(0,s.getGap)("col")};
		`}
	`),g=(0,c.default)(s.Div).withConfig({componentId:"sc-e23cbf24-6"})(()=>c.css`
		display: flex;
		flex-direction: column;
		gap: ${(0,s.getGap)("m")};

		padding-top: ${(0,s.getGap)("huge")};
		padding-bottom: ${(0,s.getGap)("xl")};
		

		${s.bp.l`
			padding-top: 50dvh;
		`}

		p {
			${a.titleL}
			text-transform: none;
			color: ${(0,s.getBrand)("bc5",80)};
		}
	`),y=(0,c.default)(s.Div).withConfig({componentId:"sc-e23cbf24-7"})(()=>c.css`
		display: flex;
		flex-direction: column;
		gap: ${(0,s.getGap)("xl")};
	`),x=c.default.div.withConfig({componentId:"sc-e23cbf24-8"})(()=>c.css`
		display: flex;
		flex-direction: column;
		gap: ${(0,s.getGap)("m")};

		h2 {
			display: flex;
			flex-direction: column;

			${a.titleL}

			color: ${(0,s.getBrand)("bc5")};
			text-wrap: pretty;

			/* The section number — by attribute, since the AnimatedHeading wrappers
			   inside this h2 are spans too and must not pick this up. */
			[data-name='number'] {
				${a.headlineL}
				opacity: 0.2;
			}
		}

		p {
			${a.bodyS}

			color: ${(0,s.getBrand)("bc5",80)};
			text-wrap: pretty;
		}

		ul,
		ol {
			${a.bodyS}

			padding-left: 1.2em;
			color: ${(0,s.getBrand)("bc5",80)};
		}

		ul {
			list-style-type: disc;
		}

		ol {
			list-style-type: decimal;
		}

		a {
			color: inherit;
			text-decoration: underline;
			text-underline-offset: 0.2em;
		}
	`),w=t=>{let i,r,s,a,c,x,w,I,j,_,O,A,T,S,C,L,M,B,E=(0,n.c)(58),{routePath:P,id:U,jumpLinks:D,isPrimary:G,title:N,description:H,sections:R,lastUpdated:z}=t;E[0]!==D?(i=void 0===D?[]:D,E[0]=D,E[1]=i):i=E[1];let V=i,W=void 0===G||G;E[2]!==N?(r=(0,o.cleanSanityString)(N),E[2]=N,E[3]=r):r=E[3];let q=r;if(E[4]!==H||E[5]!==q||E[6]!==U||E[7]!==W||E[8]!==V||E[9]!==z||E[10]!==P||E[11]!==R){I=Symbol.for("react.early_return_sentinel");t:{let t,n,i,r,y,v,S=(0,o.cleanSanityString)(H);E[23]!==R?(t=R??[],E[23]=R,E[24]=t):t=E[24],w=t;let C=W?"h1":"h2";if(!q){I=null;break t}x=u,A=U,T=P,c=l.default,E[25]!==C||E[26]!==q?(n=(0,e.jsx)(p,{as:C,children:q}),E[25]=C,E[26]=q,E[27]=n):n=E[27],E[28]!==V?(i=V.length>0&&(0,e.jsx)(d,{"aria-label":"Legal documents",children:V.map(b)}),E[28]=V,E[29]=i):i=E[29],E[30]===Symbol.for("react.memo_cache_sentinel")?(r=(0,e.jsx)("span",{children:"Last Updated"}),E[30]=r):r=E[30],E[31]!==z?(y=z?new Date(z).toLocaleDateString("en-US",{day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}):"",E[31]=z,E[32]=y):y=E[32],E[33]!==y?(v=(0,e.jsxs)(f,{children:[r,(0,e.jsx)("span",{children:y})]}),E[33]=y,E[34]=v):v=E[34],E[35]!==n||E[36]!==i||E[37]!==v?(O=(0,e.jsxs)(h,{$l:"2/5",children:[n,i,v]}),E[35]=n,E[36]=i,E[37]=v,E[38]=O):O=E[38],a=m,_="8/12",s=g,j=S?.split(/\r?\n/).filter($).map(k)}E[4]=H,E[5]=q,E[6]=U,E[7]=W,E[8]=V,E[9]=z,E[10]=P,E[11]=R,E[12]=s,E[13]=a,E[14]=c,E[15]=x,E[16]=w,E[17]=I,E[18]=j,E[19]=_,E[20]=O,E[21]=A,E[22]=T}else s=E[12],a=E[13],c=E[14],x=E[15],w=E[16],I=E[17],j=E[18],_=E[19],O=E[20],A=E[21],T=E[22];return I!==Symbol.for("react.early_return_sentinel")?I:(E[39]!==s||E[40]!==j?(S=(0,e.jsx)(s,{children:j}),E[39]=s,E[40]=j,E[41]=S):S=E[41],E[42]!==w?(C=w.length>0&&(0,e.jsx)(y,{children:w.map(v)}),E[42]=w,E[43]=C):C=E[43],E[44]!==a||E[45]!==S||E[46]!==C||E[47]!==_?(L=(0,e.jsxs)(a,{$l:_,children:[S,C]}),E[44]=a,E[45]=S,E[46]=C,E[47]=_,E[48]=L):L=E[48],E[49]!==c||E[50]!==L||E[51]!==O?(M=(0,e.jsxs)(c,{children:[O,L]}),E[49]=c,E[50]=L,E[51]=O,E[52]=M):M=E[52],E[53]!==x||E[54]!==M||E[55]!==A||E[56]!==T?(B=(0,e.jsx)(x,{id:A,"data-page-route":T,children:M}),E[53]=x,E[54]=M,E[55]=A,E[56]=T,E[57]=B):B=E[57],B)};function b(t){return(0,e.jsx)("a",{href:t.href,"aria-current":t.isCurrent?"location":void 0,children:t.label},t.href)}function $(t){return""!==t.trim()}function k(t){return(0,e.jsx)("p",{children:t},t)}function v(t,n){let l=(0,o.cleanSanityString)(t.heading),s=n+1<=9?`0${n+1}`:`${n+1}`;return(0,e.jsxs)(x,{children:[l&&(0,e.jsxs)("h2",{children:[(0,e.jsx)(i.default,{as:"span",children:(0,e.jsx)("span",{"data-name":"number",children:s})}),(0,e.jsx)(i.default,{as:"span",children:(0,e.jsx)("strong",{children:l})})]}),t.content&&(0,e.jsx)(r.default,{value:t.content})]},`${l??"section"}-${n.toString()}`)}w.displayName="LegalPage",t.s(["default",0,w],64064)},800147,t=>{"use strict";var e=t.i(843476),n=t.i(500932),i=t.i(236726),r=t.i(481293),o=t.i(328852),l=t.i(951847);let s={marks:{link:({value:t,children:n})=>{let i="string"==typeof t?.href?t.href:"";return i?i.startsWith("/")&&!i.startsWith("//")?(0,e.jsx)(l.Link,{href:i,children:n}):(0,e.jsx)("a",{href:i,children:n}):(0,e.jsx)(e.Fragment,{children:n})}},types:{image:({value:t})=>{let n=(0,r.resolveImageWithAlt)(t);return n?(0,e.jsx)(o.default,{image:{...n,alt:t.alt||""},width:1200,height:675,sizes:"(max-width: 768px) 100vw, 50vw"}):null}}},a=t=>{let r,o=(0,n.c)(2),{value:l}=t;return l?.length?(o[0]!==l?(r=(0,e.jsx)(i.PortableText,{value:l,components:s}),o[0]=l,o[1]=r):r=o[1],r):null};a.displayName="PortableText",t.s(["default",0,a])}]);