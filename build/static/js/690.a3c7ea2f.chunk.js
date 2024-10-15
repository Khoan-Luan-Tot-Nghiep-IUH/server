"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[690,15],{1690:(e,t,r)=>{r.r(t),r.d(t,{default:()=>b});var s=r(5043);function a(e,t){let{title:r,titleId:a,...n}=e;return s.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":a},n),r?s.createElement("title",{id:a},r):null,s.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m19.5 8.25-7.5 7.5-7.5-7.5"}))}const n=s.forwardRef(a);function i(e,t){let{title:r,titleId:a,...n}=e;return s.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":a},n),r?s.createElement("title",{id:a},r):null,s.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m8.25 4.5 7.5 7.5-7.5 7.5"}))}const l=s.forwardRef(i);var o=r(579);const c=e=>{let{onFilterChange:t}=e;const[r,a]=(0,s.useState)({departureTime:!1,busOperator:!1,priceRange:!1}),i=e=>{a((t=>({...t,[e]:!t[e]})))};return(0,o.jsxs)("div",{className:"filter-sidebar p-4 shadow-xl bg-white rounded-3xl sticky top-4 h-[calc(100vh-50px)] overflow-y-auto border border-gray-200",children:[(0,o.jsx)("h3",{className:"text-xl font-extrabold text-gray-900 mb-6",children:"B\u1ed9 l\u1ecdc"}),(0,o.jsxs)("div",{className:"space-y-4 mb-6 bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200",children:[(0,o.jsx)("h4",{className:"text-lg font-semibold text-gray-800",children:"S\u1eafp x\u1ebfp"}),[{value:"default",label:"M\u1eb7c \u0111\u1ecbnh"},{value:"earliest",label:"Gi\u1edd \u0111i s\u1edbm nh\u1ea5t"},{value:"latest",label:"Gi\u1edd \u0111i mu\u1ed9n nh\u1ea5t"},{value:"priceAsc",label:"Gi\xe1 t\u0103ng d\u1ea7n"},{value:"priceDesc",label:"Gi\xe1 gi\u1ea3m d\u1ea7n"}].map((e=>{let{value:r,label:s}=e;return(0,o.jsxs)("label",{className:"flex items-center space-x-3 cursor-pointer transition hover:bg-gray-100 rounded-lg p-2",children:[(0,o.jsx)("input",{type:"radio",name:"sort",value:r,onChange:e=>t("sort",e.target.value),className:"form-radio h-5 w-5 text-blue-600 focus:ring-blue-500"}),(0,o.jsx)("span",{className:"text-gray-700",children:s})]},r)}))]}),(0,o.jsx)("hr",{className:"my-6"}),(0,o.jsxs)("div",{className:"space-y-6",children:[(0,o.jsxs)("div",{className:"bg-white p-4 rounded-lg shadow-md border border-gray-200",children:[(0,o.jsxs)("h4",{onClick:()=>i("departureTime"),className:"text-lg font-semibold text-gray-800 mb-2 cursor-pointer flex justify-between items-center",children:["Gi\u1edd \u0111i",r.departureTime?(0,o.jsx)(n,{className:"h-5 w-5 text-gray-600"}):(0,o.jsx)(l,{className:"h-5 w-5 text-gray-600"})]}),r.departureTime&&(0,o.jsxs)("select",{className:"w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500",onChange:e=>t("departureTimeRange",e.target.value),children:[(0,o.jsx)("option",{value:"",children:"T\u1ea5t c\u1ea3"}),(0,o.jsx)("option",{value:"morning",children:"Bu\u1ed5i s\xe1ng"}),(0,o.jsx)("option",{value:"afternoon",children:"Bu\u1ed5i chi\u1ec1u"})]})]}),(0,o.jsxs)("div",{className:"bg-white p-4 rounded-lg shadow-md border border-gray-200",children:[(0,o.jsxs)("h4",{onClick:()=>i("busOperator"),className:"text-lg font-semibold text-gray-800 mb-2 cursor-pointer flex justify-between items-center",children:["Nh\xe0 xe",r.busOperator?(0,o.jsx)(n,{className:"h-5 w-5 text-gray-600"}):(0,o.jsx)(l,{className:"h-5 w-5 text-gray-600"})]}),r.busOperator&&(0,o.jsxs)("select",{className:"w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500",onChange:e=>t("busOperator",e.target.value),children:[(0,o.jsx)("option",{value:"",children:"T\u1ea5t c\u1ea3"}),(0,o.jsx)("option",{value:"Vie Limousine",children:"Vie Limousine"}),(0,o.jsx)("option",{value:"Th\xe0nh B\u01b0\u1edfi",children:"Th\xe0nh B\u01b0\u1edfi"})]})]}),(0,o.jsxs)("div",{className:"bg-white p-4 rounded-lg shadow-md border border-gray-200",children:[(0,o.jsxs)("h4",{onClick:()=>i("priceRange"),className:"text-lg font-semibold text-gray-800 mb-2 cursor-pointer flex justify-between items-center",children:["Gi\xe1 v\xe9",r.priceRange?(0,o.jsx)(n,{className:"h-5 w-5 text-gray-600"}):(0,o.jsx)(l,{className:"h-5 w-5 text-gray-600"})]}),r.priceRange&&(0,o.jsxs)("select",{className:"w-full p-3 border border-gray-300 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500",onChange:e=>t("priceRange",e.target.value),children:[(0,o.jsx)("option",{value:"",children:"T\u1ea5t c\u1ea3"}),(0,o.jsx)("option",{value:"low",children:"D\u01b0\u1edbi 200.000"}),(0,o.jsx)("option",{value:"medium",children:"200.000 - 500.000"}),(0,o.jsx)("option",{value:"high",children:"Tr\xean 500.000"})]})]}),(0,o.jsx)("div",{className:"flex justify-end",children:(0,o.jsx)("button",{className:"px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition",onClick:()=>t("clear",""),children:"X\xf3a l\u1ecdc"})})]})]})};var d=r(6015),u=r(4674),m=r(1768);const h=s.createContext({}),x=!0;function p(e){let{baseColor:t,highlightColor:r,width:s,height:a,borderRadius:n,circle:i,direction:l,duration:o,enableAnimation:c=x,customHighlightBackground:d}=e;const u={};return"rtl"===l&&(u["--animation-direction"]="reverse"),"number"===typeof o&&(u["--animation-duration"]=`${o}s`),c||(u["--pseudo-element-display"]="none"),"string"!==typeof s&&"number"!==typeof s||(u.width=s),"string"!==typeof a&&"number"!==typeof a||(u.height=a),"string"!==typeof n&&"number"!==typeof n||(u.borderRadius=n),i&&(u.borderRadius="50%"),"undefined"!==typeof t&&(u["--base-color"]=t),"undefined"!==typeof r&&(u["--highlight-color"]=r),"string"===typeof d&&(u["--custom-highlight-background"]=d),u}function g(e){let{count:t=1,wrapper:r,className:a,containerClassName:n,containerTestId:i,circle:l=!1,style:o,...c}=e;var d,u,m;const g=s.useContext(h),b={...c};for(const[s,h]of Object.entries(c))"undefined"===typeof h&&delete b[s];const f={...g,...b,circle:l},v={...o,...p(f)};let j="react-loading-skeleton";a&&(j+=` ${a}`);const y=null!==(d=f.inline)&&void 0!==d&&d,N=[],w=Math.ceil(t);for(let h=0;h<w;h++){let e=v;if(w>t&&h===w-1){const r=null!==(u=e.width)&&void 0!==u?u:"100%",s=t%1,a="number"===typeof r?r*s:`calc(${r} * ${s})`;e={...e,width:a}}const r=s.createElement("span",{className:j,style:e,key:h},"\u200c");y?N.push(r):N.push(s.createElement(s.Fragment,{key:h},r,s.createElement("br",null)))}return s.createElement("span",{className:n,"data-testid":i,"aria-live":"polite","aria-busy":null!==(m=f.enableAnimation)&&void 0!==m?m:x},r?N.map(((e,t)=>s.createElement(r,{key:t},e))):N)}const b=()=>{const[e,t]=(0,s.useState)({sort:"default",busOperator:"",departureTimeRange:"",priceRange:"",pickupPoint:"",dropoffPoint:""}),[r,a]=(0,s.useState)(!0);s.useEffect((()=>{setTimeout((()=>{a(!1)}),1e3)}),[]);return(0,o.jsxs)("div",{children:[(0,o.jsx)(m.A,{}),(0,o.jsxs)("div",{className:"min-h-screen w-full max-w-6xl mx-auto",children:[(0,o.jsx)("div",{className:"w-full mx-auto mb-6",children:r?(0,o.jsx)(g,{height:150}):(0,o.jsx)(u.A,{})}),(0,o.jsxs)("div",{className:"flex w-full",children:[(0,o.jsx)("div",{className:"w-1/4 pr-4",children:r?(0,o.jsxs)("div",{children:[(0,o.jsx)(g,{height:40,count:6})," "]}):(0,o.jsx)(c,{onSortChange:e=>{t((t=>({...t,sort:e.target.value})))},onFilterChange:(e,r)=>{t("clear"===e?{sort:"default",busOperator:"",departureTimeRange:"",priceRange:"",pickupPoint:"",dropoffPoint:""}:t=>({...t,[e]:r}))}})}),(0,o.jsx)("div",{className:"w-3/4",children:r?(0,o.jsxs)("div",{children:[(0,o.jsx)(g,{height:150,count:5})," "]}):(0,o.jsx)(d.default,{filters:e})})]})]})]})}},6015:(e,t,r)=>{r.r(t),r.d(t,{default:()=>d});var s=r(5043),a=r(3216),n=r(5868),i=r(254),l=r(579);const o=e=>{let{trip:t}=e;return(0,l.jsxs)("div",{className:"border p-4 rounded-lg shadow-md bg-white transition hover:shadow-lg flex justify-between items-center mb-4 hover:scale-105 transform transition-transform duration-300 ease-in-out",children:[(0,l.jsxs)("div",{className:"flex items-center",children:[(0,l.jsxs)("div",{className:"relative flex-shrink-0",children:[(0,l.jsx)("img",{src:"https://static.vexere.com/production/images/1702527338553.jpeg?w=250&h=250",alt:"Bus type",className:"w-24 h-24 object-cover rounded-md"}),(0,l.jsx)("div",{className:"absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded-lg",children:"X\xe1c nh\u1eadn t\u1ee9c th\xec"})]}),(0,l.jsxs)("div",{className:"ml-6",children:[(0,l.jsx)("h3",{className:"text-lg font-semibold text-blue-600",children:t.busType.name}),(0,l.jsxs)("p",{className:"text-sm text-gray-500 mb-1",children:["Limousine ",t.busType.seats," ch\u1ed7"]}),(0,l.jsxs)("div",{className:"flex items-center text-sm text-gray-700 mb-2",children:[(0,l.jsxs)("p",{className:"mr-4",children:[(0,l.jsx)("span",{className:"font-semibold",children:"Gi\u1edd \u0111i: "}),new Date(t.departureTime).toLocaleTimeString()]}),(0,l.jsxs)("p",{children:[(0,l.jsx)("span",{className:"font-semibold",children:"Gi\u1edd \u0111\u1ebfn: "}),new Date(t.arrivalTime).toLocaleTimeString()]})]}),(0,l.jsxs)("p",{className:"text-sm mb-1",children:[(0,l.jsx)("span",{className:"font-semibold",children:"N\u01a1i \u0111i: "}),t.departureLocation.name]}),(0,l.jsxs)("p",{className:"text-sm mb-1",children:[(0,l.jsx)("span",{className:"font-semibold",children:"N\u01a1i \u0111\u1ebfn: "}),t.arrivalLocation.name]}),(0,l.jsxs)("p",{className:"text-sm text-green-600 font-semibold",children:["C\xf2n ",t.availableSeats," ch\u1ed7 tr\u1ed1ng"]})]})]}),(0,l.jsxs)("div",{className:"text-right",children:[(0,l.jsx)("div",{className:"mb-2",children:(0,l.jsxs)("span",{className:"text-xl font-bold text-blue-600",children:["T\u1eeb ",(0,i.v)(t.basePrice)," VND"]})}),t.discount&&(0,l.jsxs)("div",{className:"text-green-500 text-sm mb-2",children:["Gi\u1ea3m ",t.discount,"%"]}),(0,l.jsx)("button",{className:"bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300 text-lg",children:"Ch\u1ecdn chuy\u1ebfn"}),(0,l.jsx)("p",{className:"text-xs text-gray-500 mt-2",children:"KH\xd4NG C\u1ea6N THANH TO\xc1N TR\u01af\u1edaC"})]})]})};var c=r(6181);const d=e=>{let{filters:t}=e;const{state:r}=(0,a.zy)(),{departureLocation:i,arrivalLocation:d,departureDate:u,returnDate:m,ticketCount:h}=r||{},[x,p]=(0,s.useState)([]),[g,b]=(0,s.useState)([]),[f,v]=(0,s.useState)(!0),{data:j,error:y,isLoading:N}=(0,n.pg)({departureLocation:i,arrivalLocation:d,departureDate:u,returnDate:m,ticketCount:h});return(0,s.useEffect)((()=>{var e;null!==j&&void 0!==j&&null!==(e=j.data)&&void 0!==e&&e.departureTrips&&(b(j.data.departureTrips),p(j.data.departureTrips))}),[j]),(0,s.useEffect)((()=>{v(!0);const e=setTimeout((()=>{(()=>{let e=[...g];"low"===t.priceRange?e=e.filter((e=>e.basePrice<2e5)):"medium"===t.priceRange?e=e.filter((e=>e.basePrice>=2e5&&e.basePrice<=5e5)):"high"===t.priceRange&&(e=e.filter((e=>e.basePrice>5e5))),t.busOperator&&(e=e.filter((e=>{var r;return(null===(r=e.busType)||void 0===r?void 0:r.name)===t.busOperator}))),"morning"===t.departureTimeRange?e=e.filter((e=>{const t=new Date(e.departureTime).getHours();return t>=6&&t<12})):"afternoon"===t.departureTimeRange&&(e=e.filter((e=>{const t=new Date(e.departureTime).getHours();return t>=12&&t<18}))),"priceAsc"===t.sort?e.sort(((e,t)=>e.basePrice-t.basePrice)):"priceDesc"===t.sort?e.sort(((e,t)=>t.basePrice-e.basePrice)):"earliest"===t.sort?e.sort(((e,t)=>new Date(e.departureTime)-new Date(t.departureTime))):"latest"===t.sort&&e.sort(((e,t)=>new Date(t.departureTime)-new Date(e.departureTime))),p(e),v(!1)})()}),500);return()=>clearTimeout(e)}),[t,g]),f||N?(0,l.jsxs)("div",{className:"container mx-auto py-8",children:[(0,l.jsx)(c.A,{})," "]}):y?(0,l.jsxs)("div",{children:["Kh\xf4ng t\xecm th\u1ea5y chuy\u1ebfn xe. L\u1ed7i: ",y.message]}):0===x.length?(0,l.jsx)("div",{children:"Kh\xf4ng t\xecm th\u1ea5y chuy\u1ebfn xe n\xe0o ph\xf9 h\u1ee3p v\u1edbi y\xeau c\u1ea7u t\xecm ki\u1ebfm c\u1ee7a b\u1ea1n."}):(0,l.jsxs)("div",{className:"container mx-auto py-8",children:[(0,l.jsx)("h2",{className:"text-2xl font-bold mb-4",children:"K\u1ebft qu\u1ea3 t\xecm ki\u1ebfm chuy\u1ebfn xe"}),(0,l.jsx)("div",{className:"space-y-4",children:x.map((e=>(0,l.jsx)(o,{trip:e},e._id)))})]})}},254:(e,t,r)=>{r.d(t,{D:()=>n,v:()=>i});var s=r(4348),a=r.n(s);const n={parseUTCTimeForForm:e=>e?new Date(e):new Date,formatTimeForServer:e=>e?a()(e).utc().format():null,formatDisplayTime:e=>e?a()(e).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm"):""},i=e=>e?new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(e):"0 VND"}}]);
//# sourceMappingURL=690.a3c7ea2f.chunk.js.map