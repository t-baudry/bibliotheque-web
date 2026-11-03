(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,95788,35311,t=>{"use strict";var e=t.i(43476),i=t.i(71645),l=t.i(89970);class n{constructor(t,e,i,l,r="div"){this.parent=t,this.object=e,this.property=i,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(r),this.domElement.classList.add("lil-controller"),this.domElement.classList.add(l),this.$name=document.createElement("div"),this.$name.classList.add("lil-name"),n.nextNameID=n.nextNameID||0,this.$name.id=`lil-gui-name-${++n.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("lil-widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",t=>t.stopPropagation()),this.domElement.addEventListener("keyup",t=>t.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(i)}name(t){return this._name=t,this.$name.textContent=t,this}onChange(t){return this._onChange=t,this}_callOnChange(){this.parent._callOnChange(this),void 0!==this._onChange&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),void 0!==this._onFinishChange&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(t=!0){return this.disable(!t)}disable(t=!0){return t===this._disabled||(this._disabled=t,this.domElement.classList.toggle("lil-disabled",t),this.$disable.toggleAttribute("disabled",t)),this}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(t){let e=this.parent.add(this.object,this.property,t);return e.name(this._name),this.destroy(),e}min(t){return this}max(t){return this}step(t){return this}decimals(t){return this}listen(t=!0){return this._listening=t,void 0!==this._listenCallbackID&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);let t=this.save();t!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=t}getValue(){return this.object[this.property]}setValue(t){return this.getValue()!==t&&(this.object[this.property]=t,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(t){return this.setValue(t),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class r extends n{constructor(t,e,i){super(t,e,i,"lil-boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function a(t){let e,i;return(e=t.match(/(#|0x)?([a-f0-9]{6})/i))?i=e[2]:(e=t.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?i=parseInt(e[1]).toString(16).padStart(2,0)+parseInt(e[2]).toString(16).padStart(2,0)+parseInt(e[3]).toString(16).padStart(2,0):(e=t.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(i=e[1]+e[1]+e[2]+e[2]+e[3]+e[3]),!!i&&"#"+i}let s={isPrimitive:!0,match:t=>"number"==typeof t,fromHexString:t=>parseInt(t.substring(1),16),toHexString:t=>"#"+t.toString(16).padStart(6,0)},o=[{isPrimitive:!0,match:t=>"string"==typeof t,fromHexString:a,toHexString:a},s,{isPrimitive:!1,match:t=>Array.isArray(t)||ArrayBuffer.isView(t),fromHexString(t,e,i=1){let l=s.fromHexString(t);e[0]=(l>>16&255)/255*i,e[1]=(l>>8&255)/255*i,e[2]=(255&l)/255*i},toHexString([t,e,i],l=1){let n=t*(l=255/l)<<16^e*l<<8^i*l;return s.toHexString(n)}},{isPrimitive:!1,match:t=>Object(t)===t,fromHexString(t,e,i=1){let l=s.fromHexString(t);e.r=(l>>16&255)/255*i,e.g=(l>>8&255)/255*i,e.b=(255&l)/255*i},toHexString({r:t,g:e,b:i},l=1){let n=t*(l=255/l)<<16^e*l<<8^i*l;return s.toHexString(n)}}];class h extends n{constructor(t,e,i,l){super(t,e,i,"lil-color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=function(t){return o.find(e=>e.match(t))}(this.initialValue),this._rgbScale=l,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{let t=a(this.$text.value);t&&this._setValueFromHexString(t)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(t){if(this._format.isPrimitive){let e=this._format.fromHexString(t);this.setValue(e)}else this._format.fromHexString(t,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(t){return this._setValueFromHexString(t),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class d extends n{constructor(t,e,i){super(t,e,i,"lil-function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",t=>{t.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class c extends n{constructor(t,e,i,l,n,r){super(t,e,i,"lil-number"),this._initInput(),this.min(l),this.max(n);const a=void 0!==r;this.step(a?r:this._getImplicitStep(),a),this.updateDisplay()}decimals(t){return this._decimals=t,this.updateDisplay(),this}min(t){return this._min=t,this._onUpdateMinMax(),this}max(t){return this._max=t,this._onUpdateMinMax(),this}step(t,e=!0){return this._step=t,this._stepExplicit=e,this}updateDisplay(){let t=this.getValue();if(this._hasSlider){let e=(t-this._min)/(this._max-this._min);e=Math.max(0,Math.min(e,1)),this.$fill.style.width=100*e+"%"}return this._inputFocused||(this.$input.value=void 0===this._decimals?t:t.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;let t=()=>{let t=parseFloat(this.$input.value);isNaN(t)||(this._stepExplicit&&(t=this._snap(t)),this.setValue(this._clamp(t)))},e=t=>{let e=parseFloat(this.$input.value);isNaN(e)||(this._snapClampSetValue(e+t),this.$input.value=this.getValue())},i=t=>{"Enter"===t.key&&this.$input.blur(),"ArrowUp"===t.code&&(t.preventDefault(),e(this._step*this._arrowKeyMultiplier(t))),"ArrowDown"===t.code&&(t.preventDefault(),e(-(this._step*this._arrowKeyMultiplier(t)*1)))},l=t=>{this._inputFocused&&(t.preventDefault(),e(this._step*this._normalizeMouseWheel(t)))},n=!1,r,a,s,o,h,d=t=>{r=t.clientX,a=s=t.clientY,n=!0,o=this.getValue(),h=0,window.addEventListener("mousemove",c),window.addEventListener("mouseup",u)},c=t=>{if(n){let e=t.clientX-r;Math.abs(t.clientY-a)>5?(t.preventDefault(),this.$input.blur(),n=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(e)>5&&u()}if(!n){let e=t.clientY-s;h-=e*this._step*this._arrowKeyMultiplier(t),o+h>this._max?h=this._max-o:o+h<this._min&&(h=this._min-o),this._snapClampSetValue(o+h)}s=t.clientY},u=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",c),window.removeEventListener("mouseup",u)},p=()=>{this._inputFocused=!0},g=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",t),this.$input.addEventListener("keydown",i),this.$input.addEventListener("wheel",l,{passive:!1}),this.$input.addEventListener("mousedown",d),this.$input.addEventListener("focus",p),this.$input.addEventListener("blur",g)}_initSlider(){let t;this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("lil-slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("lil-fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("lil-has-slider");let e=t=>{let e,i,l,n=this.$slider.getBoundingClientRect(),r=(e=n.left,i=n.right,l=this._min,(t-e)/(i-e)*(this._max-l)+l);this._snapClampSetValue(r)},i=t=>{this._setDraggingStyle(!0),e(t.clientX),window.addEventListener("mousemove",l),window.addEventListener("mouseup",n)},l=t=>{e(t.clientX)},n=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",l),window.removeEventListener("mouseup",n)},r=!1,a,s,o=t=>{t.preventDefault(),this._setDraggingStyle(!0),e(t.touches[0].clientX),r=!1},h=t=>{t.touches.length>1||(this._hasScrollBar?(a=t.touches[0].clientX,s=t.touches[0].clientY,r=!0):o(t),window.addEventListener("touchmove",d,{passive:!1}),window.addEventListener("touchend",c))},d=t=>{r?Math.abs(t.touches[0].clientX-a)>Math.abs(t.touches[0].clientY-s)?o(t):(window.removeEventListener("touchmove",d),window.removeEventListener("touchend",c)):(t.preventDefault(),e(t.touches[0].clientX))},c=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",d),window.removeEventListener("touchend",c)},u=this._callOnFinishChange.bind(this),p=e=>{if(Math.abs(e.deltaX)<Math.abs(e.deltaY)&&this._hasScrollBar)return;e.preventDefault();let i=this._normalizeMouseWheel(e)*this._step;this._snapClampSetValue(this.getValue()+i),this.$input.value=this.getValue(),clearTimeout(t),t=setTimeout(u,400)};this.$slider.addEventListener("mousedown",i),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",p,{passive:!1})}_setDraggingStyle(t,e="horizontal"){this.$slider&&this.$slider.classList.toggle("lil-active",t),document.body.classList.toggle("lil-dragging",t),document.body.classList.toggle(`lil-${e}`,t)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(t){let{deltaX:e,deltaY:i}=t;return Math.floor(t.deltaY)!==t.deltaY&&t.wheelDelta&&(e=0,i=-t.wheelDelta/120*(this._stepExplicit?1:10)),e+-i}_arrowKeyMultiplier(t){let e=this._stepExplicit?1:10;return t.shiftKey?e*=10:t.altKey&&(e/=10),e}_snap(t){let e=0;return this._hasMin?e=this._min:this._hasMax&&(e=this._max),t-=e,t=parseFloat((t=Math.round(t/this._step)*this._step+e).toPrecision(15))}_clamp(t){return t<this._min&&(t=this._min),t>this._max&&(t=this._max),t}_snapClampSetValue(t){this.setValue(this._clamp(this._snap(t)))}get _hasScrollBar(){let t=this.parent.root.$children;return t.scrollHeight>t.clientHeight}get _hasMin(){return void 0!==this._min}get _hasMax(){return void 0!==this._max}}class u extends n{constructor(t,e,i,l){super(t,e,i,"lil-option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("lil-focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("lil-focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(l)}options(t){return this._values=Array.isArray(t)?t:Object.values(t),this._names=Array.isArray(t)?t:Object.keys(t),this.$select.replaceChildren(),this._names.forEach(t=>{let e=document.createElement("option");e.textContent=t,this.$select.appendChild(e)}),this.updateDisplay(),this}updateDisplay(){let t=this.getValue(),e=this._values.indexOf(t);return this.$select.selectedIndex=e,this.$display.textContent=-1===e?t:this._names[e],this}}class p extends n{constructor(t,e,i){super(t,e,i,"lil-string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",t=>{"Enter"===t.code&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}var g=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.lil-root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.lil-root > .lil-children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.lil-allow-touch-styles, .lil-gui.lil-allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.lil-force-touch-styles, .lil-gui.lil-force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.lil-auto-place, .lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-controller.lil-disabled {
  opacity: 0.5;
}
.lil-controller.lil-disabled, .lil-controller.lil-disabled * {
  pointer-events: none !important;
}
.lil-controller > .lil-name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-controller .lil-widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-controller.lil-string input {
  color: var(--string-color);
}
.lil-controller.lil-boolean {
  cursor: pointer;
}
.lil-controller.lil-color .lil-display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-controller.lil-color .lil-display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-controller.lil-color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-controller.lil-color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-controller.lil-option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-controller.lil-option .lil-display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-display.lil-focus {
    background: var(--focus-color);
  }
}
.lil-controller.lil-option .lil-display.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-option .lil-display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-controller.lil-option .lil-widget,
.lil-controller.lil-option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-widget:hover .lil-display {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number input {
  color: var(--number-color);
}
.lil-controller.lil-number.lil-has-slider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-controller.lil-number .lil-slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-controller.lil-number .lil-slider:hover {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number .lil-slider.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-number .lil-slider.lil-active .lil-fill {
  opacity: 0.95;
}
.lil-controller.lil-number .lil-fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-dragging * {
  cursor: ew-resize !important;
}
.lil-dragging.lil-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .lil-title {
  height: var(--title-height);
  font-weight: 600;
  padding: 0 var(--padding);
  width: 100%;
  text-align: left;
  background: none;
  text-decoration-skip: objects;
}
.lil-gui .lil-title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .lil-title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-dragging) .lil-gui .lil-title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .lil-title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.lil-root > .lil-title:focus {
  text-decoration: none !important;
}
.lil-gui.lil-closed > .lil-title:before {
  content: "▸";
}
.lil-gui.lil-closed > .lil-children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.lil-closed:not(.lil-transition) > .lil-children {
  display: none;
}
.lil-gui.lil-transition > .lil-children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .lil-children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.lil-root > .lil-children > .lil-gui > .lil-title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.lil-root > .lil-children > .lil-gui.lil-closed > .lil-title {
  border-bottom-color: transparent;
}
.lil-gui + .lil-controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .lil-title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .lil-children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .lil-controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  border: none;
}
.lil-gui .lil-controller button {
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
}
@media (hover: hover) {
  .lil-gui .lil-controller button:hover {
    background: var(--hover-color);
  }
  .lil-gui .lil-controller button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui .lil-controller button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAAALkAAsAAAAABtQAAAKVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqBBIEbATYCJAMUCwwABCAFhAoHgQQbHAbIDiUFEYVARAAAYQTVWNmz9MxhEgodq49wYRUFKE8GWNiUBxI2LBRaVnc51U83Gmhs0Q7JXWMiz5eteLwrKwuxHO8VFxUX9UpZBs6pa5ABRwHA+t3UxUnH20EvVknRerzQgX6xC/GH6ZUvTcAjAv122dF28OTqCXrPuyaDER30YBA1xnkVutDDo4oCi71Ca7rrV9xS8dZHbPHefsuwIyCpmT7j+MnjAH5X3984UZoFFuJ0yiZ4XEJFxjagEBeqs+e1iyK8Xf/nOuwF+vVK0ur765+vf7txotUi0m3N0m/84RGSrBCNrh8Ee5GjODjF4gnWP+dJrH/Lk9k4oT6d+gr6g/wssA2j64JJGP6cmx554vUZnpZfn6ZfX2bMwPPrlANsB86/DiHjhl0OP+c87+gaJo/gY084s3HoYL/ZkWHTRfBXvvoHnnkHvngKun4KBE/ede7tvq3/vQOxDXB1/fdNz6XbPdcr0Vhpojj9dG+owuSKFsslCi1tgEjirjXdwMiov2EioadxmqTHUCIwo8NgQaeIasAi0fTYSPTbSmwbMOFduyh9wvBrESGY0MtgRjtgQR8Q1bRPohn2UoCRZf9wyYANMXFeJTysqAe0I4mrherOekFdKMrYvJjLvOIUM9SuwYB5DVZUwwVjJJOaUnZCmcEkIZZrKqNvRGRMvmFZsmhP4VMKCSXBhSqUBxgMS7h0cZvEd71AWkEhGWaeMFcNnpqyJkyXgYL7PQ1MoSq0wDAkRtJIijkZSmqYTiSImfLiSWXIZwhRh3Rug2X0kk1Dgj+Iu43u5p98ghopcpSo0Uyc8SnjlYX59WUeaMoDqmVD2TOWD9a4pCRAzf2ECgwGcrHjPOWY9bNxq/OL3I/QjwEAAAA=") format("woff2");
}`;let m=!1;class f{constructor({parent:t,autoPlace:e=void 0===t,container:i,width:l,title:n="Controls",closeFolders:r=!1,injectStyles:a=!0,touchStyles:s=!0}={}){if(this.parent=t,this.root=t?t.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("button"),this.$title.classList.add("lil-title"),this.$title.setAttribute("aria-expanded",!0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("lil-children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(n),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("lil-root"),s&&this.domElement.classList.add("lil-allow-touch-styles"),!m&&a&&(!function(t){let e=document.createElement("style");e.innerHTML=t;let i=document.querySelector("head link[rel=stylesheet], head style");i?document.head.insertBefore(e,i):document.head.appendChild(e)}(g),m=!0),i?i.appendChild(this.domElement):e&&(this.domElement.classList.add("lil-auto-place","autoPlace"),document.body.appendChild(this.domElement)),l&&this.domElement.style.setProperty("--width",l+"px"),this._closeFolders=r}add(t,e,i,l,n){if(Object(i)===i)return new u(this,t,e,i);let a=t[e];switch(typeof a){case"number":return new c(this,t,e,i,l,n);case"boolean":return new r(this,t,e);case"string":return new p(this,t,e);case"function":return new d(this,t,e)}console.error(`gui.add failed
	property:`,e,`
	object:`,t,`
	value:`,a)}addColor(t,e,i=1){return new h(this,t,e,i)}addFolder(t){let e=new f({parent:this,title:t});return this.root._closeFolders&&e.close(),e}load(t,e=!0){return t.controllers&&this.controllers.forEach(e=>{!(e instanceof d)&&e._name in t.controllers&&e.load(t.controllers[e._name])}),e&&t.folders&&this.folders.forEach(e=>{e._title in t.folders&&e.load(t.folders[e._title])}),this}save(t=!0){let e={controllers:{},folders:{}};return this.controllers.forEach(t=>{if(!(t instanceof d)){if(t._name in e.controllers)throw Error(`Cannot save GUI with duplicate property "${t._name}"`);e.controllers[t._name]=t.save()}}),t&&this.folders.forEach(t=>{if(t._title in e.folders)throw Error(`Cannot save GUI with duplicate folder "${t._title}"`);e.folders[t._title]=t.save()}),e}open(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("lil-closed",this._closed),this}close(){return this.open(!1)}_setClosed(t){this._closed!==t&&(this._closed=t,this._callOnOpenClose(this))}show(t=!0){return this._hidden=!t,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(t=!0){return this._setClosed(!t),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{let e=this.$children.clientHeight;this.$children.style.height=e+"px",this.domElement.classList.add("lil-transition");let i=t=>{t.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("lil-transition"),this.$children.removeEventListener("transitionend",i))};this.$children.addEventListener("transitionend",i);let l=t?this.$children.scrollHeight:0;this.domElement.classList.toggle("lil-closed",!t),requestAnimationFrame(()=>{this.$children.style.height=l+"px"})}),this}title(t){return this._title=t,this.$title.textContent=t,this}reset(t=!0){return(t?this.controllersRecursive():this.controllers).forEach(t=>t.reset()),this}onChange(t){return this._onChange=t,this}_callOnChange(t){this.parent&&this.parent._callOnChange(t),void 0!==this._onChange&&this._onChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onFinishChange(t){return this._onFinishChange=t,this}_callOnFinishChange(t){this.parent&&this.parent._callOnFinishChange(t),void 0!==this._onFinishChange&&this._onFinishChange.call(this,{object:t.object,property:t.property,value:t.getValue(),controller:t})}onOpenClose(t){return this._onOpenClose=t,this}_callOnOpenClose(t){this.parent&&this.parent._callOnOpenClose(t),void 0!==this._onOpenClose&&this._onOpenClose.call(this,t)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(t=>t.destroy())}controllersRecursive(){let t=Array.from(this.controllers);return this.folders.forEach(e=>{t=t.concat(e.controllersRecursive())}),t}foldersRecursive(){let t=Array.from(this.folders);return this.folders.forEach(e=>{t=t.concat(e.foldersRecursive())}),t}}let v=0,b=-156,w=10,x=26,y=1.55,$=2.85,M=5,_=18,C=-148,E=148,A=12,S=28,k=1.75,L=2.85,F=.62,D=.48,O=.5,z=.52,V=function(t){let e=t.trim().replace(/^#/,"");if(!/^[0-9a-fA-F]{3}$/.test(e)&&!/^[0-9a-fA-F]{6}$/.test(e))throw Error(`hexToRgb: invalid hex "${t}"`);let i=Number.parseInt(3===e.length?`${e[0]}${e[0]}${e[1]}${e[1]}${e[2]}${e[2]}`:e,16);return{r:i>>16&255,g:i>>8&255,b:255&i}}("#286561");function I(t,e,i){return Math.max(e,Math.min(i,t))}function R(t,e){return t+Math.random()*(e-t)}function H(t=10){let e=Math.max(10,Math.round(t)),i=[];for(let t=0;t<e;t++){let{startX:t,startY:e}=function(){let t=Math.floor(4*Math.random());return 0===t?{startX:R(0,100),startY:R(-2,6)}:1===t?{startX:R(94,102),startY:R(0,100)}:2===t?{startX:R(0,100),startY:R(94,102)}:{startX:R(-2,6),startY:R(0,100)}}(),{tx:l,ty:n}=function(){let t=Math.random()*Math.PI*2,e=Math.sqrt(Math.random());return{tx:I(50+30*e*Math.cos(t),4,96),ty:I(50+18*e*Math.sin(t),4,96)}}(),r=R(.28,.98),a=t+(l-t)*r,s=e+(n-e)*r,o=R(.0024,.0038),h=o+R(.0014,.0034),d=Math.random()>=.2?{curveAmount:v,curveDirection:b,waveAmplitude:R(w,x),waveFrequency:R(y,$)}:{curveAmount:R(M,_),curveDirection:R(C,E),waveAmplitude:R(A,S),waveFrequency:R(k,L),waveEndsCalm:F,waveRippleSlowBlend:D,waveRippleSlowFreqMul:O,waveRippleSlowAmpMul:z};i.push({line:{startX:t,startY:e,endX:I(a,-4,104),endY:I(s,-4,104),...d},flare:{count:1,minSpeed:o,maxSpeed:h,minSize:R(.72,.88),maxSize:R(1.15,1.65),intensity:5,tailLength:24,blur:1},style:{show:!1,opacity:.07,width:5,glowSize:8,fadeStart:R(6,38),fadeEnd:R(10,52)},color:{...V}})}return i}let B=H(10);function P(){return{timingA:.28+1.12*Math.random(),timingB:.22+1.28*Math.random(),phaseA:Math.random()*Math.PI*2,phaseB:Math.random()*Math.PI*2,speedBias:.42+1.18*Math.random(),motionCurve:Math.floor(4*Math.random())}}function j(t,e,i,l){return Math.hypot(i-t,l-e)||1}function U(t){let e=t.fadeStart/100;return e>0?Math.random()*e:Math.random()}function T(t){void 0===t.trailLengthMul&&(t.trailLengthMul=3)}function X(t){for(let e of t)T(e.flare)}t.s(["DEFAULT_RANDOM_FLARE_LINE_COUNT",0,10,"createDefaultRandomCenterFlares",0,H,"defaultLines",0,B],35311),t.s(["default",0,function({lines:t,debug:n=!1,zIndex:r=10,className:a="",fadeInDuration:s=1e3,fadeInDelay:o=0,siteEntranceCanvasLayer:h=!1}){let d,c=(0,i.useRef)(null),u=(0,i.useRef)(null),p=(0,i.useRef)([]),g=(0,i.useRef)([]),m=(0,i.useRef)(null),v=(0,i.useRef)(0),b=(0,i.useRef)({width:0,height:0}),w=(0,i.useRef)([]),x=(0,i.useRef)(!0),y=(0,i.useRef)(new Map),$=(0,i.useRef)(200),M=(0,i.useRef)(!0),[_,C]=(0,i.useState)(()=>h),E=(0,i.useRef)(!1),A=(0,i.useRef)(void 0===t),S=(0,i.useRef)((X(d=JSON.parse(JSON.stringify(t??H(10)))),d));(0,i.useEffect)(()=>{if(t){let e=JSON.parse(JSON.stringify(t));X(e),S.current=e,x.current=!0}},[t]);let k=(0,i.useCallback)(t=>{let e=b.current.width||1,i=b.current.height||1,l=[],n=t.startX/100*e,r=t.startY/100*i,a=t.endX/100*e,s=t.endY/100*i,{controlX:o,controlY:h}=function(t,e,i,l,n,r,a){let s=(t+i)/2,o=(e+l)/2,h=n.curveDirection*Math.PI/180,d=s+Math.cos(h)*n.curveAmount*(r/100),c=o+Math.sin(h)*n.curveAmount*(a/100);if(n.curveAmount>1e-6){let n=.22*j(t,e,i,l),r=d-s,a=c-o,h=Math.hypot(r,a);if(h>n){let t=n/h;d=s+r*t,c=o+a*t}}return{controlX:d,controlY:c}}(n,r,a,s,t,e,i),d=j(n,r,a,s),c=Math.min(t.waveAmplitude,.075*d);for(let e=0;e<=1;e+=.01){let i=Math.pow(1-e,2)*n+2*(1-e)*e*o+Math.pow(e,2)*a,d=Math.pow(1-e,2)*r+2*(1-e)*e*h+Math.pow(e,2)*s,u=function(t,e,i){let l=e.waveFrequency,n=i??e.waveAmplitude,r=Math.sin(t*Math.PI*l)*n,a=e.waveRippleSlowBlend;void 0!==a&&a>1e-6&&(r=(1-a)*r+a*(.52*r+.48*(Math.sin(t*Math.PI*l*(e.waveRippleSlowFreqMul??.52))*n*(e.waveRippleSlowAmpMul??.58))));let s=e.waveEndsCalm;return void 0!==s&&s>1e-6&&(r*=1-s+s*Math.sin(t*Math.PI)**2),r}(e,t,c),p=a-n,g=s-r,m=Math.sqrt(p*p+g*g)||1,f=-g/m,v=p/m;l.push({x:i+f*u,y:d+v*u})}return l},[]),L=(0,i.useCallback)(()=>{g.current=S.current.map(t=>k(t.line)),x.current=!0},[k]),F=(0,i.useCallback)(()=>{let t="u">typeof performance?performance.now():0,e=A.current,i=0;p.current=[],S.current.forEach((l,n)=>{for(let r=0;r<l.flare.count;r++)p.current.push({lineIndex:n,progress:e?0:U(l.style),speed:l.flare.minSpeed+Math.random()*(l.flare.maxSpeed-l.flare.minSpeed),size:l.flare.minSize+Math.random()*(l.flare.maxSize-l.flare.minSize),intensity:(.6+.4*Math.random())*l.flare.intensity,...e?{pauseUntilMs:t+function(t){let e=180+1400*Math.random();for(let i=1;i<=t;i++)e+=750+4600*Math.random(),.33>Math.random()&&(e+=1200+3800*Math.random());return Math.round(e)}(i++)}:{},...P()})})},[]);return(0,i.useEffect)(()=>{let t=u.current;if(!t)return;let e=t.getContext("2d",{alpha:!0});if(!e)return;let i=0,r=0,a=1,s=()=>{let l=c.current;l&&(a=Math.min(window.devicePixelRatio||1,2),i=l.clientWidth,r=l.clientHeight,b.current={width:i,height:r},t.width=i*a,t.height=r*a,t.style.width=`${i}px`,t.style.height=`${r}px`,e.setTransform(1,0,0,1,0,0),e.scale(a,a),L(),w.current=S.current.map(()=>{let t=document.createElement("canvas");return t.width=i*a,t.height=r*a,t}),x.current=!0)},d=(t,e)=>{let i=Math.floor(e*(t.length-1)),l=Math.min(i+1,t.length-1),n=e*(t.length-1)%1;return{x:t[i].x+(t[l].x-t[i].x)*n,y:t[i].y+(t[l].y-t[i].y)*n}},_=(t,e,i)=>{let l=e.size*i.tailLength/(.84*$.current);return Math.min(.14,Math.max(.0025,2*$.current*l/t))},A=(t,e)=>{let i=t.fadeStart/100,l=t.fadeEnd/100,n=1;return e<i&&i>0?n*=e/i:e>1-l&&l>0&&(n*=(1-e)/l),n*n*(3-2*n)},D=(t,i,l,n,r,a,s,o=1)=>{let h=l-i;if(h<1e-6)return;let c=Math.max(18,Math.min(56,Math.ceil(h*(t.length-1)*1.15))),u=[];for(let e=0;e<=c;e++){let l=i+e/c*h;u.push(d(t,l))}let p=u[0],g=u[u.length-1],m=A(a,i),f=A(a,l),v=Math.min(1,Math.max(Math.min(m,f),f*o)),b=Math.max(2.8,10*(n.size*r.tailLength/(.84*$.current))),w=.7*Math.max(1.2,.36*b);e.shadowBlur=0,e.shadowColor="transparent",e.lineCap="round",e.lineJoin="round",e.globalAlpha=Math.min(1,Math.max(0,o));let{r:x,g:y,b:M}=s,_=Math.min(255,Math.round(x+48)),C=Math.min(255,Math.round(y+48)),E=Math.min(255,Math.round(M+48)),S=Math.min(255,Math.round((x+_)/2)),k=Math.min(255,Math.round((y+C)/2)),L=Math.min(255,Math.round((M+E)/2)),F=e.createLinearGradient(p.x,p.y,g.x,g.y),D=Math.min(1,.12*v*.7),O=Math.min(1,.28*v*.7);F.addColorStop(0,`rgba(${x},${y},${M},0)`),F.addColorStop(.5,`rgba(${S},${k},${L},${D})`),F.addColorStop(1,`rgba(${_},${C},${E},${O})`),e.beginPath(),e.moveTo(u[0].x,u[0].y);for(let t=1;t<u.length;t++)e.lineTo(u[t].x,u[t].y);e.strokeStyle=F,e.lineWidth=.7*b*1.35,e.stroke();let z=e.createLinearGradient(p.x,p.y,g.x,g.y),V=Math.min(1,.38*v*.7),I=Math.min(1,.94*v*.7);z.addColorStop(0,`rgba(${x},${y},${M},0)`),z.addColorStop(.55,`rgba(${S},${k},${L},${V})`),z.addColorStop(1,`rgba(${_},${C},${E},${I})`),e.beginPath(),e.moveTo(u[0].x,u[0].y);for(let t=1;t<u.length;t++)e.lineTo(u[t].x,u[t].y);e.strokeStyle=z,e.lineWidth=w,e.stroke(),e.globalAlpha=1},O=()=>{if(!M.current||i<=0||r<=0)return;e.clearRect(0,0,i,r);let t=g.current.map(t=>t.length>1?(t=>{let e=0;for(let i=0;i<t.length-1;i++)e+=Math.hypot(t[i+1].x-t[i].x,t[i+1].y-t[i].y);return Math.max(e,1)})(t):1);x.current&&(S.current.forEach((t,e)=>{let i=g.current[e],l=w.current[e];i&&l&&l.width>0&&l.height>0&&((t,e,i,l)=>{let n=t.getContext("2d");if(!n||e.length<2||!i.show)return;n.setTransform(1,0,0,1,0,0),n.clearRect(0,0,t.width,t.height),n.scale(a,a);let r=i.fadeStart/100,s=i.fadeEnd/100,o={};for(let t=0;t<e.length-1;t++){let i=t/(e.length-1),l=1;i<r&&r>0?l=i/r:i>1-s&&s>0&&(l=(1-i)/s);let n=Math.round(10*(l=l*l*(3-2*l)))/10;n<.05||(o[n]||(o[n]=[]),o[n].push(t))}Object.entries(o).forEach(([t,r])=>{let a=parseFloat(t),s=i.opacity*a;n.beginPath(),r.forEach(t=>{n.moveTo(e[t].x,e[t].y),n.lineTo(e[t+1].x,e[t+1].y)}),n.shadowColor=`rgba(${l.r}, ${l.g}, ${l.b}, ${.3*a})`,n.shadowBlur=Math.min(i.glowSize,10),n.strokeStyle=`rgba(${Math.max(0,l.r-20)}, ${Math.max(0,l.g-20)}, ${Math.max(0,l.b-20)}, ${.15*s})`,n.lineWidth=i.width,n.lineCap="butt",n.stroke(),n.beginPath(),r.forEach(t=>{n.moveTo(e[t].x,e[t].y),n.lineTo(e[t+1].x,e[t+1].y)}),n.shadowBlur=Math.min(i.glowSize,10)/3,n.strokeStyle=`rgba(${Math.min(255,l.r+20)}, ${Math.min(255,l.g+20)}, ${Math.min(255,l.b+20)}, ${.25*s})`,n.lineWidth=.6*i.width,n.stroke()}),n.shadowBlur=0})(l,i,t.style,t.color)}),x.current=!1),w.current.forEach(t=>{t&&t.width>0&&t.height>0&&e.drawImage(t,0,0,i,r)}),p.current.forEach(e=>{let i=S.current[e.lineIndex];if(!i)return;let l=g.current[e.lineIndex];if(!l||0===l.length)return;"number"!=typeof e.speedBias&&Object.assign(e,P());let n=Math.min(.42,_(t[e.lineIndex]??1,e,i.flare)*(i.flare.trailLengthMul??3)),r=function(t,e){let i,l=e*t.timingA+t.phaseA,n=e*t.timingB+t.phaseB;switch(t.motionCurve){case 0:i=.2+1.05*(.5+.5*(.5*Math.sin(l)+.5*Math.sin(n)));break;case 1:{let t=Math.sin(l)*Math.sin(1.63*n);i=.16+1.08*t*t;break}case 2:i=.34+.62*(.5+.5*Math.sin(e*t.timingA*.31+t.phaseA));break;default:{let t=Math.sin(n);i=.22+(.5+.5*Math.sin(l))*(.28+.72*t*t)*.98}}return Math.min(2.15,Math.max(.07,i*t.speedBias))}(e,.001*performance.now());if(e.lastMotionMul=r,e.trailDrain){let t=e.trailDrain,i=Math.max(2.4*e.speed,.0045);if(t.tail+=i*r*.7,t.tail>=t.head-.002){let t;e.trailDrain=void 0,e.pauseUntilMs=performance.now()+(t=1300+8800*Math.random(),.3>Math.random()&&(t+=1600+4500*Math.random()),Math.round(t)),e.progress=0}return}let a=performance.now();if((void 0===e.pauseUntilMs||!(a<e.pauseUntilMs))&&(void 0!==e.pauseUntilMs&&(e.pauseUntilMs=void 0,e.progress<1e-5&&(e.progress=U(i.style))),e.progress+=e.speed*r*.7,e.progress>1)){let t=Math.min(1,e.progress);e.trailDrain={tail:Math.max(0,t-n),head:t},e.progress=0,e.speed=i.flare.minSpeed+Math.random()*(i.flare.maxSpeed-i.flare.minSpeed),e.size=i.flare.minSize+Math.random()*(i.flare.maxSize-i.flare.minSize),e.intensity=(.6+.4*Math.random())*i.flare.intensity,Object.assign(e,P())}});let l=performance.now();p.current.forEach(i=>{var n,r;let a,s,o,h,c,u,p=S.current[i.lineIndex];if(!p)return;let m=g.current[i.lineIndex];if(!m||0===m.length||!i.trailDrain&&void 0!==i.pauseUntilMs&&l<i.pauseUntilMs)return;let f=Math.min(.42,_(t[i.lineIndex]??1,i,p.flare)*(p.flare.trailLengthMul??3));if(i.trailDrain){let{tail:t,head:e}=i.trailDrain,l=Math.max(0,t),n=Math.max(l+1e-5,Math.min(1,e));D(m,l,n,i,p.flare,p.style,p.color,1);return}let v=(n=i.progress,a=(r=p.style).fadeStart/100,s=r.fadeEnd/100,o=1,n<a&&a>0?o=n/a:n>1-s&&s>0&&(o=(1-n)/s),o);if(v<1e-5)return;let b=Math.max(0,i.progress-f),w=Math.max(b+1e-5,Math.min(1,i.progress-.04*f));D(m,b,w,i,p.flare,p.style,p.color,v);let x=d(m,i.progress),M=(c=Math.min((h=Math.floor(i.progress*(m.length-1)))+1,m.length-1),u=m[c].x-m[h].x,Math.atan2(m[c].y-m[h].y,u));((t,i,l,n,r,a,s,o,h=1)=>{let d,c,u,p=(d=`${s.r},${s.g},${s.b}`,(u=(c=y.current).get(d))||(u=(t=>{let e=$.current,i=document.createElement("canvas");i.width=2*e,i.height=e;let l=i.getContext("2d");if(!l)return i;let n=e/2,r=.84*e,a=+r,s=e-a,o=e+r,h=e+(r-a)/2,d=(r+a)/2,{r:c,g:u,b:p}=t,g=t=>Math.max(0,Math.min(255,Math.round(t))),m=(t,e)=>Math.min(255,Math.round(t+e)),f=m(c,58),v=m(u,58),b=m(p,58),w=m(c,26),x=m(u,26),y=m(p,26),M=g(.72*c+.14*u+.12*p+38),_=g(.78*u+.1*c+.1*p+32),C=g(.74*p+.1*c+.12*u+44),E=g(.45*c+.18*M),A=g(.45*u+.18*_),S=g(.45*p+.18*C),k=(t,e,i)=>{let r=l.createLinearGradient(s,n,o,n);for(let t of i)r.addColorStop(t.pos,t.css);l.beginPath(),l.ellipse(h,n,t,e,0,0,2*Math.PI),l.fillStyle=r,l.fill()};return l.filter="blur(0.55px)",k(d,.03*e,[{pos:0,css:`rgba(${E}, ${A}, ${S}, 0)`},{pos:.1,css:`rgba(${M}, ${_}, ${C}, 0.16)`},{pos:.26,css:`rgba(${w}, ${x}, ${y}, 0.38)`},{pos:.5,css:`rgba(${f}, ${v}, ${b}, 0.5)`},{pos:.74,css:`rgba(${w}, ${x}, ${y}, 0.35)`},{pos:.9,css:`rgba(${M}, ${_}, ${C}, 0.14)`},{pos:1,css:`rgba(${E}, ${A}, ${S}, 0)`}]),k(.78*d,.019*e,[{pos:0,css:"rgba(0,0,0,0)"},{pos:.16,css:`rgba(${c}, ${u}, ${p}, 0.3)`},{pos:.5,css:`rgba(${f}, ${v}, ${b}, 0.68)`},{pos:.84,css:`rgba(${M}, ${_}, ${C}, 0.28)`},{pos:1,css:"rgba(0,0,0,0)"}]),k(.4*d,.011*e,[{pos:0,css:"rgba(0,0,0,0)"},{pos:.38,css:`rgba(${w}, ${x}, ${y}, 0.55)`},{pos:.5,css:`rgba(${f}, ${v}, ${b}, 0.88)`},{pos:.62,css:`rgba(${w}, ${x}, ${y}, 0.52)`},{pos:1,css:"rgba(0,0,0,0)"}]),l.filter="none",i})(s),c.set(d,u)),u);if(!p)return;let g=Math.pow(o,.5),m=l*a.tailLength*g/(.84*$.current),f=Math.min(1.12,Math.max(.88,.9+.22*Math.min(1.35,h)/1.35));e.save(),e.translate(t,i),e.rotate(r),e.globalAlpha=Math.min(1,.34*n*o),e.scale(m*f,m*f*1.53),e.drawImage(p,-$.current,-$.current/2),e.restore()})(x.x,x.y,i.size,i.intensity,M,p.flare,p.color,v,i.lastMotionMul??1)})};h&&(E.current=!0,C(!0)),s(),F(),l.default.ticker.add(O),(n||"#debug"===window.location.hash)&&(()=>{if(m.current)return;let t=new f({title:"Flowing Flares"});m.current=t;let e=()=>{[...t.folders].forEach(t=>{"Select Line"!==t._title&&t.destroy()});let e=S.current[v.current];if(!e)return;T(e.flare);let i=()=>{g.current[v.current]=k(e.line),x.current=!0},l=()=>{x.current=!0},n=t.addFolder("Line Position");n.add(e.line,"startX",-50,150,1).name("Start X %").onChange(i),n.add(e.line,"startY",-50,150,1).name("Start Y %").onChange(i),n.add(e.line,"endX",-50,150,1).name("End X %").onChange(i),n.add(e.line,"endY",-50,150,1).name("End Y %").onChange(i);let r=t.addFolder("Line Shape");r.add(e.line,"curveAmount",0,100,1).name("Curve Amount").onChange(i),r.add(e.line,"curveDirection",-180,180,1).name("Curve Direction").onChange(i),r.add(e.line,"waveAmplitude",0,100,1).name("Wave Amplitude").onChange(i),r.add(e.line,"waveFrequency",0,10,.1).name("Wave Frequency").onChange(i);let a=t.addFolder("Line Style");a.add(e.style,"show").name("Show Line").onChange(l),a.add(e.style,"opacity",0,2,.1).name("Opacity").onChange(l),a.add(e.style,"width",.5,10,.1).name("Width").onChange(l),a.add(e.style,"glowSize",0,50,1).name("Glow Size").onChange(l),a.add(e.style,"fadeStart",0,50,1).name("Fade Start %").onChange(l),a.add(e.style,"fadeEnd",0,50,1).name("Fade End %").onChange(l);let s=t.addFolder("Flares");s.add(e.flare,"count",1,10,1).name("Count").onChange(()=>{p.current=p.current.filter(t=>t.lineIndex!==v.current);for(let t=0;t<e.flare.count;t++)p.current.push({lineIndex:v.current,progress:U(e.style),speed:e.flare.minSpeed+Math.random()*(e.flare.maxSpeed-e.flare.minSpeed),size:e.flare.minSize+Math.random()*(e.flare.maxSize-e.flare.minSize),intensity:(.6+.4*Math.random())*e.flare.intensity,...P()})}),s.add(e.flare,"minSpeed",1e-4,.02,1e-4).name("Min Speed"),s.add(e.flare,"maxSpeed",1e-4,.02,1e-4).name("Max Speed"),s.add(e.flare,"minSize",.5,5,.1).name("Min Size"),s.add(e.flare,"maxSize",1,10,.1).name("Max Size"),s.add(e.flare,"intensity",.1,5,.1).name("Intensity"),s.add(e.flare,"tailLength",10,100,1).name("Tail Length"),s.add(e.flare,"blur",0,2,.1).name("Blur"),s.add(e.flare,"trailLengthMul",1,6,.05).name("Trail × flare length");let o=t.addFolder("Color");o.add(e.color,"r",0,255,1).name("Red").onChange(l),o.add(e.color,"g",0,255,1).name("Green").onChange(l),o.add(e.color,"b",0,255,1).name("Blue").onChange(l)},i=t.addFolder("Select Line"),l={};S.current.forEach((t,e)=>{l[`Line ${e+1}`]=e});let n={selected:v.current};i.add(n,"selected",l).name("Edit Line").onChange(t=>{v.current=t,e()}),t.add({exportCurrent:()=>{let t=S.current[v.current];navigator.clipboard.writeText(JSON.stringify(t,null,2)),alert(`Line ${v.current+1} config copied to clipboard!`)}},"exportCurrent").name("Export Current Line"),t.add({exportAll:()=>{navigator.clipboard.writeText(JSON.stringify(S.current,null,2)),alert("All lines config copied to clipboard!")}},"exportAll").name("Export All Lines"),e()})();let z=null,V=new IntersectionObserver(t=>{t.forEach(t=>{M.current=t.isIntersecting,t.isIntersecting&&!E.current&&(E.current=!0,o>0?z=setTimeout(()=>{C(!0)},o):C(!0))})},{threshold:0});t&&V.observe(t);let I=c.current,R=new ResizeObserver(()=>{s()});return I&&R.observe(I),()=>{z&&clearTimeout(z),R.disconnect(),l.default.ticker.remove(O),V.disconnect(),y.current.clear(),m.current&&(m.current.destroy(),m.current=null)}},[n,k,L,F,o,h]),(0,e.jsx)("div",{ref:c,"data-site-entrance-canvas":h?"":void 0,className:`pointer-events-none absolute inset-0 top-[-3%] h-full w-full ${a}${h?" opacity-0":""}`,style:{zIndex:r},children:(0,e.jsx)("canvas",{ref:u,className:"h-full w-full",style:{opacity:h?1:+!!_,transition:h?"none":`opacity ${s}ms ease-out`}})})}],95788)}]);