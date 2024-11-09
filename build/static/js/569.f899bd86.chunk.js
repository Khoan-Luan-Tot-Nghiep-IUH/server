"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[569],{16569:(e,n,t)=>{t.d(n,{Ay:()=>K});var o=t(60436),r=t(65043),s=t(58895),a=t(72339),i=t(35296),l=t(58732),c=t(12499),u=t(78528),p=t(51376),d=t(13888),m=t(40164),g=t(98139),f=t.n(g),y=t(44082),v=t(78887),b=t(7896),x=t(64980),C=t(94414),O=t(78855),h=t(78446);const $=e=>{const{componentCls:n,iconCls:t,boxShadow:o,colorText:r,colorSuccess:s,colorError:a,colorWarning:i,colorInfo:l,fontSizeLG:c,motionEaseInOutCirc:u,motionDurationSlow:p,marginXS:d,paddingXS:m,borderRadiusLG:g,zIndexPopup:f,contentPadding:y,contentBg:v}=e,x=`${n}-notice`,O=new b.Mo("MessageMoveIn",{"0%":{padding:0,transform:"translateY(-100%)",opacity:0},"100%":{padding:m,transform:"translateY(0)",opacity:1}}),h=new b.Mo("MessageMoveOut",{"0%":{maxHeight:e.height,padding:m,opacity:1},"100%":{maxHeight:0,padding:0,opacity:0}}),$={padding:m,textAlign:"center",[`${n}-custom-content`]:{display:"flex",alignItems:"center"},[`${n}-custom-content > ${t}`]:{marginInlineEnd:d,fontSize:c},[`${x}-content`]:{display:"inline-block",padding:y,background:v,borderRadius:g,boxShadow:o,pointerEvents:"all"},[`${n}-success > ${t}`]:{color:s},[`${n}-error > ${t}`]:{color:a},[`${n}-warning > ${t}`]:{color:i},[`${n}-info > ${t},\n      ${n}-loading > ${t}`]:{color:l}};return[{[n]:Object.assign(Object.assign({},(0,C.dF)(e)),{color:r,position:"fixed",top:d,width:"100%",pointerEvents:"none",zIndex:f,[`${n}-move-up`]:{animationFillMode:"forwards"},[`\n        ${n}-move-up-appear,\n        ${n}-move-up-enter\n      `]:{animationName:O,animationDuration:p,animationPlayState:"paused",animationTimingFunction:u},[`\n        ${n}-move-up-appear${n}-move-up-appear-active,\n        ${n}-move-up-enter${n}-move-up-enter-active\n      `]:{animationPlayState:"running"},[`${n}-move-up-leave`]:{animationName:h,animationDuration:p,animationPlayState:"paused",animationTimingFunction:u},[`${n}-move-up-leave${n}-move-up-leave-active`]:{animationPlayState:"running"},"&-rtl":{direction:"rtl",span:{direction:"rtl"}}})},{[n]:{[`${x}-wrapper`]:Object.assign({},$)}},{[`${n}-notice-pure-panel`]:Object.assign(Object.assign({},$),{padding:0,textAlign:"start"})}]},j=(0,O.OF)("Message",(e=>{const n=(0,h.oX)(e,{height:150});return[$(n)]}),(e=>({zIndexPopup:e.zIndexPopupBase+x.jH+10,contentBg:e.colorBgElevated,contentPadding:`${(e.controlHeightLG-e.fontSize*e.lineHeight)/2}px ${e.paddingSM}px`})));var E=function(e,n){var t={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&n.indexOf(o)<0&&(t[o]=e[o]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)n.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(t[o[r]]=e[o[r]])}return t};const w={info:r.createElement(d.A,null),success:r.createElement(c.A,null),error:r.createElement(u.A,null),warning:r.createElement(p.A,null),loading:r.createElement(m.A,null)},P=e=>{let{prefixCls:n,type:t,icon:o,children:s}=e;return r.createElement("div",{className:f()(`${n}-custom-content`,`${n}-${t}`)},o||w[t],r.createElement("span",null,s))},k=e=>{const{prefixCls:n,className:t,type:o,icon:s,content:a}=e,l=E(e,["prefixCls","className","type","icon","content"]),{getPrefixCls:c}=r.useContext(i.QO),u=n||c("message"),p=(0,v.A)(u),[d,m,g]=j(u,p);return d(r.createElement(y.$T,Object.assign({},l,{prefixCls:u,className:f()(t,m,`${u}-notice-pure-panel`,g,p),eventKey:"pure",duration:null,content:r.createElement(P,{prefixCls:u,type:o,icon:s},a)})))};var N=t(53727),S=t(59478);function A(e){let n;const t=new Promise((t=>{n=e((()=>{t(!0)}))})),o=()=>{null===n||void 0===n||n()};return o.then=(e,n)=>t.then(e,n),o.promise=t,o}var I=function(e,n){var t={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&n.indexOf(o)<0&&(t[o]=e[o]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(e);r<o.length;r++)n.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(e,o[r])&&(t[o[r]]=e[o[r]])}return t};const M=3,F=e=>{let{children:n,prefixCls:t}=e;const o=(0,v.A)(t),[s,a,i]=j(t,o);return s(r.createElement(y.ph,{classNames:{list:f()(a,i,o)}},n))},R=(e,n)=>{let{prefixCls:t,key:o}=n;return r.createElement(F,{prefixCls:t,key:o},e)},z=r.forwardRef(((e,n)=>{const{top:t,prefixCls:o,getContainer:s,maxCount:a,duration:l=M,rtl:c,transitionName:u,onAllRemoved:p}=e,{getPrefixCls:d,getPopupContainer:m,message:g,direction:v}=r.useContext(i.QO),b=o||d("message"),x=r.createElement("span",{className:`${b}-close-x`},r.createElement(N.A,{className:`${b}-close-icon`})),[C,O]=(0,y.hN)({prefixCls:b,style:()=>({left:"50%",transform:"translateX(-50%)",top:null!==t&&void 0!==t?t:8}),className:()=>f()({[`${b}-rtl`]:null!==c&&void 0!==c?c:"rtl"===v}),motion:()=>function(e,n){return{motionName:null!==n&&void 0!==n?n:`${e}-move-up`}}(b,u),closable:!1,closeIcon:x,duration:l,getContainer:()=>(null===s||void 0===s?void 0:s())||(null===m||void 0===m?void 0:m())||document.body,maxCount:a,onAllRemoved:p,renderNotifications:R});return r.useImperativeHandle(n,(()=>Object.assign(Object.assign({},C),{prefixCls:b,message:g}))),O}));let H=0;function B(e){const n=r.useRef(null),t=((0,S.rJ)("Message"),r.useMemo((()=>{const e=e=>{var t;null===(t=n.current)||void 0===t||t.close(e)},t=t=>{if(!n.current){const e=()=>{};return e.then=()=>{},e}const{open:o,prefixCls:s,message:a}=n.current,i=`${s}-notice`,{content:l,icon:c,type:u,key:p,className:d,style:m,onClose:g}=t,y=I(t,["content","icon","type","key","className","style","onClose"]);let v=p;return void 0!==v&&null!==v||(H+=1,v=`antd-message-${H}`),A((n=>(o(Object.assign(Object.assign({},y),{key:v,content:r.createElement(P,{prefixCls:s,type:u,icon:c},l),placement:"top",className:f()(u&&`${i}-${u}`,d,null===a||void 0===a?void 0:a.className),style:Object.assign(Object.assign({},null===a||void 0===a?void 0:a.style),m),onClose:()=>{null===g||void 0===g||g(),n()}})),()=>{e(v)})))},o={open:t,destroy:t=>{var o;void 0!==t?e(t):null===(o=n.current)||void 0===o||o.destroy()}};return["info","success","warning","error","loading"].forEach((e=>{o[e]=(n,o,r)=>{let s,a,i;s=n&&"object"===typeof n&&"content"in n?n:{content:n},"function"===typeof o?i=o:(a=o,i=r);const l=Object.assign(Object.assign({onClose:i,duration:a},s),{type:e});return t(l)}})),o}),[]));return[t,r.createElement(z,Object.assign({key:"message-holder"},e,{ref:n}))]}let D=null,T=e=>e(),X=[],G={};function L(){const{getContainer:e,duration:n,rtl:t,maxCount:o,top:r}=G,s=(null===e||void 0===e?void 0:e())||document.body;return{getContainer:()=>s,duration:n,rtl:t,maxCount:o,top:r}}const Q=r.forwardRef(((e,n)=>{const{messageConfig:t,sync:o}=e,{getPrefixCls:s}=(0,r.useContext)(i.QO),l=G.prefixCls||s("message"),c=(0,r.useContext)(a.B),[u,p]=B(Object.assign(Object.assign(Object.assign({},t),{prefixCls:l}),c.message));return r.useImperativeHandle(n,(()=>{const e=Object.assign({},u);return Object.keys(e).forEach((n=>{e[n]=function(){return o(),u[n].apply(u,arguments)}})),{instance:e,sync:o}})),p})),Y=r.forwardRef(((e,n)=>{const[t,o]=r.useState(L),s=()=>{o(L)};r.useEffect(s,[]);const a=(0,l.cr)(),i=a.getRootPrefixCls(),c=a.getIconPrefixCls(),u=a.getTheme(),p=r.createElement(Q,{ref:n,sync:s,messageConfig:t});return r.createElement(l.Ay,{prefixCls:i,iconPrefixCls:c,theme:u},a.holderRender?a.holderRender(p):p)}));function W(){if(!D){const e=document.createDocumentFragment(),n={fragment:e};return D=n,void T((()=>{(0,s.X)(r.createElement(Y,{ref:e=>{const{instance:t,sync:o}=e||{};Promise.resolve().then((()=>{!n.instance&&t&&(n.instance=t,n.sync=o,W())}))}}),e)}))}D.instance&&(X.forEach((e=>{const{type:n,skipped:t}=e;if(!t)switch(n){case"open":T((()=>{const n=D.instance.open(Object.assign(Object.assign({},G),e.config));null===n||void 0===n||n.then(e.resolve),e.setCloseFn(n)}));break;case"destroy":T((()=>{null===D||void 0===D||D.instance.destroy(e.key)}));break;default:T((()=>{var t;const r=(t=D.instance)[n].apply(t,(0,o.A)(e.args));null===r||void 0===r||r.then(e.resolve),e.setCloseFn(r)}))}})),X=[])}const J={open:function(e){const n=A((n=>{let t;const o={type:"open",config:e,resolve:n,setCloseFn:e=>{t=e}};return X.push(o),()=>{t?T((()=>{t()})):o.skipped=!0}}));return W(),n},destroy:e=>{X.push({type:"destroy",key:e}),W()},config:function(e){G=Object.assign(Object.assign({},G),e),T((()=>{var e;null===(e=null===D||void 0===D?void 0:D.sync)||void 0===e||e.call(D)}))},useMessage:function(e){return B(e)},_InternalPanelDoNotUseOrYouWillBeFired:k};["success","info","warning","error","loading"].forEach((e=>{J[e]=function(){for(var n=arguments.length,t=new Array(n),o=0;o<n;o++)t[o]=arguments[o];return function(e,n){(0,l.cr)();const t=A((t=>{let o;const r={type:e,args:n,resolve:t,setCloseFn:e=>{o=e}};return X.push(r),()=>{o?T((()=>{o()})):r.skipped=!0}}));return W(),t}(e,t)}}));const K=J}}]);
//# sourceMappingURL=569.f899bd86.chunk.js.map