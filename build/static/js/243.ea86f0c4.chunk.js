"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[243],{3243:(e,t,n)=>{n.r(t),n.d(t,{default:()=>u});var a=n(5043),s=n(3216),r=n(5627),o=n(3003),l=(n(1906),n(8544)),i=n(579);const u=()=>{const[e,t]=(0,a.useState)(""),[n,u]=(0,a.useState)(""),[c,d]=(0,a.useState)(""),[g,p]=(0,a.useState)(""),[h,f]=(0,a.useState)(""),[m,x]=(0,a.useState)(""),[b,y]=(0,a.useState)(1),[v,w]=(0,a.useState)(""),[N,j]=(0,a.useState)(""),S=((0,o.wA)(),(0,s.Zp)()),[C,{isLoading:P}]=(0,r.ge)(),[k,{isLoading:O}]=(0,r.x8)(),[T,E]=(0,a.useState)(!1),[q,V]=(0,a.useState)(""),[$,A]=(0,a.useState)("success"),D=(e,t)=>{A(e),V(t),E(!0)};return(0,i.jsxs)("div",{className:"min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center bg-cover bg-center bg-fixed",style:{backgroundImage:'url("https://source.unsplash.com/1600x900/?nature,water")'},children:[(0,i.jsxs)("div",{className:"bg-white shadow-md rounded-lg p-8 w-full max-w-md bg-opacity-80",children:[(0,i.jsx)("h2",{className:"text-2xl font-bold text-center mb-6",children:1===b?"Create Your Account":"Enter OTP"}),1===b?(0,i.jsxs)("form",{className:"space-y-4",onSubmit:async t=>{t.preventDefault(),j("");if(!/^[0-9]{10}$/.test(h))return void j("S\u1ed1 \u0111i\u1ec7n tho\u1ea1i ph\u1ea3i c\xf3 10 ch\u1eef s\u1ed1.");if(!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(g))return void j("Email ph\u1ea3i thu\u1ed9c mi\u1ec1n @gmail.com.");let a=h.startsWith("0")?`+84${h.slice(1)}`:h;try{const t=await C({userName:e,password:n,fullName:c,email:g,phoneNumber:a}).unwrap();if(null===t||void 0===t||!t.success)throw new Error((null===t||void 0===t?void 0:t.message)||"\u0110\u0103ng k\xfd th\u1ea5t b\u1ea1i");w(a),y(2),D("success","M\xe3 OTP \u0111\xe3 \u0111\u01b0\u1ee3c g\u1eedi!")}catch(r){var s;const e=(null===r||void 0===r||null===(s=r.data)||void 0===s?void 0:s.message)||"\u0110\u0103ng k\xfd th\u1ea5t b\u1ea1i. Vui l\xf2ng th\u1eed l\u1ea1i.";j(e),D("error",e)}},children:[(0,i.jsx)("input",{type:"text",placeholder:"Username",value:e,onChange:e=>t(e.target.value),required:!0,className:"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"}),(0,i.jsx)("input",{type:"password",placeholder:"Password",value:n,onChange:e=>u(e.target.value),required:!0,className:"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"}),(0,i.jsx)("input",{type:"text",placeholder:"Full Name",value:c,onChange:e=>d(e.target.value),required:!0,className:"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"}),(0,i.jsx)("input",{type:"email",placeholder:"Email",value:g,onChange:e=>p(e.target.value),required:!0,className:`shadow appearance-none border ${N.includes("Email")?"border-red-500":""} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500`}),(0,i.jsx)("input",{type:"text",placeholder:"Phone Number",value:h,onChange:e=>f(e.target.value),required:!0,className:`shadow appearance-none border ${N.includes("S\u1ed1 \u0111i\u1ec7n tho\u1ea1i")?"border-red-500":""} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500`}),N&&(0,i.jsx)("p",{className:"text-red-500 text-xs italic",children:N}),(0,i.jsx)("button",{type:"submit",className:"w-full bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500",children:P?"Registering...":"Register"})]}):(0,i.jsxs)("form",{className:"space-y-4",onSubmit:async e=>{e.preventDefault();try{const e=await k({phoneNumber:v,verificationCode:m}).unwrap();if(console.log("Verify Data:",e),null===e||void 0===e||!e.success)throw new Error("X\xe1c minh OTP th\u1ea5t b\u1ea1i");D("success","X\xe1c minh OTP th\xe0nh c\xf4ng! Vui l\xf2ng \u0111\u0103ng nh\u1eadp."),S("/login")}catch(a){var t,n;const e=(null===a||void 0===a||null===(t=a.response)||void 0===t||null===(n=t.data)||void 0===n?void 0:n.message)||"X\xe1c minh OTP th\u1ea5t b\u1ea1i. Vui l\xf2ng th\u1eed l\u1ea1i.";console.error("L\u1ed7i x\xe1c minh OTP: ",a),D("error",e)}},children:[(0,i.jsx)("input",{type:"text",placeholder:"Enter OTP",value:m,onChange:e=>x(e.target.value),required:!0,className:"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"}),N&&(0,i.jsx)("p",{className:"text-red-500 text-xs italic",children:N}),(0,i.jsx)("button",{type:"submit",className:"w-full bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500",children:O?"Verifying...":"Verify OTP"})]})]}),(0,i.jsx)(l.A,{open:T,onClose:()=>{E(!1)},severity:$,message:q})]})}}}]);
//# sourceMappingURL=243.ea86f0c4.chunk.js.map