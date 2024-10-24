"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[345],{3345:(e,n,s)=>{s.r(n),s.d(n,{default:()=>x});var t=s(5043),a=s(3003),i=s(480),o=s(3188),r=s(4520),l=s(8577),c=s(8365),d=s(579);const m=e=>{let{busType:n,closeDrawer:s}=e;const[a]=(0,i.T$)(),[o]=(0,i.Od)(),[r,l]=(0,t.useState)({name:"",description:"",seats:40,floorCount:1});(0,t.useEffect)((()=>{n&&l({name:n.name,description:n.description||"",seats:n.seats,floorCount:n.floorCount||1})}),[n]);const c=e=>{const{name:n,value:s}=e.target;l({...r,[n]:s})};return(0,d.jsxs)("form",{onSubmit:async e=>{e.preventDefault();try{n?(await o({id:n._id,updatedBusType:r}).unwrap(),s(`C\u1eadp nh\u1eadt lo\u1ea1i xe "${r.name}" th\xe0nh c\xf4ng!`)):(await a(r).unwrap(),s(`Th\xeam lo\u1ea1i xe "${r.name}" th\xe0nh c\xf4ng!`))}catch(t){s(`L\u1ed7i khi l\u01b0u lo\u1ea1i xe: ${t.message}`,"error"),console.error("L\u1ed7i khi l\u01b0u lo\u1ea1i xe:",t)}},children:[(0,d.jsxs)("div",{className:"mb-6",children:[(0,d.jsx)("label",{className:"block text-sm font-medium text-gray-700",children:"T\xean Lo\u1ea1i Xe:"}),(0,d.jsx)("input",{type:"text",name:"name",value:r.name,onChange:c,className:"mt-2 p-2 border rounded w-full",required:!0})]}),(0,d.jsxs)("div",{className:"mb-6",children:[(0,d.jsx)("label",{className:"block text-sm font-medium text-gray-700",children:"M\xf4 T\u1ea3:"}),(0,d.jsx)("textarea",{name:"description",value:r.description,onChange:c,className:"mt-2 p-2 border rounded w-full"})]}),(0,d.jsxs)("div",{className:"mb-6",children:[(0,d.jsx)("label",{className:"block text-sm font-medium text-gray-700",children:"S\u1ed1 Gh\u1ebf:"}),(0,d.jsx)("input",{type:"number",name:"seats",value:r.seats,onChange:c,className:"mt-2 p-2 border rounded w-full",min:"1",required:!0})]}),(0,d.jsxs)("div",{className:"mb-6",children:[(0,d.jsx)("label",{className:"block text-sm font-medium text-gray-700",children:"S\u1ed1 T\u1ea7ng:"}),(0,d.jsx)("input",{type:"number",name:"floorCount",value:r.floorCount,onChange:c,className:"mt-2 p-2 border rounded w-full",min:"1"})]}),(0,d.jsx)("button",{type:"submit",className:"bg-green-500 text-white px-4 py-2 rounded w-full",children:n?"C\u1eadp Nh\u1eadt Lo\u1ea1i Xe":"Th\xeam Lo\u1ea1i Xe"})]})};var u=s(6384);const h=()=>{const e=(0,a.d4)((e=>{var n,s;return null===(n=e.user)||void 0===n||null===(s=n.userInfo)||void 0===s?void 0:s.companyId})),{data:n,isLoading:s,error:h,refetch:x}=(0,i.rz)({companyId:e}),p=(null===n||void 0===n?void 0:n.data)||[],[y]=(0,i.OE)(),[f,g]=(0,t.useState)(!1),[j,v]=(0,t.useState)(null),[b,C]=(0,t.useState)({open:!1,severity:"info",message:""});if(s)return(0,d.jsx)("p",{children:"\u0110ang t\u1ea3i d\u1eef li\u1ec7u..."});if(h)return(0,d.jsxs)("p",{children:["L\u1ed7i khi t\u1ea3i d\u1eef li\u1ec7u: ",h.message]});const k=e=>{g(!1),e&&(C({open:!0,severity:"success",message:e}),x())},w=[{title:"T\xean Lo\u1ea1i Xe",dataIndex:"name",key:"name"},{title:"M\xf4 T\u1ea3",dataIndex:"description",key:"description"},{title:"S\u1ed1 Gh\u1ebf",dataIndex:"seats",key:"seats"},{title:"S\u1ed1 T\u1ea7ng",dataIndex:"floorCount",key:"floorCount"},{title:"Thao T\xe1c",key:"action",render:(e,n)=>(0,d.jsxs)("span",{children:[(0,d.jsx)(o.Ay,{type:"link",onClick:()=>(v(n),void g(!0)),children:"S\u1eeda"}),(0,d.jsx)(r.A,{title:"B\u1ea1n c\xf3 ch\u1eafc ch\u1eafn mu\u1ed1n x\xf3a lo\u1ea1i xe n\xe0y kh\xf4ng?",onConfirm:()=>(async e=>{try{await y(e).unwrap(),C({open:!0,severity:"success",message:"X\xf3a lo\u1ea1i xe th\xe0nh c\xf4ng!"}),x()}catch(h){C({open:!0,severity:"error",message:`L\u1ed7i khi x\xf3a lo\u1ea1i xe: ${h.message}`})}})(n._id),okText:"C\xf3",cancelText:"Kh\xf4ng",children:(0,d.jsx)(o.Ay,{type:"link",danger:!0,children:"X\xf3a"})})]})}];return(0,d.jsxs)(d.Fragment,{children:[(0,d.jsxs)("div",{className:"p-6",children:[(0,d.jsxs)("div",{className:"flex justify-between items-center mb-6",children:[(0,d.jsx)("h1",{className:"text-3xl font-bold text-gray-700",children:"Danh S\xe1ch C\xe1c Lo\u1ea1i Xe"}),(0,d.jsx)(o.Ay,{type:"primary",onClick:()=>{v(null),g(!0)},children:"Th\xeam Lo\u1ea1i Xe M\u1edbi"})]}),(0,d.jsx)(l.A,{dataSource:p,columns:w,rowKey:"_id",pagination:!1}),(0,d.jsx)(c.A,{title:j?"Ch\u1ec9nh S\u1eeda Lo\u1ea1i Xe":"Th\xeam Lo\u1ea1i Xe M\u1edbi",width:500,onClose:()=>k(),visible:f,destroyOnClose:!0,children:(0,d.jsx)(m,{busType:j,closeDrawer:e=>k(e)})})]}),(0,d.jsx)(u.A,{open:b.open,severity:b.severity,message:b.message,onClose:()=>C({...b,open:!1})})]})},x=()=>(0,d.jsx)("div",{className:"p-8",children:(0,d.jsx)(h,{})})},6384:(e,n,s)=>{s.d(n,{A:()=>c});var t=s(5043),a=s(182),i=s(8730),o=s(5897),r=s(579);const l=t.forwardRef((function(e,n){return(0,r.jsx)(i.A,{elevation:6,ref:n,variant:"filled",...e})})),c=e=>{let{open:n,onClose:s,severity:t,message:i,autoHideDuration:c=3e3,TransitionComponent:d=o.A}=e;return(0,r.jsx)(a.A,{open:n,autoHideDuration:c,onClose:s,TransitionComponent:d,anchorOrigin:{vertical:"top",horizontal:"right"},children:(0,r.jsx)(l,{onClose:s,severity:t,sx:{width:"100%"},children:i})})}}}]);
//# sourceMappingURL=345.3de4865c.chunk.js.map