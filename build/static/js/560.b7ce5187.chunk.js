"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[560],{82179:(e,s,n)=>{n.r(s),n.d(s,{default:()=>K});var i=n(65043),r=n(62764),t=n(23927),l=n(91995),a=n(15444),c=n(59748),h=n(80349),d=n(6051),o=n(3188),m=n(91686),u=n(42261),x=n(91898),g=n(53722),p=n(67407),y=n(61966),j=n(76401),A=n(75337),b=n(62058),v=n(48677),N=n(47419),k=n(11645),f=n(1118),w=n(70579);const I=e=>e?`${e}`.replace(/\B(?=(\d{3})+(?!\d))/g,","):"",T=e=>{let{visible:s,onClose:n,onAddDriverSuccess:i}=e;const[t,{isLoading:l}]=(0,r.oS)(),[d]=c.A.useForm();return(0,w.jsx)(v.A,{title:"Th\xeam T\xe0i X\u1ebf M\u1edbi",width:720,onClose:n,visible:s,bodyStyle:{paddingBottom:80},children:(0,w.jsxs)(c.A,{layout:"vertical",form:d,onFinish:async e=>{try{const s=await t(e).unwrap();d.resetFields(),i(s.driver),n()}catch(s){h.Ay.error({message:"L\u1ed7i",description:"C\xf3 l\u1ed7i x\u1ea3y ra khi th\xeam t\xe0i x\u1ebf!"})}},children:[(0,w.jsx)(c.A.Item,{name:"fullName",label:"H\u1ecd v\xe0 T\xean",rules:[{required:!0,message:"Vui l\xf2ng nh\u1eadp h\u1ecd v\xe0 t\xean t\xe0i x\u1ebf"}],children:(0,w.jsx)(a.A,{placeholder:"Nh\u1eadp h\u1ecd v\xe0 t\xean t\xe0i x\u1ebf"})}),(0,w.jsx)(c.A.Item,{name:"email",label:"Email",rules:[{required:!0,type:"email",message:"Vui l\xf2ng nh\u1eadp email h\u1ee3p l\u1ec7"}],children:(0,w.jsx)(a.A,{placeholder:"Nh\u1eadp email"})}),(0,w.jsx)(c.A.Item,{name:"phoneNumber",label:"S\u1ed1 \u0111i\u1ec7n tho\u1ea1i",rules:[{required:!0,message:"Vui l\xf2ng nh\u1eadp s\u1ed1 \u0111i\u1ec7n tho\u1ea1i"}],children:(0,w.jsx)(a.A,{placeholder:"Nh\u1eadp s\u1ed1 \u0111i\u1ec7n tho\u1ea1i"})}),(0,w.jsx)(c.A.Item,{name:"licenseNumber",label:"Gi\u1ea5y ph\xe9p l\xe1i xe",rules:[{required:!0,message:"Vui l\xf2ng nh\u1eadp gi\u1ea5y ph\xe9p l\xe1i xe"}],children:(0,w.jsx)(a.A,{placeholder:"Nh\u1eadp gi\u1ea5y ph\xe9p l\xe1i xe"})}),(0,w.jsxs)(N.A,{gutter:16,children:[(0,w.jsx)(k.A,{span:12,children:(0,w.jsx)(c.A.Item,{name:"userName",label:"T\xean \u0111\u0103ng nh\u1eadp",rules:[{required:!0,message:"Vui l\xf2ng nh\u1eadp t\xean \u0111\u0103ng nh\u1eadp"}],children:(0,w.jsx)(a.A,{placeholder:"Nh\u1eadp t\xean \u0111\u0103ng nh\u1eadp"})})}),(0,w.jsx)(k.A,{span:12,children:(0,w.jsx)(c.A.Item,{name:"password",label:"M\u1eadt kh\u1ea9u",rules:[{required:!0,message:"Vui l\xf2ng nh\u1eadp m\u1eadt kh\u1ea9u",min:3}],children:(0,w.jsx)(a.A.Password,{placeholder:"Nh\u1eadp m\u1eadt kh\u1ea9u"})})})]}),(0,w.jsxs)(N.A,{gutter:16,children:[(0,w.jsx)(k.A,{span:12,children:(0,w.jsx)(c.A.Item,{name:"baseSalary",label:"L\u01b0\u01a1ng c\u01a1 b\u1ea3n",rules:[{required:!0,message:"Vui l\xf2ng nh\u1eadp l\u01b0\u01a1ng c\u01a1 b\u1ea3n"}],children:(0,w.jsx)(f.A,{placeholder:"Nh\u1eadp l\u01b0\u01a1ng c\u01a1 b\u1ea3n",min:0,style:{width:"100%"},formatter:e=>`${I(e)} \u0111`,parser:e=>e.replace(/\u0111\s?|(,*)/g,"")})})}),(0,w.jsx)(k.A,{span:12,children:(0,w.jsx)(c.A.Item,{name:"salaryRate",label:"M\u1ee9c l\u01b0\u01a1ng m\u1ed7i chuy\u1ebfn",rules:[{required:!0,message:"Vui l\xf2ng nh\u1eadp m\u1ee9c l\u01b0\u01a1ng m\u1ed7i chuy\u1ebfn"}],children:(0,w.jsx)(f.A,{placeholder:"Nh\u1eadp m\u1ee9c l\u01b0\u01a1ng m\u1ed7i chuy\u1ebfn",min:0,style:{width:"100%"},formatter:e=>`${I(e)} \u0111`,parser:e=>e.replace(/\u0111\s?|(,*)/g,"")})})})]}),(0,w.jsxs)("div",{className:"flex justify-end gap-4",children:[(0,w.jsx)(o.Ay,{onClick:n,className:"bg-gray-300",children:"H\u1ee7y"}),(0,w.jsx)(o.Ay,{type:"primary",htmlType:"submit",loading:l,className:"bg-blue-500 text-white",children:"Th\xeam"})]})]})})};var C=n(84561),S=n(8354),L=n(86178),V=n.n(L);const{Title:D,Text:q}=t.A,F=e=>{let{visible:s,onClose:n,driver:t}=e;const[a]=(0,r.b2)(),[d]=c.A.useForm(),[o,m]=(0,i.useState)(null);return(0,w.jsxs)(l.A,{title:`T\xednh L\u01b0\u01a1ng Cho T\xe0i X\u1ebf: ${t.userId.fullName}`,visible:s,onOk:()=>{d.submit()},onCancel:n,okText:"T\xednh L\u01b0\u01a1ng",cancelText:"H\u1ee7y",children:[(0,w.jsxs)(c.A,{form:d,onFinish:async e=>{const{month:s,bonuses:n,deductions:i}=e,r=V()(s).startOf("month").format("YYYY-MM-DD"),l=V()(s).endOf("month").format("YYYY-MM-DD");try{const e=await a({userId:t.userId._id,startDate:r,endDate:l,bonuses:n||0,deductions:i||0}).unwrap();m(e.salaryRecord),h.Ay.success({message:"T\xednh l\u01b0\u01a1ng th\xe0nh c\xf4ng",description:`L\u01b0\u01a1ng \u0111\xe3 \u0111\u01b0\u1ee3c t\xednh v\xe0 l\u01b0u cho t\xe0i x\u1ebf ${t.userId.fullName}.`})}catch(d){var c;h.Ay.error({message:"L\u1ed7i khi t\xednh l\u01b0\u01a1ng",description:(null===(c=d.data)||void 0===c?void 0:c.message)||"C\xf3 l\u1ed7i x\u1ea3y ra khi t\xednh l\u01b0\u01a1ng."})}},layout:"vertical",children:[(0,w.jsx)(c.A.Item,{name:"month",label:"Ch\u1ecdn th\xe1ng",rules:[{required:!0,message:"Vui l\xf2ng ch\u1ecdn th\xe1ng"}],children:(0,w.jsx)(C.A,{picker:"month",style:{width:"100%"},disabledDate:e=>e&&e>V()().endOf("month")})}),(0,w.jsx)(c.A.Item,{name:"bonuses",label:"Kho\u1ea3n th\u01b0\u1edfng",children:(0,w.jsx)(f.A,{style:{width:"100%"},placeholder:"Nh\u1eadp kho\u1ea3n th\u01b0\u1edfng (n\u1ebfu c\xf3)",formatter:e=>`${e}`.replace(/\B(?=(\d{3})+(?!\d))/g,","),parser:e=>e.replace(/\$\s?|(,*)/g,"")})}),(0,w.jsx)(c.A.Item,{name:"deductions",label:"Kho\u1ea3n kh\u1ea5u tr\u1eeb",children:(0,w.jsx)(f.A,{style:{width:"100%"},placeholder:"Nh\u1eadp kho\u1ea3n kh\u1ea5u tr\u1eeb (n\u1ebfu c\xf3)",formatter:e=>`${e}`.replace(/\B(?=(\d{3})+(?!\d))/g,","),parser:e=>e.replace(/\$\s?|(,*)/g,"")})})]}),o&&(0,w.jsxs)("div",{style:{marginTop:"20px"},children:[(0,w.jsx)(S.A,{}),(0,w.jsx)(D,{level:5,children:"Chi Ti\u1ebft L\u01b0\u01a1ng"}),(0,w.jsxs)(q,{children:[(0,w.jsx)("b",{children:"L\u01b0\u01a1ng c\u01a1 b\u1ea3n:"})," ",o.baseSalary.toLocaleString("vi-VN")," VND"]}),(0,w.jsx)("br",{}),(0,w.jsxs)(q,{children:[(0,w.jsx)("b",{children:"Thu nh\u1eadp t\u1eeb chuy\u1ebfn \u0111i:"})," ",o.tripEarnings.toLocaleString("vi-VN")," VND"]}),(0,w.jsx)("br",{}),(0,w.jsxs)(q,{children:[(0,w.jsx)("b",{children:"T\u1ed5ng l\u01b0\u01a1ng:"})," ",o.totalSalary.toLocaleString("vi-VN")," VND"]}),(0,w.jsx)("br",{}),(0,w.jsxs)(q,{children:[(0,w.jsx)("b",{children:"Kho\u1ea3n th\u01b0\u1edfng:"})," ",o.bonuses.toLocaleString("vi-VN")," VND"]}),(0,w.jsx)("br",{}),(0,w.jsxs)(q,{children:[(0,w.jsx)("b",{children:"Kho\u1ea3n kh\u1ea5u tr\u1eeb:"})," ",o.deductions.toLocaleString("vi-VN")," VND"]})]})]})},{Title:$}=t.A,{confirm:M}=l.A,{Search:B}=a.A,Y=e=>new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND",minimumFractionDigits:0,maximumFractionDigits:0}).format(e),K=()=>{const{data:e,isLoading:s,isError:n,refetch:t}=(0,r.BI)(),[l]=(0,r.oP)(),[a]=(0,r.qb)(),[v]=(0,r.n0)(),[N,k]=(0,i.useState)([]),[f,I]=(0,i.useState)([]),[C,S]=(0,i.useState)(!1),[L,V]=(0,i.useState)(!1),[D,q]=(0,i.useState)(null),[K,R]=(0,i.useState)(null),[X]=c.A.useForm();(0,i.useEffect)((()=>{e&&e.drivers&&(k(e.drivers),I(e.drivers))}),[e]);const E=[{title:"T\xean t\xe0i x\u1ebf",dataIndex:["userId","fullName"],key:"fullName",render:e=>(0,w.jsxs)("span",{children:[(0,w.jsx)(g.A,{style:{marginRight:5}}),e]})},{title:"Email",dataIndex:["userId","email"],key:"email"},{title:"S\u1ed1 \u0111i\u1ec7n tho\u1ea1i",dataIndex:["userId","phoneNumber"],key:"phoneNumber"},{title:"Gi\u1ea5y ph\xe9p l\xe1i xe",dataIndex:"licenseNumber",key:"licenseNumber"},{title:"L\u01b0\u01a1ng c\u01a1 b\u1ea3n",dataIndex:"baseSalary",key:"baseSalary",render:e=>Y(e)},{title:"M\u1ee9c l\u01b0\u01a1ng m\u1ed7i chuy\u1ebfn",dataIndex:"salaryRate",key:"salaryRate",render:e=>Y(e)},{title:"Thao t\xe1c",key:"action",render:(e,s)=>(0,w.jsxs)(d.A,{size:"middle",children:[(0,w.jsx)(o.Ay,{type:"link",icon:(0,w.jsx)(p.A,{}),onClick:()=>{return R(e=s),void X.setFieldsValue(e);var e},children:"S\u1eeda"}),(0,w.jsx)(o.Ay,{type:"link",icon:(0,w.jsx)(y.A,{}),danger:!0,onClick:()=>{return e=s._id,void M({title:"B\u1ea1n c\xf3 ch\u1eafc ch\u1eafn mu\u1ed1n x\xf3a t\xe0i x\u1ebf n\xe0y kh\xf4ng?",onOk:async()=>{try{await a(e).unwrap(),h.Ay.success({message:"X\xf3a th\xe0nh c\xf4ng",description:"T\xe0i x\u1ebf \u0111\xe3 \u0111\u01b0\u1ee3c x\xf3a th\xe0nh c\xf4ng."}),t()}catch(s){h.Ay.error({message:"L\u1ed7i",description:"C\xf3 l\u1ed7i x\u1ea3y ra khi x\xf3a t\xe0i x\u1ebf!"})}}});var e},children:"X\xf3a"}),(0,w.jsx)(o.Ay,{type:"link",onClick:()=>(async e=>{try{await v(e).unwrap(),h.Ay.success({message:"Thay \u0111\u1ed5i tr\u1ea1ng th\xe1i th\xe0nh c\xf4ng",description:"Tr\u1ea1ng th\xe1i c\u1ee7a t\xe0i x\u1ebf \u0111\xe3 \u0111\u01b0\u1ee3c c\u1eadp nh\u1eadt."}),t()}catch(s){h.Ay.error({message:"L\u1ed7i",description:"C\xf3 l\u1ed7i x\u1ea3y ra khi thay \u0111\u1ed5i tr\u1ea1ng th\xe1i t\xe0i x\u1ebf!"})}})(s.userId._id),children:s.isActive?"V\xf4 hi\u1ec7u h\xf3a":"K\xedch ho\u1ea1t"}),(0,w.jsx)(o.Ay,{type:"link",icon:(0,w.jsx)(j.A,{}),onClick:()=>(q(s),void V(!0)),children:"T\xednh l\u01b0\u01a1ng"})]})}];return(0,w.jsxs)("div",{className:"manage-drivers bg-white p-6 shadow-md rounded-lg",children:[(0,w.jsxs)("div",{className:"flex justify-between items-center mb-6",children:[(0,w.jsxs)($,{level:3,className:"text-gray-700",children:[(0,w.jsx)(g.A,{style:{marginRight:8}}),"Qu\u1ea3n L\xfd T\xe0i X\u1ebf"]}),(0,w.jsx)(o.Ay,{type:"primary",icon:(0,w.jsx)(A.A,{}),onClick:()=>{S(!0)},children:"Th\xeam T\xe0i X\u1ebf M\u1edbi"})]}),(0,w.jsx)(d.A,{style:{marginBottom:16},children:(0,w.jsx)(B,{placeholder:"T\xecm ki\u1ebfm t\xe0i x\u1ebf...",onSearch:e=>{if(e){const s=N.filter((s=>s.userId.fullName.toLowerCase().includes(e.toLowerCase())||s.userId.email.toLowerCase().includes(e.toLowerCase())||s.licenseNumber.toLowerCase().includes(e.toLowerCase())));I(s)}else I(N)},enterButton:(0,w.jsx)(b.A,{})})}),s?(0,w.jsx)("div",{className:"flex justify-center items-center py-10",children:(0,w.jsx)(m.A,{tip:"\u0110ang t\u1ea3i danh s\xe1ch t\xe0i x\u1ebf...",size:"large"})}):n?(0,w.jsx)("div",{className:"flex justify-center items-center py-10",children:(0,w.jsx)(u.A,{message:"C\xf3 l\u1ed7i x\u1ea3y ra khi t\u1ea3i danh s\xe1ch t\xe0i x\u1ebf",description:n.message,type:"error",showIcon:!0})}):(0,w.jsx)(x.A,{dataSource:f,columns:E,rowKey:"_id",pagination:{pageSize:5}}),(0,w.jsx)(T,{visible:C,onClose:()=>{S(!1)},onAddDriverSuccess:e=>{k((s=>[...s,e])),I((s=>[...s,e])),t(),h.Ay.success({message:"Th\xeam t\xe0i x\u1ebf th\xe0nh c\xf4ng",description:`T\xe0i x\u1ebf ${e.userId.fullName} \u0111\xe3 \u0111\u01b0\u1ee3c th\xeam th\xe0nh c\xf4ng.`})}}),D&&(0,w.jsx)(F,{visible:L,onClose:()=>V(!1),driver:D})]})}}}]);
//# sourceMappingURL=560.b7ce5187.chunk.js.map