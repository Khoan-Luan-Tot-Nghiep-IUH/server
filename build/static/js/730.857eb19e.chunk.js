"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[730],{80349:(t,e,o)=>{o.d(e,{Ay:()=>it});var n=o(65043),i=o(58895),a=o(72339),r=o(35296),c=o(58732),s=o(12499),l=o(78528),d=o(53727),p=o(51376),f=o(13888),u=o(40164),m=o(98139),g=o.n(m),b=o(44082),h=o(78887),$=o(7896),v=o(64980),y=o(94414),O=o(78446),k=o(78855);const x=t=>{const{componentCls:e,notificationMarginEdge:o,animationMaxHeight:n}=t,i=`${e}-notice`,a=new $.Mo("antNotificationFadeIn",{"0%":{transform:"translate3d(100%, 0, 0)",opacity:0},"100%":{transform:"translate3d(0, 0, 0)",opacity:1}}),r=new $.Mo("antNotificationTopFadeIn",{"0%":{top:-n,opacity:0},"100%":{top:0,opacity:1}}),c=new $.Mo("antNotificationBottomFadeIn",{"0%":{bottom:t.calc(n).mul(-1).equal(),opacity:0},"100%":{bottom:0,opacity:1}}),s=new $.Mo("antNotificationLeftFadeIn",{"0%":{transform:"translate3d(-100%, 0, 0)",opacity:0},"100%":{transform:"translate3d(0, 0, 0)",opacity:1}});return{[e]:{[`&${e}-top, &${e}-bottom`]:{marginInline:0,[i]:{marginInline:"auto auto"}},[`&${e}-top`]:{[`${e}-fade-enter${e}-fade-enter-active, ${e}-fade-appear${e}-fade-appear-active`]:{animationName:r}},[`&${e}-bottom`]:{[`${e}-fade-enter${e}-fade-enter-active, ${e}-fade-appear${e}-fade-appear-active`]:{animationName:c}},[`&${e}-topRight, &${e}-bottomRight`]:{[`${e}-fade-enter${e}-fade-enter-active, ${e}-fade-appear${e}-fade-appear-active`]:{animationName:a}},[`&${e}-topLeft, &${e}-bottomLeft`]:{marginRight:{value:0,_skip_check_:!0},marginLeft:{value:o,_skip_check_:!0},[i]:{marginInlineEnd:"auto",marginInlineStart:0},[`${e}-fade-enter${e}-fade-enter-active, ${e}-fade-appear${e}-fade-appear-active`]:{animationName:s}}}}},C=["top","topLeft","topRight","bottom","bottomLeft","bottomRight"],w={topLeft:"left",topRight:"right",bottomLeft:"left",bottomRight:"right",top:"left",bottom:"left"},j=t=>{const e={};for(let o=1;o<t.notificationStackLayer;o++)e[`&:nth-last-child(${o+1})`]={overflow:"hidden",[`& > ${t.componentCls}-notice`]:{opacity:0,transition:`opacity ${t.motionDurationMid}`}};return Object.assign({[`&:not(:nth-last-child(-n+${t.notificationStackLayer}))`]:{opacity:0,overflow:"hidden",color:"transparent",pointerEvents:"none"}},e)},S=t=>{const e={};for(let o=1;o<t.notificationStackLayer;o++)e[`&:nth-last-child(${o+1})`]={background:t.colorBgBlur,backdropFilter:"blur(10px)","-webkit-backdrop-filter":"blur(10px)"};return Object.assign({},e)},E=t=>{const{componentCls:e}=t;return Object.assign({[`${e}-stack`]:{[`& > ${e}-notice-wrapper`]:Object.assign({transition:`all ${t.motionDurationSlow}, backdrop-filter 0s`,position:"absolute"},j(t))},[`${e}-stack:not(${e}-stack-expanded)`]:{[`& > ${e}-notice-wrapper`]:Object.assign({},S(t))},[`${e}-stack${e}-stack-expanded`]:{[`& > ${e}-notice-wrapper`]:{"&:not(:nth-last-child(-n + 1))":{opacity:1,overflow:"unset",color:"inherit",pointerEvents:"auto",[`& > ${t.componentCls}-notice`]:{opacity:1}},"&:after":{content:'""',position:"absolute",height:t.margin,width:"100%",insetInline:0,bottom:t.calc(t.margin).mul(-1).equal(),background:"transparent",pointerEvents:"auto"}}}},C.map((e=>((t,e)=>{const{componentCls:o}=t;return{[`${o}-${e}`]:{[`&${o}-stack > ${o}-notice-wrapper`]:{[e.startsWith("top")?"top":"bottom"]:0,[w[e]]:{value:0,_skip_check_:!0}}}}})(t,e))).reduce(((t,e)=>Object.assign(Object.assign({},t),e)),{}))},P=t=>{const{iconCls:e,componentCls:o,boxShadow:n,fontSizeLG:i,notificationMarginBottom:a,borderRadiusLG:r,colorSuccess:c,colorInfo:s,colorWarning:l,colorError:d,colorTextHeading:p,notificationBg:f,notificationPadding:u,notificationMarginEdge:m,notificationProgressBg:g,notificationProgressHeight:b,fontSize:h,lineHeight:v,width:O,notificationIconSize:k,colorText:x}=t,C=`${o}-notice`;return{position:"relative",marginBottom:a,marginInlineStart:"auto",background:f,borderRadius:r,boxShadow:n,[C]:{padding:u,width:O,maxWidth:`calc(100vw - ${(0,$.zA)(t.calc(m).mul(2).equal())})`,overflow:"hidden",lineHeight:v,wordWrap:"break-word"},[`${C}-message`]:{marginBottom:t.marginXS,color:p,fontSize:i,lineHeight:t.lineHeightLG},[`${C}-description`]:{fontSize:h,color:x},[`${C}-closable ${C}-message`]:{paddingInlineEnd:t.paddingLG},[`${C}-with-icon ${C}-message`]:{marginBottom:t.marginXS,marginInlineStart:t.calc(t.marginSM).add(k).equal(),fontSize:i},[`${C}-with-icon ${C}-description`]:{marginInlineStart:t.calc(t.marginSM).add(k).equal(),fontSize:h},[`${C}-icon`]:{position:"absolute",fontSize:k,lineHeight:1,[`&-success${e}`]:{color:c},[`&-info${e}`]:{color:s},[`&-warning${e}`]:{color:l},[`&-error${e}`]:{color:d}},[`${C}-close`]:Object.assign({position:"absolute",top:t.notificationPaddingVertical,insetInlineEnd:t.notificationPaddingHorizontal,color:t.colorIcon,outline:"none",width:t.notificationCloseButtonSize,height:t.notificationCloseButtonSize,borderRadius:t.borderRadiusSM,transition:`background-color ${t.motionDurationMid}, color ${t.motionDurationMid}`,display:"flex",alignItems:"center",justifyContent:"center","&:hover":{color:t.colorIconHover,backgroundColor:t.colorBgTextHover},"&:active":{backgroundColor:t.colorBgTextActive}},(0,y.K8)(t)),[`${C}-progress`]:{position:"absolute",display:"block",appearance:"none",WebkitAppearance:"none",inlineSize:`calc(100% - ${(0,$.zA)(r)} * 2)`,left:{_skip_check_:!0,value:r},right:{_skip_check_:!0,value:r},bottom:0,blockSize:b,border:0,"&, &::-webkit-progress-bar":{borderRadius:r,backgroundColor:"rgba(0, 0, 0, 0.04)"},"&::-moz-progress-bar":{background:g},"&::-webkit-progress-value":{borderRadius:r,background:g}},[`${C}-btn`]:{float:"right",marginTop:t.marginSM}}},I=t=>{const{componentCls:e,notificationMarginBottom:o,notificationMarginEdge:n,motionDurationMid:i,motionEaseInOut:a}=t,r=`${e}-notice`,c=new $.Mo("antNotificationFadeOut",{"0%":{maxHeight:t.animationMaxHeight,marginBottom:o},"100%":{maxHeight:0,marginBottom:0,paddingTop:0,paddingBottom:0,opacity:0}});return[{[e]:Object.assign(Object.assign({},(0,y.dF)(t)),{position:"fixed",zIndex:t.zIndexPopup,marginRight:{value:n,_skip_check_:!0},[`${e}-hook-holder`]:{position:"relative"},[`${e}-fade-appear-prepare`]:{opacity:"0 !important"},[`${e}-fade-enter, ${e}-fade-appear`]:{animationDuration:t.motionDurationMid,animationTimingFunction:a,animationFillMode:"both",opacity:0,animationPlayState:"paused"},[`${e}-fade-leave`]:{animationTimingFunction:a,animationFillMode:"both",animationDuration:i,animationPlayState:"paused"},[`${e}-fade-enter${e}-fade-enter-active, ${e}-fade-appear${e}-fade-appear-active`]:{animationPlayState:"running"},[`${e}-fade-leave${e}-fade-leave-active`]:{animationName:c,animationPlayState:"running"},"&-rtl":{direction:"rtl",[`${r}-btn`]:{float:"left"}}})},{[e]:{[`${r}-wrapper`]:Object.assign({},P(t))}}]},N=t=>({zIndexPopup:t.zIndexPopupBase+v.jH+50,width:384}),M=t=>{const e=t.paddingMD,o=t.paddingLG;return(0,O.oX)(t,{notificationBg:t.colorBgElevated,notificationPaddingVertical:e,notificationPaddingHorizontal:o,notificationIconSize:t.calc(t.fontSizeLG).mul(t.lineHeightLG).equal(),notificationCloseButtonSize:t.calc(t.controlHeightLG).mul(.55).equal(),notificationMarginBottom:t.margin,notificationPadding:`${(0,$.zA)(t.paddingMD)} ${(0,$.zA)(t.paddingContentHorizontalLG)}`,notificationMarginEdge:t.marginLG,animationMaxHeight:150,notificationStackLayer:3,notificationProgressHeight:2,notificationProgressBg:`linear-gradient(90deg, ${t.colorPrimaryBorderHover}, ${t.colorPrimary})`})},z=(0,k.OF)("Notification",(t=>{const e=M(t);return[I(e),x(e),E(e)]}),N),H=(0,k.bf)(["Notification","PurePanel"],(t=>{const e=`${t.componentCls}-notice`,o=M(t);return{[`${e}-pure-panel`]:Object.assign(Object.assign({},P(o)),{width:o.width,maxWidth:`calc(100vw - ${(0,$.zA)(t.calc(o.notificationMarginEdge).mul(2).equal())})`,margin:0})}}),N);var B=function(t,e){var o={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.indexOf(n)<0&&(o[n]=t[n]);if(null!=t&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(n=Object.getOwnPropertySymbols(t);i<n.length;i++)e.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(t,n[i])&&(o[n[i]]=t[n[i]])}return o};f.A,s.A,l.A,p.A,u.A;function R(t,e){return null===e||!1===e?null:e||n.createElement(d.A,{className:`${t}-close-icon`})}const A={success:s.A,info:f.A,error:l.A,warning:p.A},L=t=>{const{prefixCls:e,icon:o,type:i,message:a,description:r,btn:c,role:s="alert"}=t;let l=null;return o?l=n.createElement("span",{className:`${e}-icon`},o):i&&(l=n.createElement(A[i]||null,{className:g()(`${e}-icon`,`${e}-icon-${i}`)})),n.createElement("div",{className:g()({[`${e}-with-icon`]:l}),role:s},l,n.createElement("div",{className:`${e}-message`},a),n.createElement("div",{className:`${e}-description`},r),c&&n.createElement("div",{className:`${e}-btn`},c))},_=t=>{const{prefixCls:e,className:o,icon:i,type:a,message:c,description:s,btn:l,closable:d=!0,closeIcon:p,className:f}=t,u=B(t,["prefixCls","className","icon","type","message","description","btn","closable","closeIcon","className"]),{getPrefixCls:m}=n.useContext(r.QO),$=e||m("notification"),v=`${$}-notice`,y=(0,h.A)($),[O,k,x]=z($,y);return O(n.createElement("div",{className:g()(`${v}-pure-panel`,k,o,x,y)},n.createElement(H,{prefixCls:$}),n.createElement(b.$T,Object.assign({},u,{prefixCls:$,eventKey:"pure",duration:null,closable:d,className:g()({notificationClassName:f}),closeIcon:R($,p),content:n.createElement(L,{prefixCls:v,icon:i,type:a,message:c,description:s,btn:l})}))))};var F=o(59478),D=o(691);var T=function(t,e){var o={};for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.indexOf(n)<0&&(o[n]=t[n]);if(null!=t&&"function"===typeof Object.getOwnPropertySymbols){var i=0;for(n=Object.getOwnPropertySymbols(t);i<n.length;i++)e.indexOf(n[i])<0&&Object.prototype.propertyIsEnumerable.call(t,n[i])&&(o[n[i]]=t[n[i]])}return o};const G="topRight",q=t=>{let{children:e,prefixCls:o}=t;const i=(0,h.A)(o),[a,r,c]=z(o,i);return a(n.createElement(b.ph,{classNames:{list:g()(r,c,i)}},e))},W=(t,e)=>{let{prefixCls:o,key:i}=e;return n.createElement(q,{prefixCls:o,key:i},t)},X=n.forwardRef(((t,e)=>{const{top:o,bottom:i,prefixCls:a,getContainer:c,maxCount:s,rtl:l,onAllRemoved:d,stack:p,duration:f,pauseOnHover:u=!0,showProgress:m}=t,{getPrefixCls:h,getPopupContainer:$,notification:v,direction:y}=(0,n.useContext)(r.QO),[,O]=(0,D.Ay)(),k=a||h("notification"),[x,C]=(0,b.hN)({prefixCls:k,style:t=>function(t,e,o){let n;switch(t){case"top":n={left:"50%",transform:"translateX(-50%)",right:"auto",top:e,bottom:"auto"};break;case"topLeft":n={left:0,top:e,bottom:"auto"};break;case"topRight":n={right:0,top:e,bottom:"auto"};break;case"bottom":n={left:"50%",transform:"translateX(-50%)",right:"auto",top:"auto",bottom:o};break;case"bottomLeft":n={left:0,top:"auto",bottom:o};break;default:n={right:0,top:"auto",bottom:o}}return n}(t,null!==o&&void 0!==o?o:24,null!==i&&void 0!==i?i:24),className:()=>g()({[`${k}-rtl`]:null!==l&&void 0!==l?l:"rtl"===y}),motion:()=>function(t){return{motionName:`${t}-fade`}}(k),closable:!0,closeIcon:R(k),duration:null!==f&&void 0!==f?f:4.5,getContainer:()=>(null===c||void 0===c?void 0:c())||(null===$||void 0===$?void 0:$())||document.body,maxCount:s,pauseOnHover:u,showProgress:m,onAllRemoved:d,renderNotifications:W,stack:!1!==p&&{threshold:"object"===typeof p?null===p||void 0===p?void 0:p.threshold:void 0,offset:8,gap:O.margin}});return n.useImperativeHandle(e,(()=>Object.assign(Object.assign({},x),{prefixCls:k,notification:v}))),C}));function Q(t){const e=n.useRef(null),o=((0,F.rJ)("Notification"),n.useMemo((()=>{const o=o=>{var i;if(!e.current)return;const{open:a,prefixCls:r,notification:c}=e.current,s=`${r}-notice`,{message:l,description:d,icon:p,type:f,btn:u,className:m,style:b,role:h="alert",closeIcon:$,closable:v}=o,y=T(o,["message","description","icon","type","btn","className","style","role","closeIcon","closable"]),O=R(s,"undefined"!==typeof $?$:null===c||void 0===c?void 0:c.closeIcon);return a(Object.assign(Object.assign({placement:null!==(i=null===t||void 0===t?void 0:t.placement)&&void 0!==i?i:G},y),{content:n.createElement(L,{prefixCls:s,icon:p,type:f,message:l,description:d,btn:u,role:h}),className:g()(f&&`${s}-${f}`,m,null===c||void 0===c?void 0:c.className),style:Object.assign(Object.assign({},null===c||void 0===c?void 0:c.style),b),closeIcon:O,closable:null!==v&&void 0!==v?v:!!O}))},i={open:o,destroy:t=>{var o,n;void 0!==t?null===(o=e.current)||void 0===o||o.close(t):null===(n=e.current)||void 0===n||n.destroy()}};return["success","info","warning","error"].forEach((t=>{i[t]=e=>o(Object.assign(Object.assign({},e),{type:t}))})),i}),[]));return[o,n.createElement(X,Object.assign({key:"notification-holder"},t,{ref:e}))]}let K=null,V=t=>t(),J=[],U={};function Y(){const{getContainer:t,rtl:e,maxCount:o,top:n,bottom:i,showProgress:a,pauseOnHover:r}=U,c=(null===t||void 0===t?void 0:t())||document.body;return{getContainer:()=>c,rtl:e,maxCount:o,top:n,bottom:i,showProgress:a,pauseOnHover:r}}const Z=n.forwardRef(((t,e)=>{const{notificationConfig:o,sync:i}=t,{getPrefixCls:c}=(0,n.useContext)(r.QO),s=U.prefixCls||c("notification"),l=(0,n.useContext)(a.B),[d,p]=Q(Object.assign(Object.assign(Object.assign({},o),{prefixCls:s}),l.notification));return n.useEffect(i,[]),n.useImperativeHandle(e,(()=>{const t=Object.assign({},d);return Object.keys(t).forEach((e=>{t[e]=function(){return i(),d[e].apply(d,arguments)}})),{instance:t,sync:i}})),p})),tt=n.forwardRef(((t,e)=>{const[o,i]=n.useState(Y),a=()=>{i(Y)};n.useEffect(a,[]);const r=(0,c.cr)(),s=r.getRootPrefixCls(),l=r.getIconPrefixCls(),d=r.getTheme(),p=n.createElement(Z,{ref:e,sync:a,notificationConfig:o});return n.createElement(c.Ay,{prefixCls:s,iconPrefixCls:l,theme:d},r.holderRender?r.holderRender(p):p)}));function et(){if(!K){const t=document.createDocumentFragment(),e={fragment:t};return K=e,void V((()=>{(0,i.X)(n.createElement(tt,{ref:t=>{const{instance:o,sync:n}=t||{};Promise.resolve().then((()=>{!e.instance&&o&&(e.instance=o,e.sync=n,et())}))}}),t)}))}K.instance&&(J.forEach((t=>{switch(t.type){case"open":V((()=>{K.instance.open(Object.assign(Object.assign({},U),t.config))}));break;case"destroy":V((()=>{null===K||void 0===K||K.instance.destroy(t.key)}))}})),J=[])}function ot(t){(0,c.cr)();J.push({type:"open",config:t}),et()}const nt={open:ot,destroy:t=>{J.push({type:"destroy",key:t}),et()},config:function(t){U=Object.assign(Object.assign({},U),t),V((()=>{var t;null===(t=null===K||void 0===K?void 0:K.sync)||void 0===t||t.call(K)}))},useNotification:function(t){return Q(t)},_InternalPanelDoNotUseOrYouWillBeFired:_};["success","info","warning","error"].forEach((t=>{nt[t]=e=>ot(Object.assign(Object.assign({},e),{type:t}))}));const it=nt}}]);
//# sourceMappingURL=730.857eb19e.chunk.js.map