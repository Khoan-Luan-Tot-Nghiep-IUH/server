"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[345],{3345:(e,s,n)=>{n.r(s),n.d(s,{default:()=>j});var t=n(5043),a=n(3003),i=n(480),l=n(3927),r=n(3188),o=n(322),c=n(1686),d=n(9472),m=n(1898),u=n(8677),h=n(579);const x=e=>{let{busType:s,closeDrawer:n}=e;const[a]=(0,i.T$)(),[l]=(0,i.Od)(),[r,o]=(0,t.useState)({name:"",description:"",seats:40,floorCount:1});(0,t.useEffect)((()=>{s&&o({name:s.name,description:s.description||"",seats:s.seats,floorCount:s.floorCount||1})}),[s]);const c=e=>{const{name:s,value:n}=e.target;o({...r,[s]:n})};return(0,h.jsxs)("form",{onSubmit:async e=>{e.preventDefault();try{s?(await l({id:s._id,updatedBusType:r}).unwrap(),n(`C\u1eadp nh\u1eadt lo\u1ea1i xe "${r.name}" th\xe0nh c\xf4ng!`)):(await a(r).unwrap(),n(`Th\xeam lo\u1ea1i xe "${r.name}" th\xe0nh c\xf4ng!`))}catch(t){n(`L\u1ed7i khi l\u01b0u lo\u1ea1i xe: ${t.message}`,"error"),console.error("L\u1ed7i khi l\u01b0u lo\u1ea1i xe:",t)}},children:[(0,h.jsxs)("div",{className:"mb-6",children:[(0,h.jsx)("label",{className:"block text-sm font-medium text-gray-700",children:"T\xean Lo\u1ea1i Xe:"}),(0,h.jsx)("input",{type:"text",name:"name",value:r.name,onChange:c,className:"mt-2 p-2 border rounded w-full",required:!0})]}),(0,h.jsxs)("div",{className:"mb-6",children:[(0,h.jsx)("label",{className:"block text-sm font-medium text-gray-700",children:"M\xf4 T\u1ea3:"}),(0,h.jsx)("textarea",{name:"description",value:r.description,onChange:c,className:"mt-2 p-2 border rounded w-full"})]}),(0,h.jsxs)("div",{className:"mb-6",children:[(0,h.jsx)("label",{className:"block text-sm font-medium text-gray-700",children:"S\u1ed1 Gh\u1ebf:"}),(0,h.jsx)("input",{type:"number",name:"seats",value:r.seats,onChange:c,className:"mt-2 p-2 border rounded w-full",min:"1",required:!0})]}),(0,h.jsxs)("div",{className:"mb-6",children:[(0,h.jsx)("label",{className:"block text-sm font-medium text-gray-700",children:"S\u1ed1 T\u1ea7ng:"}),(0,h.jsx)("input",{type:"number",name:"floorCount",value:r.floorCount,onChange:c,className:"mt-2 p-2 border rounded w-full",min:"1"})]}),(0,h.jsx)("button",{type:"submit",className:"bg-green-500 text-white px-4 py-2 rounded w-full",children:s?"C\u1eadp Nh\u1eadt Lo\u1ea1i Xe":"Th\xeam Lo\u1ea1i Xe"})]})};var p=n(8544);const{Title:y}=l.A,g=()=>{const e=(0,a.d4)((e=>{var s,n;return null===(s=e.user)||void 0===s||null===(n=s.userInfo)||void 0===n?void 0:n.companyId})),{data:s,isLoading:n,error:l,refetch:g}=(0,i.rz)({companyId:e}),j=(null===s||void 0===s?void 0:s.data)||[],[f]=(0,i.OE)(),[v,b]=(0,t.useState)(!1),[C,k]=(0,t.useState)(null),[w,N]=(0,t.useState)({open:!1,severity:"info",message:""}),T=e=>{b(!1),e&&(N({open:!0,severity:"success",message:e}),g())},S=[{title:"T\xean Lo\u1ea1i Xe",dataIndex:"name",key:"name"},{title:"M\xf4 T\u1ea3",dataIndex:"description",key:"description"},{title:"S\u1ed1 Gh\u1ebf",dataIndex:"seats",key:"seats"},{title:"S\u1ed1 T\u1ea7ng",dataIndex:"floorCount",key:"floorCount"},{title:"Thao T\xe1c",key:"action",render:(e,s)=>(0,h.jsxs)("span",{children:[(0,h.jsx)(r.Ay,{type:"link",onClick:()=>(k(s),void b(!0)),children:"S\u1eeda"}),(0,h.jsx)(o.A,{title:"B\u1ea1n c\xf3 ch\u1eafc ch\u1eafn mu\u1ed1n x\xf3a lo\u1ea1i xe n\xe0y kh\xf4ng?",onConfirm:()=>(async e=>{try{await f(e).unwrap(),N({open:!0,severity:"success",message:"X\xf3a lo\u1ea1i xe th\xe0nh c\xf4ng!"}),g()}catch(l){N({open:!0,severity:"error",message:`L\u1ed7i khi x\xf3a lo\u1ea1i xe: ${l.message}`})}})(s._id),okText:"C\xf3",cancelText:"Kh\xf4ng",children:(0,h.jsx)(r.Ay,{type:"link",danger:!0,children:"X\xf3a"})})]})}];return(0,h.jsxs)("div",{className:"p-6 bg-white shadow-md rounded-lg",children:[(0,h.jsxs)("div",{className:"flex justify-between items-center mb-6",children:[(0,h.jsx)(y,{level:3,className:"text-gray-700",children:"Danh S\xe1ch C\xe1c Lo\u1ea1i Xe"}),(0,h.jsx)(r.Ay,{type:"primary",onClick:()=>{k(null),b(!0)},children:"Th\xeam Lo\u1ea1i Xe M\u1edbi"})]}),n?(0,h.jsx)("div",{className:"flex justify-center items-center py-10",children:(0,h.jsx)(c.A,{tip:"\u0110ang t\u1ea3i danh s\xe1ch lo\u1ea1i xe...",size:"large"})}):l?(0,h.jsx)("div",{className:"flex justify-center items-center py-10",children:(0,h.jsxs)("p",{children:["L\u1ed7i khi t\u1ea3i d\u1eef li\u1ec7u: ",l.message]})}):0===j.length?(0,h.jsx)("div",{className:"flex justify-center items-center py-10",children:(0,h.jsx)(d.A,{description:"Kh\xf4ng c\xf3 lo\u1ea1i xe n\xe0o"})}):(0,h.jsx)(m.A,{dataSource:j,columns:S,rowKey:"_id",pagination:{pageSize:5}}),(0,h.jsx)(u.A,{title:C?"Ch\u1ec9nh S\u1eeda Lo\u1ea1i Xe":"Th\xeam Lo\u1ea1i Xe M\u1edbi",width:500,onClose:()=>T(),visible:v,destroyOnClose:!0,children:(0,h.jsx)(x,{busType:C,closeDrawer:e=>T(e)})}),(0,h.jsx)(p.A,{open:w.open,severity:w.severity,message:w.message,onClose:()=>N({...w,open:!1})})]})},j=()=>(0,h.jsx)("div",{className:"p-8",children:(0,h.jsx)(g,{})})}}]);
//# sourceMappingURL=345.dd3cccae.chunk.js.map