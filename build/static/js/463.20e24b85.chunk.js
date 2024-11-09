"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[463],{64463:(e,a,s)=>{s.r(a),s.d(a,{default:()=>v});var t=s(65043),l=s(23927),n=s(16569),d=s(3188),i=s(47419),r=s(11645),c=s(89073),o=s(91995),u=s(59748),h=s(15444),x=s(6051),j=s(75337),m=s(76191),g=s(67407),p=s(61966),A=s(39052),y=s(70579);const{Title:b}=l.A,v=()=>{var e;const[a,s]=(0,t.useState)(null),[l,v]=(0,t.useState)(!1),[w,C]=(0,t.useState)(!1),[L,N]=(0,t.useState)({name:"",address:"",city:"",coordinates:[0,0]}),{data:k,error:f,isLoading:E}=(0,A.eg)(),[q]=(0,A.yg)(),[I]=(0,A.xK)(),[F]=(0,A.L0)(),{data:S}=(0,A.$$)(a,{skip:!a}),$=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;C(!!e),N(e||{name:"",address:"",city:"",coordinates:[0,0]}),v(!0)},_=()=>v(!1);return(0,y.jsxs)("div",{className:"p-6 bg-gray-100 min-h-screen",children:[(0,y.jsx)(b,{level:2,className:"text-center text-blue-700 mb-8 font-bold",children:"Location Management"}),(0,y.jsxs)("div",{className:"bg-white p-4 rounded-lg shadow-lg mb-8",children:[(0,y.jsxs)("div",{className:"flex justify-between items-center mb-4",children:[(0,y.jsx)(b,{level:4,className:"text-blue-600",children:"All Locations"}),(0,y.jsx)(d.Ay,{type:"primary",icon:(0,y.jsx)(j.A,{}),onClick:()=>$(),className:"bg-blue-600",children:"Add Location"})]}),E&&(0,y.jsx)("p",{children:"Loading..."}),f&&(0,y.jsx)("p",{className:"text-red-500",children:"Error loading locations"}),(0,y.jsx)(i.A,{gutter:16,children:null===k||void 0===k||null===(e=k.data)||void 0===e?void 0:e.map((e=>(0,y.jsx)(r.A,{xs:24,sm:12,md:8,lg:6,children:(0,y.jsx)(c.A,{hoverable:!0,className:"location-card shadow-md hover:shadow-lg transition-shadow duration-300",actions:[(0,y.jsx)(m.A,{onClick:()=>s(e._id)}),(0,y.jsx)(g.A,{onClick:()=>$(e)}),(0,y.jsx)(p.A,{onClick:()=>(async e=>{try{await F(e).unwrap(),n.Ay.success("Location deleted successfully")}catch(f){n.Ay.error("Failed to delete location")}})(e._id)})],children:(0,y.jsx)(c.A.Meta,{title:(0,y.jsx)("span",{className:"text-blue-600 font-semibold",children:e.name}),description:`${e.address}, ${e.city}`})})},e._id)))})]}),S&&(0,y.jsxs)("div",{className:"bg-white p-4 rounded-lg shadow-lg mb-6",children:[(0,y.jsx)(b,{level:4,className:"text-blue-600",children:"Location Detail"}),(0,y.jsxs)("p",{children:[(0,y.jsx)("strong",{children:"Name:"})," ",S.data.name]}),(0,y.jsxs)("p",{children:[(0,y.jsx)("strong",{children:"Address:"})," ",S.data.address]}),(0,y.jsxs)("p",{children:[(0,y.jsx)("strong",{children:"City:"})," ",S.data.city]}),(0,y.jsxs)("p",{children:[(0,y.jsx)("strong",{children:"Coordinates:"})," ",S.data.coordinates.coordinates.join(", ")]})]}),(0,y.jsx)(o.A,{title:w?"Edit Location":"Add New Location",visible:l,onOk:async()=>{try{w?(await I({id:L._id,updatedLocation:L}).unwrap(),n.Ay.success("Location updated successfully")):(await q(L).unwrap(),n.Ay.success("Location created successfully")),_()}catch(f){n.Ay.error("Failed to save location")}},onCancel:_,okText:w?"Update":"Create",okButtonProps:{className:"bg-blue-600"},children:(0,y.jsxs)(u.A,{layout:"vertical",children:[(0,y.jsx)(u.A.Item,{label:"Name",required:!0,children:(0,y.jsx)(h.A,{value:L.name,onChange:e=>N({...L,name:e.target.value}),placeholder:"Enter location name"})}),(0,y.jsx)(u.A.Item,{label:"Address",required:!0,children:(0,y.jsx)(h.A,{value:L.address,onChange:e=>N({...L,address:e.target.value}),placeholder:"Enter address"})}),(0,y.jsx)(u.A.Item,{label:"City",required:!0,children:(0,y.jsx)(h.A,{value:L.city,onChange:e=>N({...L,city:e.target.value}),placeholder:"Enter city"})}),(0,y.jsxs)(x.A,{children:[(0,y.jsx)(u.A.Item,{label:"Latitude",required:!0,children:(0,y.jsx)(h.A,{type:"number",value:L.coordinates[0],onChange:e=>N({...L,coordinates:[parseFloat(e.target.value),L.coordinates[1]]}),placeholder:"Enter latitude"})}),(0,y.jsx)(u.A.Item,{label:"Longitude",required:!0,children:(0,y.jsx)(h.A,{type:"number",value:L.coordinates[1],onChange:e=>N({...L,coordinates:[L.coordinates[0],parseFloat(e.target.value)]}),placeholder:"Enter longitude"})})]})]})})]})}}}]);
//# sourceMappingURL=463.20e24b85.chunk.js.map