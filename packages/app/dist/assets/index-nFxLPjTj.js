(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();var B,Oe;class ct extends Error{}ct.prototype.name="InvalidTokenError";function Ks(n){return decodeURIComponent(atob(n).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Gs(n){let t=n.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Ks(t)}catch{return atob(t)}}function ns(n,t){if(typeof n!="string")throw new ct("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=n.split(".")[e];if(typeof s!="string")throw new ct(`Invalid token specified: missing part #${e+1}`);let i;try{i=Gs(s)}catch(r){throw new ct(`Invalid token specified: invalid base64 for part #${e+1} (${r.message})`)}try{return JSON.parse(i)}catch(r){throw new ct(`Invalid token specified: invalid json for part #${e+1} (${r.message})`)}}const Zs="mu:context",ie=`${Zs}:change`;class Qs{constructor(t,e){this._proxy=Xs(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class he extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Qs(t,this),this.style.display="contents"}attach(t){return this.addEventListener(ie,t),t}detach(t){this.removeEventListener(ie,t)}}function Xs(n,t){return new Proxy(n,{get:(s,i,r)=>{if(i==="then")return;const o=Reflect.get(s,i,r);return console.log(`Context['${i}'] => `,o),o},set:(s,i,r,o)=>{const l=n[i];console.log(`Context['${i.toString()}'] <= `,r);const a=Reflect.set(s,i,r,o);if(a){let d=new CustomEvent(ie,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:i,oldValue:l,value:r}),t.dispatchEvent(d)}else console.log(`Context['${i}] was not set to ${r}`);return a}})}function ti(n,t){const e=rs(t,n);return new Promise((s,i)=>{if(e){const r=e.localName;customElements.whenDefined(r).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function rs(n,t){const e=`[provides="${n}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return rs(n,i.host)}class ei extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function os(n="mu:message"){return(t,...e)=>t.dispatchEvent(new ei(e,n))}class ue{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function si(n){return t=>({...t,...n})}const ne="mu:auth:jwt",as=class ls extends ue{constructor(t,e){super((s,i)=>this.update(s,i),t,ls.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(ni(s)),Zt(i);case"auth/signout":return e(ri()),Zt(this._redirectForLogin);case"auth/redirect":return Zt(this._redirectForLogin,{next:window.location.href});default:const r=t[0];throw new Error(`Unhandled Auth message "${r}"`)}}};as.EVENT_TYPE="auth:message";let cs=as;const hs=os(cs.EVENT_TYPE);function Zt(n,t={}){if(!n)return;const e=window.location.href,s=new URL(n,e);return Object.entries(t).forEach(([i,r])=>s.searchParams.set(i,r)),()=>{console.log("Redirecting to ",n),window.location.assign(s)}}class ii extends he{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=G.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new cs(this.context,this.redirect).attach(this)}}class K{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ne),t}}class G extends K{constructor(t){super();const e=ns(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new G(t);return localStorage.setItem(ne,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ne);return t?G.authenticate(t):new K}}function ni(n){return si({user:G.authenticate(n),token:n})}function ri(){return n=>{const t=n.user;return{user:t&&t.authenticated?K.deauthenticate(t):t,token:""}}}function oi(n){return n.authenticated?{Authorization:`Bearer ${n.token||"NO_TOKEN"}`}:{}}function ai(n){return n.authenticated?ns(n.token||""):{}}const M=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:G,Provider:ii,User:K,dispatch:hs,headers:oi,payload:ai},Symbol.toStringTag,{value:"Module"}));function Ot(n,t,e){const s=n.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${n.type}:`,i),s.dispatchEvent(i),n.stopPropagation()}function re(n,t="*"){return n.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const us=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:re,relay:Ot},Symbol.toStringTag,{value:"Module"}));function Dt(n,...t){const e=n.map((i,r)=>r?[t[r-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const li=new DOMParser;function z(n,...t){const e=t.map(l),s=n.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),i=li.parseFromString(s,"text/html"),r=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...r),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Ce(a);case"bigint":case"boolean":case"number":case"symbol":return Ce(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ce(n){return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Ft(n,t={mode:"open"}){const e=n.attachShadow(t),s={template:i,styles:r};return s;function i(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function r(...o){e.adoptedStyleSheets=o}}let ci=(B=class extends HTMLElement{constructor(){super(),this._state={},Ft(this).template(B.template).styles(B.styles),this.addEventListener("change",n=>{const t=n.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",n=>{n.preventDefault(),Ot(n,"mu-form:submit",this._state)})}set init(n){this._state=n||{},hi(this._state,this)}get form(){var n;return(n=this.shadowRoot)==null?void 0:n.querySelector("form")}},B.template=z`
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
  `,B.styles=Dt`
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
  `,B);function hi(n,t){const e=Object.entries(n);for(const[s,i]of e){const r=t.querySelector(`[name="${s}"]`);if(r){const o=r;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return n}const ds=Object.freeze(Object.defineProperty({__proto__:null,Element:ci},Symbol.toStringTag,{value:"Module"})),ps=class fs extends ue{constructor(t){super((e,s)=>this.update(e,s),t,fs.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(di(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(pi(s,i));break}}}};ps.EVENT_TYPE="history:message";let de=ps;class Te extends he{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=ui(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),pe(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new de(this.context).attach(this)}}function ui(n){const t=n.currentTarget,e=s=>s.tagName=="A"&&s.href;if(n.button===0)if(n.composed){const i=n.composedPath().find(e);return i||void 0}else{for(let s=n.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function di(n,t={}){return history.pushState(t,"",n),()=>({location:document.location,state:history.state})}function pi(n,t={}){return history.replaceState(t,"",n),()=>({location:document.location,state:history.state})}const pe=os(de.EVENT_TYPE),fi=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Te,Provider:Te,Service:de,dispatch:pe},Symbol.toStringTag,{value:"Module"}));class I{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Re(this._provider,t);this._effects.push(i),e(i)}else ti(this._target,this._contextLabel).then(i=>{const r=new Re(i,t);this._provider=i,this._effects.push(r),i.attach(o=>this._handleChange(o)),e(r)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Re{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const gs=class ms extends HTMLElement{constructor(){super(),this._state={},this._user=new K,this._authObserver=new I(this,"blazing:auth"),Ft(this).template(ms.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;gi(i,this._state,e,this.authorization).then(r=>rt(r,this)).then(r=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:r,url:i}});this.dispatchEvent(l)}).catch(r=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:r,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},rt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Ne(this.src,this.authorization).then(e=>{this._state=e,rt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Ne(this.src,this.authorization).then(i=>{this._state=i,rt(i,this)});break;case"new":s&&(this._state={},rt({},this));break}}};gs.observedAttributes=["src","new","action"];gs.template=z`
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
  `;function Ne(n,t){return fetch(n,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${n}:`,e))}function rt(n,t){const e=Object.entries(n);for(const[s,i]of e){const r=t.querySelector(`[name="${s}"]`);if(r){const o=r;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return n}function gi(n,t,e="PUT",s={}){return fetch(n,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const ys=class vs extends ue{constructor(t,e){super(e,t,vs.EVENT_TYPE,!1)}};ys.EVENT_TYPE="mu:message";let _s=ys;class mi extends he{constructor(t,e,s){super(e),this._user=new K,this._updateFn=t,this._authObserver=new I(this,s)}connectedCallback(){const t=new _s(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const yi=Object.freeze(Object.defineProperty({__proto__:null,Provider:mi,Service:_s},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Pt=globalThis,fe=Pt.ShadowRoot&&(Pt.ShadyCSS===void 0||Pt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ge=Symbol(),Ue=new WeakMap;let $s=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ge)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(fe&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ue.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ue.set(e,t))}return t}toString(){return this.cssText}};const vi=n=>new $s(typeof n=="string"?n:n+"",void 0,ge),_i=(n,...t)=>{const e=n.length===1?n[0]:t.reduce((s,i,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new $s(e,n,ge)},$i=(n,t)=>{if(fe)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=Pt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,n.appendChild(s)}},Le=fe?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return vi(e)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:bi,defineProperty:wi,getOwnPropertyDescriptor:Ai,getOwnPropertyNames:Ei,getOwnPropertySymbols:xi,getPrototypeOf:Si}=Object,Z=globalThis,ze=Z.trustedTypes,Pi=ze?ze.emptyScript:"",Me=Z.reactiveElementPolyfillSupport,ht=(n,t)=>n,Ct={toAttribute(n,t){switch(t){case Boolean:n=n?Pi:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},me=(n,t)=>!bi(n,t),Ie={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:me};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Z.litPropertyMetadata??(Z.litPropertyMetadata=new WeakMap);let W=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ie){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&wi(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=Ai(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);r.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ie}static _$Ei(){if(this.hasOwnProperty(ht("elementProperties")))return;const t=Si(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ht("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ht("properties"))){const e=this.properties,s=[...Ei(e),...xi(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Le(i))}else t!==void 0&&e.push(Le(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return $i(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,i);if(r!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:Ct).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,r=i._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const o=i.getPropertyOptions(r),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Ct;this._$Em=r,this[r]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??me)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,o]of i)o.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var r;return(r=i.hostUpdate)==null?void 0:r.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[ht("elementProperties")]=new Map,W[ht("finalized")]=new Map,Me==null||Me({ReactiveElement:W}),(Z.reactiveElementVersions??(Z.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=globalThis,Rt=Tt.trustedTypes,He=Rt?Rt.createPolicy("lit-html",{createHTML:n=>n}):void 0,bs="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,ws="?"+S,ki=`<${ws}>`,H=document,pt=()=>H.createComment(""),ft=n=>n===null||typeof n!="object"&&typeof n!="function",ye=Array.isArray,Oi=n=>ye(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",Qt=`[ 	
\f\r]`,ot=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,je=/-->/g,De=/>/g,R=RegExp(`>|${Qt}(?:([^\\s"'>=/]+)(${Qt}*=${Qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Fe=/'/g,Ve=/"/g,As=/^(?:script|style|textarea|title)$/i,Ci=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),at=Ci(1),Q=Symbol.for("lit-noChange"),_=Symbol.for("lit-nothing"),Be=new WeakMap,U=H.createTreeWalker(H,129);function Es(n,t){if(!ye(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return He!==void 0?He.createHTML(t):t}const Ti=(n,t)=>{const e=n.length-1,s=[];let i,r=t===2?"<svg>":t===3?"<math>":"",o=ot;for(let l=0;l<e;l++){const a=n[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ot?f[1]==="!--"?o=je:f[1]!==void 0?o=De:f[2]!==void 0?(As.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=R):f[3]!==void 0&&(o=R):o===R?f[0]===">"?(o=i??ot,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?R:f[3]==='"'?Ve:Fe):o===Ve||o===Fe?o=R:o===je||o===De?o=ot:(o=R,i=void 0);const h=o===R&&n[l+1].startsWith("/>")?" ":"";r+=o===ot?a+ki:u>=0?(s.push(d),a.slice(0,u)+bs+a.slice(u)+S+h):a+S+(u===-2?l:h)}return[Es(n,r+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let oe=class xs{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Ti(t,e);if(this.el=xs.createElement(d,s),U.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=U.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(bs)){const c=f[o++],h=i.getAttribute(u).split(S),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:r,name:p[2],strings:h,ctor:p[1]==="."?Ni:p[1]==="?"?Ui:p[1]==="@"?Li:Vt}),i.removeAttribute(u)}else u.startsWith(S)&&(a.push({type:6,index:r}),i.removeAttribute(u));if(As.test(i.tagName)){const u=i.textContent.split(S),c=u.length-1;if(c>0){i.textContent=Rt?Rt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],pt()),U.nextNode(),a.push({type:2,index:++r});i.append(u[c],pt())}}}else if(i.nodeType===8)if(i.data===ws)a.push({type:2,index:r});else{let u=-1;for(;(u=i.data.indexOf(S,u+1))!==-1;)a.push({type:7,index:r}),u+=S.length-1}r++}}static createElement(t,e){const s=H.createElement("template");return s.innerHTML=t,s}};function X(n,t,e=n,s){var i,r;if(t===Q)return t;let o=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const l=ft(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((r=o==null?void 0:o._$AO)==null||r.call(o,!1),l===void 0?o=void 0:(o=new l(n),o._$AT(n,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=X(n,o._$AS(n,t.values),o,s)),t}class Ri{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??H).importNode(e,!0);U.currentNode=i;let r=U.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new vt(r,r.nextSibling,this,t):a.type===1?d=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(d=new zi(r,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(r=U.nextNode(),o++)}return U.currentNode=H,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class vt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=_,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),ft(t)?t===_||t==null||t===""?(this._$AH!==_&&this._$AR(),this._$AH=_):t!==this._$AH&&t!==Q&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Oi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==_&&ft(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,r=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=oe.createElement(Es(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===r)this._$AH.p(s);else{const o=new Ri(r,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Be.get(t.strings);return e===void 0&&Be.set(t.strings,e=new oe(t)),e}k(t){ye(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new vt(this.O(pt()),this.O(pt()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Vt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=_,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=_}_$AI(t,e=this,s,i){const r=this.strings;let o=!1;if(r===void 0)t=X(this,t,e,0),o=!ft(t)||t!==this._$AH&&t!==Q,o&&(this._$AH=t);else{const l=t;let a,d;for(t=r[0],a=0;a<r.length-1;a++)d=X(this,l[s+a],e,a),d===Q&&(d=this._$AH[a]),o||(o=!ft(d)||d!==this._$AH[a]),d===_?t=_:t!==_&&(t+=(d??"")+r[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===_?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ni extends Vt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===_?void 0:t}}class Ui extends Vt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==_)}}class Li extends Vt{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??_)===Q)return;const s=this._$AH,i=t===_&&s!==_||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==_&&(s===_||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class zi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}}const qe=Tt.litHtmlPolyfillSupport;qe==null||qe(oe,vt),(Tt.litHtmlVersions??(Tt.litHtmlVersions=[])).push("3.2.0");const Mi=(n,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const r=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new vt(t.insertBefore(pt(),r),r,void 0,e??{})}return i._$AI(n),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let J=class extends W{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Mi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return Q}};J._$litElement$=!0,J.finalized=!0,(Oe=globalThis.litElementHydrateSupport)==null||Oe.call(globalThis,{LitElement:J});const We=globalThis.litElementPolyfillSupport;We==null||We({LitElement:J});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ii={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:me},Hi=(n=Ii,t,e)=>{const{kind:s,metadata:i}=e;let r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),r.set(e.name,n),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,n)},init(l){return l!==void 0&&this.P(o,void 0,n),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,n)}}throw Error("Unsupported decorator location: "+s)};function Ss(n){return(t,e)=>typeof e=="object"?Hi(n,t,e):((s,i,r)=>{const o=i.hasOwnProperty(r);return i.constructor.createProperty(r,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,r):void 0})(n,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ps(n){return Ss({...n,state:!0,attribute:!1})}function ji(n){return n&&n.__esModule&&Object.prototype.hasOwnProperty.call(n,"default")?n.default:n}function Di(n){throw new Error('Could not dynamically require "'+n+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var ks={};(function(n){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],i=[1,10],r=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,m,g,y,Wt){var A=y.length-1;switch(g){case 1:return new m.Root({},[y[A-1]]);case 2:return new m.Root({},[new m.Literal({value:""})]);case 3:this.$=new m.Concat({},[y[A-1],y[A]]);break;case 4:case 5:this.$=y[A];break;case 6:this.$=new m.Literal({value:y[A]});break;case 7:this.$=new m.Splat({name:y[A]});break;case 8:this.$=new m.Param({name:y[A]});break;case 9:this.$=new m.Optional({},[y[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:r,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:r,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:r,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:r,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(m,g){this.message=m,this.hash=g};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],m=[null],g=[],y=this.table,Wt="",A=0,Se=0,qs=2,Pe=1,Ws=g.slice.call(arguments,1),v=Object.create(this.lexer),C={yy:{}};for(var Yt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Yt)&&(C.yy[Yt]=this.yy[Yt]);v.setInput(c,C.yy),C.yy.lexer=v,C.yy.parser=this,typeof v.yylloc>"u"&&(v.yylloc={});var Jt=v.yylloc;g.push(Jt);var Ys=v.options&&v.options.ranges;typeof C.yy.parseError=="function"?this.parseError=C.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Js=function(){var V;return V=v.lex()||Pe,typeof V!="number"&&(V=h.symbols_[V]||V),V},b,T,E,Kt,F={},xt,x,ke,St;;){if(T=p[p.length-1],this.defaultActions[T]?E=this.defaultActions[T]:((b===null||typeof b>"u")&&(b=Js()),E=y[T]&&y[T][b]),typeof E>"u"||!E.length||!E[0]){var Gt="";St=[];for(xt in y[T])this.terminals_[xt]&&xt>qs&&St.push("'"+this.terminals_[xt]+"'");v.showPosition?Gt="Parse error on line "+(A+1)+`:
`+v.showPosition()+`
Expecting `+St.join(", ")+", got '"+(this.terminals_[b]||b)+"'":Gt="Parse error on line "+(A+1)+": Unexpected "+(b==Pe?"end of input":"'"+(this.terminals_[b]||b)+"'"),this.parseError(Gt,{text:v.match,token:this.terminals_[b]||b,line:v.yylineno,loc:Jt,expected:St})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+T+", token: "+b);switch(E[0]){case 1:p.push(b),m.push(v.yytext),g.push(v.yylloc),p.push(E[1]),b=null,Se=v.yyleng,Wt=v.yytext,A=v.yylineno,Jt=v.yylloc;break;case 2:if(x=this.productions_[E[1]][1],F.$=m[m.length-x],F._$={first_line:g[g.length-(x||1)].first_line,last_line:g[g.length-1].last_line,first_column:g[g.length-(x||1)].first_column,last_column:g[g.length-1].last_column},Ys&&(F._$.range=[g[g.length-(x||1)].range[0],g[g.length-1].range[1]]),Kt=this.performAction.apply(F,[Wt,Se,A,C.yy,E[1],m,g].concat(Ws)),typeof Kt<"u")return Kt;x&&(p=p.slice(0,-1*x*2),m=m.slice(0,-1*x),g=g.slice(0,-1*x)),p.push(this.productions_[E[1]][0]),m.push(F.$),g.push(F._$),ke=y[p[p.length-2]][p[p.length-1]],p.push(ke);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var g=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===m.length?this.yylloc.first_column:0)+m[m.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[g[0],g[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,m,g;if(this.options.backtrack_lexer&&(g={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(g.yylloc.range=this.yylloc.range.slice(0))),m=c[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var y in g)this[y]=g[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,m;this._more||(this.yytext="",this.match="");for(var g=this._currentRules(),y=0;y<g.length;y++)if(p=this._input.match(this.rules[g[y]]),p&&(!h||p[0].length>h[0].length)){if(h=p,m=y,this.options.backtrack_lexer){if(c=this.test_match(p,g[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,g[m]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,m,g){switch(m){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Di<"u"&&(n.parser=t,n.Parser=t.Parser,n.parse=function(){return t.parse.apply(t,arguments)})})(ks);function q(n){return function(t,e){return{displayName:n,props:t,children:e||[]}}}var Os={Root:q("Root"),Concat:q("Concat"),Literal:q("Literal"),Splat:q("Splat"),Param:q("Param"),Optional:q("Optional")},Cs=ks.parser;Cs.yy=Os;var Fi=Cs,Vi=Object.keys(Os);function Bi(n){return Vi.forEach(function(t){if(typeof n[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:n}}var Ts=Bi,qi=Ts,Wi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Rs(n){this.captures=n.captures,this.re=n.re}Rs.prototype.match=function(n){var t=this.re.exec(n),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Yi=qi({Concat:function(n){return n.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(n){return{re:n.props.value.replace(Wi,"\\$&"),captures:[]}},Splat:function(n){return{re:"([^?]*?)",captures:[n.props.name]}},Param:function(n){return{re:"([^\\/\\?]+)",captures:[n.props.name]}},Optional:function(n){var t=this.visit(n.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(n){var t=this.visit(n.children[0]);return new Rs({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Ji=Yi,Ki=Ts,Gi=Ki({Concat:function(n,t){var e=n.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(n){return decodeURI(n.props.value)},Splat:function(n,t){return t[n.props.name]?t[n.props.name]:!1},Param:function(n,t){return t[n.props.name]?t[n.props.name]:!1},Optional:function(n,t){var e=this.visit(n.children[0],t);return e||""},Root:function(n,t){t=t||{};var e=this.visit(n.children[0],t);return e?encodeURI(e):!1}}),Zi=Gi,Qi=Fi,Xi=Ji,tn=Zi;_t.prototype=Object.create(null);_t.prototype.match=function(n){var t=Xi.visit(this.ast),e=t.match(n);return e||!1};_t.prototype.reverse=function(n){return tn.visit(this.ast,n)};function _t(n){var t;if(this?t=this:t=Object.create(_t.prototype),typeof n>"u")throw new Error("A route spec is required");return t.spec=n,t.ast=Qi.parse(n),t}var en=_t,sn=en,nn=sn;const rn=ji(nn);var on=Object.defineProperty,Ns=(n,t,e,s)=>{for(var i=void 0,r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=o(t,e,i)||i);return i&&on(t,e,i),i};const Us=class extends J{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>at` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new rn(i.path)})),this._historyObserver=new I(this,e),this._authObserver=new I(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),at` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(hs(this,"auth/redirect"),at` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):at` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),at` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),r=s+e;for(const o of this._cases){const l=o.route.match(r);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){pe(this,"history/redirect",{href:t})}};Us.styles=_i`
    :host,
    main {
      display: contents;
    }
  `;let Nt=Us;Ns([Ps()],Nt.prototype,"_user");Ns([Ps()],Nt.prototype,"_match");const an=Object.freeze(Object.defineProperty({__proto__:null,Element:Nt,Switch:Nt},Symbol.toStringTag,{value:"Module"})),Ls=class zs extends HTMLElement{constructor(){if(super(),Ft(this).template(zs.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Ls.template=z`
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
  `;let ln=Ls;const cn=Object.freeze(Object.defineProperty({__proto__:null,Element:ln},Symbol.toStringTag,{value:"Module"})),Ms=class ae extends HTMLElement{constructor(){super(),this._array=[],Ft(this).template(ae.template).styles(ae.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Is("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,r=e.closest("label");if(r){const o=Array.from(this.children).indexOf(r);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{re(t,"button.add")?Ot(t,"input-array:add"):re(t,"button.remove")&&Ot(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],hn(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Ms.template=z`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Ms.styles=Dt`
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
  `;function hn(n,t){t.replaceChildren(),n.forEach((e,s)=>t.append(Is(e)))}function Is(n,t){const e=n===void 0?z`<input />`:z`<input value="${n}" />`;return z`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function nt(n){return Object.entries(n).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var un=Object.defineProperty,dn=Object.getOwnPropertyDescriptor,pn=(n,t,e,s)=>{for(var i=dn(t,e),r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=o(t,e,i)||i);return i&&un(t,e,i),i};class ve extends J{constructor(t){super(),this._pending=[],this._observer=new I(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}pn([Ss()],ve.prototype,"model");const fn={};function gn(n,t,e){switch(n[0]){case"profile/save":console.log("Applying selected profile to model:",n[1]),console.log("User",e),mn(n[1],e).then(s=>{s?(console.log("Applying profile to model:",s),t(i=>({...i,user:s}))):console.warn("No profile data returned from saveProfile")}).then(()=>{const{onSuccess:s}=n[1];s&&s()}).catch(s=>{const{onFailure:i}=n[1];i&&i(s)});break;case"profile/select":yn(n[1],e).then(s=>{s?(console.log("Applying profile to model:",s),t(i=>({...i,user:s}))):console.warn("No profile data returned from selectProfile")});break;case"listing/save":console.log("Applying selected saveListing to model:",n[1]),console.log("User",e),vn(n[1],e).then(s=>{s?(console.log("Applying saveListing to model:",s),t(i=>({...i,listing:s}))):console.warn("No listing data returned from saveListing")}).then(()=>{const{onSuccess:s}=n[1];s&&s()}).catch(s=>{const{onFailure:i}=n[1];i&&i(s)});break;case"listing/select":_n(n[1],e).then(s=>{s?(console.log("Applying selectListing to model:",s),t(i=>({...i,listing:s}))):console.warn("No profile data returned from selectListing")});break}}function mn(n,t){return fetch(`/api/users/${n.userid}`,{method:"PUT",headers:{"Content-Type":"application/json",...M.headers(t)},body:JSON.stringify(n.user)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to save profile for ${n.userid}`)}).then(e=>{if(console.log("JSON for save profile",e),e)return e})}function yn(n,t){return fetch(`/api/users/${n.userid}`,{headers:M.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Fetched profile JSON:",e),e})}function vn(n,t){return fetch(`/api/listings/${n.listingid}`,{method:"PUT",headers:{"Content-Type":"application/json",...M.headers(t)},body:JSON.stringify(n.listing)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to save profile for ${n.listingid}`)}).then(e=>{if(console.log("JSON for save profile",e),e)return e})}function _n(n,t){return fetch(`/api/listings/${n.listingid}`,{headers:M.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Fetched profile JSON Listing:",e),e})}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=globalThis,_e=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,$e=Symbol(),Ye=new WeakMap;let Hs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==$e)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(_e&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ye.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ye.set(e,t))}return t}toString(){return this.cssText}};const $n=n=>new Hs(typeof n=="string"?n:n+"",void 0,$e),$t=(n,...t)=>{const e=n.length===1?n[0]:t.reduce((s,i,r)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+n[r+1],n[0]);return new Hs(e,n,$e)},bn=(n,t)=>{if(_e)n.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=kt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,n.appendChild(s)}},Je=_e?n=>n:n=>n instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return $n(e)})(n):n;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:wn,defineProperty:An,getOwnPropertyDescriptor:En,getOwnPropertyNames:xn,getOwnPropertySymbols:Sn,getPrototypeOf:Pn}=Object,k=globalThis,Ke=k.trustedTypes,kn=Ke?Ke.emptyScript:"",Xt=k.reactiveElementPolyfillSupport,ut=(n,t)=>n,Ut={toAttribute(n,t){switch(t){case Boolean:n=n?kn:null;break;case Object:case Array:n=n==null?n:JSON.stringify(n)}return n},fromAttribute(n,t){let e=n;switch(t){case Boolean:e=n!==null;break;case Number:e=n===null?null:Number(n);break;case Object:case Array:try{e=JSON.parse(n)}catch{e=null}}return e}},be=(n,t)=>!wn(n,t),Ge={attribute:!0,type:String,converter:Ut,reflect:!1,hasChanged:be};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),k.litPropertyMetadata??(k.litPropertyMetadata=new WeakMap);class Y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ge){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&An(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:r}=En(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);r.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ge}static _$Ei(){if(this.hasOwnProperty(ut("elementProperties")))return;const t=Pn(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ut("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ut("properties"))){const e=this.properties,s=[...xn(e),...Sn(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Je(i))}else t!==void 0&&e.push(Je(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return bn(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var r;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((r=s.converter)==null?void 0:r.toAttribute)!==void 0?s.converter:Ut).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var r;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((r=o.converter)==null?void 0:r.fromAttribute)!==void 0?o.converter:Ut;this._$Em=i,this[i]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??be)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[r,o]of this._$Ep)this[r]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,o]of i)o.wrapped!==!0||this._$AL.has(r)||this[r]===void 0||this.P(r,this[r],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var r;return(r=i.hostUpdate)==null?void 0:r.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[ut("elementProperties")]=new Map,Y[ut("finalized")]=new Map,Xt==null||Xt({ReactiveElement:Y}),(k.reactiveElementVersions??(k.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dt=globalThis,Lt=dt.trustedTypes,Ze=Lt?Lt.createPolicy("lit-html",{createHTML:n=>n}):void 0,js="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,Ds="?"+P,On=`<${Ds}>`,j=document,gt=()=>j.createComment(""),mt=n=>n===null||typeof n!="object"&&typeof n!="function",we=Array.isArray,Cn=n=>we(n)||typeof(n==null?void 0:n[Symbol.iterator])=="function",te=`[ 	
\f\r]`,lt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Qe=/-->/g,Xe=/>/g,N=RegExp(`>|${te}(?:([^\\s"'>=/]+)(${te}*=${te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ts=/'/g,es=/"/g,Fs=/^(?:script|style|textarea|title)$/i,Tn=n=>(t,...e)=>({_$litType$:n,strings:t,values:e}),w=Tn(1),tt=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),ss=new WeakMap,L=j.createTreeWalker(j,129);function Vs(n,t){if(!we(n)||!n.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ze!==void 0?Ze.createHTML(t):t}const Rn=(n,t)=>{const e=n.length-1,s=[];let i,r=t===2?"<svg>":t===3?"<math>":"",o=lt;for(let l=0;l<e;l++){const a=n[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===lt?f[1]==="!--"?o=Qe:f[1]!==void 0?o=Xe:f[2]!==void 0?(Fs.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=N):f[3]!==void 0&&(o=N):o===N?f[0]===">"?(o=i??lt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?N:f[3]==='"'?es:ts):o===es||o===ts?o=N:o===Qe||o===Xe?o=lt:(o=N,i=void 0);const h=o===N&&n[l+1].startsWith("/>")?" ":"";r+=o===lt?a+On:u>=0?(s.push(d),a.slice(0,u)+js+a.slice(u)+P+h):a+P+(u===-2?l:h)}return[Vs(n,r+(n[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class yt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let r=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Rn(t,e);if(this.el=yt.createElement(d,s),L.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=L.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(js)){const c=f[o++],h=i.getAttribute(u).split(P),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:r,name:p[2],strings:h,ctor:p[1]==="."?Un:p[1]==="?"?Ln:p[1]==="@"?zn:Bt}),i.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:r}),i.removeAttribute(u));if(Fs.test(i.tagName)){const u=i.textContent.split(P),c=u.length-1;if(c>0){i.textContent=Lt?Lt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],gt()),L.nextNode(),a.push({type:2,index:++r});i.append(u[c],gt())}}}else if(i.nodeType===8)if(i.data===Ds)a.push({type:2,index:r});else{let u=-1;for(;(u=i.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:r}),u+=P.length-1}r++}}static createElement(t,e){const s=j.createElement("template");return s.innerHTML=t,s}}function et(n,t,e=n,s){var o,l;if(t===tt)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const r=mt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==r&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),r===void 0?i=void 0:(i=new r(n),i._$AT(n,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=et(n,i._$AS(n,t.values),i,s)),t}class Nn{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??j).importNode(e,!0);L.currentNode=i;let r=L.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new bt(r,r.nextSibling,this,t):a.type===1?d=new a.ctor(r,a.name,a.strings,this,t):a.type===6&&(d=new Mn(r,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(r=L.nextNode(),o++)}return L.currentNode=j,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class bt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=et(this,t,e),mt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==tt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Cn(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&mt(this._$AH)?this._$AA.nextSibling.data=t:this.T(j.createTextNode(t)),this._$AH=t}$(t){var r;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=yt.createElement(Vs(s.h,s.h[0]),this.options)),s);if(((r=this._$AH)==null?void 0:r._$AD)===i)this._$AH.p(e);else{const o=new Nn(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=ss.get(t.strings);return e===void 0&&ss.set(t.strings,e=new yt(t)),e}k(t){we(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const r of t)i===e.length?e.push(s=new bt(this.O(gt()),this.O(gt()),this,this.options)):s=e[i],s._$AI(r),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Bt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,r){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const r=this.strings;let o=!1;if(r===void 0)t=et(this,t,e,0),o=!mt(t)||t!==this._$AH&&t!==tt,o&&(this._$AH=t);else{const l=t;let a,d;for(t=r[0],a=0;a<r.length-1;a++)d=et(this,l[s+a],e,a),d===tt&&(d=this._$AH[a]),o||(o=!mt(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+r[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Un extends Bt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Ln extends Bt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class zn extends Bt{constructor(t,e,s,i,r){super(t,e,s,i,r),this.type=5}_$AI(t,e=this){if((t=et(this,t,e,0)??$)===tt)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,r=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Mn{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){et(this,t)}}const ee=dt.litHtmlPolyfillSupport;ee==null||ee(yt,bt),(dt.litHtmlVersions??(dt.litHtmlVersions=[])).push("3.2.1");const In=(n,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const r=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new bt(t.insertBefore(gt(),r),r,void 0,e??{})}return i._$AI(n),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let O=class extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=In(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return tt}};var is;O._$litElement$=!0,O.finalized=!0,(is=globalThis.litElementHydrateSupport)==null||is.call(globalThis,{LitElement:O});const se=globalThis.litElementPolyfillSupport;se==null||se({LitElement:O});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Hn={attribute:!0,type:String,converter:Ut,reflect:!1,hasChanged:be},jn=(n=Hn,t,e)=>{const{kind:s,metadata:i}=e;let r=globalThis.litPropertyMetadata.get(i);if(r===void 0&&globalThis.litPropertyMetadata.set(i,r=new Map),r.set(e.name,n),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,n)},init(l){return l!==void 0&&this.P(o,void 0,n),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,n)}}throw Error("Unsupported decorator location: "+s)};function wt(n){return(t,e)=>typeof e=="object"?jn(n,t,e):((s,i,r)=>{const o=i.hasOwnProperty(r);return i.constructor.createProperty(r,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,r):void 0})(n,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function At(n){return wt({...n,state:!0,attribute:!1})}const Dn=Dt`
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
`,Et={styles:Dn};var Fn=Object.defineProperty,Vn=(n,t,e,s)=>{for(var i=void 0,r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=o(t,e,i)||i);return i&&Fn(t,e,i),i};function Bn(n){const e=n.target.checked;us.relay(n,"dark-mode",{checked:e})}function qn(n){us.relay(n,"auth:message",["auth/signout"])}const Mt=class Mt extends O{constructor(){super(...arguments),this.userid="user",this._authObserver=new I(this,"blazing:auth")}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{console.log("user",t),t&&(t.username==="anonymous"?(console.log("User is anonymous. Redirecting to /login."),window.location.href="/login"):t.username!==this.userid&&(console.log("Updating userid from",this.userid,"to",t.username),this.userid=t.username))})}static initializeOnce(){function t(e,s){e.classList.toggle("dark-mode",s)}document.body.addEventListener("dark-mode",e=>{var s;return t(e.currentTarget,(s=e.detail)==null?void 0:s.checked)})}render(){return w`
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
                        <a id="signout" @click=${qn}>Sign Out</a>
                      </li>
                    `:w`
                      <li class="when-signed-out">
                        <a href="/login">Sign In</a>
                      </li>
                    `}
                <label @change=${Bn}>
                  <input type="checkbox" />
                  Dark Mode
                </label>
              </div>
            </div>
          </section>
        </main>
      </header>
    `}};Mt.uses=nt({"drop-down":cn.Element}),Mt.styles=[Et.styles,$t`
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
    `];let st=Mt;Vn([At()],st.prototype,"userid");const Wn=Dt`
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
`,Bs={styles:Wn},Ee=class Ee extends O{render(){return w`
      <figure>
        <slot name="image"></slot>
        <figcaption>
          <slot name="listingName"><a href="#">Default Listing Name</a></slot>
          <slot name="price"><p>Price: $280</p></slot>
        </figcaption>
      </figure>
    `}};Ee.styles=[Et.styles,$t`
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
    `];let le=Ee;var Yn=Object.defineProperty,Jn=(n,t,e,s)=>{for(var i=void 0,r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=o(t,e,i)||i);return i&&Yn(t,e,i),i};const It=class It extends O{constructor(){super(...arguments),this.src="/api/listings",this.listingIndex=new Array,this._authObserver=new I(this,"blazing:auth"),this._user=new M.User}connectedCallback(){super.connectedCallback(),console.log("UnimarketListings connected"),this._authObserver.observe(({user:t})=>{console.log("Auth observer fired:",t),t&&(this._user=t),this.hydrate(this.src)})}hydrate(t){console.log("Fetching listings from:",t),fetch(t,{headers:M.headers(this._user)}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to render data ${t}:`,e)).then(e=>{e&&(console.log("Listings:",e),this.listingIndex=e)}).catch(e=>console.log("Failed to convert listing data:",e))}render(){const t=this.listingIndex.map(this.renderListing);return w` <section class="listings">${t}</section> `}renderListing(t){const{_id:e,name:s,price:i,featuredImage:r}=t;return w`
      <listing-header>
        <img slot="image" src="/assets/${r}" alt="${s}" />
        <span slot="listingName">
          <a href="/app/listing/${e}">${s}</a>
        </span>
        <span slot="price">Price: $${i}</span>
      </listing-header>
    `}};It.uses=nt({"listing-header":le}),It.styles=[Et.styles,Bs.styles,$t`
      .listings {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
        gap: var(--size-type-small);
        margin: 0.5rem;
      }
    `];let zt=It;Jn([At()],zt.prototype,"listingIndex");var Kn=Object.defineProperty,Gn=Object.getOwnPropertyDescriptor,qt=(n,t,e,s)=>{for(var i=s>1?void 0:s?Gn(t,e):t,r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Kn(t,e,i),i};const Ht=class Ht extends ve{constructor(){super("blazing:model"),this.listingid="",this.mode="view"}get listing(){return this.model.listing}get user(){return this.model.user}_handleSubmit(t){this.dispatchMessage(["listing/save",{listingid:this.listingid,listing:t.detail,onSuccess:()=>{this.mode="view"},onFailure:e=>console.log("ERROR:",e)}])}updated(t){var e,s;if(super.updated(t),(e=this.listing)!=null&&e.seller&&(!this.user||((s=this.user._id)==null?void 0:s.toString())!==this.listing.seller.toString())){const i=this.listing.seller.toString();console.log("Dispatching profile/select for seller",i),this.dispatchMessage(["profile/select",{userid:i}])}}attributeChangedCallback(t,e,s){console.log(`Attribute changed: ${t}, Old: ${e}, New: ${s}`),super.attributeChangedCallback(t,e,s),t==="listingid"&&e!==s&&s&&this.dispatchMessage(["listing/select",{listingid:s}])}render(){const{name:t,description:e,price:s,pickUpLocation:i,listedDate:r,condition:o,featuredImage:l}=this.listing||{};return w`
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
                <dd>
                  ${r?new Date(r).toLocaleDateString("en-US"):""}
                </dd>
                <dt>Condition</dt>
                <dd>${o}</dd>
                <dt>Pick Up Location</dt>
                <dd>${i}</dd>
                <dt>Seller Information</dt>
                <dd>
                  ${this.user?w`<a href="../user/${this.user._id}">
                        ${this.user.name}
                      </a>`:w`<span>Loading seller information...</span>`}
                </dd>
              </dl>
            </div>
          </section>
          <button @click=${()=>this.mode="edit"}>Edit</button>
        </section>
      </section>
      <mu-form
        class="edit"
        .init=${this.listing}
        @mu-form:submit=${this._handleSubmit}
      >
        <main class="center-container">
          <section class="formContent">
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
          </section>
        </main>
      </mu-form>
    `}};Ht.uses=nt({"mu-form":ds.Element}),Ht.styles=[Et.styles,Bs.styles,$t`
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

      .center-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .formContent {
        display: flex;
        flex-direction: column;
        background-color: var(--color-eggplant);
        padding: var(--content-size-xlarge);
        gap: 5px;
        width: 80%;
        max-width: 600px;
        margin-bottom: var(--content-size-medium);
      }

      button {
        background-color: var(--color-eggplant);
        border-radius: 8px;
        border-style: none;
        box-sizing: border-box;
        color: #ffffff;
        cursor: pointer;
        display: inline-block;
        font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial,
          sans-serif;
        font-size: 14px;
        font-weight: 500;
        height: 40px;
        line-height: 20px;
        list-style: none;
        margin: 0;
        outline: none;
        padding: 10px 16px;
        position: relative;
        text-align: center;
        text-decoration: none;
        transition: color 100ms;
        vertical-align: baseline;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        margin-top: 10px;
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
    `];let D=Ht;qt([wt({attribute:"listingid"})],D.prototype,"listingid",2);qt([wt({reflect:!0})],D.prototype,"mode",2);qt([At()],D.prototype,"listing",1);qt([At()],D.prototype,"user",1);var Zn=Object.defineProperty,Qn=Object.getOwnPropertyDescriptor,Ae=(n,t,e,s)=>{for(var i=s>1?void 0:s?Qn(t,e):t,r=n.length-1,o;r>=0;r--)(o=n[r])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Zn(t,e,i),i};const jt=class jt extends ve{constructor(){super("blazing:model"),this.userid="",this.mode="view"}get user(){return this.model.user}attributeChangedCallback(t,e,s){console.log(`Attribute changed: ${t}, Old: ${e}, New: ${s}`),super.attributeChangedCallback(t,e,s),t==="userid"&&e!==s&&s&&this.dispatchMessage(["profile/select",{userid:s}])}_handleSubmit(t){this.dispatchMessage(["profile/save",{userid:this.userid,user:t.detail,onSuccess:()=>{this.mode="view"},onFailure:e=>console.log("ERROR:",e)}])}render(){const{name:t,contactInfo:e,profilePic:s}=this.user||{};return console.log("this.user",this.user),w`
      <section class="view">
        <main class="center-container">
          <section class="userProfile">
            <div class="userPhoto-container">
              <img src="/assets/${s}" alt=${t} />
            </div>
            <h2>${t}</h2>
            <section class="userDescription">
              <dl>
                <dt>Contact Information</dt>
                <dd>${e}</dd>
              </dl>
              <button
                class="edit"
                id="edit"
                @click=${()=>this.mode="edit"}
              >
                Edit
              </button>
            </section>
          </section>
        </main>
      </section>
      <mu-form
        class="edit"
        .init=${this.user}
        @mu-form:submit=${this._handleSubmit}
      >
        <main class="center-container">
          <section class="formContent">
            <label>
              <span>User Name</span>
              <input name="name" />
            </label>
            <label>
              <span>Contact Information</span>
              <input name="contactInfo" />
            </label>
          </section>
        </main>
      </mu-form>
    `}};jt.uses=nt({"mu-form":ds.Element}),jt.styles=[Et.styles,$t`
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

      .userPhoto-container img {
        width: 15rem;
        height: 15rem;
      }

      .userDescription {
        display: flex;
        align-items: center;
        flex-direction: column;
      }

      .center-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      .formContent {
        display: flex;
        flex-direction: column;
        background-color: var(--color-eggplant);
        padding: var(--content-size-xlarge);
        gap: 5px;
        width: 80%;
        max-width: 600px;
        margin-bottom: var(--content-size-medium);
      }

      button {
        background-color: var(--color-sage);
        border-radius: 8px;
        border-style: none;
        box-sizing: border-box;
        color: #ffffff;
        cursor: pointer;
        display: inline-block;
        font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial,
          sans-serif;
        font-size: 14px;
        font-weight: 500;
        height: 40px;
        line-height: 20px;
        list-style: none;
        margin: 0;
        outline: none;
        padding: 10px 16px;
        position: relative;
        text-align: center;
        text-decoration: none;
        transition: color 100ms;
        vertical-align: baseline;
        user-select: none;
        -webkit-user-select: none;
        touch-action: manipulation;
        margin-top: 10px;
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
    `];let it=jt;Ae([wt({attribute:"userid"})],it.prototype,"userid",2);Ae([wt({reflect:!0})],it.prototype,"mode",2);Ae([At()],it.prototype,"user",1);const xe=class xe extends O{render(){return w` <home-view></home-view> `}connectedCallback(){super.connectedCallback(),st.initializeOnce()}};xe.uses=nt({"home-view":zt});let ce=xe;const Xn=[{path:"/app/listing/:listingId",view:n=>w`
      <uni-listing listingid=${n.listingId}></uni-listing>
    `},{path:"/app/user/:userId",view:n=>w`
      <user-profile userid=${n.userId}></user-profile>
    `},{path:"/app",view:()=>w` <home-view></home-view> `},{path:"/",redirect:"/app"}];nt({"mu-auth":M.Provider,"mu-history":fi.Provider,"mu-switch":class extends an.Element{constructor(){super(Xn,"blazing:history","blazing:auth")}},"mu-store":class extends yi.Provider{constructor(){super(gn,fn,"blazing:auth")}},"uni-market-app":ce,"uni-market-nav":st,"user-profile":it,"uni-listing":D});st.initializeOnce();
