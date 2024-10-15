"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[10],{5885:(t,e,n)=>{n.d(e,{UE:()=>j,RK:()=>P,ll:()=>L,rD:()=>_,__:()=>E,UU:()=>A,jD:()=>S,mG:()=>O,ER:()=>q,cY:()=>D,iD:()=>R,BN:()=>k,Ej:()=>C});var o=n(5e3);function r(t,e,n){let{reference:r,floating:i}=t;const l=(0,o.TV)(e),c=(0,o.Dz)(e),s=(0,o.sq)(c),a=(0,o.C0)(e),f="y"===l,u=r.x+r.width/2-i.width/2,d=r.y+r.height/2-i.height/2,p=r[s]/2-i[s]/2;let m;switch(a){case"top":m={x:u,y:r.y-i.height};break;case"bottom":m={x:u,y:r.y+r.height};break;case"right":m={x:r.x+r.width,y:d};break;case"left":m={x:r.x-i.width,y:d};break;default:m={x:r.x,y:r.y}}switch((0,o.Sg)(e)){case"start":m[c]-=p*(n&&f?-1:1);break;case"end":m[c]+=p*(n&&f?-1:1)}return m}async function i(t,e){var n;void 0===e&&(e={});const{x:r,y:i,platform:l,rects:c,elements:s,strategy:a}=t,{boundary:f="clippingAncestors",rootBoundary:u="viewport",elementContext:d="floating",altBoundary:p=!1,padding:m=0}=(0,o._3)(e,t),h=(0,o.nI)(m),g=s[p?"floating"===d?"reference":"floating":d],y=(0,o.B1)(await l.getClippingRect({element:null==(n=await(null==l.isElement?void 0:l.isElement(g)))||n?g:g.contextElement||await(null==l.getDocumentElement?void 0:l.getDocumentElement(s.floating)),boundary:f,rootBoundary:u,strategy:a})),w="floating"===d?{x:r,y:i,width:c.floating.width,height:c.floating.height}:c.reference,v=await(null==l.getOffsetParent?void 0:l.getOffsetParent(s.floating)),x=await(null==l.isElement?void 0:l.isElement(v))&&await(null==l.getScale?void 0:l.getScale(v))||{x:1,y:1},b=(0,o.B1)(l.convertOffsetParentRelativeRectToViewportRelativeRect?await l.convertOffsetParentRelativeRectToViewportRelativeRect({elements:s,rect:w,offsetParent:v,strategy:a}):w);return{top:(y.top-b.top+h.top)/x.y,bottom:(b.bottom-y.bottom+h.bottom)/x.y,left:(y.left-b.left+h.left)/x.x,right:(b.right-y.right+h.right)/x.x}}function l(t,e){return{top:t.top-e.height,right:t.right-e.width,bottom:t.bottom-e.height,left:t.left-e.width}}function c(t){return o.r_.some((e=>t[e]>=0))}function s(t){const e=(0,o.jk)(...t.map((t=>t.left))),n=(0,o.jk)(...t.map((t=>t.top)));return{x:e,y:n,width:(0,o.T9)(...t.map((t=>t.right)))-e,height:(0,o.T9)(...t.map((t=>t.bottom)))-n}}var a=n(5702);function f(t){const e=(0,a.L9)(t);let n=parseFloat(e.width)||0,r=parseFloat(e.height)||0;const i=(0,a.sb)(t),l=i?t.offsetWidth:n,c=i?t.offsetHeight:r,s=(0,o.LI)(n)!==l||(0,o.LI)(r)!==c;return s&&(n=l,r=c),{width:n,height:r,$:s}}function u(t){return(0,a.vq)(t)?t:t.contextElement}function d(t){const e=u(t);if(!(0,a.sb)(e))return(0,o.Jx)(1);const n=e.getBoundingClientRect(),{width:r,height:i,$:l}=f(e);let c=(l?(0,o.LI)(n.width):n.width)/r,s=(l?(0,o.LI)(n.height):n.height)/i;return c&&Number.isFinite(c)||(c=1),s&&Number.isFinite(s)||(s=1),{x:c,y:s}}const p=(0,o.Jx)(0);function m(t){const e=(0,a.zk)(t);return(0,a.Tc)()&&e.visualViewport?{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}:p}function h(t,e,n,r){void 0===e&&(e=!1),void 0===n&&(n=!1);const i=t.getBoundingClientRect(),l=u(t);let c=(0,o.Jx)(1);e&&(r?(0,a.vq)(r)&&(c=d(r)):c=d(t));const s=function(t,e,n){return void 0===e&&(e=!1),!(!n||e&&n!==(0,a.zk)(t))&&e}(l,n,r)?m(l):(0,o.Jx)(0);let f=(i.left+s.x)/c.x,p=(i.top+s.y)/c.y,h=i.width/c.x,g=i.height/c.y;if(l){const t=(0,a.zk)(l),e=r&&(0,a.vq)(r)?(0,a.zk)(r):r;let n=t,o=(0,a._m)(n);for(;o&&r&&e!==n;){const t=d(o),e=o.getBoundingClientRect(),r=(0,a.L9)(o),i=e.left+(o.clientLeft+parseFloat(r.paddingLeft))*t.x,l=e.top+(o.clientTop+parseFloat(r.paddingTop))*t.y;f*=t.x,p*=t.y,h*=t.x,g*=t.y,f+=i,p+=l,n=(0,a.zk)(o),o=(0,a._m)(n)}}return(0,o.B1)({width:h,height:g,x:f,y:p})}function g(t){return h((0,a.ep)(t)).left+(0,a.CP)(t).scrollLeft}function y(t,e,n){let r;if("viewport"===e)r=function(t,e){const n=(0,a.zk)(t),o=(0,a.ep)(t),r=n.visualViewport;let i=o.clientWidth,l=o.clientHeight,c=0,s=0;if(r){i=r.width,l=r.height;const t=(0,a.Tc)();(!t||t&&"fixed"===e)&&(c=r.offsetLeft,s=r.offsetTop)}return{width:i,height:l,x:c,y:s}}(t,n);else if("document"===e)r=function(t){const e=(0,a.ep)(t),n=(0,a.CP)(t),r=t.ownerDocument.body,i=(0,o.T9)(e.scrollWidth,e.clientWidth,r.scrollWidth,r.clientWidth),l=(0,o.T9)(e.scrollHeight,e.clientHeight,r.scrollHeight,r.clientHeight);let c=-n.scrollLeft+g(t);const s=-n.scrollTop;return"rtl"===(0,a.L9)(r).direction&&(c+=(0,o.T9)(e.clientWidth,r.clientWidth)-i),{width:i,height:l,x:c,y:s}}((0,a.ep)(t));else if((0,a.vq)(e))r=function(t,e){const n=h(t,!0,"fixed"===e),r=n.top+t.clientTop,i=n.left+t.clientLeft,l=(0,a.sb)(t)?d(t):(0,o.Jx)(1);return{width:t.clientWidth*l.x,height:t.clientHeight*l.y,x:i*l.x,y:r*l.y}}(e,n);else{const n=m(t);r={...e,x:e.x-n.x,y:e.y-n.y}}return(0,o.B1)(r)}function w(t,e){const n=(0,a.$4)(t);return!(n===e||!(0,a.vq)(n)||(0,a.eu)(n))&&("fixed"===(0,a.L9)(n).position||w(n,e))}function v(t,e,n){const r=(0,a.sb)(e),i=(0,a.ep)(e),l="fixed"===n,c=h(t,!0,l,e);let s={scrollLeft:0,scrollTop:0};const f=(0,o.Jx)(0);if(r||!r&&!l)if(("body"!==(0,a.mq)(e)||(0,a.ZU)(i))&&(s=(0,a.CP)(e)),r){const t=h(e,!0,l,e);f.x=t.x+e.clientLeft,f.y=t.y+e.clientTop}else i&&(f.x=g(i));return{x:c.left+s.scrollLeft-f.x,y:c.top+s.scrollTop-f.y,width:c.width,height:c.height}}function x(t){return"static"===(0,a.L9)(t).position}function b(t,e){return(0,a.sb)(t)&&"fixed"!==(0,a.L9)(t).position?e?e(t):t.offsetParent:null}function T(t,e){const n=(0,a.zk)(t);if((0,a.Tf)(t))return n;if(!(0,a.sb)(t)){let e=(0,a.$4)(t);for(;e&&!(0,a.eu)(e);){if((0,a.vq)(e)&&!x(e))return e;e=(0,a.$4)(e)}return n}let o=b(t,e);for(;o&&(0,a.Lv)(o)&&x(o);)o=b(o,e);return o&&(0,a.eu)(o)&&x(o)&&!(0,a.sQ)(o)?n:o||(0,a.gJ)(t)||n}const R={convertOffsetParentRelativeRectToViewportRelativeRect:function(t){let{elements:e,rect:n,offsetParent:r,strategy:i}=t;const l="fixed"===i,c=(0,a.ep)(r),s=!!e&&(0,a.Tf)(e.floating);if(r===c||s&&l)return n;let f={scrollLeft:0,scrollTop:0},u=(0,o.Jx)(1);const p=(0,o.Jx)(0),m=(0,a.sb)(r);if((m||!m&&!l)&&(("body"!==(0,a.mq)(r)||(0,a.ZU)(c))&&(f=(0,a.CP)(r)),(0,a.sb)(r))){const t=h(r);u=d(r),p.x=t.x+r.clientLeft,p.y=t.y+r.clientTop}return{width:n.width*u.x,height:n.height*u.y,x:n.x*u.x-f.scrollLeft*u.x+p.x,y:n.y*u.y-f.scrollTop*u.y+p.y}},getDocumentElement:a.ep,getClippingRect:function(t){let{element:e,boundary:n,rootBoundary:r,strategy:i}=t;const l=[..."clippingAncestors"===n?(0,a.Tf)(e)?[]:function(t,e){const n=e.get(t);if(n)return n;let o=(0,a.v9)(t,[],!1).filter((t=>(0,a.vq)(t)&&"body"!==(0,a.mq)(t))),r=null;const i="fixed"===(0,a.L9)(t).position;let l=i?(0,a.$4)(t):t;for(;(0,a.vq)(l)&&!(0,a.eu)(l);){const e=(0,a.L9)(l),n=(0,a.sQ)(l);n||"fixed"!==e.position||(r=null),(i?!n&&!r:!n&&"static"===e.position&&r&&["absolute","fixed"].includes(r.position)||(0,a.ZU)(l)&&!n&&w(t,l))?o=o.filter((t=>t!==l)):r=e,l=(0,a.$4)(l)}return e.set(t,o),o}(e,this._c):[].concat(n),r],c=l[0],s=l.reduce(((t,n)=>{const r=y(e,n,i);return t.top=(0,o.T9)(r.top,t.top),t.right=(0,o.jk)(r.right,t.right),t.bottom=(0,o.jk)(r.bottom,t.bottom),t.left=(0,o.T9)(r.left,t.left),t}),y(e,c,i));return{width:s.right-s.left,height:s.bottom-s.top,x:s.left,y:s.top}},getOffsetParent:T,getElementRects:async function(t){const e=this.getOffsetParent||T,n=this.getDimensions,o=await n(t.floating);return{reference:v(t.reference,await e(t.floating),t.strategy),floating:{x:0,y:0,width:o.width,height:o.height}}},getClientRects:function(t){return Array.from(t.getClientRects())},getDimensions:function(t){const{width:e,height:n}=f(t);return{width:e,height:n}},getScale:d,isElement:a.vq,isRTL:function(t){return"rtl"===(0,a.L9)(t).direction}};function L(t,e,n,r){void 0===r&&(r={});const{ancestorScroll:i=!0,ancestorResize:l=!0,elementResize:c="function"===typeof ResizeObserver,layoutShift:s="function"===typeof IntersectionObserver,animationFrame:f=!1}=r,d=u(t),p=i||l?[...d?(0,a.v9)(d):[],...(0,a.v9)(e)]:[];p.forEach((t=>{i&&t.addEventListener("scroll",n,{passive:!0}),l&&t.addEventListener("resize",n)}));const m=d&&s?function(t,e){let n,r=null;const i=(0,a.ep)(t);function l(){var t;clearTimeout(n),null==(t=r)||t.disconnect(),r=null}return function c(s,a){void 0===s&&(s=!1),void 0===a&&(a=1),l();const{left:f,top:u,width:d,height:p}=t.getBoundingClientRect();if(s||e(),!d||!p)return;const m={rootMargin:-(0,o.RI)(u)+"px "+-(0,o.RI)(i.clientWidth-(f+d))+"px "+-(0,o.RI)(i.clientHeight-(u+p))+"px "+-(0,o.RI)(f)+"px",threshold:(0,o.T9)(0,(0,o.jk)(1,a))||1};let h=!0;function g(t){const e=t[0].intersectionRatio;if(e!==a){if(!h)return c();e?c(!1,e):n=setTimeout((()=>{c(!1,1e-7)}),1e3)}h=!1}try{r=new IntersectionObserver(g,{...m,root:i.ownerDocument})}catch(y){r=new IntersectionObserver(g,m)}r.observe(t)}(!0),l}(d,n):null;let g,y=-1,w=null;c&&(w=new ResizeObserver((t=>{let[o]=t;o&&o.target===d&&w&&(w.unobserve(e),cancelAnimationFrame(y),y=requestAnimationFrame((()=>{var t;null==(t=w)||t.observe(e)}))),n()})),d&&!f&&w.observe(d),w.observe(e));let v=f?h(t):null;return f&&function e(){const o=h(t);!v||o.x===v.x&&o.y===v.y&&o.width===v.width&&o.height===v.height||n();v=o,g=requestAnimationFrame(e)}(),n(),()=>{var t;p.forEach((t=>{i&&t.removeEventListener("scroll",n),l&&t.removeEventListener("resize",n)})),null==m||m(),null==(t=w)||t.disconnect(),w=null,f&&cancelAnimationFrame(g)}}const E=i,D=function(t){return void 0===t&&(t=0),{name:"offset",options:t,async fn(e){var n,r;const{x:i,y:l,placement:c,middlewareData:s}=e,a=await async function(t,e){const{placement:n,platform:r,elements:i}=t,l=await(null==r.isRTL?void 0:r.isRTL(i.floating)),c=(0,o.C0)(n),s=(0,o.Sg)(n),a="y"===(0,o.TV)(n),f=["left","top"].includes(c)?-1:1,u=l&&a?-1:1,d=(0,o._3)(e,t);let{mainAxis:p,crossAxis:m,alignmentAxis:h}="number"===typeof d?{mainAxis:d,crossAxis:0,alignmentAxis:null}:{mainAxis:0,crossAxis:0,alignmentAxis:null,...d};return s&&"number"===typeof h&&(m="end"===s?-1*h:h),a?{x:m*u,y:p*f}:{x:p*f,y:m*u}}(e,t);return c===(null==(n=s.offset)?void 0:n.placement)&&null!=(r=s.arrow)&&r.alignmentOffset?{}:{x:i+a.x,y:l+a.y,data:{...a,placement:c}}}}},P=function(t){return void 0===t&&(t={}),{name:"autoPlacement",options:t,async fn(e){var n,r,l;const{rects:c,middlewareData:s,placement:a,platform:f,elements:u}=e,{crossAxis:d=!1,alignment:p,allowedPlacements:m=o.DD,autoAlignment:h=!0,...g}=(0,o._3)(t,e),y=void 0!==p||m===o.DD?function(t,e,n){return(t?[...n.filter((e=>(0,o.Sg)(e)===t)),...n.filter((e=>(0,o.Sg)(e)!==t))]:n.filter((t=>(0,o.C0)(t)===t))).filter((n=>!t||(0,o.Sg)(n)===t||!!e&&(0,o.aD)(n)!==n))}(p||null,h,m):m,w=await i(e,g),v=(null==(n=s.autoPlacement)?void 0:n.index)||0,x=y[v];if(null==x)return{};const b=(0,o.w7)(x,c,await(null==f.isRTL?void 0:f.isRTL(u.floating)));if(a!==x)return{reset:{placement:y[0]}};const T=[w[(0,o.C0)(x)],w[b[0]],w[b[1]]],R=[...(null==(r=s.autoPlacement)?void 0:r.overflows)||[],{placement:x,overflows:T}],L=y[v+1];if(L)return{data:{index:v+1,overflows:R},reset:{placement:L}};const E=R.map((t=>{const e=(0,o.Sg)(t.placement);return[t.placement,e&&d?t.overflows.slice(0,2).reduce(((t,e)=>t+e),0):t.overflows[0],t.overflows]})).sort(((t,e)=>t[1]-e[1])),D=(null==(l=E.filter((t=>t[2].slice(0,(0,o.Sg)(t[0])?2:3).every((t=>t<=0))))[0])?void 0:l[0])||E[0][0];return D!==a?{data:{index:v+1,overflows:R},reset:{placement:D}}:{}}}},k=function(t){return void 0===t&&(t={}),{name:"shift",options:t,async fn(e){const{x:n,y:r,placement:l}=e,{mainAxis:c=!0,crossAxis:s=!1,limiter:a={fn:t=>{let{x:e,y:n}=t;return{x:e,y:n}}},...f}=(0,o._3)(t,e),u={x:n,y:r},d=await i(e,f),p=(0,o.TV)((0,o.C0)(l)),m=(0,o.PG)(p);let h=u[m],g=u[p];if(c){const t="y"===m?"bottom":"right",e=h+d["y"===m?"top":"left"],n=h-d[t];h=(0,o.qE)(e,h,n)}if(s){const t="y"===p?"bottom":"right",e=g+d["y"===p?"top":"left"],n=g-d[t];g=(0,o.qE)(e,g,n)}const y=a.fn({...e,[m]:h,[p]:g});return{...y,data:{x:y.x-n,y:y.y-r}}}}},A=function(t){return void 0===t&&(t={}),{name:"flip",options:t,async fn(e){var n,r;const{placement:l,middlewareData:c,rects:s,initialPlacement:a,platform:f,elements:u}=e,{mainAxis:d=!0,crossAxis:p=!0,fallbackPlacements:m,fallbackStrategy:h="bestFit",fallbackAxisSideDirection:g="none",flipAlignment:y=!0,...w}=(0,o._3)(t,e);if(null!=(n=c.arrow)&&n.alignmentOffset)return{};const v=(0,o.C0)(l),x=(0,o.TV)(a),b=(0,o.C0)(a)===a,T=await(null==f.isRTL?void 0:f.isRTL(u.floating)),R=m||(b||!y?[(0,o.bV)(a)]:(0,o.WJ)(a)),L="none"!==g;!m&&L&&R.push(...(0,o.lP)(a,y,g,T));const E=[a,...R],D=await i(e,w),P=[];let k=(null==(r=c.flip)?void 0:r.overflows)||[];if(d&&P.push(D[v]),p){const t=(0,o.w7)(l,s,T);P.push(D[t[0]],D[t[1]])}if(k=[...k,{placement:l,overflows:P}],!P.every((t=>t<=0))){var A,C;const t=((null==(A=c.flip)?void 0:A.index)||0)+1,e=E[t];if(e)return{data:{index:t,overflows:k},reset:{placement:e}};let n=null==(C=k.filter((t=>t.overflows[0]<=0)).sort(((t,e)=>t.overflows[1]-e.overflows[1]))[0])?void 0:C.placement;if(!n)switch(h){case"bestFit":{var S;const t=null==(S=k.filter((t=>{if(L){const e=(0,o.TV)(t.placement);return e===x||"y"===e}return!0})).map((t=>[t.placement,t.overflows.filter((t=>t>0)).reduce(((t,e)=>t+e),0)])).sort(((t,e)=>t[1]-e[1]))[0])?void 0:S[0];t&&(n=t);break}case"initialPlacement":n=a}if(l!==n)return{reset:{placement:n}}}return{}}}},C=function(t){return void 0===t&&(t={}),{name:"size",options:t,async fn(e){const{placement:n,rects:r,platform:l,elements:c}=e,{apply:s=()=>{},...a}=(0,o._3)(t,e),f=await i(e,a),u=(0,o.C0)(n),d=(0,o.Sg)(n),p="y"===(0,o.TV)(n),{width:m,height:h}=r.floating;let g,y;"top"===u||"bottom"===u?(g=u,y=d===(await(null==l.isRTL?void 0:l.isRTL(c.floating))?"start":"end")?"left":"right"):(y=u,g="end"===d?"top":"bottom");const w=h-f.top-f.bottom,v=m-f.left-f.right,x=(0,o.jk)(h-f[g],w),b=(0,o.jk)(m-f[y],v),T=!e.middlewareData.shift;let R=x,L=b;if(p?L=d||T?(0,o.jk)(b,v):v:R=d||T?(0,o.jk)(x,w):w,T&&!d){const t=(0,o.T9)(f.left,0),e=(0,o.T9)(f.right,0),n=(0,o.T9)(f.top,0),r=(0,o.T9)(f.bottom,0);p?L=m-2*(0!==t||0!==e?t+e:(0,o.T9)(f.left,f.right)):R=h-2*(0!==n||0!==r?n+r:(0,o.T9)(f.top,f.bottom))}await s({...e,availableWidth:L,availableHeight:R});const E=await l.getDimensions(c.floating);return m!==E.width||h!==E.height?{reset:{rects:!0}}:{}}}},S=function(t){return void 0===t&&(t={}),{name:"hide",options:t,async fn(e){const{rects:n}=e,{strategy:r="referenceHidden",...s}=(0,o._3)(t,e);switch(r){case"referenceHidden":{const t=l(await i(e,{...s,elementContext:"reference"}),n.reference);return{data:{referenceHiddenOffsets:t,referenceHidden:c(t)}}}case"escaped":{const t=l(await i(e,{...s,altBoundary:!0}),n.floating);return{data:{escapedOffsets:t,escaped:c(t)}}}default:return{}}}}},j=t=>({name:"arrow",options:t,async fn(e){const{x:n,y:r,placement:i,rects:l,platform:c,elements:s,middlewareData:a}=e,{element:f,padding:u=0}=(0,o._3)(t,e)||{};if(null==f)return{};const d=(0,o.nI)(u),p={x:n,y:r},m=(0,o.Dz)(i),h=(0,o.sq)(m),g=await c.getDimensions(f),y="y"===m,w=y?"top":"left",v=y?"bottom":"right",x=y?"clientHeight":"clientWidth",b=l.reference[h]+l.reference[m]-p[m]-l.floating[h],T=p[m]-l.reference[m],R=await(null==c.getOffsetParent?void 0:c.getOffsetParent(f));let L=R?R[x]:0;L&&await(null==c.isElement?void 0:c.isElement(R))||(L=s.floating[x]||l.floating[h]);const E=b/2-T/2,D=L/2-g[h]/2-1,P=(0,o.jk)(d[w],D),k=(0,o.jk)(d[v],D),A=P,C=L-g[h]-k,S=L/2-g[h]/2+E,j=(0,o.qE)(A,S,C),O=!a.arrow&&null!=(0,o.Sg)(i)&&S!==j&&l.reference[h]/2-(S<A?P:k)-g[h]/2<0,q=O?S<A?S-A:S-C:0;return{[m]:p[m]+q,data:{[m]:j,centerOffset:S-j-q,...O&&{alignmentOffset:q}},reset:O}}}),O=function(t){return void 0===t&&(t={}),{name:"inline",options:t,async fn(e){const{placement:n,elements:r,rects:i,platform:l,strategy:c}=e,{padding:a=2,x:f,y:u}=(0,o._3)(t,e),d=Array.from(await(null==l.getClientRects?void 0:l.getClientRects(r.reference))||[]),p=function(t){const e=t.slice().sort(((t,e)=>t.y-e.y)),n=[];let r=null;for(let o=0;o<e.length;o++){const t=e[o];!r||t.y-r.y>r.height/2?n.push([t]):n[n.length-1].push(t),r=t}return n.map((t=>(0,o.B1)(s(t))))}(d),m=(0,o.B1)(s(d)),h=(0,o.nI)(a);const g=await l.getElementRects({reference:{getBoundingClientRect:function(){if(2===p.length&&p[0].left>p[1].right&&null!=f&&null!=u)return p.find((t=>f>t.left-h.left&&f<t.right+h.right&&u>t.top-h.top&&u<t.bottom+h.bottom))||m;if(p.length>=2){if("y"===(0,o.TV)(n)){const t=p[0],e=p[p.length-1],r="top"===(0,o.C0)(n),i=t.top,l=e.bottom,c=r?t.left:e.left,s=r?t.right:e.right;return{top:i,bottom:l,left:c,right:s,width:s-c,height:l-i,x:c,y:i}}const t="left"===(0,o.C0)(n),e=(0,o.T9)(...p.map((t=>t.right))),r=(0,o.jk)(...p.map((t=>t.left))),i=p.filter((n=>t?n.left===r:n.right===e)),l=i[0].top,c=i[i.length-1].bottom;return{top:l,bottom:c,left:r,right:e,width:e-r,height:c-l,x:r,y:l}}return m}},floating:r.floating,strategy:c});return i.reference.x!==g.reference.x||i.reference.y!==g.reference.y||i.reference.width!==g.reference.width||i.reference.height!==g.reference.height?{reset:{rects:g}}:{}}}},q=function(t){return void 0===t&&(t={}),{options:t,fn(e){const{x:n,y:r,placement:i,rects:l,middlewareData:c}=e,{offset:s=0,mainAxis:a=!0,crossAxis:f=!0}=(0,o._3)(t,e),u={x:n,y:r},d=(0,o.TV)(i),p=(0,o.PG)(d);let m=u[p],h=u[d];const g=(0,o._3)(s,e),y="number"===typeof g?{mainAxis:g,crossAxis:0}:{mainAxis:0,crossAxis:0,...g};if(a){const t="y"===p?"height":"width",e=l.reference[p]-l.floating[t]+y.mainAxis,n=l.reference[p]+l.reference[t]-y.mainAxis;m<e?m=e:m>n&&(m=n)}if(f){var w,v;const t="y"===p?"width":"height",e=["top","left"].includes((0,o.C0)(i)),n=l.reference[d]-l.floating[t]+(e&&(null==(w=c.offset)?void 0:w[d])||0)+(e?0:y.crossAxis),r=l.reference[d]+l.reference[t]+(e?0:(null==(v=c.offset)?void 0:v[d])||0)-(e?y.crossAxis:0);h<n?h=n:h>r&&(h=r)}return{[p]:m,[d]:h}}}},_=(t,e,n)=>{const o=new Map,i={platform:R,...n},l={...i.platform,_c:o};return(async(t,e,n)=>{const{placement:o="bottom",strategy:i="absolute",middleware:l=[],platform:c}=n,s=l.filter(Boolean),a=await(null==c.isRTL?void 0:c.isRTL(e));let f=await c.getElementRects({reference:t,floating:e,strategy:i}),{x:u,y:d}=r(f,o,a),p=o,m={},h=0;for(let g=0;g<s.length;g++){const{name:n,fn:l}=s[g],{x:y,y:w,data:v,reset:x}=await l({x:u,y:d,initialPlacement:o,placement:p,strategy:i,middlewareData:m,rects:f,platform:c,elements:{reference:t,floating:e}});u=null!=y?y:u,d=null!=w?w:d,m={...m,[n]:{...m[n],...v}},x&&h<=50&&(h++,"object"===typeof x&&(x.placement&&(p=x.placement),x.rects&&(f=!0===x.rects?await c.getElementRects({reference:t,floating:e,strategy:i}):x.rects),({x:u,y:d}=r(f,p,a))),g=-1)}return{x:u,y:d,placement:p,strategy:i,middlewareData:m}})(t,e,{...i,platform:l})}},6178:(t,e,n)=>{n.d(e,{BN:()=>m,ER:()=>h,Ej:()=>y,RK:()=>w,UE:()=>b,UU:()=>g,cY:()=>p,jD:()=>v,mG:()=>x,we:()=>u});var o=n(5885),r=n(5043),i=n(7950),l="undefined"!==typeof document?r.useLayoutEffect:r.useEffect;function c(t,e){if(t===e)return!0;if(typeof t!==typeof e)return!1;if("function"===typeof t&&t.toString()===e.toString())return!0;let n,o,r;if(t&&e&&"object"===typeof t){if(Array.isArray(t)){if(n=t.length,n!==e.length)return!1;for(o=n;0!==o--;)if(!c(t[o],e[o]))return!1;return!0}if(r=Object.keys(t),n=r.length,n!==Object.keys(e).length)return!1;for(o=n;0!==o--;)if(!{}.hasOwnProperty.call(e,r[o]))return!1;for(o=n;0!==o--;){const n=r[o];if(("_owner"!==n||!t.$$typeof)&&!c(t[n],e[n]))return!1}return!0}return t!==t&&e!==e}function s(t){if("undefined"===typeof window)return 1;return(t.ownerDocument.defaultView||window).devicePixelRatio||1}function a(t,e){const n=s(t);return Math.round(e*n)/n}function f(t){const e=r.useRef(t);return l((()=>{e.current=t})),e}function u(t){void 0===t&&(t={});const{placement:e="bottom",strategy:n="absolute",middleware:u=[],platform:d,elements:{reference:p,floating:m}={},transform:h=!0,whileElementsMounted:g,open:y}=t,[w,v]=r.useState({x:0,y:0,strategy:n,placement:e,middlewareData:{},isPositioned:!1}),[x,b]=r.useState(u);c(x,u)||b(u);const[T,R]=r.useState(null),[L,E]=r.useState(null),D=r.useCallback((t=>{t!==C.current&&(C.current=t,R(t))}),[]),P=r.useCallback((t=>{t!==S.current&&(S.current=t,E(t))}),[]),k=p||T,A=m||L,C=r.useRef(null),S=r.useRef(null),j=r.useRef(w),O=null!=g,q=f(g),_=f(d),B=r.useCallback((()=>{if(!C.current||!S.current)return;const t={placement:e,strategy:n,middleware:x};_.current&&(t.platform=_.current),(0,o.rD)(C.current,S.current,t).then((t=>{const e={...t,isPositioned:!0};V.current&&!c(j.current,e)&&(j.current=e,i.flushSync((()=>{v(e)})))}))}),[x,e,n,_]);l((()=>{!1===y&&j.current.isPositioned&&(j.current.isPositioned=!1,v((t=>({...t,isPositioned:!1}))))}),[y]);const V=r.useRef(!1);l((()=>(V.current=!0,()=>{V.current=!1})),[]),l((()=>{if(k&&(C.current=k),A&&(S.current=A),k&&A){if(q.current)return q.current(k,A,B);B()}}),[k,A,B,q,O]);const z=r.useMemo((()=>({reference:C,floating:S,setReference:D,setFloating:P})),[D,P]),F=r.useMemo((()=>({reference:k,floating:A})),[k,A]),I=r.useMemo((()=>{const t={position:n,left:0,top:0};if(!F.floating)return t;const e=a(F.floating,w.x),o=a(F.floating,w.y);return h?{...t,transform:"translate("+e+"px, "+o+"px)",...s(F.floating)>=1.5&&{willChange:"transform"}}:{position:n,left:e,top:o}}),[n,h,F.floating,w.x,w.y]);return r.useMemo((()=>({...w,update:B,refs:z,elements:F,floatingStyles:I})),[w,B,z,F,I])}const d=t=>({name:"arrow",options:t,fn(e){const{element:n,padding:r}="function"===typeof t?t(e):t;return n&&(i=n,{}.hasOwnProperty.call(i,"current"))?null!=n.current?(0,o.UE)({element:n.current,padding:r}).fn(e):{}:n?(0,o.UE)({element:n,padding:r}).fn(e):{};var i}}),p=(t,e)=>({...(0,o.cY)(t),options:[t,e]}),m=(t,e)=>({...(0,o.BN)(t),options:[t,e]}),h=(t,e)=>({...(0,o.ER)(t),options:[t,e]}),g=(t,e)=>({...(0,o.UU)(t),options:[t,e]}),y=(t,e)=>({...(0,o.Ej)(t),options:[t,e]}),w=(t,e)=>({...(0,o.RK)(t),options:[t,e]}),v=(t,e)=>({...(0,o.jD)(t),options:[t,e]}),x=(t,e)=>({...(0,o.mG)(t),options:[t,e]}),b=(t,e)=>({...d(t),options:[t,e]})},81:(t,e,n)=>{n.d(e,{$t:()=>c,$u:()=>x,EW:()=>w,F2:()=>y,Go:()=>p,O_:()=>m,Pg:()=>a,RS:()=>r,WZ:()=>T,YE:()=>g,YF:()=>s,cX:()=>d,gR:()=>i,jo:()=>b,nr:()=>f,tZ:()=>h,uo:()=>l});var o=n(5702);function r(t){let e=t.activeElement;for(;null!=(null==(n=e)||null==(n=n.shadowRoot)?void 0:n.activeElement);){var n;e=e.shadowRoot.activeElement}return e}function i(t,e){if(!t||!e)return!1;const n=null==e.getRootNode?void 0:e.getRootNode();if(t.contains(e))return!0;if(n&&(0,o.Ng)(n)){let n=e;for(;n;){if(t===n)return!0;n=n.parentNode||n.host}}return!1}function l(){const t=navigator.userAgentData;return null!=t&&t.platform?t.platform:navigator.platform}function c(){const t=navigator.userAgentData;return t&&Array.isArray(t.brands)?t.brands.map((t=>{let{brand:e,version:n}=t;return e+"/"+n})).join(" "):navigator.userAgent}function s(t){return!(0!==t.mozInputSource||!t.isTrusted)||(u()&&t.pointerType?"click"===t.type&&1===t.buttons:0===t.detail&&!t.pointerType)}function a(t){return!c().includes("jsdom/")&&(!u()&&0===t.width&&0===t.height||u()&&1===t.width&&1===t.height&&0===t.pressure&&0===t.detail&&"mouse"===t.pointerType||t.width<1&&t.height<1&&0===t.pressure&&0===t.detail&&"touch"===t.pointerType)}function f(){return/apple/i.test(navigator.vendor)}function u(){const t=/android/i;return t.test(l())||t.test(c())}function d(){return l().toLowerCase().startsWith("mac")&&!navigator.maxTouchPoints}function p(t,e){const n=["mouse","pen"];return e||n.push("",void 0),n.includes(t)}function m(t){return"nativeEvent"in t}function h(t){return t.matches("html,body")}function g(t){return(null==t?void 0:t.ownerDocument)||document}function y(t,e){if(null==e)return!1;if("composedPath"in t)return t.composedPath().includes(e);const n=t;return null!=n.target&&e.contains(n.target)}function w(t){return"composedPath"in t?t.composedPath()[0]:t.target}const v="input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])";function x(t){return(0,o.sb)(t)&&t.matches(v)}function b(t){t.preventDefault(),t.stopPropagation()}function T(t){return!!t&&("combobox"===t.getAttribute("role")&&x(t))}},5702:(t,e,n)=>{function o(t){return l(t)?(t.nodeName||"").toLowerCase():"#document"}function r(t){var e;return(null==t||null==(e=t.ownerDocument)?void 0:e.defaultView)||window}function i(t){var e;return null==(e=(l(t)?t.ownerDocument:t.document)||window.document)?void 0:e.documentElement}function l(t){return t instanceof Node||t instanceof r(t).Node}function c(t){return t instanceof Element||t instanceof r(t).Element}function s(t){return t instanceof HTMLElement||t instanceof r(t).HTMLElement}function a(t){return"undefined"!==typeof ShadowRoot&&(t instanceof ShadowRoot||t instanceof r(t).ShadowRoot)}function f(t){const{overflow:e,overflowX:n,overflowY:o,display:r}=y(t);return/auto|scroll|overlay|hidden|clip/.test(e+o+n)&&!["inline","contents"].includes(r)}function u(t){return["table","td","th"].includes(o(t))}function d(t){return[":popover-open",":modal"].some((e=>{try{return t.matches(e)}catch(n){return!1}}))}function p(t){const e=h(),n=c(t)?y(t):t;return"none"!==n.transform||"none"!==n.perspective||!!n.containerType&&"normal"!==n.containerType||!e&&!!n.backdropFilter&&"none"!==n.backdropFilter||!e&&!!n.filter&&"none"!==n.filter||["transform","perspective","filter"].some((t=>(n.willChange||"").includes(t)))||["paint","layout","strict","content"].some((t=>(n.contain||"").includes(t)))}function m(t){let e=v(t);for(;s(e)&&!g(e);){if(p(e))return e;if(d(e))return null;e=v(e)}return null}function h(){return!("undefined"===typeof CSS||!CSS.supports)&&CSS.supports("-webkit-backdrop-filter","none")}function g(t){return["html","body","#document"].includes(o(t))}function y(t){return r(t).getComputedStyle(t)}function w(t){return c(t)?{scrollLeft:t.scrollLeft,scrollTop:t.scrollTop}:{scrollLeft:t.scrollX,scrollTop:t.scrollY}}function v(t){if("html"===o(t))return t;const e=t.assignedSlot||t.parentNode||a(t)&&t.host||i(t);return a(e)?e.host:e}function x(t){const e=v(t);return g(e)?t.ownerDocument?t.ownerDocument.body:t.body:s(e)&&f(e)?e:x(e)}function b(t,e,n){var o;void 0===e&&(e=[]),void 0===n&&(n=!0);const i=x(t),l=i===(null==(o=t.ownerDocument)?void 0:o.body),c=r(i);if(l){const t=T(c);return e.concat(c,c.visualViewport||[],f(i)?i:[],t&&n?b(t):[])}return e.concat(i,b(i,[],n))}function T(t){return t.parent&&Object.getPrototypeOf(t.parent)?t.frameElement:null}n.d(e,{$4:()=>v,CP:()=>w,L9:()=>y,Lv:()=>u,Ng:()=>a,Tc:()=>h,Tf:()=>d,ZU:()=>f,_m:()=>T,ep:()=>i,eu:()=>g,gJ:()=>m,mq:()=>o,sQ:()=>p,sb:()=>s,v9:()=>b,vq:()=>c,zk:()=>r})},5e3:(t,e,n)=>{n.d(e,{B1:()=>P,C0:()=>h,DD:()=>i,Dz:()=>x,Jx:()=>f,LI:()=>s,PG:()=>y,RI:()=>a,Sg:()=>g,T9:()=>c,TV:()=>v,WJ:()=>T,_3:()=>m,aD:()=>R,bV:()=>E,jk:()=>l,lP:()=>L,nI:()=>D,qE:()=>p,r_:()=>o,sq:()=>w,w7:()=>b});const o=["top","right","bottom","left"],r=["start","end"],i=o.reduce(((t,e)=>t.concat(e,e+"-"+r[0],e+"-"+r[1])),[]),l=Math.min,c=Math.max,s=Math.round,a=Math.floor,f=t=>({x:t,y:t}),u={left:"right",right:"left",bottom:"top",top:"bottom"},d={start:"end",end:"start"};function p(t,e,n){return c(t,l(e,n))}function m(t,e){return"function"===typeof t?t(e):t}function h(t){return t.split("-")[0]}function g(t){return t.split("-")[1]}function y(t){return"x"===t?"y":"x"}function w(t){return"y"===t?"height":"width"}function v(t){return["top","bottom"].includes(h(t))?"y":"x"}function x(t){return y(v(t))}function b(t,e,n){void 0===n&&(n=!1);const o=g(t),r=x(t),i=w(r);let l="x"===r?o===(n?"end":"start")?"right":"left":"start"===o?"bottom":"top";return e.reference[i]>e.floating[i]&&(l=E(l)),[l,E(l)]}function T(t){const e=E(t);return[R(t),e,R(e)]}function R(t){return t.replace(/start|end/g,(t=>d[t]))}function L(t,e,n,o){const r=g(t);let i=function(t,e,n){const o=["left","right"],r=["right","left"],i=["top","bottom"],l=["bottom","top"];switch(t){case"top":case"bottom":return n?e?r:o:e?o:r;case"left":case"right":return e?i:l;default:return[]}}(h(t),"start"===n,o);return r&&(i=i.map((t=>t+"-"+r)),e&&(i=i.concat(i.map(R)))),i}function E(t){return t.replace(/left|right|bottom|top/g,(t=>u[t]))}function D(t){return"number"!==typeof t?function(t){return{top:0,right:0,bottom:0,left:0,...t}}(t):{top:t,right:t,bottom:t,left:t}}function P(t){const{x:e,y:n,width:o,height:r}=t;return{width:o,height:r,top:n,left:e,right:e+o,bottom:n+r,x:e,y:n}}}}]);
//# sourceMappingURL=10.b7b5f228.chunk.js.map