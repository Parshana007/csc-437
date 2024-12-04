(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();var B,ke;class lt extends Error{}lt.prototype.name="InvalidTokenError";function Ws(n){return decodeURIComponent(atob(n).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Ys(n){let t=n.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Ws(t)}catch{return atob(t)}}function is(n,t){if(typeof n!="string")throw new lt("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=n.split(".")[e];if(typeof s!="string")throw new lt(`Invalid token specified: missing part #${e+1}`);let i;try{i=Ys(s)}catch(r){throw new lt(`Invalid token specified: invalid base64 for part #${e+1} (${r.message})`)}try{return JSON.parse(i)}catch(r){throw new lt(`Invalid token specified: invalid json for part #${e+1} (${r.message})`)}}const Ks="mu:context",ie=`${Ks}:change`;class Js{constructor(t,e){this._proxy=Zs(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ns extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Js(t,this),this.style.display="contents"}attach(t){return this.addEventListener(ie,t),t}detach(t){this.removeEventListener(ie,t)}}function Zs(n,t){return new Proxy(n,{get:(s,i,r)=>{if(i==="then")return;const o=Reflect.get(s,i,r);return console.log(`Context['${i}'] => `,o),o},set:(s,i,r,o)=>{const l=n[i];console.log(`Context['${i.toString()}'] <= `,r);const a=Reflect.set(s,i,r,o);if(a){let d=new CustomEvent(ie,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:i,oldValue:l,value:r}),t.dispatchEvent(d)}else console.log(`Context['${i}] was not set to ${r}`);return a}})}function Gs(n,t){const e=rs(t,n);return new Promise((s,i)=>{if(e){const r=e.localName;customElements.whenDefined(r).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function rs(n,t){const e=`[provides="${n}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return rs(n,i.host)}class Qs extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function os(n="mu:message"){return(t,...e)=>t.dispatchEvent(new Qs(e,n))}class he{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function Xs(n){return t=>({...t,...n})}const ne="mu:auth:jwt",as=class ls extends he{constructor(t,e){super((s,i)=>this.update(s,i),t,ls.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(ei(s)),Gt(i);case"auth/signout":return e(si()),Gt(this._redirectForLogin);case"auth/redirect":return Gt(this._redirectForLogin,{next:window.location.href});default:const r=t[0];throw new Error(`Unhandled Auth message "${r}"`)}}};as.EVENT_TYPE="auth:message";let cs=as;const hs=os(cs.EVENT_TYPE);function Gt(n,t={}){if(!n)return;const e=window.location.href,s=new URL(n,e);return Object.entries(t).forEach(([i,r])=>s.searchParams.set(i,r)),()=>{console.log("Redirecting to ",n),window.location.assign(s)}}class ti extends ns{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=J.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new cs(this.context,this.redirect).attach(this)}}class dt{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ne),t}}class J extends dt{constructor(t){super();const e=is(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new J(t);return localStorage.setItem(ne,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ne);return t?J.authenticate(t):new dt}}function ei(n){return Xs({user:J.authenticate(n),token:n})}function si(){return n=>{const t=n.user;return{user:t&&t.authenticated?dt.deauthenticate(t):t,token:""}}}function ii(n){return n.authenticated?{Authorization:`Bearer ${n.token||"NO_TOKEN"}`}:{}}function ni(n){return n.authenticated?is(n.token||""):{}}const S=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:J,Provider:ti,User:dt,dispatch:hs,headers:ii,payload:ni},Symbol.toStringTag,{value:"Module"}));function kt(n,t,e){const s=n.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${n.type}:`,i),s.dispatchEvent(i),n.stopPropagation()}function re(n,t="*"){return n.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const us=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:re,relay:kt},Symbol.toStringTag,{value:"Module"}));function jt(n,...t){const e=n.map((i,r)=>r?[t[r-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const ri=new DOMParser;function I(n,...t){const e=t.map(l),s=n.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),i=ri.parseFromString(s,"text/html"),r=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...r),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Ce(a);case"bigint":case"boolean":case"number":case"symbol":return Ce(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ce(n){return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Dt(n,t={mode:"open"}){const e=n.attachShadow(t),s={template:i,styles:r};return s;function i(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function r(...o){e.adoptedStyleSheets=o}}let oi=(B=class extends HTMLElement{constructor(){super(),this._state={},Dt(this).template(B.template).styles(B.styles),this.addEventListener("change",n=>{const t=n.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",n=>{n.preventDefault(),kt(n,"mu-form:submit",this._state)})}set init(n){this._state=n||{},ai(this._state,this)}get form(){var n;return(n=this.shadowRoot)==null?void 0:n.querySelector("form")}},B.template=I`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,B.styles=jt`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `,B);function ai(n,t){const e=Object.entries(n);for(const[s,i]of e){const r=t.querySelector(`[name="${s}"]`);if(r){const o=r;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return n}const ds=Object.freeze(Object.defineProperty({__proto__:null,Element:oi},Symbol.toStringTag,{value:"Module"})),ps=class fs extends he{constructor(t){super((e,s)=>this.update(e,s),t,fs.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(ci(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(hi(s,i));break}}}};ps.EVENT_TYPE="history:message";let ue=ps;class Oe extends ns{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=li(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),de(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ue(this.context).attach(this)}}function li(n){const t=n.currentTarget,e=s=>s.tagName=="A"&&s.href;if(n.button===0)if(n.composed){const i=n.composedPath().find(e);return i||void 0}else{for(let s=n.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function ci(n,t={}){return history.pushState(t,"",n),()=>({location:document.location,state:history.state})}function hi(n,t={}){return history.replaceState(t,"",n),()=>({location:document.location,state:history.state})}const de=os(ue.EVENT_TYPE),ui=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Oe,Provider:Oe,Service:ue,dispatch:de},Symbol.toStringTag,{value:"Module"}));class T{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Te(this._provider,t);this._effects.push(i),e(i)}else Gs(this._target,this._contextLabel).then(i=>{const r=new Te(i,t);this._provider=i,this._effects.push(r),i.attach(o=>this._handleChange(o)),e(r)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Te{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const ms=class gs extends HTMLElement{constructor(){super(),this._state={},this._user=new dt,this._authObserver=new T(this,"blazing:auth"),Dt(this).template(gs.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;di(i,this._state,e,this.authorization).then(r=>nt(r,this)).then(r=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:r,url:i}});this.dispatchEvent(l)}).catch(r=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:r,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},nt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Re(this.src,this.authorization).then(e=>{this._state=e,nt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Re(this.src,this.authorization).then(i=>{this._state=i,nt(i,this)});break;case"new":s&&(this._state={},nt({},this));break}}};ms.observedAttributes=["src","new","action"];ms.template=I`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function Re(n,t){return fetch(n,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${n}:`,e))}function nt(n,t){const e=Object.entries(n);for(const[s,i]of e){const r=t.querySelector(`[name="${s}"]`);if(r){const o=r;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return n}function di(n,t,e="PUT",s={}){return fetch(n,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const pi=class ys extends he{constructor(t,e){super(e,t,ys.EVENT_TYPE,!1)}};pi.EVENT_TYPE="mu:message";/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xt=globalThis,pe=xt.ShadowRoot&&(xt.ShadyCSS===void 0||xt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,fe=Symbol(),Ue=new WeakMap;let vs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==fe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(pe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ue.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ue.set(e,t))}return t}toString(){return this.cssText}};const fi=n=>new vs(typeof n=="string"?n:n+"",void 0,fe),mi=(n,...t)=>{const e=n.length===1?n[0]:t.reduce((s,i,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new vs(e,n,fe)},gi=(n,t)=>{if(pe)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=xt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,n.appendChild(s)}},Ne=pe?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return fi(e)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:yi,defineProperty:vi,getOwnPropertyDescriptor:_i,getOwnPropertyNames:$i,getOwnPropertySymbols:bi,getPrototypeOf:wi}=Object,Z=globalThis,Le=Z.trustedTypes,Ai=Le?Le.emptyScript:"",Me=Z.reactiveElementPolyfillSupport,ct=(n,t)=>n,Ct={toAttribute(n,t){switch(t){case Boolean:n=n?Ai:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},me=(n,t)=>!yi(n,t),ze={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:me};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Z.litPropertyMetadata??(Z.litPropertyMetadata=new WeakMap);let W=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ze){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&vi(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=_i(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);r.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ze}static _$Ei(){if(this.hasOwnProperty(ct("elementProperties")))return;const t=wi(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ct("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ct("properties"))){const e=this.properties,s=[...$i(e),...bi(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Ne(i))}else t!==void 0&&e.push(Ne(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return gi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(r!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:Ct).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,r=i._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const o=i.getPropertyOptions(r),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Ct;this._$Em=r,this[r]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??me)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,o]of i)o.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var r;return(r=i.hostUpdate)==null?void 0:r.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[ct("elementProperties")]=new Map,W[ct("finalized")]=new Map,Me==null||Me({ReactiveElement:W}),(Z.reactiveElementVersions??(Z.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ot=globalThis,Tt=Ot.trustedTypes,Ie=Tt?Tt.createPolicy("lit-html",{createHTML:n=>n}):void 0,_s="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,$s="?"+k,Ei=`<${$s}>`,H=document,pt=()=>H.createComment(""),ft=n=>n===null||typeof n!="object"&&typeof n!="function",ge=Array.isArray,Si=n=>ge(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",Qt=`[ 	
\f\r]`,rt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,He=/-->/g,je=/>/g,N=RegExp(`>|${Qt}(?:([^\\s"'>=/]+)(${Qt}*=${Qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),De=/'/g,Fe=/"/g,bs=/^(?:script|style|textarea|title)$/i,xi=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),ot=xi(1),G=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Ve=new WeakMap,M=H.createTreeWalker(H,129);function ws(n,t){if(!ge(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ie!==void 0?Ie.createHTML(t):t}const Pi=(n,t)=>{const e=n.length-1,s=[];let i,r=t===2?"<svg>":t===3?"<math>":"",o=rt;for(let l=0;l<e;l++){const a=n[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===rt?f[1]==="!--"?o=He:f[1]!==void 0?o=je:f[2]!==void 0?(bs.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=N):f[3]!==void 0&&(o=N):o===N?f[0]===">"?(o=i??rt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?N:f[3]==='"'?Fe:De):o===Fe||o===De?o=N:o===He||o===je?o=rt:(o=N,i=void 0);const h=o===N&&n[l+1].startsWith("/>")?" ":"";r+=o===rt?a+Ei:u>=0?(s.push(d),a.slice(0,u)+_s+a.slice(u)+k+h):a+k+(u===-2?l:h)}return[ws(n,r+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let oe=class As{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Pi(t,e);if(this.el=As.createElement(d,s),M.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=M.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(_s)){const c=f[o++],h=i.getAttribute(u).split(k),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:r,name:p[2],strings:h,ctor:p[1]==="."?Ci:p[1]==="?"?Oi:p[1]==="@"?Ti:Ft}),i.removeAttribute(u)}else u.startsWith(k)&&(a.push({type:6,index:r}),i.removeAttribute(u));if(bs.test(i.tagName)){const u=i.textContent.split(k),c=u.length-1;if(c>0){i.textContent=Tt?Tt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],pt()),M.nextNode(),a.push({type:2,index:++r});i.append(u[c],pt())}}}else if(i.nodeType===8)if(i.data===$s)a.push({type:2,index:r});else{let u=-1;for(;(u=i.data.indexOf(k,u+1))!==-1;)a.push({type:7,index:r}),u+=k.length-1}r++}}static createElement(t,e){const s=H.createElement("template");return s.innerHTML=t,s}};function Q(n,t,e=n,s){var i,r;if(t===G)return t;let o=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const l=ft(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((r=o==null?void 0:o._$AO)==null||r.call(o,!1),l===void 0?o=void 0:(o=new l(n),o._$AT(n,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=Q(n,o._$AS(n,t.values),o,s)),t}class ki{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??H).importNode(e,!0);M.currentNode=i;let r=M.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new _t(r,r.nextSibling,this,t):a.type===1?d=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(d=new Ri(r,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(r=M.nextNode(),o++)}return M.currentNode=H,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class _t{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),ft(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==G&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Si(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&ft(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,r=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=oe.createElement(ws(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===r)this._$AH.p(s);else{const o=new ki(r,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Ve.get(t.strings);return e===void 0&&Ve.set(t.strings,e=new oe(t)),e}k(t){ge(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new _t(this.O(pt()),this.O(pt()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Ft{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,i){const r=this.strings;let o=!1;if(r===void 0)t=Q(this,t,e,0),o=!ft(t)||t!==this._$AH&&t!==G,o&&(this._$AH=t);else{const l=t;let a,d;for(t=r[0],a=0;a<r.length-1;a++)d=Q(this,l[s+a],e,a),d===G&&(d=this._$AH[a]),o||(o=!ft(d)||d!==this._$AH[a]),d===_?t=_:t!==_&&(t+=(d??"")+r[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ci extends Ft{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class Oi extends Ft{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class Ti extends Ft{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??_)===G)return;const s=this._$AH,i=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==_&&(s===_||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Ri{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const Be=Ot.litHtmlPolyfillSupport;Be==null||Be(oe,_t),(Ot.litHtmlVersions??(Ot.litHtmlVersions=[])).push("3.2.0");const Ui=(n,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const r=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new _t(t.insertBefore(pt(),r),r,void 0,e??{})}return i._$AI(n),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let K=class extends W{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Ui(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return G}};K._$litElement$=!0,K.finalized=!0,(ke=globalThis.litElementHydrateSupport)==null||ke.call(globalThis,{LitElement:K});const qe=globalThis.litElementPolyfillSupport;qe==null||qe({LitElement:K});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ni={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:me},Li=(n=Ni,t,e)=>{const{kind:s,metadata:i}=e;let r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),r.set(e.name,n),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,n)},init(l){return l!==void 0&&this.P(o,void 0,n),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,n)}}throw Error("Unsupported decorator location: "+s)};function Es(n){return(t,e)=>typeof e=="object"?Li(n,t,e):((s,i,r)=>{const o=i.hasOwnProperty(r);return i.constructor.createProperty(r,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,r):void 0})(n,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ss(n){return Es({...n,state:!0,attribute:!1})}function Mi(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}function zi(n){throw new Error('Could not dynamically require "'+n+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var xs={};(function(n){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],i=[1,10],r=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,g,m,y,Wt){var A=y.length-1;switch(m){case 1:return new g.Root({},[y[A-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[y[A-1],y[A]]);break;case 4:case 5:this.$=y[A];break;case 6:this.$=new g.Literal({value:y[A]});break;case 7:this.$=new g.Splat({name:y[A]});break;case 8:this.$=new g.Param({name:y[A]});break;case 9:this.$=new g.Optional({},[y[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:r,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:r,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:r,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:r,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],g=[null],m=[],y=this.table,Wt="",A=0,Se=0,Fs=2,xe=1,Vs=m.slice.call(arguments,1),v=Object.create(this.lexer),R={yy:{}};for(var Yt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Yt)&&(R.yy[Yt]=this.yy[Yt]);v.setInput(c,R.yy),R.yy.lexer=v,R.yy.parser=this,typeof v.yylloc>"u"&&(v.yylloc={});var Kt=v.yylloc;m.push(Kt);var Bs=v.options&&v.options.ranges;typeof R.yy.parseError=="function"?this.parseError=R.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var qs=function(){var V;return V=v.lex()||xe,typeof V!="number"&&(V=h.symbols_[V]||V),V},b,U,E,Jt,F={},Et,P,Pe,St;;){if(U=p[p.length-1],this.defaultActions[U]?E=this.defaultActions[U]:((b===null||typeof b>"u")&&(b=qs()),E=y[U]&&y[U][b]),typeof E>"u"||!E.length||!E[0]){var Zt="";St=[];for(Et in y[U])this.terminals_[Et]&&Et>Fs&&St.push("'"+this.terminals_[Et]+"'");v.showPosition?Zt="Parse error on line "+(A+1)+`:
`+v.showPosition()+`
Expecting `+St.join(", ")+", got '"+(this.terminals_[b]||b)+"'":Zt="Parse error on line "+(A+1)+": Unexpected "+(b==xe?"end of input":"'"+(this.terminals_[b]||b)+"'"),this.parseError(Zt,{text:v.match,token:this.terminals_[b]||b,line:v.yylineno,loc:Kt,expected:St})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+U+", token: "+b);switch(E[0]){case 1:p.push(b),g.push(v.yytext),m.push(v.yylloc),p.push(E[1]),b=null,Se=v.yyleng,Wt=v.yytext,A=v.yylineno,Kt=v.yylloc;break;case 2:if(P=this.productions_[E[1]][1],F.$=g[g.length-P],F._$={first_line:m[m.length-(P||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(P||1)].first_column,last_column:m[m.length-1].last_column},Bs&&(F._$.range=[m[m.length-(P||1)].range[0],m[m.length-1].range[1]]),Jt=this.performAction.apply(F,[Wt,Se,A,R.yy,E[1],g,m].concat(Vs)),typeof Jt<"u")return Jt;P&&(p=p.slice(0,-1*P*2),g=g.slice(0,-1*P),m=m.slice(0,-1*P)),p.push(this.productions_[E[1]][0]),g.push(F.$),m.push(F._$),Pe=y[p[p.length-2]][p[p.length-1]],p.push(Pe);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in m)this[y]=m[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),y=0;y<m.length;y++)if(p=this._input.match(this.rules[m[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=y,this.options.backtrack_lexer){if(c=this.test_match(p,m[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof zi<"u"&&(n.parser=t,n.Parser=t.Parser,n.parse=function(){return t.parse.apply(t,arguments)})})(xs);function q(n){return function(t,e){return{displayName:n,props:t,children:e||[]}}}var Ps={Root:q("Root"),Concat:q("Concat"),Literal:q("Literal"),Splat:q("Splat"),Param:q("Param"),Optional:q("Optional")},ks=xs.parser;ks.yy=Ps;var Ii=ks,Hi=Object.keys(Ps);function ji(n){return Hi.forEach(function(t){if(typeof n[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:n}}var Cs=ji,Di=Cs,Fi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Os(n){this.captures=n.captures,this.re=n.re}Os.prototype.match=function(n){var t=this.re.exec(n),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Vi=Di({Concat:function(n){return n.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(n){return{re:n.props.value.replace(Fi,"\\$&"),captures:[]}},Splat:function(n){return{re:"([^?]*?)",captures:[n.props.name]}},Param:function(n){return{re:"([^\\/\\?]+)",captures:[n.props.name]}},Optional:function(n){var t=this.visit(n.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(n){var t=this.visit(n.children[0]);return new Os({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Bi=Vi,qi=Cs,Wi=qi({Concat:function(n,t){var e=n.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(n){return decodeURI(n.props.value)},Splat:function(n,t){return t[n.props.name]?t[n.props.name]:!1},Param:function(n,t){return t[n.props.name]?t[n.props.name]:!1},Optional:function(n,t){var e=this.visit(n.children[0],t);return e||""},Root:function(n,t){t=t||{};var e=this.visit(n.children[0],t);return e?encodeURI(e):!1}}),Yi=Wi,Ki=Ii,Ji=Bi,Zi=Yi;$t.prototype=Object.create(null);$t.prototype.match=function(n){var t=Ji.visit(this.ast),e=t.match(n);return e||!1};$t.prototype.reverse=function(n){return Zi.visit(this.ast,n)};function $t(n){var t;if(this?t=this:t=Object.create($t.prototype),typeof n>"u")throw new Error("A route spec is required");return t.spec=n,t.ast=Ki.parse(n),t}var Gi=$t,Qi=Gi,Xi=Qi;const tn=Mi(Xi);var en=Object.defineProperty,Ts=(n,t,e,s)=>{for(var i=void 0,r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=o(t,e,i)||i);return i&&en(t,e,i),i};const Rs=class extends K{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>ot` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new tn(i.path)})),this._historyObserver=new T(this,e),this._authObserver=new T(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),ot` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(hs(this,"auth/redirect"),ot` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):ot` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),ot` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),r=s+e;for(const o of this._cases){const l=o.route.match(r);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){de(this,"history/redirect",{href:t})}};Rs.styles=mi`
    :host,
    main {
      display: contents;
    }
  `;let Rt=Rs;Ts([Ss()],Rt.prototype,"_user");Ts([Ss()],Rt.prototype,"_match");const sn=Object.freeze(Object.defineProperty({__proto__:null,Element:Rt,Switch:Rt},Symbol.toStringTag,{value:"Module"})),Us=class Ns extends HTMLElement{constructor(){if(super(),Dt(this).template(Ns.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Us.template=I`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;let nn=Us;const rn=Object.freeze(Object.defineProperty({__proto__:null,Element:nn},Symbol.toStringTag,{value:"Module"})),ye=class ae extends HTMLElement{constructor(){super(),this._array=[],Dt(this).template(ae.template).styles(ae.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Ls("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,r=e.closest("label");if(r){const o=Array.from(this.children).indexOf(r);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{re(t,"button.add")?kt(t,"input-array:add"):re(t,"button.remove")&&kt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],an(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};ye.template=I`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;ye.styles=jt`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
    }
  `;let on=ye;function an(n,t){t.replaceChildren(),n.forEach((e,s)=>t.append(Ls(e)))}function Ls(n,t){const e=n===void 0?I`<input />`:I`<input value="${n}" />`;return I`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}const ln=Object.freeze(Object.defineProperty({__proto__:null,Element:on},Symbol.toStringTag,{value:"Module"}));function st(n){return Object.entries(n).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var cn=Object.defineProperty,hn=Object.getOwnPropertyDescriptor,un=(n,t,e,s)=>{for(var i=hn(t,e),r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=o(t,e,i)||i);return i&&cn(t,e,i),i};class dn extends K{constructor(t){super(),this._pending=[],this._observer=new T(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}un([Es()],dn.prototype,"model");/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=globalThis,ve=Pt.ShadowRoot&&(Pt.ShadyCSS===void 0||Pt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,_e=Symbol(),We=new WeakMap;let Ms=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==_e)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ve&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=We.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&We.set(e,t))}return t}toString(){return this.cssText}};const pn=n=>new Ms(typeof n=="string"?n:n+"",void 0,_e),bt=(n,...t)=>{const e=n.length===1?n[0]:t.reduce((s,i,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new Ms(e,n,_e)},fn=(n,t)=>{if(ve)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=Pt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,n.appendChild(s)}},Ye=ve?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return pn(e)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:mn,defineProperty:gn,getOwnPropertyDescriptor:yn,getOwnPropertyNames:vn,getOwnPropertySymbols:_n,getPrototypeOf:$n}=Object,O=globalThis,Ke=O.trustedTypes,bn=Ke?Ke.emptyScript:"",Xt=O.reactiveElementPolyfillSupport,ht=(n,t)=>n,Ut={toAttribute(n,t){switch(t){case Boolean:n=n?bn:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},$e=(n,t)=>!mn(n,t),Je={attribute:!0,type:String,converter:Ut,reflect:!1,hasChanged:$e};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),O.litPropertyMetadata??(O.litPropertyMetadata=new WeakMap);class Y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Je){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&gn(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=yn(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);r.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Je}static _$Ei(){if(this.hasOwnProperty(ht("elementProperties")))return;const t=$n(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ht("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ht("properties"))){const e=this.properties,s=[...vn(e),..._n(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Ye(i))}else t!==void 0&&e.push(Ye(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return fn(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var r;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:Ut).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var r;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((r=o.converter)==null?void 0:r.fromAttribute)!==void 0?o.converter:Ut;this._$Em=i,this[i]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??$e)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,o]of i)o.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var r;return(r=i.hostUpdate)==null?void 0:r.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[ht("elementProperties")]=new Map,Y[ht("finalized")]=new Map,Xt==null||Xt({ReactiveElement:Y}),(O.reactiveElementVersions??(O.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ut=globalThis,Nt=ut.trustedTypes,Ze=Nt?Nt.createPolicy("lit-html",{createHTML:n=>n}):void 0,zs="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,Is="?"+C,wn=`<${Is}>`,j=document,mt=()=>j.createComment(""),gt=n=>n===null||typeof n!="object"&&typeof n!="function",be=Array.isArray,An=n=>be(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",te=`[ 	
\f\r]`,at=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ge=/-->/g,Qe=/>/g,L=RegExp(`>|${te}(?:([^\\s"'>=/]+)(${te}*=${te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Xe=/'/g,ts=/"/g,Hs=/^(?:script|style|textarea|title)$/i,En=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),w=En(1),X=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),es=new WeakMap,z=j.createTreeWalker(j,129);function js(n,t){if(!be(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ze!==void 0?Ze.createHTML(t):t}const Sn=(n,t)=>{const e=n.length-1,s=[];let i,r=t===2?"<svg>":t===3?"<math>":"",o=at;for(let l=0;l<e;l++){const a=n[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===at?f[1]==="!--"?o=Ge:f[1]!==void 0?o=Qe:f[2]!==void 0?(Hs.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=L):f[3]!==void 0&&(o=L):o===L?f[0]===">"?(o=i??at,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?L:f[3]==='"'?ts:Xe):o===ts||o===Xe?o=L:o===Ge||o===Qe?o=at:(o=L,i=void 0);const h=o===L&&n[l+1].startsWith("/>")?" ":"";r+=o===at?a+wn:u>=0?(s.push(d),a.slice(0,u)+zs+a.slice(u)+C+h):a+C+(u===-2?l:h)}return[js(n,r+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class yt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Sn(t,e);if(this.el=yt.createElement(d,s),z.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=z.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(zs)){const c=f[o++],h=i.getAttribute(u).split(C),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:r,name:p[2],strings:h,ctor:p[1]==="."?Pn:p[1]==="?"?kn:p[1]==="@"?Cn:Vt}),i.removeAttribute(u)}else u.startsWith(C)&&(a.push({type:6,index:r}),i.removeAttribute(u));if(Hs.test(i.tagName)){const u=i.textContent.split(C),c=u.length-1;if(c>0){i.textContent=Nt?Nt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],mt()),z.nextNode(),a.push({type:2,index:++r});i.append(u[c],mt())}}}else if(i.nodeType===8)if(i.data===Is)a.push({type:2,index:r});else{let u=-1;for(;(u=i.data.indexOf(C,u+1))!==-1;)a.push({type:7,index:r}),u+=C.length-1}r++}}static createElement(t,e){const s=j.createElement("template");return s.innerHTML=t,s}}function tt(n,t,e=n,s){var o,l;if(t===X)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const r=gt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==r&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=tt(n,i._$AS(n,t.values),i,s)),t}class xn{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??j).importNode(e,!0);z.currentNode=i;let r=z.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new wt(r,r.nextSibling,this,t):a.type===1?d=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(d=new On(r,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(r=z.nextNode(),o++)}return z.currentNode=j,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class wt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),gt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==X&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):An(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&gt(this._$AH)?this._$AA.nextSibling.data=t:this.T(j.createTextNode(t)),this._$AH=t}$(t){var r;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=yt.createElement(js(s.h,s.h[0]),this.options)),s);if(((r=this._$AH)==null?void 0:r._$AD)===i)this._$AH.p(e);else{const o=new xn(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=es.get(t.strings);return e===void 0&&es.set(t.strings,e=new yt(t)),e}k(t){be(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new wt(this.O(mt()),this.O(mt()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Vt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const r=this.strings;let o=!1;if(r===void 0)t=tt(this,t,e,0),o=!gt(t)||t!==this._$AH&&t!==X,o&&(this._$AH=t);else{const l=t;let a,d;for(t=r[0],a=0;a<r.length-1;a++)d=tt(this,l[s+a],e,a),d===X&&(d=this._$AH[a]),o||(o=!gt(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+r[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Pn extends Vt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class kn extends Vt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Cn extends Vt{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??$)===X)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class On{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const ee=ut.litHtmlPolyfillSupport;ee==null||ee(yt,wt),(ut.litHtmlVersions??(ut.litHtmlVersions=[])).push("3.2.1");const Tn=(n,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const r=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new wt(t.insertBefore(mt(),r),r,void 0,e??{})}return i._$AI(n),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let x=class extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Tn(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return X}};var ss;x._$litElement$=!0,x.finalized=!0,(ss=globalThis.litElementHydrateSupport)==null||ss.call(globalThis,{LitElement:x});const se=globalThis.litElementPolyfillSupport;se==null||se({LitElement:x});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rn={attribute:!0,type:String,converter:Ut,reflect:!1,hasChanged:$e},Un=(n=Rn,t,e)=>{const{kind:s,metadata:i}=e;let r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),r.set(e.name,n),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,n)},init(l){return l!==void 0&&this.P(o,void 0,n),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,n)}}throw Error("Unsupported decorator location: "+s)};function it(n){return(t,e)=>typeof e=="object"?Un(n,t,e):((s,i,r)=>{const o=i.hasOwnProperty(r);return i.constructor.createProperty(r,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,r):void 0})(n,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Bt(n){return it({...n,state:!0,attribute:!1})}const Nn=jt`
  * {
    margin: 0;
    box-sizing: border-box;
  }
  body {
    line-height: 1.5;
  }
  img {
    max-width: 100%;
  }
`,At={styles:Nn};var Ln=Object.defineProperty,Mn=(n,t,e,s)=>{for(var i=void 0,r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=o(t,e,i)||i);return i&&Ln(t,e,i),i};function zn(n){const e=n.target.checked;us.relay(n,"dark-mode",{checked:e})}function In(n){us.relay(n,"auth:message",["auth/signout"])}const Mt=class Mt extends x{constructor(){super(...arguments),this.userid="user",this._authObserver=new T(this,"blazing:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{console.log("user",t),t&&t.username!==this.userid&&(console.log("Updating userid from",this.userid,"to",t.username),this.userid=t.username)})}static initializeOnce(){function t(e,s){e.classList.toggle("dark-mode",s)}document.body.addEventListener("dark-mode",e=>{var s;return t(e.currentTarget,(s=e.detail)==null?void 0:s.checked)})}render(){return w`
      <header>
        <main class="navBar">
          <a href="/app">
            <h1 class="navTitle">
              <svg class="icon-market">
                <use href="/assets/icons.svg#icon-market" />
              </svg>
              <span>UniMarket</span>
            </h1>
          </a>
          <section class="navInfo">
            <a slot="actuator">
              Hello,
              <span id="userid">${this.userid}</span>
            </a>
            <div class="dropdown">
              <button class="dropbtn">Menu</button>
              <!-- Conditionally render Sign Out/Sign In links -->
              <div class="dropdown-content">
                ${this.userid!=="anonymous"?w`
                      <li class="when-signed-in">
                        <a id="signout" @click=${In}>Sign Out</a>
                      </li>
                    `:w`
                      <li class="when-signed-out">
                        <a href="/login">Sign In</a>
                      </li>
                    `}
                <label @change=${zn}>
                  <input type="checkbox" />
                  Dark Mode
                </label>
              </div>
            </div>
          </section>
        </main>
      </header>
    `}};Mt.uses=st({"drop-down":rn.Element}),Mt.styles=[At.styles,bt`
      .navTitle {
        display: flex;
        align-items: center;
        flex-direction: row;
        gap: 0.5em;
      }

      .navBar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      }

      .navInfo {
        display: flex;
        flex-direction: column;
        align-self: center;
        margin-right: 10px;
      }

      .dropbtn {
        background-color: var(--color-sage);
        color: white;
        font-size: 16px;
        border: none;
        cursor: pointer;
        padding-left: 20px;
        padding-right: 20px;
      }

      .dropdown {
        position: relative;
        display: inline-block;
        align-self: center;
      }

      /* Dropdown Content (Hidden by Default) */
      .dropdown-content {
        display: none;
        position: absolute;
        background-color: var(--color-eggplant);
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        z-index: 1;
      }

      /* Show the dropdown menu on hover */
      .dropdown:hover .dropdown-content {
        display: block;
      }

      .icon-market {
        width: 1.5em;
        height: 1.5em;
        margin: 0;
        padding-left: var(--content-size-small);
        fill: var(--color-white);
      }

      header h1 {
        font-size: var(--size-type-xxlarge);
        font-family: var(--font-family-display);
        padding: 0.5rem;
        width: 100%;
        margin: 0;
      }

      header {
        background-color: var(--color-eggplant);
        color: var(--color-white);
        margin: 0;
        margin-bottom: var(--content-size-small);
      }

      a {
        color: var(--color-link);
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }
    `];let vt=Mt;Mn([Bt()],vt.prototype,"userid");const Hn=jt`
  .listings {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: var(--size-type-small);
    margin: 0.5rem;
  }

  figure {
    display: flex;
    flex-direction: column;
    margin: 0;
  }

  header {
    display: flex;
    flex-direction: row;
  }

  header h1 {
    font-size: var(--size-type-xxlarge);
    font-family: var(--font-family-display);
    padding: 0.5rem;
    width: 100%;
    margin: 0;
  }

  figure img {
    width: 100%;
    object-fit: cover;
    max-height: 20rem;
    height: 25rem;
  }

  figcaption {
    background-color: var(--color-eggplant);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  p {
    margin: 0.5rem;
  }

  a:hover {
    text-decoration: underline;
  }

  a {
    color: var(--color-link);
    text-decoration: none;
  }

  .navBar {
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 0.5em;
  }

  header {
    background-color: var(--color-eggplant);
    color: var(--color-white);
    margin: 0;
    margin-bottom: var(--content-size-small);
  }

  body {
    background-color: var(--color-sage);
    font-family: var(--font-family-body);
    font-size: calc(var(--content-size-small) + 0.1vw);
    margin: 0;
    color: var(--color-white);
  }

  .icon-market {
    width: 1.5em;
    height: 1.5em;
    margin: 0;
    padding-left: var(--content-size-small);
    fill: var(--color-white);
  }

  h2 {
    margin-top: 0;
  }
`,Ds={styles:Hn},Ae=class Ae extends x{render(){return w`
      <figure>
        <slot name="image"></slot>
        <figcaption>
          <slot name="listingName"><a href="#">Default Listing Name</a></slot>
          <slot name="price"><p>Price: $280</p></slot>
        </figcaption>
      </figure>
    `}};Ae.styles=[At.styles,bt`
      figure {
        display: flex;
        flex-direction: column;
        margin: 0;
      }

      ::slotted(img) {
        width: 100%;
        object-fit: cover;
        max-height: 20rem;
        height: 25rem;
      }

      figcaption {
        background-color: var(--color-eggplant);
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
      }

      a:hover {
        text-decoration: underline;
      }

      a {
        color: var(--color-link);
        text-decoration: none;
      }
    `];let le=Ae;var jn=Object.defineProperty,Dn=(n,t,e,s)=>{for(var i=void 0,r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=o(t,e,i)||i);return i&&jn(t,e,i),i};const zt=class zt extends x{constructor(){super(...arguments),this.src="/api/listings",this.listingIndex=new Array,this._authObserver=new T(this,"blazing:auth"),this._user=new S.User}connectedCallback(){super.connectedCallback(),console.log("UnimarketListings connected"),this._authObserver.observe(({user:t})=>{console.log("Auth observer fired:",t),t&&(this._user=t),this.hydrate(this.src)})}hydrate(t){console.log("Fetching listings from:",t),fetch(t,{headers:S.headers(this._user)}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to render data ${t}:`,e)).then(e=>{e&&(console.log("Listings:",e),this.listingIndex=e)}).catch(e=>console.log("Failed to convert listing data:",e))}render(){const t=this.listingIndex.map(this.renderListing);return w` <section class="listings">${t}</section> `}renderListing(t){const{_id:e,name:s,price:i,featuredImage:r}=t;return w`
      <listing-header>
        <img slot="image" src="/assets/${r}" alt="${s}" />
        <span slot="listingName">
          <a href="/app/listing/${e}">${s}</a>
        </span>
        <span slot="price">Price: $${i}</span>
      </listing-header>
    `}};zt.uses=st({"listing-header":le}),zt.styles=[At.styles,Ds.styles,bt`
      .listings {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
        gap: var(--size-type-small);
        margin: 0.5rem;
      }
    `];let Lt=zt;Dn([Bt()],Lt.prototype,"listingIndex");var Fn=Object.defineProperty,we=(n,t,e,s)=>{for(var i=void 0,r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=o(t,e,i)||i);return i&&Fn(t,e,i),i};const It=class It extends x{constructor(){super(...arguments),this.mode="view",this._authObserver=new T(this,"blazing:auth"),this._user=new S.User}get src(){return`/api/users/${this.userid}`}connectedCallback(){super.connectedCallback(),console.log("UnimarketListings connected"),this._authObserver.observe(({user:t})=>{console.log("Auth observer fired:",t),t&&(this._user=t),this.hydrate(this.src)})}hydrate(t){console.log("Fetching listings from:",t),fetch(t,{headers:S.headers(this._user)}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to render data ${t}:`,e)).then(e=>{e&&(console.log("User: ",e),this.user=e)}).catch(e=>console.log("Failed to convert user data:",e))}submit(t,e){fetch(t,{headers:S.headers(this._user),method:"PUT",body:JSON.stringify(e)}).then(s=>s.json()).then(s=>{s&&(console.log("User: ",s),this.user=s),this.mode="view"}).catch(s=>console.log(`Failed to render data on submit ${t}:`,s))}render(){const{name:t,contactInfo:e,profilePic:s}=this.user||{};return w`
      <section class="view">
        <main class="center-container">
          <section class="userProfile">
            <div class="userPhoto-container">
              <img src="/assets/${s}" alt=${t}/>
            </div>
            <h2>${t}</h2>
            <section class="userDescription">
              <dl>
                <dt>Contact Information</dt>
                <dd>${e}</dd>
              </dl>
              <button id="edit" @click=${()=>this.mode="edit"}>
                Edit
              </button>
            </section>
          </section>
        </main>
      </section>
      <mu-form class="edit">
        <label>
          <span>User Name</span>
          <input name="name" />
        </label>
        <label>
          <span>Contact Information</span>
          <input name="contactInfo" />
        </label>
      </mu-form>
    `}};It.uses=st({"mu-form":ds.Element}),It.styles=[At.styles,bt`
      .userProfile {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--color-eggplant);
        padding: var(--content-size-xlarge);
        width: 80%;
        max-width: 600px;
        margin-bottom: var(--content-size-medium);
      }

      .userPhoto-container {
        width: 15rem;
        height: 15rem;
      }

      .userDescription dl {
        display: grid;
        grid-template-columns: auto 1fr;
        grid-gap: 0.5rem;
        width: 100%;
      }

      .userDescription dt {
        text-align: right;
        font-weight: bold;
      }

      .userDescription dd {
        text-align: left;
        margin: 0;
      }

      a {
        color: var(--color-link);
        text-decoration: none;
      }

      a:hover {
        text-decoration: underline;
      }

      .center-container {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      :host {
        display: contents;
      }
      :host([mode="edit"]),
      :host([mode="new"]) {
        --display-view-none: none;
      }
      :host([mode="view"]) {
        --display-editor-none: none;
      }
      section.view {
        display: var(--display-view-none, grid);
        grid-template-columns: subgrid;
        gap: inherit;
        gap: var(--size-spacing-medium) var(--size-spacing-xlarge);
        align-items: end;
        grid-column: 1 / -1;
      }
      mu-form.edit {
        display: var(--display-editor-none, grid);
        grid-column: 1/-1;
        grid-template-columns: subgrid;
      }
    `];let et=It;we([it()],et.prototype,"userid");we([Bt()],et.prototype,"user");we([it({reflect:!0})],et.prototype,"mode");var Vn=Object.defineProperty,qt=(n,t,e,s)=>{for(var i=void 0,r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=o(t,e,i)||i);return i&&Vn(t,e,i),i};const Ht=class Ht extends x{constructor(){super(...arguments),this.mode="view",this._authObserver=new T(this,"blazing:auth"),this._user=new S.User}get src(){return`/api/listings/${this.listingid}`}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:S.headers(this._user)}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to render data ${t}:`,e)).then(e=>{e&&(console.log("Listing: ",e),this.listing=e,this.renderUser())}).catch(e=>console.log("Failed to convert listing data:",e))}submit(t,e){fetch(t,{headers:S.headers(this._user),method:"PUT",body:JSON.stringify(e)}).then(s=>s.json()).then(s=>{s&&(console.log("Listing: ",s),this.listing=s),this.mode="view"}).catch(s=>console.log(`Failed to render data on submit ${t}:`,s))}async renderUser(){var t;try{const e=`/api/users/${(t=this.listing)==null?void 0:t.seller}`,s=await fetch(e,{headers:S.headers(this._user)});if(console.log("response",s),!s.ok)throw new Error(`Error fetching seller info: ${s.statusText}`);const i=await s.json();console.log("Seller data",i),this.sellerData=i}catch(e){console.error("Failed to fetch seller data:",e)}}render(){const{name:t,description:e,price:s,pickUpLocation:i,listedDate:r,condition:o,featuredImage:l}=this.listing||{};return w`
      <section class="view">
        <section class="listing">
          <div class="listing-header">
            <h2>${t}</h2>
            <a href="/app">
              <svg class="crossSvg">
                <use href="/assets/icons.svg#icon-cross"></use>
              </svg>
            </a>
          </div>
          <section class="listing-description">
            <img src="/assets/${l}" alt="${t}" />
            <div class="details">
              <dl>
                <dt>Description</dt>
                <dd>${e}</dd>
                <dt>Price</dt>
                <dd>$${s}</dd>
                <dt>Listed Date</dt>
                <dd>${r}</dd>
                <dt>Condition</dt>
                <dd>${o}</dd>
                <dt>Pick Up Location</dt>
                <dd>${i}</dd>
                <dt>Seller Information</dt>
                <dd>
                  ${this.sellerData?w`<a href="../user/${this.sellerData._id}">
                        ${this.sellerData.name}
                      </a>`:w`<span>Loading seller information...</span>`}
                </dd>
              </dl>
            </div>
          </section>
          <button @click=${()=>this.mode="edit"}>Edit</button>
        </section>
      </section>
      <mu-form class="edit" .init=${this.listing}>
        <label>
          <span>Listing Name</span>
          <input name="name" />
        </label>
        <label>
          <span>Description</span>
          <input name="description" />
        </label>
        <label>
          <span>Price</span>
          <input name="price" />
        </label>
        <label>
          <span>Pick Up Location</span>
          <input name="pickUpLocation" />
        </label>
      </mu-form>
    `}};Ht.uses=st({"mu-form":ds.Element,"input-array":ln.Element}),Ht.styles=[At.styles,Ds.styles,bt`
      .listing {
        margin: var(--content-size-small);
      }

      .listing-description {
        display: flex;
        flex-direction: row;
      }

      .details {
        padding: var(--size-type-large);
      }

      img {
        max-height: calc(
          70vh - var(--content-size-medium)
        ); /* vh is the visual height */
      }

      .crossSvg {
        width: var(--content-size-large);
        height: var(--content-size-large);
        fill: var(--color-sage);
        stroke: var(--color-white);
      }

      dt {
        font-weight: var(--font-bold); /* Make the terms bold for emphasis */
      }

      dd {
        margin-bottom: var(--content-size-small);
        margin-left: var(--content-size-small);
      }

      .listing-header {
        display: flex;
        align-items: center; /* Align the items vertically in the center */
        justify-content: space-between; /* Push items to the edges */
        padding-bottom: var(
          --content-size-small
        ); /* Optional: Adds some space below the header */
      }

      :host {
        display: contents;
      }
      :host([mode="edit"]),
      :host([mode="new"]) {
        --display-view-none: none;
      }
      :host([mode="view"]) {
        --display-editor-none: none;
      }
      section.view {
        display: var(--display-view-none, grid);
        grid-template-columns: subgrid;
        gap: inherit;
        gap: var(--size-spacing-medium) var(--size-spacing-xlarge);
        align-items: end;
        grid-column: 1 / -1;
      }
      mu-form.edit {
        display: var(--display-editor-none, grid);
        grid-column: 1/-1;
        grid-template-columns: subgrid;
      }
    `];let D=Ht;qt([it()],D.prototype,"listingid");qt([it({attribute:!1})],D.prototype,"listing");qt([Bt()],D.prototype,"sellerData");qt([it({reflect:!0})],D.prototype,"mode");const Ee=class Ee extends x{render(){return w` <home-view></home-view> `}connectedCallback(){super.connectedCallback(),vt.initializeOnce()}};Ee.uses=st({"home-view":Lt});let ce=Ee;const Bn=[{path:"/app/listing/:listingId",view:n=>w`
      <uni-listing listingid=${n.listingId}></uni-listing>
    `},{path:"/app/user/:userId",view:n=>w`
      <user-profile userid=${n.userId}></user-profile>
    `},{path:"/app",view:()=>w` <home-view></home-view> `},{path:"/",redirect:"/app"}];st({"mu-auth":S.Provider,"mu-history":ui.Provider,"mu-switch":class extends sn.Element{constructor(){super(Bn,"blazing:history","blazing:auth")}},"uni-market-app":ce,"uni-market-nav":vt,"user-profile":et,"uni-listing":D});
