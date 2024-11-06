"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[73],{89073:(e,t,a)=>{a.d(t,{A:()=>P});var n=a(65043),o=a(98139),r=a.n(o),i=a(18574),l=a(35296),d=a(89122),s=a(7650),c=a(8918),g=function(e,t){var a={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(a[n]=e[n]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(a[n[o]]=e[n[o]])}return a};const b=e=>{var{prefixCls:t,className:a,hoverable:o=!0}=e,i=g(e,["prefixCls","className","hoverable"]);const{getPrefixCls:d}=n.useContext(l.QO),s=d("card",t),c=r()(`${s}-grid`,a,{[`${s}-grid-hoverable`]:o});return n.createElement("div",Object.assign({},i,{className:c}))};var p=a(7896),m=a(94414),$=a(78855),h=a(78446);const u=e=>{const{antCls:t,componentCls:a,headerHeight:n,cardPaddingBase:o,tabsMarginBottom:r}=e;return Object.assign(Object.assign({display:"flex",justifyContent:"center",flexDirection:"column",minHeight:n,marginBottom:-1,padding:`0 ${(0,p.zA)(o)}`,color:e.colorTextHeading,fontWeight:e.fontWeightStrong,fontSize:e.headerFontSize,background:e.headerBg,borderBottom:`${(0,p.zA)(e.lineWidth)} ${e.lineType} ${e.colorBorderSecondary}`,borderRadius:`${(0,p.zA)(e.borderRadiusLG)} ${(0,p.zA)(e.borderRadiusLG)} 0 0`},(0,m.t6)()),{"&-wrapper":{width:"100%",display:"flex",alignItems:"center"},"&-title":Object.assign(Object.assign({display:"inline-block",flex:1},m.L9),{[`\n          > ${a}-typography,\n          > ${a}-typography-edit-content\n        `]:{insetInlineStart:0,marginTop:0,marginBottom:0}}),[`${t}-tabs-top`]:{clear:"both",marginBottom:r,color:e.colorText,fontWeight:"normal",fontSize:e.fontSize,"&-bar":{borderBottom:`${(0,p.zA)(e.lineWidth)} ${e.lineType} ${e.colorBorderSecondary}`}}})},y=e=>{const{cardPaddingBase:t,colorBorderSecondary:a,cardShadow:n,lineWidth:o}=e;return{width:"33.33%",padding:t,border:0,borderRadius:0,boxShadow:`\n      ${(0,p.zA)(o)} 0 0 0 ${a},\n      0 ${(0,p.zA)(o)} 0 0 ${a},\n      ${(0,p.zA)(o)} ${(0,p.zA)(o)} 0 0 ${a},\n      ${(0,p.zA)(o)} 0 0 0 ${a} inset,\n      0 ${(0,p.zA)(o)} 0 0 ${a} inset;\n    `,transition:`all ${e.motionDurationMid}`,"&-hoverable:hover":{position:"relative",zIndex:1,boxShadow:n}}},v=e=>{const{componentCls:t,iconCls:a,actionsLiMargin:n,cardActionsIconSize:o,colorBorderSecondary:r,actionsBg:i}=e;return Object.assign(Object.assign({margin:0,padding:0,listStyle:"none",background:i,borderTop:`${(0,p.zA)(e.lineWidth)} ${e.lineType} ${r}`,display:"flex",borderRadius:`0 0 ${(0,p.zA)(e.borderRadiusLG)} ${(0,p.zA)(e.borderRadiusLG)}`},(0,m.t6)()),{"& > li":{margin:n,color:e.colorTextDescription,textAlign:"center","> span":{position:"relative",display:"block",minWidth:e.calc(e.cardActionsIconSize).mul(2).equal(),fontSize:e.fontSize,lineHeight:e.lineHeight,cursor:"pointer","&:hover":{color:e.colorPrimary,transition:`color ${e.motionDurationMid}`},[`a:not(${t}-btn), > ${a}`]:{display:"inline-block",width:"100%",color:e.colorTextDescription,lineHeight:(0,p.zA)(e.fontHeight),transition:`color ${e.motionDurationMid}`,"&:hover":{color:e.colorPrimary}},[`> ${a}`]:{fontSize:o,lineHeight:(0,p.zA)(e.calc(o).mul(e.lineHeight).equal())}},"&:not(:last-child)":{borderInlineEnd:`${(0,p.zA)(e.lineWidth)} ${e.lineType} ${r}`}}})},f=e=>Object.assign(Object.assign({margin:`${(0,p.zA)(e.calc(e.marginXXS).mul(-1).equal())} 0`,display:"flex"},(0,m.t6)()),{"&-avatar":{paddingInlineEnd:e.padding},"&-detail":{overflow:"hidden",flex:1,"> div:not(:last-child)":{marginBottom:e.marginXS}},"&-title":Object.assign({color:e.colorTextHeading,fontWeight:e.fontWeightStrong,fontSize:e.fontSizeLG},m.L9),"&-description":{color:e.colorTextDescription}}),S=e=>{const{componentCls:t,cardPaddingBase:a,colorFillAlter:n}=e;return{[`${t}-head`]:{padding:`0 ${(0,p.zA)(a)}`,background:n,"&-title":{fontSize:e.fontSize}},[`${t}-body`]:{padding:`${(0,p.zA)(e.padding)} ${(0,p.zA)(a)}`}}},z=e=>{const{componentCls:t}=e;return{overflow:"hidden",[`${t}-body`]:{userSelect:"none"}}},x=e=>{const{componentCls:t,cardShadow:a,cardHeadPadding:n,colorBorderSecondary:o,boxShadowTertiary:r,cardPaddingBase:i,extraColor:l}=e;return{[t]:Object.assign(Object.assign({},(0,m.dF)(e)),{position:"relative",background:e.colorBgContainer,borderRadius:e.borderRadiusLG,[`&:not(${t}-bordered)`]:{boxShadow:r},[`${t}-head`]:u(e),[`${t}-extra`]:{marginInlineStart:"auto",color:l,fontWeight:"normal",fontSize:e.fontSize},[`${t}-body`]:Object.assign({padding:i,borderRadius:`0 0 ${(0,p.zA)(e.borderRadiusLG)} ${(0,p.zA)(e.borderRadiusLG)}`},(0,m.t6)()),[`${t}-grid`]:y(e),[`${t}-cover`]:{"> *":{display:"block",width:"100%",borderRadius:`${(0,p.zA)(e.borderRadiusLG)} ${(0,p.zA)(e.borderRadiusLG)} 0 0`}},[`${t}-actions`]:v(e),[`${t}-meta`]:f(e)}),[`${t}-bordered`]:{border:`${(0,p.zA)(e.lineWidth)} ${e.lineType} ${o}`,[`${t}-cover`]:{marginTop:-1,marginInlineStart:-1,marginInlineEnd:-1}},[`${t}-hoverable`]:{cursor:"pointer",transition:`box-shadow ${e.motionDurationMid}, border-color ${e.motionDurationMid}`,"&:hover":{borderColor:"transparent",boxShadow:a}},[`${t}-contain-grid`]:{borderRadius:`${(0,p.zA)(e.borderRadiusLG)} ${(0,p.zA)(e.borderRadiusLG)} 0 0 `,[`${t}-body`]:{display:"flex",flexWrap:"wrap"},[`&:not(${t}-loading) ${t}-body`]:{marginBlockStart:e.calc(e.lineWidth).mul(-1).equal(),marginInlineStart:e.calc(e.lineWidth).mul(-1).equal(),padding:0}},[`${t}-contain-tabs`]:{[`> div${t}-head`]:{minHeight:0,[`${t}-head-title, ${t}-extra`]:{paddingTop:n}}},[`${t}-type-inner`]:S(e),[`${t}-loading`]:z(e),[`${t}-rtl`]:{direction:"rtl"}}},O=e=>{const{componentCls:t,cardPaddingSM:a,headerHeightSM:n,headerFontSizeSM:o}=e;return{[`${t}-small`]:{[`> ${t}-head`]:{minHeight:n,padding:`0 ${(0,p.zA)(a)}`,fontSize:o,[`> ${t}-head-wrapper`]:{[`> ${t}-extra`]:{fontSize:e.fontSize}}},[`> ${t}-body`]:{padding:a}},[`${t}-small${t}-contain-tabs`]:{[`> ${t}-head`]:{[`${t}-head-title, ${t}-extra`]:{paddingTop:0,display:"flex",alignItems:"center"}}}}},A=(0,$.OF)("Card",(e=>{const t=(0,h.oX)(e,{cardShadow:e.boxShadowCard,cardHeadPadding:e.padding,cardPaddingBase:e.paddingLG,cardActionsIconSize:e.fontSize,cardPaddingSM:12});return[x(t),O(t)]}),(e=>({headerBg:"transparent",headerFontSize:e.fontSizeLG,headerFontSizeSM:e.fontSize,headerHeight:e.fontSizeLG*e.lineHeightLG+2*e.padding,headerHeightSM:e.fontSize*e.lineHeight+2*e.paddingXS,actionsBg:e.colorBgContainer,actionsLiMargin:`${e.paddingSM}px 0`,tabsMarginBottom:-e.padding-e.lineWidth,extraColor:e.colorText})));var C=function(e,t){var a={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(a[n]=e[n]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(a[n[o]]=e[n[o]])}return a};const j=e=>{const{actionClasses:t,actions:a=[],actionStyle:o}=e;return n.createElement("ul",{className:t,style:o},a.map(((e,t)=>{const o=`action-${t}`;return n.createElement("li",{style:{width:100/a.length+"%"},key:o},n.createElement("span",null,e))})))},w=n.forwardRef(((e,t)=>{const{prefixCls:a,className:o,rootClassName:g,style:p,extra:m,headStyle:$={},bodyStyle:h={},title:u,loading:y,bordered:v=!0,size:f,type:S,cover:z,actions:x,tabList:O,children:w,activeTabKey:E,defaultActiveTabKey:B,tabBarExtraContent:N,hoverable:P,tabProps:T={},classNames:L,styles:H}=e,R=C(e,["prefixCls","className","rootClassName","style","extra","headStyle","bodyStyle","title","loading","bordered","size","type","cover","actions","tabList","children","activeTabKey","defaultActiveTabKey","tabBarExtraContent","hoverable","tabProps","classNames","styles"]),{getPrefixCls:M,direction:G,card:W}=n.useContext(l.QO);const I=e=>{var t;return r()(null===(t=null===W||void 0===W?void 0:W.classNames)||void 0===t?void 0:t[e],null===L||void 0===L?void 0:L[e])},k=e=>{var t;return Object.assign(Object.assign({},null===(t=null===W||void 0===W?void 0:W.styles)||void 0===t?void 0:t[e]),null===H||void 0===H?void 0:H[e])},D=n.useMemo((()=>{let e=!1;return n.Children.forEach(w,(t=>{(null===t||void 0===t?void 0:t.type)===b&&(e=!0)})),e}),[w]),F=M("card",a),[K,q,X]=A(F),Q=n.createElement(s.A,{loading:!0,active:!0,paragraph:{rows:4},title:!1},w),J=void 0!==E,U=Object.assign(Object.assign({},T),{[J?"activeKey":"defaultActiveKey"]:J?E:B,tabBarExtraContent:N});let V;const Y=(0,d.A)(f),Z=Y&&"default"!==Y?Y:"large",_=O?n.createElement(c.A,Object.assign({size:Z},U,{className:`${F}-head-tabs`,onChange:t=>{var a;null===(a=e.onTabChange)||void 0===a||a.call(e,t)},items:O.map((e=>{var{tab:t}=e,a=C(e,["tab"]);return Object.assign({label:t},a)}))})):null;if(u||m||_){const e=r()(`${F}-head`,I("header")),t=r()(`${F}-head-title`,I("title")),a=r()(`${F}-extra`,I("extra")),o=Object.assign(Object.assign({},$),k("header"));V=n.createElement("div",{className:e,style:o},n.createElement("div",{className:`${F}-head-wrapper`},u&&n.createElement("div",{className:t,style:k("title")},u),m&&n.createElement("div",{className:a,style:k("extra")},m)),_)}const ee=r()(`${F}-cover`,I("cover")),te=z?n.createElement("div",{className:ee,style:k("cover")},z):null,ae=r()(`${F}-body`,I("body")),ne=Object.assign(Object.assign({},h),k("body")),oe=n.createElement("div",{className:ae,style:ne},y?Q:w),re=r()(`${F}-actions`,I("actions")),ie=(null===x||void 0===x?void 0:x.length)?n.createElement(j,{actionClasses:re,actionStyle:k("actions"),actions:x}):null,le=(0,i.A)(R,["onTabChange"]),de=r()(F,null===W||void 0===W?void 0:W.className,{[`${F}-loading`]:y,[`${F}-bordered`]:v,[`${F}-hoverable`]:P,[`${F}-contain-grid`]:D,[`${F}-contain-tabs`]:null===O||void 0===O?void 0:O.length,[`${F}-${Y}`]:Y,[`${F}-type-${S}`]:!!S,[`${F}-rtl`]:"rtl"===G},o,g,q,X),se=Object.assign(Object.assign({},null===W||void 0===W?void 0:W.style),p);return K(n.createElement("div",Object.assign({ref:t},le,{className:de,style:se}),V,te,oe,ie))}));var E=function(e,t){var a={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(a[n]=e[n]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(a[n[o]]=e[n[o]])}return a};const B=e=>{const{prefixCls:t,className:a,avatar:o,title:i,description:d}=e,s=E(e,["prefixCls","className","avatar","title","description"]),{getPrefixCls:c}=n.useContext(l.QO),g=c("card",t),b=r()(`${g}-meta`,a),p=o?n.createElement("div",{className:`${g}-meta-avatar`},o):null,m=i?n.createElement("div",{className:`${g}-meta-title`},i):null,$=d?n.createElement("div",{className:`${g}-meta-description`},d):null,h=m||$?n.createElement("div",{className:`${g}-meta-detail`},m,$):null;return n.createElement("div",Object.assign({},s,{className:b}),p,h)},N=w;N.Grid=b,N.Meta=B;const P=N}}]);
//# sourceMappingURL=73.6e069a22.chunk.js.map