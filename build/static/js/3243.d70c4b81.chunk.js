"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[3243],{63243:(e,t,n)=>{n.r(t),n.d(t,{default:()=>c});var s=n(65043),l=n(73216),a=n(85627),r=n(83003),i=n(76384),o=n(70579);const c=()=>{const[e,t]=(0,s.useState)(""),[n,c]=(0,s.useState)(""),[u,d]=(0,s.useState)(""),[h,p]=(0,s.useState)(""),[g,m]=(0,s.useState)(""),[x,f]=(0,s.useState)("email"),[v,b]=(0,s.useState)(""),[y,j]=(0,s.useState)(1),[N,w]=(0,s.useState)(""),[k,S]=(0,s.useState)(""),C=((0,r.wA)(),(0,l.Zp)()),[T,{isLoading:O}]=(0,a.ge)(),[q,{isLoading:P}]=(0,a.x8)(),[A,X]=(0,s.useState)(!1),[E,M]=(0,s.useState)(""),[D,H]=(0,s.useState)("success"),V=(e,t)=>{H(e),M(t),X(!0)};return(0,o.jsxs)("div",{className:"min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 via-gray-300 to-gray-300",children:[(0,o.jsxs)("div",{className:"bg-white shadow-lg rounded-lg p-8 w-full max-w-md bg-opacity-90",children:[(0,o.jsx)("h2",{className:"text-3xl font-semibold text-center text-gray-800 mb-8",children:1===y?"T\u1ea1o t\xe0i kho\u1ea3n":"Nh\u1eadp m\xe3 OTP"}),1===y?(0,o.jsxs)("form",{className:"space-y-5",onSubmit:async t=>{t.preventDefault(),S("");if(!/^[0-9]{10}$/.test(g))return void S("S\u1ed1 \u0111i\u1ec7n tho\u1ea1i ph\u1ea3i c\xf3 10 ch\u1eef s\u1ed1.");if(!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(h))return void S("Email ph\u1ea3i thu\u1ed9c mi\u1ec1n @gmail.com.");let s=g.startsWith("0")?`+84${g.slice(1)}`:g;try{const t=await T({userName:e,password:n,fullName:u,email:h,phoneNumber:s,verificationMethod:x}).unwrap();if(null===t||void 0===t||!t.success)throw new Error((null===t||void 0===t?void 0:t.message)||"\u0110\u0103ng k\xfd th\u1ea5t b\u1ea1i");w(s),j(2),V("success","M\xe3 OTP \u0111\xe3 \u0111\u01b0\u1ee3c g\u1eedi!")}catch(a){var l;const e=(null===a||void 0===a||null===(l=a.data)||void 0===l?void 0:l.message)||"\u0110\u0103ng k\xfd th\u1ea5t b\u1ea1i. Vui l\xf2ng th\u1eed l\u1ea1i.";S(e),V("error",e)}},children:[(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-gray-700 mb-1",children:"T\xean \u0111\u0103ng nh\u1eadp"}),(0,o.jsx)("input",{type:"text",placeholder:"Nh\u1eadp t\xean \u0111\u0103ng nh\u1eadp",value:e,onChange:e=>t(e.target.value),required:!0,className:"w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-gray-700"})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-gray-700 mb-1",children:"M\u1eadt kh\u1ea9u"}),(0,o.jsx)("input",{type:"password",placeholder:"Nh\u1eadp m\u1eadt kh\u1ea9u",value:n,onChange:e=>c(e.target.value),required:!0,className:"w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-gray-700"})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-gray-700 mb-1",children:"H\u1ecd v\xe0 t\xean"}),(0,o.jsx)("input",{type:"text",placeholder:"Nh\u1eadp h\u1ecd v\xe0 t\xean",value:u,onChange:e=>d(e.target.value),required:!0,className:"w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-gray-700"})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-gray-700 mb-1",children:"Email"}),(0,o.jsx)("input",{type:"email",placeholder:"Nh\u1eadp email",value:h,onChange:e=>p(e.target.value),required:!0,className:"w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-gray-700"})]}),(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-gray-700 mb-1",children:"S\u1ed1 \u0111i\u1ec7n tho\u1ea1i"}),(0,o.jsx)("input",{type:"text",placeholder:"Nh\u1eadp s\u1ed1 \u0111i\u1ec7n tho\u1ea1i",value:g,onChange:e=>m(e.target.value),required:!0,className:"w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-gray-700"})]}),(0,o.jsxs)("div",{className:"flex justify-between items-center mt-4",children:[(0,o.jsxs)("label",{className:"flex items-center space-x-2 text-gray-700",children:[(0,o.jsx)("input",{type:"radio",value:"email",checked:"email"===x,onChange:()=>f("email"),className:"focus:ring-purple-500"}),(0,o.jsx)("span",{children:"X\xe1c minh qua Email"})]}),(0,o.jsxs)("label",{className:"flex items-center space-x-2 text-gray-700",children:[(0,o.jsx)("input",{type:"radio",value:"phone",checked:"phone"===x,onChange:()=>f("phone"),className:"focus:ring-purple-500"}),(0,o.jsx)("span",{children:"X\xe1c minh qua S\u1ed1 \u0111i\u1ec7n tho\u1ea1i"})]})]}),k&&(0,o.jsx)("p",{className:"text-red-500 text-xs italic text-center",children:k}),(0,o.jsx)("button",{type:"submit",className:"w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",children:O?"\u0110ang \u0111\u0103ng k\xfd...":"\u0110\u0103ng k\xfd"})]}):(0,o.jsxs)("form",{className:"space-y-5",onSubmit:async e=>{e.preventDefault();try{const e=await q({verificationMethod:x,phoneNumber:"phone"===x?N:void 0,email:"email"===x?h:void 0,verificationCode:v}).unwrap();if(null===e||void 0===e||!e.success)throw new Error("X\xe1c minh OTP th\u1ea5t b\u1ea1i");V("success","X\xe1c minh OTP th\xe0nh c\xf4ng! Vui l\xf2ng \u0111\u0103ng nh\u1eadp."),C("/login")}catch(s){var t,n;const e=(null===s||void 0===s||null===(t=s.response)||void 0===t||null===(n=t.data)||void 0===n?void 0:n.message)||"X\xe1c minh OTP th\u1ea5t b\u1ea1i. Vui l\xf2ng th\u1eed l\u1ea1i.";V("error",e)}},children:[(0,o.jsxs)("div",{children:[(0,o.jsx)("label",{className:"block text-gray-700 mb-1",children:"M\xe3 OTP"}),(0,o.jsx)("input",{type:"text",placeholder:"Nh\u1eadp m\xe3 OTP",value:v,onChange:e=>b(e.target.value),required:!0,className:"w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-gray-700"})]}),k&&(0,o.jsx)("p",{className:"text-red-500 text-xs italic text-center",children:k}),(0,o.jsx)("button",{type:"submit",className:"w-full py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2",children:P?"\u0110ang x\xe1c minh...":"X\xe1c minh OTP"})]})]}),(0,o.jsx)(i.A,{open:A,onClose:()=>{X(!1)},severity:D,message:E})]})}},76384:(e,t,n)=>{n.d(t,{A:()=>c});var s=n(65043),l=n(90182),a=n(77518),r=n(5897),i=n(70579);const o=s.forwardRef((function(e,t){return(0,i.jsx)(a.A,{elevation:6,ref:t,variant:"filled",...e})})),c=e=>{let{open:t,onClose:n,severity:s,message:a,autoHideDuration:c=3e3,TransitionComponent:u=r.A}=e;return(0,i.jsx)(l.A,{open:t,autoHideDuration:c,onClose:n,TransitionComponent:u,anchorOrigin:{vertical:"top",horizontal:"right"},children:(0,i.jsx)(o,{onClose:n,severity:s,sx:{width:"100%"},children:a})})}}}]);
//# sourceMappingURL=3243.d70c4b81.chunk.js.map