"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[391],{38391:(e,t,n)=>{n.r(t),n.d(t,{default:()=>B});var a=n(65043),r=n(8918),o=n(47419),i=n(11645),l=n(62764),s=n(50108),d=n(82291),h=n(87734),c=n(52185),x=n(6026),u=n(86150),y=n(21327),m=n(38643),f=n(81519),g=n(91686),p=n(42261),j=n(70579);const v=()=>{var e;const{data:t,error:n,isLoading:a}=(0,l.WS)();if(a)return(0,j.jsx)(g.A,{tip:"\u0110ang t\u1ea3i bi\u1ec3u \u0111\u1ed3..."});if(n)return(0,j.jsx)(p.A,{message:"L\u1ed7i khi t\u1ea3i d\u1eef li\u1ec7u",type:"error",showIcon:!0});const r=null===t||void 0===t||null===(e=t.data)||void 0===e?void 0:e.map(((e,t)=>({month:new Date(0,t).toLocaleString("vi",{month:"short"}),completedTrips:e})));return(0,j.jsxs)("div",{className:"chart-container",style:{padding:"20px",background:"#fff",borderRadius:"8px",boxShadow:"0px 4px 8px rgba(0, 0, 0, 0.1)"},children:[(0,j.jsx)("h3",{style:{textAlign:"center",fontSize:"20px",marginBottom:"20px",color:"#333"},children:"S\u1ed1 Chuy\u1ebfn \u0110i Ho\xe0n Th\xe0nh Theo Th\xe1ng"}),(0,j.jsx)(s.u,{width:"100%",height:400,children:(0,j.jsxs)(d.E,{data:r,margin:{top:20,right:30,left:20,bottom:10},children:[(0,j.jsx)("defs",{children:(0,j.jsxs)("linearGradient",{id:"colorUv",x1:"0",y1:"0",x2:"0",y2:"1",children:[(0,j.jsx)("stop",{offset:"5%",stopColor:"#4f85f1",stopOpacity:.9}),(0,j.jsx)("stop",{offset:"95%",stopColor:"#4f85f1",stopOpacity:.5})]})}),(0,j.jsx)(h.d,{strokeDasharray:"3 3",stroke:"#e0e0e0"}),(0,j.jsx)(c.W,{dataKey:"month",tick:{fontSize:14}}),(0,j.jsx)(x.h,{tick:{fontSize:14},label:{value:"S\u1ed1 chuy\u1ebfn \u0111i ho\xe0n th\xe0nh",angle:-90,position:"insideLeft",fontSize:14,color:"#333"},allowDecimals:!1,domain:[0,"dataMax"]}),(0,j.jsx)(u.m,{contentStyle:{backgroundColor:"#555",color:"#fff",borderRadius:"5px",border:"none",fontSize:14},labelStyle:{color:"#fff",fontWeight:"bold"},formatter:e=>`${e} chuy\u1ebfn`,labelFormatter:e=>` ${e}   `}),(0,j.jsx)(y.s,{verticalAlign:"top",height:36,formatter:()=>"S\u1ed1 chuy\u1ebfn \u0111i"}),(0,j.jsx)(m.y,{dataKey:"completedTrips",fill:"url(#colorUv)",radius:[4,4,0,0],barSize:40,children:(0,j.jsx)(f.Z,{dataKey:"completedTrips",position:"top",style:{fontSize:12,fill:"#333",fontWeight:"bold"}})})]})})]})};var D=n(60163),Y=n(4240),b=n(17869),A=n(23927),T=n(94434),S=n(89073),k=n(6051),w=n(84561),M=n(86178),N=n.n(M);const{Title:C,Text:L}=A.A,{Option:O}=T.A,z=["#4f85f1","#82ca9d"],$=()=>{var e,t,n;const r=N()().year(),f=N()().month()+1,[v,A]=(0,a.useState)("month"),[M,$]=(0,a.useState)({day:N()().format("YYYY-MM-DD"),month:f,year:r}),[V,W]=(0,a.useState)({startDate:N()().startOf("month").format("YYYY-MM-DD"),endDate:N()().endOf("month").format("YYYY-MM-DD")});(0,a.useEffect)((()=>{let e,t;"day"===v?(e=M.day,t=M.day):"month"===v?(e=N()().year(M.year).month(M.month-1).startOf("month").format("YYYY-MM-DD"),t=N()().year(M.year).month(M.month-1).endOf("month").format("YYYY-MM-DD")):"year"===v&&(e=N()().year(M.year).startOf("year").format("YYYY-MM-DD"),t=N()().year(M.year).endOf("year").format("YYYY-MM-DD")),W({startDate:e,endDate:t})}),[v,M]);const K=(e,t)=>{"day"===e?$((e=>({...e,day:t?t.format("YYYY-MM-DD"):e.day}))):"month"===e?$((e=>({...e,month:t,day:N()(`${e.year}-${t}-01`).format("YYYY-MM-DD")}))):"year"===e&&$((e=>({...e,year:t,day:N()(`${t}-${e.month}-01`).format("YYYY-MM-DD")})))},{data:R,isLoading:B,error:I}=(0,l.OW)(),{data:E,isLoading:F,error:P}=(0,l.Ps)({startDate:V.startDate,endDate:V.endDate,timeFrame:v}),G=(null===R||void 0===R||null===(e=R.data)||void 0===e?void 0:e.reduce(((e,t)=>e+t.revenue),0))||0,U=null===R||void 0===R||null===(t=R.data)||void 0===t?void 0:t.map((e=>({name:"OnBoard"===e.method?"Thanh to\xe1n tr\u1ef1c ti\u1ebfp":"Thanh to\xe1n tr\u1ef1c tuy\u1ebfn",value:e.revenue}))),H=null===E||void 0===E||null===(n=E.data)||void 0===n?void 0:n.map((e=>({period:e.date,revenue:e.revenue})));return B||F?(0,j.jsx)(g.A,{tip:"\u0110ang t\u1ea3i d\u1eef li\u1ec7u bi\u1ec3u \u0111\u1ed3 doanh thu..."}):I||P?(0,j.jsx)(p.A,{message:"L\u1ed7i khi t\u1ea3i d\u1eef li\u1ec7u doanh thu",type:"error",showIcon:!0}):(0,j.jsxs)(S.A,{style:{borderRadius:"10px",padding:"20px"},children:[(0,j.jsx)(C,{level:4,style:{textAlign:"center",marginBottom:"20px"},children:"B\xe1o C\xe1o Doanh Thu"}),(0,j.jsxs)(o.A,{gutter:16,children:[(0,j.jsx)(i.A,{span:12,children:(0,j.jsxs)(k.A,{direction:"vertical",style:{width:"100%"},children:[(0,j.jsx)(L,{strong:!0,children:"Ch\u1ecdn Th\u1eddi Gian"}),(0,j.jsxs)(T.A,{defaultValue:"month",style:{width:"100%"},onChange:e=>A(e),children:[(0,j.jsx)(O,{value:"day",children:"Theo ng\xe0y"}),(0,j.jsx)(O,{value:"month",children:"Theo th\xe1ng"}),(0,j.jsx)(O,{value:"year",children:"Theo n\u0103m"})]}),"day"===v&&(0,j.jsx)(w.A,{style:{width:"100%"},onChange:e=>K("day",e),value:N()(M.day),format:"YYYY-MM-DD",disabledDate:e=>e&&e>N()().endOf("day")}),"month"===v&&(0,j.jsxs)(k.A,{children:[(0,j.jsx)(T.A,{style:{width:"100%"},value:M.month,onChange:e=>K("month",e),children:[...Array(12)].map(((e,t)=>(0,j.jsxs)(O,{value:t+1,children:["Th\xe1ng ",t+1]},t+1)))}),(0,j.jsx)(T.A,{style:{width:"100%"},value:M.year,onChange:e=>K("year",e),children:[r-1,r,r+1].map((e=>(0,j.jsxs)(O,{value:e,children:["N\u0103m ",e]},e)))})]}),"year"===v&&(0,j.jsx)(T.A,{style:{width:"100%"},value:M.year,onChange:e=>K("year",e),children:[r-1,r,r+1].map((e=>(0,j.jsxs)(O,{value:e,children:["N\u0103m ",e]},e)))}),(0,j.jsx)(s.u,{width:"100%",height:300,children:(0,j.jsxs)(d.E,{data:H,children:[(0,j.jsx)(h.d,{strokeDasharray:"3 3"}),(0,j.jsx)(c.W,{dataKey:"period"}),(0,j.jsx)(x.h,{}),(0,j.jsx)(u.m,{formatter:e=>`${e.toLocaleString("vi-VN")} VND`}),(0,j.jsx)(m.y,{dataKey:"revenue",fill:"#4f85f1"})]})})]})}),(0,j.jsxs)(i.A,{span:12,children:[(0,j.jsx)(C,{level:5,style:{textAlign:"center",marginBottom:"10px"},children:"Doanh Thu Theo Ph\u01b0\u01a1ng Th\u1ee9c Thanh To\xe1n"}),(0,j.jsxs)(L,{strong:!0,style:{display:"block",textAlign:"center",fontSize:"16px",marginBottom:"10px"},children:["T\u1ed5ng Doanh Thu: ",G.toLocaleString("vi-VN",{style:"currency",currency:"VND"})]}),(0,j.jsx)(s.u,{width:"100%",height:300,children:(0,j.jsxs)(D.r,{children:[(0,j.jsx)(Y.F,{data:U,dataKey:"value",nameKey:"name",cx:"50%",cy:"50%",outerRadius:100,label:e=>{let{name:t,percent:n}=e;return`${t}: ${(100*n).toFixed(1)}%`},children:U.map(((e,t)=>(0,j.jsx)(b.f,{fill:z[t%z.length]},`cell-${t}`)))}),(0,j.jsx)(u.m,{formatter:e=>`${e.toLocaleString("vi-VN")} VND`}),(0,j.jsx)(y.s,{verticalAlign:"bottom",height:36})]})})]})]})]})};var V=n(91898);const{Title:W}=A.A,K=()=>{const{data:e,isLoading:t,isError:n}=(0,l.Sj)();if(t)return(0,j.jsx)("p",{children:"Loading..."});if(n)return(0,j.jsx)("p",{children:"Error loading data..."});const a=[{title:"STT",dataIndex:"rank",key:"rank",align:"center",render:(e,t,n)=>{const a=n+1;return(0,j.jsx)("span",{style:{fontWeight:a<=3?"bold":"normal",color:a<=3?"#d48806":"inherit"},children:a})}},{title:"T\xean ng\u01b0\u1eddi d\xf9ng",dataIndex:"userName",key:"userName",render:(e,t,n)=>(0,j.jsx)("span",{style:{fontWeight:n<3?"bold":"normal",color:n<3?"#d48806":"inherit"},children:e})},{title:"T\u1ed5ng doanh thu",dataIndex:"totalRevenue",key:"totalRevenue",align:"right",render:e=>(0,j.jsx)("span",{style:{color:"#3f8600",fontWeight:"bold"},children:new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND"}).format(e)})}],r=null===e||void 0===e?void 0:e.data.map(((e,t)=>({key:t,userName:e._id.fullName,totalRevenue:e.totalRevenue})));return(0,j.jsxs)(S.A,{style:{maxWidth:"600px",padding:"16px",boxShadow:"0 4px 8px rgba(0,0,0,0.1)",borderRadius:"8px",backgroundColor:"#f5f5f5"},children:[(0,j.jsx)(W,{level:4,style:{textAlign:"center",color:"#1890ff",marginBottom:"16px",fontSize:"18px"},children:"Top 10 Ng\u01b0\u1eddi D\xf9ng \u0110\u1eb7t V\xe9 Nhi\u1ec1u Nh\u1ea5t"}),(0,j.jsx)(V.A,{columns:a,dataSource:r,pagination:!1,bordered:!0,size:"small",rowKey:"key",rowClassName:(e,t)=>t%2===0?"table-row-light":"table-row-dark",style:{backgroundColor:"#fff",fontSize:"12px"}})]})},{TabPane:R}=r.A,B=()=>(0,j.jsx)("div",{className:"p-6 h-[1000px] bg-white",children:(0,j.jsxs)(r.A,{defaultActiveKey:"1",children:[(0,j.jsx)(R,{tab:"T\u0103ng tr\u01b0\u1edfng ng\u01b0\u1eddi d\xf9ng",children:(0,j.jsx)(o.A,{gutter:16,children:(0,j.jsx)(i.A,{span:24,children:(0,j.jsx)(K,{})})})},"1"),(0,j.jsx)(R,{tab:"Doanh thu",children:(0,j.jsx)(o.A,{gutter:16,children:(0,j.jsx)(i.A,{span:24,children:(0,j.jsx)($,{})})})},"2"),(0,j.jsx)(R,{tab:"Chuy\u1ebfn \u0111i",children:(0,j.jsx)(o.A,{gutter:16,children:(0,j.jsx)(i.A,{span:24,children:(0,j.jsx)(v,{})})})},"3")]})})}}]);
//# sourceMappingURL=391.a18e6546.chunk.js.map