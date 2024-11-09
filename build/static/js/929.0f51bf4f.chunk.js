"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[929],{29854:(e,t,n)=>{n.d(t,{A:()=>c,U:()=>i});var o=n(65043),r=n(28678),a=n(58732),s=n(35296);function i(e){return t=>o.createElement(a.Ay,{theme:{token:{motion:!1,zIndexPopupBase:0}}},o.createElement(e,Object.assign({},t)))}const c=(e,t,n,a)=>i((i=>{const{prefixCls:c,style:l}=i,d=o.useRef(null),[u,p]=o.useState(0),[g,m]=o.useState(0),[f,h]=(0,r.A)(!1,{value:i.open}),{getPrefixCls:v}=o.useContext(s.QO),b=v(t||"select",c);o.useEffect((()=>{if(h(!0),"undefined"!==typeof ResizeObserver){const e=new ResizeObserver((e=>{const t=e[0].target;p(t.offsetHeight+8),m(t.offsetWidth)})),t=setInterval((()=>{var o;const r=n?`.${n(b)}`:`.${b}-dropdown`,a=null===(o=d.current)||void 0===o?void 0:o.querySelector(r);a&&(clearInterval(t),e.observe(a))}),10);return()=>{clearInterval(t),e.disconnect()}}}),[]);let y=Object.assign(Object.assign({},i),{style:Object.assign(Object.assign({},l),{margin:0}),open:f,visible:f,getPopupContainer:()=>d.current});a&&(y=a(y));const O={paddingBottom:u,position:"relative",minWidth:g};return o.createElement("div",{ref:d,style:O},o.createElement(e,Object.assign({},y)))}))},58732:(e,t,n)=>{n.d(t,{Ay:()=>Q,cr:()=>K});var o=n(65043),r=n.t(o,2),a=n(7896),s=n(20794),i=n(13709),c=n(56793),l=n(59478),d=n(53130),u=n(58458),p=n(45012);const g=e=>{const{locale:t={},children:n,_ANT_MARK__:r}=e;o.useEffect((()=>(0,u.L)(null===t||void 0===t?void 0:t.Modal)),[t]);const a=o.useMemo((()=>Object.assign(Object.assign({},t),{exist:!0})),[t]);return o.createElement(p.A.Provider,{value:a},n)};var m=n(76970),f=n(19158),h=n(64580),v=n(35296),b=n(8500),y=n(50097),O=n(52931),C=n(80930);const j=`-ant-${Date.now()}-${Math.random()}`;function x(e,t){const n=function(e,t){const n={},o=(e,t)=>{let n=e.clone();return n=(null===t||void 0===t?void 0:t(n))||n,n.toRgbString()},r=(e,t)=>{const r=new y.q(e),a=(0,b.cM)(r.toRgbString());n[`${t}-color`]=o(r),n[`${t}-color-disabled`]=a[1],n[`${t}-color-hover`]=a[4],n[`${t}-color-active`]=a[6],n[`${t}-color-outline`]=r.clone().setAlpha(.2).toRgbString(),n[`${t}-color-deprecated-bg`]=a[0],n[`${t}-color-deprecated-border`]=a[2]};if(t.primaryColor){r(t.primaryColor,"primary");const e=new y.q(t.primaryColor),a=(0,b.cM)(e.toRgbString());a.forEach(((e,t)=>{n[`primary-${t+1}`]=e})),n["primary-color-deprecated-l-35"]=o(e,(e=>e.lighten(35))),n["primary-color-deprecated-l-20"]=o(e,(e=>e.lighten(20))),n["primary-color-deprecated-t-20"]=o(e,(e=>e.tint(20))),n["primary-color-deprecated-t-50"]=o(e,(e=>e.tint(50))),n["primary-color-deprecated-f-12"]=o(e,(e=>e.setAlpha(.12*e.getAlpha())));const s=new y.q(a[0]);n["primary-color-active-deprecated-f-30"]=o(s,(e=>e.setAlpha(.3*e.getAlpha()))),n["primary-color-active-deprecated-d-02"]=o(s,(e=>e.darken(2)))}return t.successColor&&r(t.successColor,"success"),t.warningColor&&r(t.warningColor,"warning"),t.errorColor&&r(t.errorColor,"error"),t.infoColor&&r(t.infoColor,"info"),`\n  :root {\n    ${Object.keys(n).map((t=>`--${e}-${t}: ${n[t]};`)).join("\n")}\n  }\n  `.trim()}(e,t);(0,O.A)()&&(0,C.BD)(n,`${j}-dynamic-theme`)}var k=n(78440),P=n(87063);const A=function(){return{componentDisabled:(0,o.useContext)(k.A),componentSize:(0,o.useContext)(P.A)}};var E=n(2231);const w=Object.assign({},r),{useId:M}=w,S="undefined"===typeof M?()=>"":M;var $=n(50541),D=n(691);function V(e){const{children:t}=e,[,n]=(0,D.Ay)(),{motion:r}=n,a=o.useRef(!1);return a.current=a.current||!1===r,a.current?o.createElement($.Kq,{motion:r},t):t}const T=()=>null;var I=n(10439),R=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)t.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(n[o[r]]=e[o[r]])}return n};const L=["getTargetContainer","getPopupContainer","renderEmpty","input","pagination","form","select","button"];let z,W,B,_;function q(){return z||v.yH}function F(){return W||v.pM}const K=()=>({getPrefixCls:(e,t)=>t||(e?`${q()}-${e}`:q()),getIconPrefixCls:F,getRootPrefixCls:()=>z||q(),getTheme:()=>B,holderRender:_}),N=e=>{const{children:t,csp:n,autoInsertSpaceInButton:r,alert:u,anchor:p,form:b,locale:y,componentSize:O,direction:C,space:j,splitter:x,virtual:A,dropdownMatchSelectWidth:w,popupMatchSelectWidth:M,popupOverflow:$,legacyLocale:D,parentContext:z,iconPrefixCls:W,theme:B,componentDisabled:_,segmented:q,statistic:F,spin:K,calendar:N,carousel:G,cascader:Q,collapse:U,typography:H,checkbox:J,descriptions:X,divider:Y,drawer:Z,skeleton:ee,steps:te,image:ne,layout:oe,list:re,mentions:ae,modal:se,progress:ie,result:ce,slider:le,breadcrumb:de,menu:ue,pagination:pe,input:ge,textArea:me,empty:fe,badge:he,radio:ve,rate:be,switch:ye,transfer:Oe,avatar:Ce,message:je,tag:xe,table:ke,card:Pe,tabs:Ae,timeline:Ee,timePicker:we,upload:Me,notification:Se,tree:$e,colorPicker:De,datePicker:Ve,rangePicker:Te,flex:Ie,wave:Re,dropdown:Le,warning:ze,tour:We,floatButtonGroup:Be,variant:_e,inputNumber:qe,treeSelect:Fe}=e,Ke=o.useCallback(((t,n)=>{const{prefixCls:o}=e;if(n)return n;const r=o||z.getPrefixCls("");return t?`${r}-${t}`:r}),[z.getPrefixCls,e.prefixCls]),Ne=W||z.iconPrefixCls||v.pM,Ge=n||z.csp;(0,I.A)(Ne,Ge);const Qe=function(e,t,n){var o;(0,l.rJ)("ConfigProvider");const r=e||{},a=!1!==r.inherit&&t?t:Object.assign(Object.assign({},f.sb),{hashed:null!==(o=null===t||void 0===t?void 0:t.hashed)&&void 0!==o?o:f.sb.hashed,cssVar:null===t||void 0===t?void 0:t.cssVar}),s=S();return(0,i.A)((()=>{var o,i;if(!e)return t;const c=Object.assign({},a.components);Object.keys(e.components||{}).forEach((t=>{c[t]=Object.assign(Object.assign({},c[t]),e.components[t])}));const l=`css-var-${s.replace(/:/g,"")}`,d=(null!==(o=r.cssVar)&&void 0!==o?o:a.cssVar)&&Object.assign(Object.assign(Object.assign({prefix:null===n||void 0===n?void 0:n.prefixCls},"object"===typeof a.cssVar?a.cssVar:{}),"object"===typeof r.cssVar?r.cssVar:{}),{key:"object"===typeof r.cssVar&&(null===(i=r.cssVar)||void 0===i?void 0:i.key)||l});return Object.assign(Object.assign(Object.assign({},a),r),{token:Object.assign(Object.assign({},a.token),r.token),components:c,cssVar:d})}),[r,a],((e,t)=>e.some(((e,n)=>{const o=t[n];return!(0,E.A)(e,o,!0)}))))}(B,z.theme,{prefixCls:Ke("")});const Ue={csp:Ge,autoInsertSpaceInButton:r,alert:u,anchor:p,locale:y||D,direction:C,space:j,splitter:x,virtual:A,popupMatchSelectWidth:null!==M&&void 0!==M?M:w,popupOverflow:$,getPrefixCls:Ke,iconPrefixCls:Ne,theme:Qe,segmented:q,statistic:F,spin:K,calendar:N,carousel:G,cascader:Q,collapse:U,typography:H,checkbox:J,descriptions:X,divider:Y,drawer:Z,skeleton:ee,steps:te,image:ne,input:ge,textArea:me,layout:oe,list:re,mentions:ae,modal:se,progress:ie,result:ce,slider:le,breadcrumb:de,menu:ue,pagination:pe,empty:fe,badge:he,radio:ve,rate:be,switch:ye,transfer:Oe,avatar:Ce,message:je,tag:xe,table:ke,card:Pe,tabs:Ae,timeline:Ee,timePicker:we,upload:Me,notification:Se,tree:$e,colorPicker:De,datePicker:Ve,rangePicker:Te,flex:Ie,wave:Re,dropdown:Le,warning:ze,tour:We,floatButtonGroup:Be,variant:_e,inputNumber:qe,treeSelect:Fe};const He=Object.assign({},z);Object.keys(Ue).forEach((e=>{void 0!==Ue[e]&&(He[e]=Ue[e])})),L.forEach((t=>{const n=e[t];n&&(He[t]=n)})),"undefined"!==typeof r&&(He.button=Object.assign({autoInsertSpace:r},He.button));const Je=(0,i.A)((()=>He),He,((e,t)=>{const n=Object.keys(e),o=Object.keys(t);return n.length!==o.length||n.some((n=>e[n]!==t[n]))})),Xe=o.useMemo((()=>({prefixCls:Ne,csp:Ge})),[Ne,Ge]);let Ye=o.createElement(o.Fragment,null,o.createElement(T,{dropdownMatchSelectWidth:w}),t);const Ze=o.useMemo((()=>{var e,t,n,o;return(0,c.h)((null===(e=m.A.Form)||void 0===e?void 0:e.defaultValidateMessages)||{},(null===(n=null===(t=Je.locale)||void 0===t?void 0:t.Form)||void 0===n?void 0:n.defaultValidateMessages)||{},(null===(o=Je.form)||void 0===o?void 0:o.validateMessages)||{},(null===b||void 0===b?void 0:b.validateMessages)||{})}),[Je,null===b||void 0===b?void 0:b.validateMessages]);Object.keys(Ze).length>0&&(Ye=o.createElement(d.A.Provider,{value:Ze},Ye)),y&&(Ye=o.createElement(g,{locale:y,_ANT_MARK__:"internalMark"},Ye)),(Ne||Ge)&&(Ye=o.createElement(s.A.Provider,{value:Xe},Ye)),O&&(Ye=o.createElement(P.c,{size:O},Ye)),Ye=o.createElement(V,null,Ye);const et=o.useMemo((()=>{const e=Qe||{},{algorithm:t,token:n,components:o,cssVar:r}=e,s=R(e,["algorithm","token","components","cssVar"]),i=t&&(!Array.isArray(t)||t.length>0)?(0,a.an)(t):f.zQ,c={};Object.entries(o||{}).forEach((e=>{let[t,n]=e;const o=Object.assign({},n);"algorithm"in o&&(!0===o.algorithm?o.theme=i:(Array.isArray(o.algorithm)||"function"===typeof o.algorithm)&&(o.theme=(0,a.an)(o.algorithm)),delete o.algorithm),c[t]=o}));const l=Object.assign(Object.assign({},h.A),n);return Object.assign(Object.assign({},s),{theme:i,token:l,components:c,override:Object.assign({override:l},c),cssVar:r})}),[Qe]);return B&&(Ye=o.createElement(f.vG.Provider,{value:et},Ye)),Je.warning&&(Ye=o.createElement(l._n.Provider,{value:Je.warning},Ye)),void 0!==_&&(Ye=o.createElement(k.X,{disabled:_},Ye)),o.createElement(v.QO.Provider,{value:Je},Ye)},G=e=>{const t=o.useContext(v.QO),n=o.useContext(p.A);return o.createElement(N,Object.assign({parentContext:t,legacyLocale:n},e))};G.ConfigContext=v.QO,G.SizeContext=P.A,G.config=e=>{const{prefixCls:t,iconPrefixCls:n,theme:o,holderRender:r}=e;void 0!==t&&(z=t),void 0!==n&&(W=n),"holderRender"in e&&(_=r),o&&(!function(e){return Object.keys(e).some((e=>e.endsWith("Color")))}(o)?B=o:x(q(),o))},G.useConfig=A,Object.defineProperty(G,"SizeContext",{get:()=>P.A});const Q=G},53130:(e,t,n)=>{n.d(t,{A:()=>o});const o=(0,n(65043).createContext)(void 0)},58458:(e,t,n)=>{n.d(t,{L:()=>i,l:()=>c});var o=n(76970);let r=Object.assign({},o.A.Modal),a=[];const s=()=>a.reduce(((e,t)=>Object.assign(Object.assign({},e),t)),o.A.Modal);function i(e){if(e){const t=Object.assign({},e);return a.push(t),r=s(),()=>{a=a.filter((e=>e!==t)),r=s()}}r=Object.assign({},o.A.Modal)}function c(){return r}},48060:(e,t,n)=>{n.d(t,{A:()=>c});var o=n(89379),r="".concat("accept acceptCharset accessKey action allowFullScreen allowTransparency\n    alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing challenge\n    charSet checked classID className colSpan cols content contentEditable contextMenu\n    controls coords crossOrigin data dateTime default defer dir disabled download draggable\n    encType form formAction formEncType formMethod formNoValidate formTarget frameBorder\n    headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity\n    is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media\n    mediaGroup method min minLength multiple muted name noValidate nonce open\n    optimum pattern placeholder poster preload radioGroup readOnly rel required\n    reversed role rowSpan rows sandbox scope scoped scrolling seamless selected\n    shape size sizes span spellCheck src srcDoc srcLang srcSet start step style\n    summary tabIndex target title type useMap value width wmode wrap"," ").concat("onCopy onCut onPaste onCompositionEnd onCompositionStart onCompositionUpdate onKeyDown\n    onKeyPress onKeyUp onFocus onBlur onChange onInput onSubmit onClick onContextMenu onDoubleClick\n    onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop onMouseDown\n    onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp onSelect onTouchCancel\n    onTouchEnd onTouchMove onTouchStart onScroll onWheel onAbort onCanPlay onCanPlayThrough\n    onDurationChange onEmptied onEncrypted onEnded onError onLoadedData onLoadedMetadata\n    onLoadStart onPause onPlay onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend onTimeUpdate onVolumeChange onWaiting onLoad onError").split(/[\s\n]+/),a="aria-",s="data-";function i(e,t){return 0===e.indexOf(t)}function c(e){var t,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];t=!1===n?{aria:!0,data:!0,attr:!0}:!0===n?{aria:!0}:(0,o.A)({},n);var c={};return Object.keys(e).forEach((function(n){(t.aria&&("role"===n||i(n,a))||t.data&&i(n,s)||t.attr&&r.includes(n))&&(c[n]=e[n])})),c}}}]);
//# sourceMappingURL=929.0f51bf4f.chunk.js.map