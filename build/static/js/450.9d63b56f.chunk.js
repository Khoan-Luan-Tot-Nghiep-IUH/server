/*! For license information please see 450.9d63b56f.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[450],{4674:(e,t,a)=>{a.d(t,{A:()=>y});var r=a(5043);function n(e,t){let{title:a,titleId:n,...s}=e;return r.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":"true","data-slot":"icon",ref:t,"aria-labelledby":n},s),a?r.createElement("title",{id:n},a):null,r.createElement("path",{fillRule:"evenodd",d:"M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z",clipRule:"evenodd"}))}const s=r.forwardRef(n);var i=a(3216);const l=function(){for(var e=arguments.length,t=new Array(e),a=0;a<e;a++)t[a]=arguments[a];return t.filter(((e,t,a)=>Boolean(e)&&a.indexOf(e)===t)).join(" ")};var o={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};const c=(0,r.forwardRef)(((e,t)=>{let{color:a="currentColor",size:n=24,strokeWidth:s=2,absoluteStrokeWidth:i,className:c="",children:d,iconNode:h,...x}=e;return(0,r.createElement)("svg",{ref:t,...o,width:n,height:n,stroke:a,strokeWidth:i?24*Number(s)/Number(n):s,className:l("lucide",c),...x},[...h.map((e=>{let[t,a]=e;return(0,r.createElement)(t,a)})),...Array.isArray(d)?d:[d]])})),d=((e,t)=>{const a=(0,r.forwardRef)(((a,n)=>{let{className:s,...i}=a;return(0,r.createElement)(c,{ref:n,iconNode:t,className:l(`lucide-${o=e,o.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase()}`,s),...i});var o}));return a.displayName=`${e}`,a})("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);var h=a(4348),x=a.n(h),u=a(579);const m=e=>{let{label:t,selectedDate:a,onDateChange:n}=e;const[s,i]=(0,r.useState)(!1),l=new Date;l.setHours(0,0,0,0);const[o,c]=(0,r.useState)(a||l),h=o.getMonth(),m=o.getFullYear(),g=(e,t)=>e===l.getFullYear()&&t===l.getMonth(),v=e=>a&&e.getDate()===a.getDate()&&e.getMonth()===a.getMonth()&&e.getFullYear()===a.getFullYear();return(0,u.jsxs)("div",{className:"relative w-full md:flex-1",children:[(0,u.jsx)("div",{className:"mb-1",children:(0,u.jsx)("label",{className:"block text-sm font-medium text-gray-700",children:t})}),(0,u.jsx)("div",{className:"border border-blue-300 rounded-lg p-2 cursor-pointer h-[42px] hover:border-blue-500 transition duration-200 ease-in-out",onClick:()=>i(!s),children:(0,u.jsx)("input",{type:"text",className:"outline-none w-full text-gray-700",value:a?x()(a).format("DD/MM/YYYY"):"",readOnly:!0,placeholder:"Ch\u1ecdn ng\xe0y"})}),s&&(0,u.jsxs)("div",{className:"absolute left-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-4",style:{minWidth:"320px"},children:[(0,u.jsxs)("div",{className:"flex justify-between items-center mb-4",children:[(0,u.jsx)("button",{className:"text-gray-600 p-1 rounded-full hover:bg-gray-200 transition duration-200 ease-in-out "+(g(m,h)?"invisible":""),onClick:e=>{e.stopPropagation(),g(m,h)||c(new Date(m,h-1))},children:"<"}),(0,u.jsxs)("div",{className:"font-medium text-gray-700",children:["TH\xc1NG ",h+1,"/",m]}),(0,u.jsx)("button",{className:"text-gray-600 p-1 rounded-full hover:bg-gray-200 transition duration-200 ease-in-out",onClick:e=>{e.stopPropagation(),c(new Date(m,h+1))},children:(0,u.jsx)(d,{size:20})})]}),(0,u.jsx)("div",{className:"grid grid-cols-7 mb-2",children:["CN","T2","T3","T4","T5","T6","T7"].map((e=>(0,u.jsx)("div",{className:"text-center text-sm text-gray-500 h-10 flex items-center justify-center",children:e},e)))}),(0,u.jsx)("div",{className:"grid grid-cols-7 gap-[1px] bg-gray-100",children:(()=>{const e=new Date(m,h+1,0).getDate();const t=new Date(m,h,1).getDay(),a=Array.from({length:e},((e,t)=>({day:t+1,date:new Date(m,h,t+1)})));return[...Array(0===t?0:t).fill(null),...a]})().map(((e,t)=>{const a=null===e||e.date<l;const r=e&&(e=>e.getDate()===l.getDate()&&e.getMonth()===l.getMonth()&&e.getFullYear()===l.getFullYear())(e.date)?"bg-yellow-100 border border-yellow-500":"";return(0,u.jsx)("div",{className:`h-10 w-10 flex items-center justify-center rounded-sm \n                    ${e?v(e.date)?"bg-blue-100 border border-blue-500":"bg-white":""}\n                    ${a?"text-gray-300 cursor-not-allowed":`hover:bg-blue-50 cursor-pointer transition duration-150 ease-in-out ${r}`}\n                  `,onClick:t=>{t.stopPropagation(),!a&&e&&(n(e.date),i(!1))},children:e?e.day:""},t)}))})]})]})};var g=a(9052),v=a(6181);const p=e=>{let{label:t,value:a,onChange:r,options:n,placeholder:s,iconClass:i}=e;return(0,u.jsxs)("div",{className:"relative w-full md:flex-1",children:[(0,u.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:t}),(0,u.jsxs)("div",{className:"relative flex items-center border-2 rounded-lg shadow-md py-2 px-4 bg-white",children:[(0,u.jsx)("span",{className:`mr-2 ${i}`}),(0,u.jsxs)("select",{value:a,onChange:r,className:"flex-grow focus:outline-none bg-transparent","aria-label":t,children:[(0,u.jsx)("option",{value:"",children:s}),(0,u.jsx)("optgroup",{label:"\u0110\u1ecba \u0111i\u1ec3m ph\u1ed5 bi\u1ebfn",children:null===n||void 0===n?void 0:n.map((e=>(0,u.jsx)("option",{value:e.name,children:e.name},e._id)))})]}),(0,u.jsx)("span",{className:"ml-2 fas fa-chevron-down text-gray-500"})]})]})},N=()=>{const[e,t]=(0,r.useState)((()=>localStorage.getItem("fromLocation")||"")),[a,n]=(0,r.useState)((()=>localStorage.getItem("toLocation")||"")),[l,o]=(0,r.useState)((()=>localStorage.getItem("ticketType")||"oneWay")),[c,d]=(0,r.useState)((()=>{const e=localStorage.getItem("ticketQuantity");return e?parseInt(e,10):1})),[h,N]=(0,r.useState)(!1),y=e=>e&&!isNaN(Date.parse(e))?new Date(e):null,[j,f]=(0,r.useState)((()=>y(localStorage.getItem("departureDate")))),[b,w]=(0,r.useState)((()=>y(localStorage.getItem("returnDate")))),{data:k,isLoading:D,error:C}=(0,g.eg)(),I=(0,i.Zp)();(0,r.useEffect)((()=>{localStorage.setItem("fromLocation",e)}),[e]),(0,r.useEffect)((()=>{localStorage.setItem("toLocation",a)}),[a]),(0,r.useEffect)((()=>{localStorage.setItem("ticketType",l)}),[l]),(0,r.useEffect)((()=>{Number.isInteger(c)&&c>0&&localStorage.setItem("ticketQuantity",c.toString())}),[c]),(0,r.useEffect)((()=>{j&&j instanceof Date&&!isNaN(j)?localStorage.setItem("departureDate",j.toISOString()):localStorage.removeItem("departureDate")}),[j]),(0,r.useEffect)((()=>{b&&b instanceof Date&&!isNaN(b)?localStorage.setItem("returnDate",b.toISOString()):localStorage.removeItem("returnDate")}),[b]);return h||D?(0,u.jsx)(v.A,{}):C?(0,u.jsx)("div",{children:"L\u1ed7i khi t\u1ea3i \u0111\u1ecba \u0111i\u1ec3m"}):(0,u.jsx)("section",{children:(0,u.jsx)("div",{children:(0,u.jsxs)("div",{className:"bg-white shadow-lg rounded-lg p-6 space-y-4",children:[(0,u.jsxs)("div",{className:"flex justify-between",children:[(0,u.jsxs)("div",{className:"flex space-x-6",children:[(0,u.jsxs)("label",{className:"flex items-center",children:[(0,u.jsx)("input",{type:"radio",name:"ticketType",value:"oneWay",checked:"oneWay"===l,onChange:e=>o(e.target.value),className:"form-radio text-blue-600"}),(0,u.jsx)("span",{className:"ml-2",children:"M\u1ed9t chi\u1ec1u"})]}),(0,u.jsxs)("label",{className:"flex items-center",children:[(0,u.jsx)("input",{type:"radio",name:"ticketType",value:"roundTrip",checked:"roundTrip"===l,onChange:e=>o(e.target.value),className:"form-radio text-blue-600"}),(0,u.jsx)("span",{className:"ml-2",children:"Kh\u1ee9 h\u1ed3i"})]})]}),(0,u.jsx)("a",{href:"#",className:"text-orange-500 text-sm hover:underline",children:"H\u01b0\u1edbng d\u1eabn mua v\xe9"})]}),(0,u.jsxs)("div",{className:"flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4",children:[(0,u.jsx)(p,{label:"N\u01a1i xu\u1ea5t ph\xe1t",value:e,onChange:e=>t(e.target.value),placeholder:"Ch\u1ecdn n\u01a1i xu\u1ea5t ph\xe1t",iconClass:"fas fa-circle text-blue-500",options:null===k||void 0===k?void 0:k.data}),(0,u.jsx)("div",{className:"relative flex justify-center items-center",children:(0,u.jsx)("button",{className:"bg-gray-100 text-gray-600 p-3 rounded-full hover:bg-gray-300 focus:outline-none shadow-md transition duration-300 ease-in-out",onClick:()=>{const r=e;t(a),n(r)},"aria-label":"Ho\xe1n \u0111\u1ed5i v\u1ecb tr\xed",children:(0,u.jsx)(s,{className:"h-6 w-6"})})}),(0,u.jsx)(p,{label:"N\u01a1i \u0111\u1ebfn",value:a,onChange:e=>n(e.target.value),placeholder:"Ch\u1ecdn n\u01a1i \u0111\u1ebfn",iconClass:"fas fa-map-marker-alt text-red-500",options:null===k||void 0===k?void 0:k.data}),(0,u.jsx)(m,{label:"Ng\xe0y \u0111i",selectedDate:j,onDateChange:e=>f(e)}),"roundTrip"===l&&(0,u.jsx)(m,{label:"Ng\xe0y v\u1ec1",selectedDate:b,onDateChange:e=>w(e)}),(0,u.jsxs)("div",{className:"relative w-full md:flex-1",children:[(0,u.jsx)("label",{className:"block text-sm font-medium text-gray-700 mb-1",children:"S\u1ed1 l\u01b0\u1ee3ng v\xe9"}),(0,u.jsx)("div",{className:"border rounded-lg py-2 px-4",children:(0,u.jsxs)("select",{value:c,onChange:e=>d(parseInt(e.target.value)),className:"w-full focus:outline-none","aria-label":"S\u1ed1 v\xe9",children:[(0,u.jsx)("option",{value:1,children:"1 v\xe9"}),(0,u.jsx)("option",{value:2,children:"2 v\xe9"}),(0,u.jsx)("option",{value:3,children:"3 v\xe9"}),(0,u.jsx)("option",{value:4,children:"4 v\xe9"})]})})]})]}),(0,u.jsx)("div",{className:"flex justify-center mt-4",children:(0,u.jsx)("button",{className:"bg-orange-500 text-white py-3 px-8 rounded-full hover:bg-orange-600 transition duration-300 ease-in-out",onClick:()=>{if(!e||!a||!j)return void alert("Vui l\xf2ng ch\u1ecdn \u0111\u1ea7y \u0111\u1ee7 th\xf4ng tin tr\u01b0\u1edbc khi t\xecm ki\u1ebfm!");N(!0);const t=x()(j).format("YYYY-MM-DD"),r=b?x()(b).format("YYYY-MM-DD"):null;setTimeout((()=>{I("/search-page",{state:{departureLocation:e,arrivalLocation:a,departureDate:t,returnDate:r,ticketCount:c,ticketType:l}}),N(!1)}),1500)},children:"T\xecm chuy\u1ebfn xe"})})]})})})},y=r.memo(N)},1768:(e,t,a)=>{a.d(t,{A:()=>g});var r=a(5043),n=a(3216),s=a(5475),i=a(3003),l=a(1906),o=a(8776),c=a(9718),d=a(2153),h=a(6062);const x=a.p+"static/media/logo.c107b9d22a8c7afae01b.JPG";var u=a(579);const m=()=>{const e=(0,i.wA)(),t=(0,n.Zp)(),a=(0,n.zy)(),m=(0,i.d4)((e=>e.user.userInfo));(0,r.useEffect)((()=>{console.log("User info has changed:",m)}),[m]);const[g,v]=(0,r.useState)(!1),p=()=>{e((0,l.ri)()),t("/")};return(0,u.jsxs)("header",{className:"bg-gradient-to-r from-blue-400 via-purple-500 to-blue-500 shadow-lg relative z-20",children:[(0,u.jsxs)("div",{className:"container mx-auto flex justify-between items-center p-4",children:[(0,u.jsxs)("div",{className:"flex items-center",children:[(0,u.jsxs)("select",{className:"mr-4 p-2 border rounded text-white bg-transparent border-white focus:outline-none",children:[(0,u.jsx)("option",{value:"vi",children:"VI"}),(0,u.jsx)("option",{value:"en",children:"EN"})]}),(0,u.jsx)("button",{className:"hidden md:block text-white bg-green-400 hover:bg-green-500 rounded px-4 py-2 transition duration-300",children:"T\u1ea3i \u1ee9ng d\u1ee5ng"})]}),(0,u.jsx)("div",{children:(0,u.jsx)(s.N_,{to:"/",children:(0,u.jsx)("img",{src:x,alt:"Logo",className:"w-24 h-20 sm:w-32 md:w-40 lg:w-48 rounded-lg shadow-lg brightness-110 contrast-110 transform hover:scale-110 transition duration-300 ease-in-out"})})}),(0,u.jsx)("div",{className:"hidden md:flex items-center space-x-4",children:m?(0,u.jsx)(u.Fragment,{children:(0,u.jsxs)(o.W1,{as:"div",className:"relative",children:[(0,u.jsxs)(o.W1.Button,{className:"flex items-center space-x-2 text-white",children:[(0,u.jsx)(c.A,{className:"h-8 w-8"}),(0,u.jsx)("div",{children:(0,u.jsx)("span",{children:m.fullName})})]}),(0,u.jsxs)(o.W1.Items,{className:"absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg transition-all duration-300 ease-in-out transform scale-95 origin-top-right z-30",children:[(0,u.jsx)(o.W1.Item,{children:e=>{let{active:t}=e;return(0,u.jsxs)(s.N_,{to:"/user/profile",className:(t?"bg-gray-100":"")+" flex items-center px-4 py-2 text-sm text-gray-700",children:[(0,u.jsx)(c.A,{className:"h-5 w-5 mr-2 text-gray-500"}),"Th\xf4ng tin c\xe1 nh\xe2n"]})}}),(0,u.jsx)(o.W1.Item,{children:e=>{let{active:t}=e;return(0,u.jsxs)(s.N_,{to:"/user/ticket-buy",className:(t?"bg-gray-100":"")+" flex items-center px-4 py-2 text-sm text-gray-700",children:[(0,u.jsx)(d.A,{className:"h-5 w-5 mr-2 text-gray-500"}),"L\u1ecbch s\u1eed \u0111\u1eb7t v\xe9"]})}}),(0,u.jsx)(o.W1.Item,{children:e=>{let{active:t}=e;return(0,u.jsxs)("button",{onClick:p,className:(t?"bg-red-100":"")+" flex items-center w-full text-left px-4 py-2 text-sm text-red-600",children:[(0,u.jsx)(h.A,{className:"h-5 w-5 mr-2 text-red-500"}),"\u0110\u0103ng xu\u1ea5t"]})}})]})]})}):(0,u.jsx)("a",{href:"/login",onClick:e=>{e.preventDefault(),t("/login",{state:{from:a}})},className:"text-white hover:text-gray-300 transition duration-300",children:"\u0110\u0103ng nh\u1eadp/\u0110\u0103ng k\xfd"})}),(0,u.jsx)("div",{className:"md:hidden",children:(0,u.jsx)("button",{onClick:()=>v(!g),type:"button",className:"text-white hover:text-gray-300 focus:outline-none focus:text-gray-300 transition duration-300",children:(0,u.jsx)("svg",{className:"h-6 w-6",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,u.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M4 6h16M4 12h16m-7 6h7"})})})})]}),(0,u.jsx)("nav",{className:"md:hidden bg-gradient-to-br from-gray-900 to-gray-700 py-2 overflow-hidden transition-all duration-500 ease-in-out "+(g?"max-h-screen":"max-h-0"),children:(0,u.jsxs)("div",{className:"flex flex-col items-center",children:[(0,u.jsx)(s.N_,{to:"/",className:"text-white hover:text-gray-300 py-2 transition duration-300",children:"Trang ch\u1ee7"}),(0,u.jsx)(s.N_,{to:"/lich-trinh",className:"text-white hover:text-gray-300 py-2 transition duration-300",children:"L\u1ecbch tr\xecnh"}),(0,u.jsx)(s.N_,{to:"/tra-cuu-ve",className:"text-white hover:text-gray-300 py-2 transition duration-300",children:"Tra c\u1ee9u v\xe9"}),(0,u.jsx)(s.N_,{to:"/tin-tuc",className:"text-white hover:text-gray-300 py-2 transition duration-300",children:"Tin t\u1ee9c"}),(0,u.jsx)(s.N_,{to:"/hoa-don",className:"text-white hover:text-gray-300 py-2 transition duration-300",children:"H\xf3a \u0111\u01a1n"}),(0,u.jsx)(s.N_,{to:"/lien-he",className:"text-white hover:text-gray-300 py-2 transition duration-300",children:"Li\xean h\u1ec7"}),(0,u.jsx)(s.N_,{to:"/ve-chung-toi",className:"text-white hover:text-gray-300 py-2 transition duration-300",children:"V\u1ec1 ch\xfang t\xf4i"}),m&&"superadmin"===m.roleId&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(s.N_,{to:"/superadmin/dashboard",className:"text-white hover:text-gray-300 py-2 transition duration-300",children:"Qu\u1ea3n l\xfd h\u1ec7 th\u1ed1ng"}),(0,u.jsx)(s.N_,{to:"/company/dashboard",className:"text-white hover:text-gray-300 py-2 transition duration-300",children:"Qu\u1ea3n l\xfd nh\xe0 xe"})]}),m&&"companyadmin"===m.roleId&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(s.N_,{to:"companyadmin/dashboard",className:"text-white hover:text-gray-300 py-2 transition duration-300",children:"Qu\u1ea3n l\xfd nh\xe0 xe"}),(0,u.jsx)(s.N_,{to:"/companyadmin/trip",className:"text-white hover:text-gray-300 py-2 transition duration-300",children:"Qu\u1ea3n l\xfd chuy\u1ebfn \u0111i"})]}),m&&"staff"===m.roleId&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(s.N_,{to:"/staff/dashboard",className:"text-white hover:text-gray-300 py-2 transition duration-300",children:"Trang qu\u1ea3n l\xfd nh\xe2n vi\xean"}),(0,u.jsx)(s.N_,{to:"/staff/support",className:"text-white hover:text-gray-300 py-2 transition duration-300",children:"H\u1ed7 tr\u1ee3 kh\xe1ch h\xe0ng"})]}),m&&"user"===m.roleId&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(s.N_,{to:"/user/profile",className:"text-white hover:text-gray-300 py-2 transition duration-300",children:"Th\xf4ng tin c\xe1 nh\xe2n"}),(0,u.jsx)(s.N_,{to:"/user/ticket-buy",className:"text-white hover:text-gray-300 py-2 transition duration-300",children:"L\u1ecbch s\u1eed \u0111\u1eb7t v\xe9"})]})]})}),(0,u.jsx)("nav",{className:"hidden md:flex bg-gradient-to-br from-gray-900 to-gray-700 py-2",children:(0,u.jsxs)("div",{className:"container mx-auto flex justify-around",children:[(0,u.jsx)(s.N_,{to:"/",className:"text-white hover:text-gray-300 transition duration-300",children:"Trang ch\u1ee7"}),(0,u.jsx)(s.N_,{to:"/lich-trinh",className:"text-white hover:text-gray-300 transition duration-300",children:"L\u1ecbch tr\xecnh"}),(0,u.jsx)(s.N_,{to:"/search-page",className:"text-white hover:text-gray-300 transition duration-300",children:"Tra c\u1ee9u v\xe9"}),(0,u.jsx)(s.N_,{to:"/tin-tuc",className:"text-white hover:text-gray-300 transition duration-300",children:"Tin t\u1ee9c"}),(0,u.jsx)(s.N_,{to:"/hoa-don",className:"text-white hover:text-gray-300 transition duration-300",children:"H\xf3a \u0111\u01a1n"}),(0,u.jsx)(s.N_,{to:"/lien-he",className:"text-white hover:text-gray-300 transition duration-300",children:"Li\xean h\u1ec7"}),(0,u.jsx)(s.N_,{to:"/ve-chung-toi",className:"text-white hover:text-gray-300 transition duration-300",children:"V\u1ec1 ch\xfang t\xf4i"}),m&&"superadmin"===m.roleId&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(s.N_,{to:"/superadmin/dashboard",className:"text-white hover:text-gray-300 transition duration-300",children:"Qu\u1ea3n l\xfd h\u1ec7 th\u1ed1ng"}),(0,u.jsx)(s.N_,{to:"/company/dashboard",className:"text-white hover:text-gray-300 transition duration-300",children:"Qu\u1ea3n l\xfd nh\xe0 xe"})]}),m&&"companyadmin"===m.roleId&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(s.N_,{to:"/companyadmin/dashboard",className:"text-white hover:text-gray-300 transition duration-300",children:"Qu\u1ea3n l\xfd nh\xe0 xe"}),(0,u.jsx)(s.N_,{to:"/companyadmin/trip",className:"text-white hover:text-gray-300 transition duration-300",children:"Qu\u1ea3n l\xfd chuy\u1ebfn \u0111i"})]}),m&&"staff"===m.roleId&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(s.N_,{to:"/staff/dashboard",className:"text-white hover:text-gray-300 transition duration-300",children:"Trang qu\u1ea3n l\xfd nh\xe2n vi\xean"}),(0,u.jsx)(s.N_,{to:"/staff/support",className:"text-white hover:text-gray-300 transition duration-300",children:"H\u1ed7 tr\u1ee3 kh\xe1ch h\xe0ng"})]}),m&&"user"===m.roleId&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(s.N_,{to:"/user/profile",className:"text-white hover:text-gray-300 transition duration-300",children:"Th\xf4ng tin c\xe1 nh\xe2n"}),(0,u.jsx)(s.N_,{to:"/user/ticket-buy",className:"text-white hover:text-gray-300 transition duration-300",children:"L\u1ecbch s\u1eed \u0111\u1eb7t v\xe9"})]})]})})]})},g=r.memo(m)}}]);
//# sourceMappingURL=450.9d63b56f.chunk.js.map