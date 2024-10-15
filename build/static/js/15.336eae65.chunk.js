"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[15],{6015:(e,t,s)=>{s.r(t),s.d(t,{default:()=>m});var r=s(5043),a=s(3216),i=s(5868),n=s(254),c=s(579);const l=e=>{let{trip:t}=e;return(0,c.jsxs)("div",{className:"border p-4 rounded-lg shadow-md bg-white transition hover:shadow-lg flex justify-between items-center mb-4 hover:scale-105 transform transition-transform duration-300 ease-in-out",children:[(0,c.jsxs)("div",{className:"flex items-center",children:[(0,c.jsxs)("div",{className:"relative flex-shrink-0",children:[(0,c.jsx)("img",{src:"https://static.vexere.com/production/images/1702527338553.jpeg?w=250&h=250",alt:"Bus type",className:"w-24 h-24 object-cover rounded-md"}),(0,c.jsx)("div",{className:"absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded-lg",children:"X\xe1c nh\u1eadn t\u1ee9c th\xec"})]}),(0,c.jsxs)("div",{className:"ml-6",children:[(0,c.jsx)("h3",{className:"text-lg font-semibold text-blue-600",children:t.busType.name}),(0,c.jsxs)("p",{className:"text-sm text-gray-500 mb-1",children:["Limousine ",t.busType.seats," ch\u1ed7"]}),(0,c.jsxs)("div",{className:"flex items-center text-sm text-gray-700 mb-2",children:[(0,c.jsxs)("p",{className:"mr-4",children:[(0,c.jsx)("span",{className:"font-semibold",children:"Gi\u1edd \u0111i: "}),new Date(t.departureTime).toLocaleTimeString()]}),(0,c.jsxs)("p",{children:[(0,c.jsx)("span",{className:"font-semibold",children:"Gi\u1edd \u0111\u1ebfn: "}),new Date(t.arrivalTime).toLocaleTimeString()]})]}),(0,c.jsxs)("p",{className:"text-sm mb-1",children:[(0,c.jsx)("span",{className:"font-semibold",children:"N\u01a1i \u0111i: "}),t.departureLocation.name]}),(0,c.jsxs)("p",{className:"text-sm mb-1",children:[(0,c.jsx)("span",{className:"font-semibold",children:"N\u01a1i \u0111\u1ebfn: "}),t.arrivalLocation.name]}),(0,c.jsxs)("p",{className:"text-sm text-green-600 font-semibold",children:["C\xf2n ",t.availableSeats," ch\u1ed7 tr\u1ed1ng"]})]})]}),(0,c.jsxs)("div",{className:"text-right",children:[(0,c.jsx)("div",{className:"mb-2",children:(0,c.jsxs)("span",{className:"text-xl font-bold text-blue-600",children:["T\u1eeb ",(0,n.v)(t.basePrice)," VND"]})}),t.discount&&(0,c.jsxs)("div",{className:"text-green-500 text-sm mb-2",children:["Gi\u1ea3m ",t.discount,"%"]}),(0,c.jsx)("button",{className:"bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300 text-lg",children:"Ch\u1ecdn chuy\u1ebfn"}),(0,c.jsx)("p",{className:"text-xs text-gray-500 mt-2",children:"KH\xd4NG C\u1ea6N THANH TO\xc1N TR\u01af\u1edaC"})]})]})};var o=s(6181);const m=e=>{let{filters:t}=e;const{state:s}=(0,a.zy)(),{departureLocation:n,arrivalLocation:m,departureDate:d,returnDate:u,ticketCount:x}=s||{},[h,p]=(0,r.useState)([]),[b,v]=(0,r.useState)([]),[N,g]=(0,r.useState)(!0),{data:f,error:j,isLoading:T}=(0,i.pg)({departureLocation:n,arrivalLocation:m,departureDate:d,returnDate:u,ticketCount:x});return(0,r.useEffect)((()=>{var e;null!==f&&void 0!==f&&null!==(e=f.data)&&void 0!==e&&e.departureTrips&&(v(f.data.departureTrips),p(f.data.departureTrips))}),[f]),(0,r.useEffect)((()=>{g(!0);const e=setTimeout((()=>{(()=>{let e=[...b];"low"===t.priceRange?e=e.filter((e=>e.basePrice<2e5)):"medium"===t.priceRange?e=e.filter((e=>e.basePrice>=2e5&&e.basePrice<=5e5)):"high"===t.priceRange&&(e=e.filter((e=>e.basePrice>5e5))),t.busOperator&&(e=e.filter((e=>{var s;return(null===(s=e.busType)||void 0===s?void 0:s.name)===t.busOperator}))),"morning"===t.departureTimeRange?e=e.filter((e=>{const t=new Date(e.departureTime).getHours();return t>=6&&t<12})):"afternoon"===t.departureTimeRange&&(e=e.filter((e=>{const t=new Date(e.departureTime).getHours();return t>=12&&t<18}))),"priceAsc"===t.sort?e.sort(((e,t)=>e.basePrice-t.basePrice)):"priceDesc"===t.sort?e.sort(((e,t)=>t.basePrice-e.basePrice)):"earliest"===t.sort?e.sort(((e,t)=>new Date(e.departureTime)-new Date(t.departureTime))):"latest"===t.sort&&e.sort(((e,t)=>new Date(t.departureTime)-new Date(e.departureTime))),p(e),g(!1)})()}),500);return()=>clearTimeout(e)}),[t,b]),N||T?(0,c.jsxs)("div",{className:"container mx-auto py-8",children:[(0,c.jsx)(o.A,{})," "]}):j?(0,c.jsxs)("div",{children:["Kh\xf4ng t\xecm th\u1ea5y chuy\u1ebfn xe. L\u1ed7i: ",j.message]}):0===h.length?(0,c.jsx)("div",{children:"Kh\xf4ng t\xecm th\u1ea5y chuy\u1ebfn xe n\xe0o ph\xf9 h\u1ee3p v\u1edbi y\xeau c\u1ea7u t\xecm ki\u1ebfm c\u1ee7a b\u1ea1n."}):(0,c.jsxs)("div",{className:"container mx-auto py-8",children:[(0,c.jsx)("h2",{className:"text-2xl font-bold mb-4",children:"K\u1ebft qu\u1ea3 t\xecm ki\u1ebfm chuy\u1ebfn xe"}),(0,c.jsx)("div",{className:"space-y-4",children:h.map((e=>(0,c.jsx)(l,{trip:e},e._id)))})]})}},254:(e,t,s)=>{s.d(t,{D:()=>i,v:()=>n});var r=s(4348),a=s.n(r);const i={parseUTCTimeForForm:e=>e?new Date(e):new Date,formatTimeForServer:e=>e?a()(e).utc().format():null,formatDisplayTime:e=>e?a()(e).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm"):""},n=e=>e?new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(e):"0 VND"}}]);
//# sourceMappingURL=15.336eae65.chunk.js.map