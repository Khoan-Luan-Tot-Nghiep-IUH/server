"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[798],{57575:(e,t,s)=>{s.r(t),s.d(t,{default:()=>p});var a=s(73216),n=s(65043),i=s(60184),l=s(11768);const c=n.createContext({}),r=!0;function o(e){let{baseColor:t,highlightColor:s,width:a,height:n,borderRadius:i,circle:l,direction:c,duration:o,enableAnimation:d=r,customHighlightBackground:h}=e;const m={};return"rtl"===c&&(m["--animation-direction"]="reverse"),"number"===typeof o&&(m["--animation-duration"]=`${o}s`),d||(m["--pseudo-element-display"]="none"),"string"!==typeof a&&"number"!==typeof a||(m.width=a),"string"!==typeof n&&"number"!==typeof n||(m.height=n),"string"!==typeof i&&"number"!==typeof i||(m.borderRadius=i),l&&(m.borderRadius="50%"),"undefined"!==typeof t&&(m["--base-color"]=t),"undefined"!==typeof s&&(m["--highlight-color"]=s),"string"===typeof h&&(m["--custom-highlight-background"]=h),m}function d(e){let{count:t=1,wrapper:s,className:a,containerClassName:i,containerTestId:l,circle:d=!1,style:h,...m}=e;var x,u,p;const g=n.useContext(c),f={...m};for(const[n,c]of Object.entries(m))"undefined"===typeof c&&delete f[n];const b={...g,...f,circle:d},j={...h,...o(b)};let N="react-loading-skeleton";a&&(N+=` ${a}`);const y=null!==(x=b.inline)&&void 0!==x&&x,v=[],w=Math.ceil(t);for(let c=0;c<w;c++){let e=j;if(w>t&&c===w-1){const s=null!==(u=e.width)&&void 0!==u?u:"100%",a=t%1,n="number"===typeof s?s*a:`calc(${s} * ${a})`;e={...e,width:n}}const s=n.createElement("span",{className:N,style:e,key:c},"\u200c");y?v.push(s):v.push(n.createElement(n.Fragment,{key:c},s,n.createElement("br",null)))}return n.createElement("span",{className:i,"data-testid":l,"aria-live":"polite","aria-busy":null!==(p=b.enableAnimation)&&void 0!==p?p:r},s?v.map(((e,t)=>n.createElement(s,{key:t},e))):v)}var h=s(70579);const m=n.lazy((()=>s.e(884).then(s.bind(s,81884)))),x=n.lazy((()=>Promise.all([s.e(348),s.e(685)]).then(s.bind(s,33685)))),u=n.lazy((()=>Promise.all([s.e(348),s.e(817)]).then(s.bind(s,10817)))),p=()=>{const[e,t]=(0,n.useState)({sort:"default",busOperator:"",departureTimeRange:"",priceRange:"",pickupPoint:"",dropoffPoint:""}),[s,c]=(0,n.useState)(!0),[r,o]=(0,n.useState)(null),[p,g]=(0,n.useState)(!1),f=(0,a.zy)(),b=(0,a.Zp)();(0,n.useEffect)((()=>{(async()=>{try{setTimeout((()=>{c(!1)}),1e3)}catch(e){o("Kh\xf4ng th\u1ec3 t\u1ea3i d\u1eef li\u1ec7u"),c(!1)}})()}),[]);const j=(0,n.useCallback)((e=>{t((t=>({...t,sort:e.target.value})))}),[]),N=(0,n.useCallback)((()=>{t({sort:"default",busOperator:"",departureTimeRange:"",priceRange:"",pickupPoint:"",dropoffPoint:""})}),[]),y=(0,n.useCallback)(((e,s)=>{"clear"===e?N():t((t=>({...t,[e]:s})))}),[N]),v=new URLSearchParams(f.search),w=v.get("departureLocation"),k=v.get("arrivalLocation"),A=v.get("departureDate"),C=new Date(A),S=new Intl.DateTimeFormat("vi-VN",{weekday:"long",day:"2-digit",month:"2-digit",year:"numeric"}).format(C);return(0,h.jsxs)("div",{className:"min-h-screen",children:[(0,h.jsxs)("div",{className:"hidden sm:block",children:[(0,h.jsx)(l.A,{}),(0,h.jsx)("div",{className:"container mx-auto mb-6",children:r?(0,h.jsxs)("div",{className:"text-red-500",children:["Error: ",r]}):(0,h.jsx)(n.Suspense,{fallback:(0,h.jsx)(d,{height:150}),children:s?(0,h.jsx)(d,{height:150}):(0,h.jsx)(u,{onPopularRouteClick:(e,t)=>{const s=new URLSearchParams;s.set("departureLocation",e),s.set("arrivalLocation",t);const a=(new Date).toISOString().split("T")[0];s.set("date",a),s.set("ticketCount","1"),b(`/search-page?${s.toString()}`)}})})})]}),(0,h.jsxs)("div",{className:"block sm:hidden bg-orange-500 text-white p-4 flex items-center justify-between",children:[(0,h.jsx)("button",{onClick:()=>b(-1),className:"text-white",children:"\u2190"}),(0,h.jsxs)("div",{className:"text-center mt-4",children:[(0,h.jsxs)("h2",{className:"text-lg font-bold",children:[w," - ",k]}),(0,h.jsx)("p",{className:"text-sm",children:S})]}),(0,h.jsx)("button",{onClick:()=>g(!0),className:"text-white",children:(0,h.jsx)(i.F7,{className:"h-5 w-5"})})]}),(0,h.jsxs)("div",{className:"container mx-auto flex flex-col md:flex-row w-full max-w-6xl px-4 md:px-0",children:[p&&(0,h.jsx)("div",{className:"fixed inset-0 bg-gray-800 bg-opacity-50 z-40 flex justify-end sm:hidden",children:(0,h.jsxs)("div",{className:"w-3/4 bg-white h-full p-4 z-50",children:[(0,h.jsxs)("div",{className:"flex justify-between items-center mb-4",children:[(0,h.jsx)("h2",{className:"text-lg font-bold",children:"B\u1ed9 l\u1ecdc"}),(0,h.jsx)("button",{onClick:()=>g(!1),className:"text-gray-700",children:"\u0110\xf3ng"})]}),(0,h.jsx)(n.Suspense,{fallback:(0,h.jsx)(d,{height:40,count:6}),children:(0,h.jsx)(m,{filters:e,onSortChange:j,onFilterChange:y})})]})}),(0,h.jsx)("div",{className:"hidden md:block md:w-1/3 pr-4",children:s?(0,h.jsx)(d,{height:40,count:6}):(0,h.jsx)(n.Suspense,{fallback:(0,h.jsx)(d,{height:40,count:6}),children:(0,h.jsx)(m,{filters:e,onSortChange:j,onFilterChange:y})})}),(0,h.jsx)("div",{className:"w-full md:w-2/3",children:s?(0,h.jsx)(d,{height:150,count:5}):(0,h.jsx)(n.Suspense,{fallback:(0,h.jsx)(d,{height:150,count:5}),children:(0,h.jsx)(x,{filters:e})})})]})]})}},11768:(e,t,s)=>{s.d(t,{A:()=>N});var a=s(65043),n=s(73216),i=s(35475),l=s(83003),c=s(31906),r=s(29718),o=s(62153),d=s(26399),h=s(19474),m=s(36400),x=s(19014),u=s(41682),p=s(11568),g=s(66062);s(83910);const f=s.p+"static/media/logo.f3bb5b8495dc1d221a6b.JPG";var b=s(70579);const j=()=>{const e=(0,l.wA)(),t=(0,n.Zp)(),s=(0,n.zy)(),j=(0,l.d4)((e=>e.user.userInfo)),[N,y]=(0,a.useState)(!1),[v,w]=(0,a.useState)(!1),[k,A]=(0,a.useState)(!1),C=(0,a.useRef)(),S=(0,a.useRef)();(0,a.useEffect)((()=>{const e=e=>{C.current&&!C.current.contains(e.target)&&w(!1),S.current&&!S.current.contains(e.target)&&A(!1)};return document.addEventListener("mousedown",e),()=>{document.removeEventListener("mousedown",e)}}),[]);const R={superadmin:[{name:"Qu\u1ea3n l\xfd h\u1ec7 th\u1ed1ng",path:"/superadmin/dashboard",icon:r.A}],companyadmin:[{name:"Qu\u1ea3n l\xfd nh\xe0 xe",path:"/companyadmin/dashboard",icon:r.A},{name:"Qu\u1ea3n l\xfd chuy\u1ebfn \u0111i",path:"/companyadmin/trip",icon:o.A}],staff:[{name:"Qu\u1ea3n l\xfd nh\xe2n vi\xean",path:"/staff/dashboard",icon:r.A},{name:"H\u1ed7 tr\u1ee3 kh\xe1ch h\xe0ng",path:"/staff/support",icon:d.A}],user:[{name:"Th\xf4ng tin t\xe0i kho\u1ea3n",path:"/user/profile",icon:r.A},{name:"\u0110\u01a1n h\xe0ng c\u1ee7a t\xf4i",path:"/user/ticket-buy",icon:o.A},{name:"\u01afu \u0111\xe3i",path:"/user/offers",icon:o.A},{name:"Nh\u1eadn x\xe9t chuy\u1ebfn \u0111i",path:"/user/reviews",icon:h.A},{name:"\u0110\u1ed5i m\u1eadt kh\u1ea9u",path:"/user/change-password",icon:m.A}]},E=[{name:"Trang ch\u1ee7",path:"/",icon:x.A},{name:"T\xe0i kho\u1ea3n c\u1ee7a t\xf4i",path:"/user/profile",icon:r.A},{name:"\u01afu \u0111\xe3i c\u1ee7a t\xf4i",path:"/user/offers",icon:o.A}],z=[{name:"M\u1edf b\xe1n t\u1ea1i VeXeOnline",path:"/mo-ban-ve-xe",icon:o.A},{name:"V\u1ec1 VeXeOnline",path:"/about",icon:x.A},{name:"Gi\u1edbi thi\u1ec7u",path:"/gioi-thieu",icon:h.A}];return(0,b.jsx)("header",{className:"bg-blue-600 shadow-md  top-0 w-full z-50",children:(0,b.jsxs)("div",{className:"container mx-auto flex justify-between items-center px-4 py-3",children:[(0,b.jsx)("button",{onClick:()=>y(!N),className:"text-white md:hidden",children:N?(0,b.jsx)(u.A,{className:"h-6 w-6"}):(0,b.jsx)(p.A,{className:"h-6 w-6"})}),(0,b.jsx)("div",{className:"flex items-center space-x-4",children:(0,b.jsxs)(i.N_,{to:"/",className:"flex items-center space-x-2",children:[(0,b.jsx)("img",{src:f,alt:"Logo",className:"h-12 w-auto rounded-lg"}),(0,b.jsx)("span",{className:"hidden md:block text-white text-sm font-medium",children:"Cam k\u1ebft ho\xe0n 150% n\u1ebfu nh\xe0 xe kh\xf4ng cung c\u1ea5p d\u1ecbch v\u1ee5 v\u1eadn chuy\u1ec3n (*)"})]})}),(0,b.jsxs)("div",{className:"hidden md:flex items-center space-x-6",children:[[{name:"\u0110\u01a1n h\xe0ng c\u1ee7a t\xf4i",path:"/user/ticket-buy"},{name:"M\u1edf b\xe1n v\xe9",path:"/mo-ban-ve-xe"}].map((e=>(0,b.jsx)(i.N_,{to:e.path,className:"text-white hover:text-gray-300",children:e.name},e.name))),(0,b.jsxs)("div",{className:"relative",ref:C,children:[(0,b.jsx)("div",{className:"flex align-center",style:{border:"1px solid gray",borderRadius:"6px",backgroundColor:"white"},children:(0,b.jsxs)("button",{onClick:()=>w(!v),className:"flex items-center w-[130px] h-[36px] justify-center space-x-1 text-black",children:[(0,b.jsx)(d.A,{className:"h-5 w-5"}),(0,b.jsx)("span",{children:"Hotline 24/7"})]})}),v&&(0,b.jsx)("div",{className:"absolute right-0 mt-2 w-80 bg-white text-black shadow-lg rounded-md p-4 z-50",children:(0,b.jsxs)("div",{className:"text-sm font-medium",children:[(0,b.jsxs)("div",{className:"py-1",children:[(0,b.jsx)("span",{style:{color:"blue"},children:"0387097651 "})," - ",(0,b.jsx)("span",{children:"Admin (07:00 - 23:00)"})]}),(0,b.jsxs)("div",{className:"py-1",children:[(0,b.jsx)("span",{style:{color:"blue"},children:"0387097651 "})," - ",(0,b.jsx)("span",{children:"Admin (07:00 - 23:00)"})]}),(0,b.jsxs)("div",{className:"py-1",children:[(0,b.jsx)("span",{style:{color:"blue"},children:"0387097651 "})," - ",(0,b.jsx)("span",{children:"Admin (07:00 - 23:00)"})]})]})})]}),j?(0,b.jsxs)("div",{className:"relative",ref:S,children:[(0,b.jsxs)("button",{onClick:()=>A(!k),className:"flex items-center space-x-2 text-white",children:[(0,b.jsx)(r.A,{className:"h-8 w-8"}),(0,b.jsx)("span",{children:j.fullName})]}),k&&(0,b.jsxs)("div",{className:"absolute right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-md",children:[(R[j.roleId]||[]).map((e=>(0,b.jsxs)(i.N_,{to:e.path,className:"block flex px-4 py-2 text-sm hover:bg-gray-100",children:[(0,b.jsx)(e.icon,{className:"h-5 w-5 mr-2 text-gray-600"}),e.name]},e.name))),(0,b.jsxs)("button",{onClick:()=>{e((0,c.ri)()),t("/"),y(!1)},className:"block w-full flex text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100",children:[(0,b.jsx)(g.A,{className:"h-5 w-5 mr-2"}),"\u0110\u0103ng xu\u1ea5t"]})]})]}):(0,b.jsx)(i.N_,{to:"/login",className:"text-white hover:text-gray-300",onClick:e=>{e.preventDefault(),t("/login",{state:{from:s}})},children:"\u0110\u0103ng nh\u1eadp/\u0110\u0103ng k\xfd"})]}),(0,b.jsxs)("div",{className:`fixed inset-y-0 left-0 transform ${N?"translate-x-0":"-translate-x-full"} w-64 bg-white transition-transform duration-300 ease-in-out overflow-y-auto md:hidden z-50`,children:[(0,b.jsxs)("div",{className:"flex items-center p-4 border-b",children:[(0,b.jsxs)("button",{className:"flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 rounded",children:[(0,b.jsx)("img",{src:"/vietnam-flag.png",alt:"VN",className:"w-6 h-4"}),(0,b.jsx)("span",{className:"text-gray-700",children:"Ti\u1ebfng Vi\u1ec7t"})]}),(0,b.jsxs)("button",{className:"flex items-center space-x-2 px-2 py-1 ml-2 hover:bg-gray-100 rounded",children:[(0,b.jsx)("img",{src:"/uk-flag.png",alt:"EN",className:"w-6 h-4"}),(0,b.jsx)("span",{className:"text-gray-700",children:"English"})]})]}),(0,b.jsxs)("nav",{className:"px-2 py-4",children:[E.map((e=>(0,b.jsxs)(i.N_,{to:e.path,className:"flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg",onClick:()=>y(!1),children:[(0,b.jsx)(e.icon,{className:"h-5 w-5 text-blue-600"}),(0,b.jsx)("span",{children:e.name})]},e.name))),(0,b.jsx)("div",{className:"border-t border-gray-200 mt-4 pt-4",children:z.map((e=>(0,b.jsxs)(i.N_,{to:e.path,className:"flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg",onClick:()=>y(!1),children:[(0,b.jsx)(e.icon,{className:"h-5 w-5 text-blue-600"}),(0,b.jsx)("span",{children:e.name})]},e.name)))})]})]}),N&&(0,b.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50 md:hidden z-40",onClick:()=>y(!1)})]})})},N=a.memo(j)}}]);
//# sourceMappingURL=798.3f6186cc.chunk.js.map