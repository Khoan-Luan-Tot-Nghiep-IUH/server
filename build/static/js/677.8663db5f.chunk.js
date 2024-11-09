"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[677],{48677:(e,t,n)=>{n.d(t,{A:()=>q});var o=n(65043),a=n(98139),r=n.n(a),l=n(89379),i=n(5544),s=n(44347),c=n(52664),d=o.createContext(null),u=o.createContext({});const v=d;var m=n(64467),p=n(58168),f=n(50541),g=n(25001),b=n(48060),h=n(80045),y=n(13758),x=["prefixCls","className","containerRef"];const w=function(e){var t=e.prefixCls,n=e.className,a=e.containerRef,l=(0,h.A)(e,x),i=o.useContext(u).panel,s=(0,y.xK)(i,a);return o.createElement("div",(0,p.A)({className:r()("".concat(t,"-content"),n),role:"dialog",ref:s},(0,b.A)(e,{aria:!0}),{"aria-modal":"true"},l))};var C=n(97907);function k(e){return"string"===typeof e&&String(Number(e))===e?((0,C.Ay)(!1,"Invalid value type of `width` or `height` which should be number type instead."),Number(e)):e}var O={width:0,height:0,overflow:"hidden",outline:"none",position:"absolute"};function S(e,t){var n,a,s,c=e.prefixCls,d=e.open,u=e.placement,h=e.inline,y=e.push,x=e.forceRender,C=e.autoFocus,S=e.keyboard,$=e.classNames,A=e.rootClassName,E=e.rootStyle,N=e.zIndex,j=e.className,D=e.id,I=e.style,M=e.motion,z=e.width,R=e.height,P=e.children,K=e.mask,L=e.maskClosable,B=e.maskMotion,W=e.maskClassName,H=e.maskStyle,T=e.afterOpenChange,X=e.onClose,U=e.onMouseEnter,_=e.onMouseOver,F=e.onMouseLeave,Y=e.onClick,G=e.onKeyDown,Q=e.onKeyUp,V=e.styles,q=e.drawerRender,J=o.useRef(),Z=o.useRef(),ee=o.useRef();o.useImperativeHandle(t,(function(){return J.current}));o.useEffect((function(){var e;d&&C&&(null===(e=J.current)||void 0===e||e.focus({preventScroll:!0}))}),[d]);var te=o.useState(!1),ne=(0,i.A)(te,2),oe=ne[0],ae=ne[1],re=o.useContext(v),le=null!==(n=null!==(a=null===(s="boolean"===typeof y?y?{}:{distance:0}:y||{})||void 0===s?void 0:s.distance)&&void 0!==a?a:null===re||void 0===re?void 0:re.pushDistance)&&void 0!==n?n:180,ie=o.useMemo((function(){return{pushDistance:le,push:function(){ae(!0)},pull:function(){ae(!1)}}}),[le]);o.useEffect((function(){var e,t;d?null===re||void 0===re||null===(e=re.push)||void 0===e||e.call(re):null===re||void 0===re||null===(t=re.pull)||void 0===t||t.call(re)}),[d]),o.useEffect((function(){return function(){var e;null===re||void 0===re||null===(e=re.pull)||void 0===e||e.call(re)}}),[]);var se=K&&o.createElement(f.Ay,(0,p.A)({key:"mask"},B,{visible:d}),(function(e,t){var n=e.className,a=e.style;return o.createElement("div",{className:r()("".concat(c,"-mask"),n,null===$||void 0===$?void 0:$.mask,W),style:(0,l.A)((0,l.A)((0,l.A)({},a),H),null===V||void 0===V?void 0:V.mask),onClick:L&&d?X:void 0,ref:t})})),ce="function"===typeof M?M(u):M,de={};if(oe&&le)switch(u){case"top":de.transform="translateY(".concat(le,"px)");break;case"bottom":de.transform="translateY(".concat(-le,"px)");break;case"left":de.transform="translateX(".concat(le,"px)");break;default:de.transform="translateX(".concat(-le,"px)")}"left"===u||"right"===u?de.width=k(z):de.height=k(R);var ue={onMouseEnter:U,onMouseOver:_,onMouseLeave:F,onClick:Y,onKeyDown:G,onKeyUp:Q},ve=o.createElement(f.Ay,(0,p.A)({key:"panel"},ce,{visible:d,forceRender:x,onVisibleChanged:function(e){null===T||void 0===T||T(e)},removeOnLeave:!1,leavedClassName:"".concat(c,"-content-wrapper-hidden")}),(function(t,n){var a=t.className,i=t.style,s=o.createElement(w,(0,p.A)({id:D,containerRef:n,prefixCls:c,className:r()(j,null===$||void 0===$?void 0:$.content),style:(0,l.A)((0,l.A)({},I),null===V||void 0===V?void 0:V.content)},(0,b.A)(e,{aria:!0}),ue),P);return o.createElement("div",(0,p.A)({className:r()("".concat(c,"-content-wrapper"),null===$||void 0===$?void 0:$.wrapper,a),style:(0,l.A)((0,l.A)((0,l.A)({},de),i),null===V||void 0===V?void 0:V.wrapper)},(0,b.A)(e,{data:!0})),q?q(s):s)})),me=(0,l.A)({},E);return N&&(me.zIndex=N),o.createElement(v.Provider,{value:ie},o.createElement("div",{className:r()(c,"".concat(c,"-").concat(u),A,(0,m.A)((0,m.A)({},"".concat(c,"-open"),d),"".concat(c,"-inline"),h)),style:me,tabIndex:-1,ref:J,onKeyDown:function(e){var t=e.keyCode,n=e.shiftKey;switch(t){case g.A.TAB:var o;if(t===g.A.TAB)if(n||document.activeElement!==ee.current){if(n&&document.activeElement===Z.current){var a;null===(a=ee.current)||void 0===a||a.focus({preventScroll:!0})}}else null===(o=Z.current)||void 0===o||o.focus({preventScroll:!0});break;case g.A.ESC:X&&S&&(e.stopPropagation(),X(e))}}},se,o.createElement("div",{tabIndex:0,ref:Z,style:O,"aria-hidden":"true","data-sentinel":"start"}),ve,o.createElement("div",{tabIndex:0,ref:ee,style:O,"aria-hidden":"true","data-sentinel":"end"})))}const $=o.forwardRef(S);const A=function(e){var t=e.open,n=void 0!==t&&t,a=e.prefixCls,r=void 0===a?"rc-drawer":a,d=e.placement,v=void 0===d?"right":d,m=e.autoFocus,p=void 0===m||m,f=e.keyboard,g=void 0===f||f,b=e.width,h=void 0===b?378:b,y=e.mask,x=void 0===y||y,w=e.maskClosable,C=void 0===w||w,k=e.getContainer,O=e.forceRender,S=e.afterOpenChange,A=e.destroyOnClose,E=e.onMouseEnter,N=e.onMouseOver,j=e.onMouseLeave,D=e.onClick,I=e.onKeyDown,M=e.onKeyUp,z=e.panelRef,R=o.useState(!1),P=(0,i.A)(R,2),K=P[0],L=P[1];var B=o.useState(!1),W=(0,i.A)(B,2),H=W[0],T=W[1];(0,c.A)((function(){T(!0)}),[]);var X=!!H&&n,U=o.useRef(),_=o.useRef();(0,c.A)((function(){X&&(_.current=document.activeElement)}),[X]);var F=o.useMemo((function(){return{panel:z}}),[z]);if(!O&&!K&&!X&&A)return null;var Y={onMouseEnter:E,onMouseOver:N,onMouseLeave:j,onClick:D,onKeyDown:I,onKeyUp:M},G=(0,l.A)((0,l.A)({},e),{},{open:X,prefixCls:r,placement:v,autoFocus:p,keyboard:g,width:h,mask:x,maskClosable:C,inline:!1===k,afterOpenChange:function(e){var t,n;(L(e),null===S||void 0===S||S(e),e||!_.current||null!==(t=U.current)&&void 0!==t&&t.contains(_.current))||(null===(n=_.current)||void 0===n||n.focus({preventScroll:!0}))},ref:U},Y);return o.createElement(u.Provider,{value:F},o.createElement(s.A,{open:X||O||K,autoDestroy:!1,getContainer:k,autoLock:x&&(X||K)},o.createElement($,G)))};var E=n(36278),N=n(64980),j=n(83290),D=n(6951),I=n(35296),M=n(99114),z=n(55391),R=n(7650);const P=e=>{var t,n;const{prefixCls:a,title:l,footer:i,extra:s,loading:c,onClose:d,headerStyle:u,bodyStyle:v,footerStyle:m,children:p,classNames:f,styles:g}=e,{drawer:b}=o.useContext(I.QO),h=o.useCallback((e=>o.createElement("button",{type:"button",onClick:d,"aria-label":"Close",className:`${a}-close`},e)),[d]),[y,x]=(0,z.A)((0,z.d)(e),(0,z.d)(b),{closable:!0,closeIconRender:h}),w=o.useMemo((()=>{var e,t;return l||y?o.createElement("div",{style:Object.assign(Object.assign(Object.assign({},null===(e=null===b||void 0===b?void 0:b.styles)||void 0===e?void 0:e.header),u),null===g||void 0===g?void 0:g.header),className:r()(`${a}-header`,{[`${a}-header-close-only`]:y&&!l&&!s},null===(t=null===b||void 0===b?void 0:b.classNames)||void 0===t?void 0:t.header,null===f||void 0===f?void 0:f.header)},o.createElement("div",{className:`${a}-header-title`},x,l&&o.createElement("div",{className:`${a}-title`},l)),s&&o.createElement("div",{className:`${a}-extra`},s)):null}),[y,x,s,u,a,l]),C=o.useMemo((()=>{var e,t;if(!i)return null;const n=`${a}-footer`;return o.createElement("div",{className:r()(n,null===(e=null===b||void 0===b?void 0:b.classNames)||void 0===e?void 0:e.footer,null===f||void 0===f?void 0:f.footer),style:Object.assign(Object.assign(Object.assign({},null===(t=null===b||void 0===b?void 0:b.styles)||void 0===t?void 0:t.footer),m),null===g||void 0===g?void 0:g.footer)},i)}),[i,m,a]);return o.createElement(o.Fragment,null,w,o.createElement("div",{className:r()(`${a}-body`,null===f||void 0===f?void 0:f.body,null===(t=null===b||void 0===b?void 0:b.classNames)||void 0===t?void 0:t.body),style:Object.assign(Object.assign(Object.assign({},null===(n=null===b||void 0===b?void 0:b.styles)||void 0===n?void 0:n.body),v),null===g||void 0===g?void 0:g.body)},c?o.createElement(R.A,{active:!0,title:!1,paragraph:{rows:5},className:`${a}-body-skeleton`}):p),C)};var K=n(7896),L=n(94414),B=n(78855),W=n(78446);const H=e=>{const t="100%";return{left:`translateX(-${t})`,right:`translateX(${t})`,top:`translateY(-${t})`,bottom:`translateY(${t})`}[e]},T=(e,t)=>({"&-enter, &-appear":Object.assign(Object.assign({},e),{"&-active":t}),"&-leave":Object.assign(Object.assign({},t),{"&-active":e})}),X=(e,t)=>Object.assign({"&-enter, &-appear, &-leave":{"&-start":{transition:"none"},"&-active":{transition:`all ${t}`}}},T({opacity:e},{opacity:1})),U=(e,t)=>[X(.7,t),T({transform:H(e)},{transform:"none"})],_=e=>{const{componentCls:t,motionDurationSlow:n}=e;return{[t]:{[`${t}-mask-motion`]:X(0,n),[`${t}-panel-motion`]:["left","right","top","bottom"].reduce(((e,t)=>Object.assign(Object.assign({},e),{[`&-${t}`]:U(t,n)})),{})}}},F=e=>{const{borderRadiusSM:t,componentCls:n,zIndexPopup:o,colorBgMask:a,colorBgElevated:r,motionDurationSlow:l,motionDurationMid:i,paddingXS:s,padding:c,paddingLG:d,fontSizeLG:u,lineHeightLG:v,lineWidth:m,lineType:p,colorSplit:f,marginXS:g,colorIcon:b,colorIconHover:h,colorBgTextHover:y,colorBgTextActive:x,colorText:w,fontWeightStrong:C,footerPaddingBlock:k,footerPaddingInline:O,calc:S}=e,$=`${n}-content-wrapper`;return{[n]:{position:"fixed",inset:0,zIndex:o,pointerEvents:"none",color:w,"&-pure":{position:"relative",background:r,display:"flex",flexDirection:"column",[`&${n}-left`]:{boxShadow:e.boxShadowDrawerLeft},[`&${n}-right`]:{boxShadow:e.boxShadowDrawerRight},[`&${n}-top`]:{boxShadow:e.boxShadowDrawerUp},[`&${n}-bottom`]:{boxShadow:e.boxShadowDrawerDown}},"&-inline":{position:"absolute"},[`${n}-mask`]:{position:"absolute",inset:0,zIndex:o,background:a,pointerEvents:"auto"},[$]:{position:"absolute",zIndex:o,maxWidth:"100vw",transition:`all ${l}`,"&-hidden":{display:"none"}},[`&-left > ${$}`]:{top:0,bottom:0,left:{_skip_check_:!0,value:0},boxShadow:e.boxShadowDrawerLeft},[`&-right > ${$}`]:{top:0,right:{_skip_check_:!0,value:0},bottom:0,boxShadow:e.boxShadowDrawerRight},[`&-top > ${$}`]:{top:0,insetInline:0,boxShadow:e.boxShadowDrawerUp},[`&-bottom > ${$}`]:{bottom:0,insetInline:0,boxShadow:e.boxShadowDrawerDown},[`${n}-content`]:{display:"flex",flexDirection:"column",width:"100%",height:"100%",overflow:"auto",background:r,pointerEvents:"auto"},[`${n}-header`]:{display:"flex",flex:0,alignItems:"center",padding:`${(0,K.zA)(c)} ${(0,K.zA)(d)}`,fontSize:u,lineHeight:v,borderBottom:`${(0,K.zA)(m)} ${p} ${f}`,"&-title":{display:"flex",flex:1,alignItems:"center",minWidth:0,minHeight:0}},[`${n}-extra`]:{flex:"none"},[`${n}-close`]:Object.assign({display:"inline-flex",width:S(u).add(s).equal(),height:S(u).add(s).equal(),borderRadius:t,justifyContent:"center",alignItems:"center",marginInlineEnd:g,color:b,fontWeight:C,fontSize:u,fontStyle:"normal",lineHeight:1,textAlign:"center",textTransform:"none",textDecoration:"none",background:"transparent",border:0,cursor:"pointer",transition:`all ${i}`,textRendering:"auto","&:hover":{color:h,backgroundColor:y,textDecoration:"none"},"&:active":{backgroundColor:x}},(0,L.K8)(e)),[`${n}-title`]:{flex:1,margin:0,fontWeight:e.fontWeightStrong,fontSize:u,lineHeight:v},[`${n}-body`]:{flex:1,minWidth:0,minHeight:0,padding:d,overflow:"auto",[`${n}-body-skeleton`]:{width:"100%",height:"100%",display:"flex",justifyContent:"center"}},[`${n}-footer`]:{flexShrink:0,padding:`${(0,K.zA)(k)} ${(0,K.zA)(O)}`,borderTop:`${(0,K.zA)(m)} ${p} ${f}`},"&-rtl":{direction:"rtl"}}}},Y=(0,B.OF)("Drawer",(e=>{const t=(0,W.oX)(e,{});return[F(t),_(t)]}),(e=>({zIndexPopup:e.zIndexPopupBase,footerPaddingBlock:e.paddingXS,footerPaddingInline:e.padding})));var G=function(e,t){var n={};for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.indexOf(o)<0&&(n[o]=e[o]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var a=0;for(o=Object.getOwnPropertySymbols(e);a<o.length;a++)t.indexOf(o[a])<0&&Object.prototype.propertyIsEnumerable.call(e,o[a])&&(n[o[a]]=e[o[a]])}return n};const Q={distance:180},V=e=>{const{rootClassName:t,width:n,height:a,size:l="default",mask:i=!0,push:s=Q,open:c,afterOpenChange:d,onClose:u,prefixCls:v,getContainer:m,style:p,className:f,visible:g,afterVisibleChange:b,maskStyle:h,drawerStyle:y,contentWrapperStyle:x}=e,w=G(e,["rootClassName","width","height","size","mask","push","open","afterOpenChange","onClose","prefixCls","getContainer","style","className","visible","afterVisibleChange","maskStyle","drawerStyle","contentWrapperStyle"]),{getPopupContainer:C,getPrefixCls:k,direction:O,drawer:S}=o.useContext(I.QO),$=k("drawer",v),[z,R,K]=Y($),L=void 0===m&&C?()=>C(document.body):m,B=r()({"no-mask":!i,[`${$}-rtl`]:"rtl"===O},t,R,K);const W=o.useMemo((()=>null!==n&&void 0!==n?n:"large"===l?736:378),[n,l]),H=o.useMemo((()=>null!==a&&void 0!==a?a:"large"===l?736:378),[a,l]),T={motionName:(0,j.b)($,"mask-motion"),motionAppear:!0,motionEnter:!0,motionLeave:!0,motionDeadline:500},X=(0,M.f)(),[U,_]=(0,N.YK)("Drawer",w.zIndex),{classNames:F={},styles:V={}}=w,{classNames:q={},styles:J={}}=S||{};return z(o.createElement(E.A,{form:!0,space:!0},o.createElement(D.A.Provider,{value:_},o.createElement(A,Object.assign({prefixCls:$,onClose:u,maskMotion:T,motion:e=>({motionName:(0,j.b)($,`panel-motion-${e}`),motionAppear:!0,motionEnter:!0,motionLeave:!0,motionDeadline:500})},w,{classNames:{mask:r()(F.mask,q.mask),content:r()(F.content,q.content),wrapper:r()(F.wrapper,q.wrapper)},styles:{mask:Object.assign(Object.assign(Object.assign({},V.mask),h),J.mask),content:Object.assign(Object.assign(Object.assign({},V.content),y),J.content),wrapper:Object.assign(Object.assign(Object.assign({},V.wrapper),x),J.wrapper)},open:null!==c&&void 0!==c?c:g,mask:i,push:s,width:W,height:H,style:Object.assign(Object.assign({},null===S||void 0===S?void 0:S.style),p),className:r()(null===S||void 0===S?void 0:S.className,f),rootClassName:B,getContainer:L,afterOpenChange:null!==d&&void 0!==d?d:b,panelRef:X,zIndex:U}),o.createElement(P,Object.assign({prefixCls:$},w,{onClose:u}))))))};V._InternalPanelDoNotUseOrYouWillBeFired=e=>{const{prefixCls:t,style:n,className:a,placement:l="right"}=e,i=G(e,["prefixCls","style","className","placement"]),{getPrefixCls:s}=o.useContext(I.QO),c=s("drawer",t),[d,u,v]=Y(c),m=r()(c,`${c}-pure`,`${c}-${l}`,u,v,a);return d(o.createElement("div",{className:m,style:n},o.createElement(P,Object.assign({prefixCls:c},i))))};const q=V}}]);
//# sourceMappingURL=677.8663db5f.chunk.js.map