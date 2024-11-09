"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[996],{41996:(e,t,a)=>{a.r(t),a.d(t,{default:()=>d});var s=a(65043),n=a(62764),r=a(70579);const l=e=>{let{companyName:t,setCompanyName:a,address:s,setAddress:n,contactInfo:l,setContactInfo:o,phoneNumber:i,setPhoneNumber:c,email:d,setEmail:u,isActive:m,setIsActive:h,handleCreateOrUpdateCompany:g,creating:p,selectedCompanyId:x}=e;return(0,r.jsx)("div",{className:"w-full flex justify-center items-start p-4",children:(0,r.jsxs)("form",{onSubmit:g,className:"bg-white shadow-md rounded-lg p-4 space-y-4 max-w-sm w-full border border-gray-200",children:[(0,r.jsx)("h2",{className:"text-xl font-semibold text-center text-blue-600",children:x?"C\u1eadp nh\u1eadt c\xf4ng ty":"T\u1ea1o c\xf4ng ty m\u1edbi"}),(0,r.jsxs)("div",{className:"flex flex-col",children:[(0,r.jsx)("label",{className:"text-sm font-medium text-gray-700",children:"T\xean c\xf4ng ty"}),(0,r.jsx)("input",{type:"text",value:t,onChange:e=>a(e.target.value),required:!0,className:"p-2 text-sm border border-gray-300 rounded focus:ring focus:ring-blue-500",placeholder:"Nh\u1eadp t\xean c\xf4ng ty"})]}),(0,r.jsxs)("div",{className:"flex flex-col",children:[(0,r.jsx)("label",{className:"text-sm font-medium text-gray-700",children:"\u0110\u1ecba ch\u1ec9"}),(0,r.jsx)("input",{type:"text",value:s,onChange:e=>n(e.target.value),required:!0,className:"p-2 text-sm border border-gray-300 rounded focus:ring focus:ring-blue-500",placeholder:"Nh\u1eadp \u0111\u1ecba ch\u1ec9"})]}),(0,r.jsxs)("div",{className:"flex flex-col",children:[(0,r.jsx)("label",{className:"text-sm font-medium text-gray-700",children:"Th\xf4ng tin li\xean h\u1ec7"}),(0,r.jsx)("input",{type:"text",value:l,onChange:e=>o(e.target.value),required:!0,className:"p-2 text-sm border border-gray-300 rounded focus:ring focus:ring-blue-500",placeholder:"Nh\u1eadp th\xf4ng tin li\xean h\u1ec7"})]}),(0,r.jsxs)("div",{className:"flex flex-col",children:[(0,r.jsx)("label",{className:"text-sm font-medium text-gray-700",children:"S\u1ed1 \u0111i\u1ec7n tho\u1ea1i"}),(0,r.jsx)("input",{type:"text",value:i,onChange:e=>c(e.target.value),required:!0,className:"p-2 text-sm border border-gray-300 rounded focus:ring focus:ring-blue-500",placeholder:"Nh\u1eadp s\u1ed1 \u0111i\u1ec7n tho\u1ea1i"})]}),(0,r.jsxs)("div",{className:"flex flex-col",children:[(0,r.jsx)("label",{className:"text-sm font-medium text-gray-700",children:"Email"}),(0,r.jsx)("input",{type:"email",value:d,onChange:e=>u(e.target.value),required:!0,className:"p-2 text-sm border border-gray-300 rounded focus:ring focus:ring-blue-500",placeholder:"Nh\u1eadp email"})]}),(0,r.jsxs)("div",{className:"flex items-center space-x-2",children:[(0,r.jsx)("label",{className:"text-sm font-medium text-gray-700",children:"K\xedch ho\u1ea1t"}),(0,r.jsx)("input",{type:"checkbox",checked:m,onChange:e=>h(e.target.checked),className:"w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-500"})]}),(0,r.jsx)("button",{type:"submit",className:`w-full py-2 text-white font-medium rounded-lg shadow ${p?"bg-blue-300 cursor-not-allowed":"bg-gradient-to-r from-blue-500 to-blue-600 hover:bg-blue-700"} focus:outline-none focus:ring-2 focus:ring-blue-500`,disabled:p,children:p?"\u0110ang l\u01b0u...":x?"C\u1eadp nh\u1eadt":"L\u01b0u"})]})})};var o=a(76384);const i=e=>{let{open:t,onClose:a,severity:s,message:n}=e;return(0,r.jsx)(o.A,{open:t,onClose:a,severity:s,message:n})},c=e=>{let{company:t,onClick:a,onToggleStatus:s}=e;return(0,r.jsxs)("div",{className:"company-card bg-gradient-to-r from-blue-400 to-purple-300 rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 cursor-pointer text-white",onClick:a,children:[(0,r.jsx)("h3",{className:"text-lg font-bold mb-2",children:t.name}),(0,r.jsx)("p",{className:"text-sm mb-4",children:t.address}),(0,r.jsx)("p",{className:"text-sm font-semibold "+(t.isActive?"text-green-200":"text-red-200"),children:t.isActive?"K\xedch ho\u1ea1t":"V\xf4 hi\u1ec7u h\xf3a"}),(0,r.jsx)("div",{className:"mt-4 flex items-center",children:(0,r.jsxs)("label",{className:"relative inline-flex items-center cursor-pointer",children:[(0,r.jsx)("input",{type:"checkbox",className:"sr-only",checked:t.isActive,onChange:()=>s(t._id)}),(0,r.jsx)("div",{className:"w-10 h-5 rounded-full transition-all duration-300 ease-in-out "+(t.isActive?"bg-green-400":"bg-red-400"),children:(0,r.jsx)("div",{className:"dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform duration-300 ease-in-out "+(t.isActive?"transform translate-x-5":"")})}),(0,r.jsx)("span",{className:"ml-3 text-sm",children:t.isActive?"V\xf4 hi\u1ec7u h\xf3a":"K\xedch ho\u1ea1t"})]})})]})},d=()=>{const[e,t]=(0,s.useState)(""),[a,o]=(0,s.useState)(""),[d,u]=(0,s.useState)(""),[m,h]=(0,s.useState)(""),[g,p]=(0,s.useState)(""),[x,b]=(0,s.useState)(null),[y,f]=(0,s.useState)(!1),[v,N]=(0,s.useState)(""),[j,w]=(0,s.useState)("success"),[C,k]=(0,s.useState)(!1),[S,A]=(0,s.useState)(""),[T,I]=(0,s.useState)(""),[E,q]=(0,s.useState)(""),[L,_]=(0,s.useState)(""),[K,D]=(0,s.useState)(!1),{data:V,isLoading:O,error:z}=(0,n.p4)(),[H,{isLoading:P}]=(0,n.qI)(),[R]=(0,n.L2)(),[U]=(0,n.QO)(),[$,{isLoading:G}]=(0,n.Gb)(),[M,Q]=(0,s.useState)([]);(0,s.useEffect)((()=>{V&&Q(V.companies)}),[V]);const B=(0,s.useRef)(null),F=()=>{t(""),o(""),u(""),h(""),p(""),b(null),A(""),I(""),_(""),q(""),D(!1)},J=(e,t)=>{w(e),N(t),f(!0)},W=async e=>{try{const t=await U(e).unwrap();Q((e=>e.map((e=>e._id===t.company._id?t.company:e)))),J("success",`C\xf4ng ty ${t.company.isActive?"\u0111\xe3 \u0111\u01b0\u1ee3c k\xedch ho\u1ea1t":"\u0111\xe3 b\u1ecb v\xf4 hi\u1ec7u h\xf3a"} v\xe0 t\u1ea5t c\u1ea3 c\xe1c t\xe0i kho\u1ea3n li\xean quan c\u0169ng \u0111\u01b0\u1ee3c c\u1eadp nh\u1eadt tr\u1ea1ng th\xe1i.`)}catch(t){J("error","Kh\xf4ng th\u1ec3 thay \u0111\u1ed5i tr\u1ea1ng th\xe1i c\xf4ng ty.")}},X=e=>{B.current&&!B.current.contains(e.target)&&(k(!1),document.body.style.overflow="hidden")};return(0,s.useEffect)((()=>(document.addEventListener("mousedown",X),()=>{document.removeEventListener("mousedown",X)})),[]),(0,r.jsxs)("div",{className:"manage-companies bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen p-8",children:[(0,r.jsx)("h2",{className:"text-3xl font-bold mb-4",children:x?"C\u1eadp nh\u1eadt C\xf4ng Ty":"T\u1ea1o C\xf4ng Ty"}),(0,r.jsxs)("button",{className:"bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 mb-6",onClick:()=>{F(),k(!0),D(!1),document.body.style.overflow="hidden"},children:[(0,r.jsx)("i",{className:"fas fa-plus"})," Th\xeam c\xf4ng ty"]}),C&&(0,r.jsx)("div",{className:"fixed inset-y-0 right-0 bg-white shadow-lg z-50 w-1/4 overflow-y-auto",ref:B,children:(0,r.jsxs)("div",{className:"p-6 relative",children:[(0,r.jsx)("span",{className:"absolute top-2 right-4 text-gray-500 cursor-pointer hover:text-gray-700 transition",onClick:()=>{k(!1),document.body.style.overflow="auto"},children:"\xd7"}),(0,r.jsx)(l,{companyName:e,setCompanyName:t,address:a,setAddress:o,contactInfo:d,setContactInfo:u,phoneNumber:m,setPhoneNumber:h,email:g,setEmail:p,handleCreateOrUpdateCompany:async t=>{t.preventDefault();try{const t={name:e,address:a,contactInfo:d,phoneNumber:m,email:g};if(x){const e=await R({companyId:x,updatedData:t}).unwrap();Q((t=>t.map((t=>t._id===e.company._id?e.company:t)))),J("success","C\u1eadp nh\u1eadt c\xf4ng ty th\xe0nh c\xf4ng!")}else{const e=await H(t).unwrap();Q((t=>[...t,e.company])),J("success","T\u1ea1o c\xf4ng ty th\xe0nh c\xf4ng!")}F(),k(!1),document.body.style.overflow="auto"}catch(s){J("error","Kh\xf4ng th\u1ec3 th\u1ef1c hi\u1ec7n t\xe1c v\u1ee5. Vui l\xf2ng ki\u1ec3m tra th\xf4ng tin v\xe0 th\u1eed l\u1ea1i.")}},creating:P,selectedCompanyId:x}),K&&(0,r.jsxs)("div",{className:"mt-8",children:[(0,r.jsx)("h4",{className:"text-lg font-semibold mb-4",children:"Th\xeam Admin cho C\xf4ng Ty"}),(0,r.jsx)("input",{type:"text",value:S,onChange:e=>A(e.target.value),placeholder:"T\xean \u0110\u0103ng Nh\u1eadp c\u1ee7a admin",className:"w-full p-2 border border-gray-300 rounded-md mb-4"}),(0,r.jsx)("input",{type:"password",value:T,onChange:e=>I(e.target.value),placeholder:"M\u1eadt kh\u1ea9u c\u1ee7a admin",className:"w-full p-2 border border-gray-300 rounded-md mb-4"}),(0,r.jsx)("input",{type:"email",value:L,onChange:e=>_(e.target.value),placeholder:"Email c\u1ee7a admin",className:"w-full p-2 border border-gray-300 rounded-md mb-4"}),(0,r.jsx)("input",{type:"text",value:E,onChange:e=>q(e.target.value),placeholder:"S\u1ed1 \u0111i\u1ec7n tho\u1ea1i c\u1ee7a admin",className:"w-full p-2 border border-gray-300 rounded-md mb-4"}),(0,r.jsx)("button",{onClick:async()=>{if(S&&T)try{await $({companyId:x,userName:S,password:T,email:L,phoneNumber:E}).unwrap(),J("success","Th\xeam admin th\xe0nh c\xf4ng!"),F()}catch(t){var e;J("error",(null===t||void 0===t||null===(e=t.data)||void 0===e?void 0:e.message)||"Kh\xf4ng th\u1ec3 th\xeam admin. Vui l\xf2ng ki\u1ec3m tra th\xf4ng tin v\xe0 th\u1eed l\u1ea1i.")}else J("warning","Vui l\xf2ng nh\u1eadp t\xean \u0111\u0103ng nh\u1eadp v\xe0 m\u1eadt kh\u1ea9u.")},disabled:G,className:"bg-green-500 text-white w-full py-2 rounded-lg hover:bg-green-600 transition duration-300",children:G?"\u0110ang th\xeam...":"Th\xeam Admin"})]})]})}),(0,r.jsx)("h3",{className:"text-xl font-semibold mt-8 mb-4",children:"Danh s\xe1ch c\xe1c c\xf4ng ty"}),(0,r.jsx)("div",{className:"company-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",children:O?(0,r.jsx)("p",{children:"\u0110ang t\u1ea3i..."}):M.map((e=>(0,r.jsx)(c,{company:e,onClick:()=>(e=>{b(e._id),t(e.name),o(e.address),u(e.contactInfo),h(e.phoneNumber),p(e.email),k(!0),D(!0),document.body.style.overflow="hidden"})(e),onToggleStatus:W},e._id)))}),z&&(0,r.jsx)("p",{className:"text-red-500 mt-4",children:z}),(0,r.jsx)(i,{open:y,onClose:()=>f(!1),severity:j,message:v})]})}},76384:(e,t,a)=>{a.d(t,{A:()=>c});var s=a(65043),n=a(90182),r=a(77518),l=a(5897),o=a(70579);const i=s.forwardRef((function(e,t){return(0,o.jsx)(r.A,{elevation:6,ref:t,variant:"filled",...e})})),c=e=>{let{open:t,onClose:a,severity:s,message:r,autoHideDuration:c=3e3,TransitionComponent:d=l.A}=e;return(0,o.jsx)(n.A,{open:t,autoHideDuration:c,onClose:a,TransitionComponent:d,anchorOrigin:{vertical:"top",horizontal:"right"},children:(0,o.jsx)(i,{onClose:a,severity:s,sx:{width:"100%"},children:r})})}}}]);
//# sourceMappingURL=996.f4714f19.chunk.js.map