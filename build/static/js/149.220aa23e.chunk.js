"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[149],{5149:(e,s,a)=>{a.r(s),a.d(s,{default:()=>l});var n=a(65043),t=a(70579);const l=()=>{const[e,s]=(0,n.useState)(!1),[a,l]=(0,n.useState)(0),c=["Hoa","Trang","Mai","Lan"];return(0,t.jsxs)("div",{className:"wheel-container",children:[(0,t.jsx)("h1",{className:"text-center",children:"V\xf2ng quay may m\u1eafn"}),(0,t.jsxs)("div",{className:"wheel-wrapper",children:[(0,t.jsx)("div",{className:"wheel "+(e?"spinning":""),style:{transform:`rotate(${a}deg)`},children:c.map(((e,s)=>(0,t.jsx)("div",{className:"wheel-segment",style:{transform:`rotate(${90*s}deg)`,backgroundColor:["#ff4d4d","#4d88ff","#ffcc00","#4dff4d"][s]},children:(0,t.jsx)("span",{className:"segment-text",children:e})},s)))}),(0,t.jsx)("div",{className:"wheel-pointer"})]}),(0,t.jsx)("button",{className:"spin-button",onClick:()=>{s(!0);const e=Math.floor(Math.random()*c.length),a=360/c.length;l(1800+e*a),setTimeout((()=>{s(!1)}),5e3)},disabled:e,children:e?"\u0110ang quay...":"Quay"})]})}}}]);
//# sourceMappingURL=149.220aa23e.chunk.js.map