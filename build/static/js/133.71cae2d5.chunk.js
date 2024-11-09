"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[133],{72133:(e,s,t)=>{t.r(s),t.d(s,{default:()=>h});var r=t(65043),o=t(83003),a=t(85627),n=t(31906),l=t(73216);class i extends Error{}function c(e){let s=e.replace(/-/g,"+").replace(/_/g,"/");switch(s.length%4){case 0:break;case 2:s+="==";break;case 3:s+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return function(e){return decodeURIComponent(atob(e).replace(/(.)/g,((e,s)=>{let t=s.charCodeAt(0).toString(16).toUpperCase();return t.length<2&&(t="0"+t),"%"+t})))}(s)}catch(t){return atob(s)}}function d(e,s){if("string"!==typeof e)throw new i("Invalid token specified: must be a string");s||(s={});const t=!0===s.header?0:1,r=e.split(".")[t];if("string"!==typeof r)throw new i(`Invalid token specified: missing part #${t+1}`);let o;try{o=c(r)}catch(a){throw new i(`Invalid token specified: invalid base64 for part #${t+1} (${a.message})`)}try{return JSON.parse(o)}catch(a){throw new i(`Invalid token specified: invalid json for part #${t+1} (${a.message})`)}}i.prototype.name="InvalidTokenError";var u=t(76384),g=t(70579);const h=()=>{var e;const[s,t]=(0,r.useState)(""),[i,c]=(0,r.useState)(""),[h,m]=(0,r.useState)(""),f=(0,o.wA)(),p=(0,l.Zp)(),x=(0,l.zy)(),[y,{isLoading:b}]=(0,a._L)(),[w,v]=(0,r.useState)(!1),[j,k]=(0,r.useState)(""),[N,S]=(0,r.useState)("success"),C=(null===(e=x.state)||void 0===e?void 0:e.from)||{pathname:"/"},A=e=>{try{const s=d(e),t={...s,token:e};console.log("Full Name:",s.fullName),localStorage.setItem("user",JSON.stringify(t)),f((0,n.LA)(t)),p(C.pathname+C.search,{replace:!0}),I("success","Social login successful!")}catch(s){m("Social login failed. Please try again."),I("error","Social login failed. Please try again.")}};(0,r.useEffect)((()=>{const e=new URLSearchParams(x.search),s=e.get("token"),t=e.get("from")||"/";s&&(A(s),p(t))}),[x]);const I=(e,s)=>{S(e),k(s),v(!0)};return(0,g.jsxs)("div",{className:"min-h-screen flex items-center justify-center bg-gray-100",children:[(0,g.jsxs)("div",{className:"bg-white shadow-md rounded-lg p-8 w-full max-w-md",children:[(0,g.jsx)("h2",{className:"text-2xl font-bold text-center mb-6",children:"Welcome Back!"}),(0,g.jsxs)("form",{className:"space-y-4",onSubmit:async e=>{e.preventDefault(),m("");try{const e=await y({userName:s,password:i}).unwrap();if(null===e||void 0===e||!e.accessToken)throw new Error("Token is missing or invalid.");{const s={...d(e.accessToken),token:e.accessToken};localStorage.setItem("user",JSON.stringify(s)),f((0,n.LA)(s)),I("success","Login successful!"),p(C.pathname+C.search,{replace:!0})}}catch(r){var t;const e=(null===r||void 0===r||null===(t=r.data)||void 0===t?void 0:t.msg)||(null===r||void 0===r?void 0:r.mmsg)||"\u0110\u0103ng nh\u1eadp th\u1ea5t b\u1ea1i. Vui l\xf2ng th\u1eed l\u1ea1i.";m(e),I("error",e)}},children:[(0,g.jsx)("div",{children:(0,g.jsx)("input",{type:"text",placeholder:"Username",value:s,onChange:e=>t(e.target.value),required:!0,className:"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"})}),(0,g.jsx)("div",{children:(0,g.jsx)("input",{type:"password",placeholder:"Password",value:i,onChange:e=>c(e.target.value),required:!0,className:"shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"})}),h&&(0,g.jsx)("p",{className:"text-red-500 text-xs italic",children:h}),(0,g.jsxs)("div",{className:"flex items-center justify-between mb-4",children:[(0,g.jsx)("a",{href:"/register",className:"text-sm text-blue-500 hover:text-blue-700",children:"Register Now?"}),(0,g.jsx)("a",{href:"/forgot-password",className:"text-sm text-blue-500 hover:text-blue-700",children:"Did you forget your password?"})]}),(0,g.jsx)("button",{type:"submit",className:"w-full bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500",children:b?"Logging in...":"Log In"})]}),(0,g.jsxs)("div",{className:"flex items-center my-4",children:[(0,g.jsx)("hr",{className:"flex-grow border-gray-300"}),(0,g.jsx)("span",{className:"mx-4 text-gray-500",children:"OR"}),(0,g.jsx)("hr",{className:"flex-grow border-gray-300"})]}),(0,g.jsxs)("div",{className:"flex justify-center space-x-4",children:[(0,g.jsxs)("button",{onClick:()=>{window.location.href="https://server-zeym.onrender.com/api/user/google"},className:"flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-full",children:[(0,g.jsx)("img",{src:"https://img.icons8.com/color/48/000000/google-logo.png",alt:"Google",className:"h-6 w-6 mr-2"}),"Google"]}),(0,g.jsxs)("button",{onClick:()=>{window.location.href="https://server-zeym.onrender.com/api/user/facebook"},className:"flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-full",children:[(0,g.jsx)("img",{src:"https://img.icons8.com/color/48/000000/facebook-new.png",alt:"Facebook",className:"h-6 w-6 mr-2"}),"Facebook"]})]})]}),(0,g.jsx)(u.A,{open:w,onClose:()=>{v(!1)},severity:N,message:j})]})}},76384:(e,s,t)=>{t.d(s,{A:()=>c});var r=t(65043),o=t(90182),a=t(77518),n=t(5897),l=t(70579);const i=r.forwardRef((function(e,s){return(0,l.jsx)(a.A,{elevation:6,ref:s,variant:"filled",...e})})),c=e=>{let{open:s,onClose:t,severity:r,message:a,autoHideDuration:c=3e3,TransitionComponent:d=n.A}=e;return(0,l.jsx)(o.A,{open:s,autoHideDuration:c,onClose:t,TransitionComponent:d,anchorOrigin:{vertical:"top",horizontal:"right"},children:(0,l.jsx)(i,{onClose:t,severity:r,sx:{width:"100%"},children:a})})}}}]);
//# sourceMappingURL=133.71cae2d5.chunk.js.map