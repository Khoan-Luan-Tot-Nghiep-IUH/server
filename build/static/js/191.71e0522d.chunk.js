"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[191],{6191:(e,s,t)=>{t.r(s),t.d(s,{default:()=>g});var l=t(65043),i=t(83003),n=t(85627),r=t(60184),a=t(82639),c=t(16569),d=t(91995),o=t(91686),h=t(73216),x=t(70579);const g=()=>{const e=(0,i.d4)((e=>e.user.userInfo)),s=(0,h.Zp)(),{data:t,isLoading:g,error:m,refetch:u}=(0,n.eY)(void 0,{skip:!e}),{data:b,error:p,isLoading:y,refetch:j}=(0,n.K0)(void 0,{skip:!e}),[v,{isLoading:N}]=(0,n.h7)(),[f,w]=(0,l.useState)(""),[k,C]=(0,l.useState)(!e),L=()=>{C(!1),s("/login")},A=()=>{C(!1),s("/")},S=()=>{s("/")};return e?(0,x.jsxs)("div",{className:"max-w-4xl mx-auto p-4",children:[(0,x.jsx)("h2",{className:"text-3xl font-bold text-center text-gray-800 mb-6",children:"\u01afu \u0110\xe3i & Voucher"}),(0,x.jsx)("div",{className:"bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center font-semibold rounded-lg p-6 mb-8 shadow-lg",children:g?(0,x.jsx)(o.A,{size:"large"}):m?(0,x.jsx)("p",{className:"text-red-500",children:"L\u1ed7i khi t\u1ea3i \u0111i\u1ec3m th\u01b0\u1edfng"}):(0,x.jsxs)(x.Fragment,{children:[(0,x.jsx)("h3",{className:"text-lg",children:"B\u1ea1n c\xf3"}),(0,x.jsx)("h1",{className:"text-4xl font-extrabold underline",children:(null===t||void 0===t?void 0:t.loyaltyPoints)||0}),(0,x.jsx)("p",{children:"\u0111i\u1ec3m th\u01b0\u1edfng"})]})}),(0,x.jsxs)("div",{className:"bg-white rounded-lg shadow-md p-6 mb-8",children:[(0,x.jsxs)("h3",{className:"text-lg font-semibold text-gray-800 mb-4 flex items-center",children:[(0,x.jsx)(a.DXl,{className:"text-yellow-500 mr-2"})," \u0110\u1ed5i \u0110i\u1ec3m L\u1ea5y Voucher"]}),(0,x.jsxs)("div",{className:"flex items-center gap-4",children:[(0,x.jsx)("input",{type:"number",value:f,onChange:e=>w(e.target.value.trim()),placeholder:"Nh\u1eadp \u0111i\u1ec3m",className:"flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"}),(0,x.jsx)("button",{onClick:async()=>{if(!f||f<=0||isNaN(f))c.Ay.error("Vui l\xf2ng nh\u1eadp s\u1ed1 \u0111i\u1ec3m h\u1ee3p l\u1ec7 \u0111\u1ec3 \u0111\u1ed5i.");else try{const e=await v({points:parseInt(f)}).unwrap();c.Ay.success(`\u0110\u1ed5i \u0111i\u1ec3m th\xe0nh c\xf4ng! B\u1ea1n \u0111\xe3 nh\u1eadn \u0111\u01b0\u1ee3c voucher gi\u1ea3m ${e.voucher.discount}%`),w(""),j(),u()}catch(p){var e;c.Ay.error((null===p||void 0===p||null===(e=p.data)||void 0===e?void 0:e.message)||"L\u1ed7i khi \u0111\u1ed5i \u0111i\u1ec3m l\u1ea5y voucher.")}},disabled:N,className:"bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow-md "+(N?"opacity-50 cursor-not-allowed":"hover:bg-blue-700"),children:N?"\u0110ang \u0111\u1ed5i...":"\u0110\u1ed5i"})]}),(0,x.jsx)("p",{className:"text-gray-500 text-sm mt-2",children:"100 \u0111i\u1ec3m = voucher gi\u1ea3m 10%"})]}),(0,x.jsxs)("div",{children:[(0,x.jsx)("h3",{className:"text-xl font-semibold text-gray-800 mb-4",children:"Voucher C\u1ee7a B\u1ea1n"}),y?(0,x.jsx)("div",{className:"flex justify-center",children:(0,x.jsx)(o.A,{size:"large"})}):p?(0,x.jsx)("p",{className:"text-center text-red-500",children:"L\u1ed7i khi t\u1ea3i danh s\xe1ch voucher"}):b&&b.length>0?(0,x.jsx)("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",children:b.map((e=>(0,x.jsxs)("div",{className:"relative p-4 rounded-lg shadow-md border "+(e.isUsed?"bg-gray-100 border-gray-400":"bg-white border-blue-300"),children:[(0,x.jsx)(r.Wp,{className:"absolute top-4 right-4 text-2xl text-yellow-400"}),(0,x.jsxs)("h4",{className:"text-lg font-bold text-gray-800 mb-2",children:["M\xe3: ",e.code]}),(0,x.jsxs)("p",{className:"text-sm text-gray-600",children:["Gi\u1ea3m gi\xe1: ",e.discount,"%"]}),(0,x.jsxs)("p",{className:"text-sm text-gray-600",children:["S\u1ed1 l\u01b0\u1ee3ng: ",e.quantity]}),(0,x.jsxs)("p",{className:"text-sm text-gray-600 mb-4",children:["H\u1ea1n: ",new Date(e.expiryDate).toLocaleDateString()]}),(0,x.jsx)("button",{onClick:S,className:"w-full text-center py-2 rounded font-semibold "+(e.isUsed?"bg-gray-400 text-white cursor-not-allowed":"bg-blue-600 text-white hover:bg-blue-700"),disabled:e.isUsed,children:e.isUsed?"\u0110\xe3 s\u1eed d\u1ee5ng":"S\u1eed d\u1ee5ng ngay"})]},e._id)))}):(0,x.jsx)("p",{className:"text-center text-gray-500",children:"Kh\xf4ng c\xf3 voucher n\xe0o."})]})]}):(0,x.jsx)(d.A,{title:"Ch\u01b0a \u0111\u0103ng nh\u1eadp",visible:k,onOk:L,onCancel:A,okText:"\u0110\u0103ng nh\u1eadp",cancelText:"Quay l\u1ea1i trang ch\u1ee7",children:(0,x.jsx)("p",{children:"B\u1ea1n c\u1ea7n \u0111\u0103ng nh\u1eadp \u0111\u1ec3 s\u1eed d\u1ee5ng c\xe1c \u01b0u \u0111\xe3i. H\xe3y \u0111\u0103ng nh\u1eadp ho\u1eb7c quay l\u1ea1i trang ch\u1ee7."})})}}}]);
//# sourceMappingURL=191.71e0522d.chunk.js.map