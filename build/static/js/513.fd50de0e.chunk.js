"use strict";(self.webpackChunkclient=self.webpackChunkclient||[]).push([[513],{2871:(e,a,t)=>{t.d(a,{A:()=>f});var n=t(5043),r=t(6213);const s="http://localhost:5000/api",c="BookingForm_bookingForm__jm2Xy",i="BookingForm_tripType__F4W87",l="BookingForm_formGroupContainer__-4t-w",o="BookingForm_formGroup__yPhDI",d="BookingForm_btnContainer__B7K7Q",h="BookingForm_btnSearch__lEVIc",_="BookingForm_switchButton__OZv7J",x="BookingForm_roundTrip__XW+aU",g="BookingForm_dateReturn__eS7YQ",j="BookingForm_ticketCount__JcdSQ";var m=t(1899),u=t.n(m);t(5015);const v={datePickerInput:"DateSelector_datePickerInput__Lvdl6",datePickerCalendar:"DateSelector_datePickerCalendar__LB-qZ","react-datepicker-wrapper":"DateSelector_react-datepicker-wrapper__DN1uF","react-datepicker":"DateSelector_react-datepicker__t-kXm","react-datepicker__header":"DateSelector_react-datepicker__header__Mnhc4","react-datepicker__current-month":"DateSelector_react-datepicker__current-month__Vb-Zy","react-datepicker__day--selected":"DateSelector_react-datepicker__day--selected__eiIxf","react-datepicker__day--keyboard-selected":"DateSelector_react-datepicker__day--keyboard-selected__NH4Px","react-datepicker__day":"DateSelector_react-datepicker__day__XQ3xU"};var p=t(579);const N=e=>{let{selectedDate:a,onDateChange:t}=e;return(0,p.jsx)(u(),{selected:a,onChange:e=>{const a=new Date(Date.UTC(e.getFullYear(),e.getMonth(),e.getDate()));t(a)},dateFormat:"dd/MM/yyyy",className:v.datePickerInput,placeholderText:"Ch\u1ecdn ng\xe0y \u0111i",calendarClassName:v.datePickerCalendar,minDate:new Date,dayClassName:e=>(e=>e<(new Date).setHours(0,0,0,0))(e)?v.pastDate:v.futureDate})},b=n.memo(N);var k=t(3216);const S=()=>{const[e,a]=(0,n.useState)([]),[t,m]=(0,n.useState)(localStorage.getItem("departure")||""),[u,v]=(0,n.useState)(localStorage.getItem("destination")||""),[N,S]=(0,n.useState)((()=>{const e=localStorage.getItem("selectedDate");return e?new Date(e):new Date})),[f,C]=(0,n.useState)(!1),[D,F]=(0,n.useState)((()=>{const e=localStorage.getItem("returnDate");return e?new Date(e):null})),[y,L]=(0,n.useState)(1),I=(0,k.Zp)();(0,n.useEffect)((()=>{(async()=>{try{const e=await(async()=>{try{return(await r.A.get(`${s}/locations`)).data.data}catch(e){throw console.error("Failed to fetch locations:",e),e}})();a(e)}catch(e){console.error("Failed to fetch locations:",e)}})()}),[]);const T=e=>{C("round-trip"===e.target.value),"round-trip"!==e.target.value&&(F(null),localStorage.removeItem("returnDate"))};return(0,p.jsxs)("div",{className:c,children:[(0,p.jsxs)("div",{className:i,children:[(0,p.jsxs)("label",{children:[(0,p.jsx)("input",{type:"radio",name:"trip",value:"one-way",defaultChecked:!0,onChange:T})," M\u1ed9t chi\u1ec1u"]}),(0,p.jsxs)("label",{children:[(0,p.jsx)("input",{type:"radio",name:"trip",value:"round-trip",onChange:T})," Kh\u1ee9 h\u1ed3i"]})]}),(0,p.jsxs)("div",{className:`${l} ${f?x:""}`,children:[(0,p.jsxs)("div",{className:o,children:[(0,p.jsx)("label",{children:"\u0110i\u1ec3m \u0111i"}),(0,p.jsxs)("select",{value:t,onChange:e=>{m(e.target.value),localStorage.setItem("departure",e.target.value)},children:[(0,p.jsx)("option",{value:"",children:"Ch\u1ecdn \u0111i\u1ec3m \u0111i"}),e.map((e=>(0,p.jsx)("option",{value:e.name,children:e.name},e._id)))]})]}),(0,p.jsx)("div",{className:_,children:(0,p.jsx)("button",{onClick:()=>{const e=t;m(u),v(e),localStorage.setItem("departure",u),localStorage.setItem("destination",e)},children:"\u2194\ufe0f"})}),(0,p.jsxs)("div",{className:o,children:[(0,p.jsx)("label",{children:"\u0110i\u1ec3m \u0111\u1ebfn"}),(0,p.jsxs)("select",{value:u,onChange:e=>{v(e.target.value),localStorage.setItem("destination",e.target.value)},children:[(0,p.jsx)("option",{value:"",children:"Ch\u1ecdn \u0111i\u1ec3m \u0111\u1ebfn"}),e.map((e=>(0,p.jsx)("option",{value:e.name,children:e.name},e._id)))]})]}),(0,p.jsxs)("div",{className:o,children:[(0,p.jsx)("label",{children:"Ng\xe0y \u0111i"}),(0,p.jsx)(b,{selectedDate:N,onDateChange:e=>{S(e),localStorage.setItem("selectedDate",e.toISOString())}})]}),f&&(0,p.jsxs)("div",{className:`${o} ${g}`,children:[(0,p.jsx)("label",{children:"Ng\xe0y v\u1ec1"}),(0,p.jsx)(b,{selectedDate:D,onDateChange:e=>{F(e),localStorage.setItem("returnDate",e.toISOString())}})]}),(0,p.jsxs)("div",{className:`${o} ${j}`,children:[(0,p.jsx)("label",{children:"S\u1ed1 v\xe9"}),(0,p.jsxs)("select",{value:y,onChange:e=>L(e.target.value),children:[(0,p.jsx)("option",{value:"1",children:"1"}),(0,p.jsx)("option",{value:"2",children:"2"}),(0,p.jsx)("option",{value:"3",children:"3"}),(0,p.jsx)("option",{value:"4",children:"4"}),(0,p.jsx)("option",{value:"5",children:"5"})]})]})]}),(0,p.jsx)("div",{className:d,children:(0,p.jsx)("button",{className:h,onClick:()=>{if(!t||!u||!N)return void alert("Vui l\xf2ng nh\u1eadp \u0111\u1ea7y \u0111\u1ee7 th\xf4ng tin!");const e=new URLSearchParams({departureLocation:t,arrivalLocation:u,departureDate:N.toISOString(),ticketCount:y});f&&D&&e.append("returnDate",D.toISOString()),I(`/search-results?${e.toString()}`)},children:"T\xecm chuy\u1ebfn xe"})})]})},f=n.memo(S)},9258:(e,a,t)=>{t.r(a),t.d(a,{default:()=>p});var n=t(5043);const r={heroSection:"HomePage_heroSection__J0jLo",heroBanner:"HomePage_heroBanner__g+PbX",bookingSection:"HomePage_bookingSection__XFqM3"};var s=t(8908);const c=t.p+"static/media/Banner.0fea3468f8a1a66a2de6.png",i="Footer_footer__+Ksbx",l="Footer_container__pm+Y6",o="Footer_contactInfo__hQLQ3",d="Footer_appLinks__xC4NB",h="Footer_downloadIcons__cYvUr",_="Footer_footerLinks__zsB7k",x="Footer_footerCol__gYbfs",g="Footer_footerLogos__BHbXm";var j=t(579);const m=()=>(0,j.jsx)("footer",{className:i,children:(0,j.jsxs)("div",{className:l,children:[(0,j.jsxs)("div",{className:o,children:[(0,j.jsx)("h3",{children:"TRUNG T\xc2M T\u1ed4NG \u0110\xc0I & CSKH"}),(0,j.jsx)("h2",{children:"1900 6067"}),(0,j.jsx)("p",{children:"C\xd4NG TY C\u1ed4 PH\u1ea6N XE KH\xc1CH PH\u01af\u01a0NG TRANG - FUTA BUS LINES"}),(0,j.jsx)("p",{children:"\u0110\u1ecba ch\u1ec9: S\u1ed1 01 T\xf4 Hi\u1ebfn Th\xe0nh, Ph\u01b0\u1eddng 3, Th\xe0nh ph\u1ed1 \u0110\xe0 L\u1ea1t, T\u1ec9nh L\xe2m \u0110\u1ed3ng, Vi\u1ec7t Nam."}),(0,j.jsxs)("p",{children:["Email: ",(0,j.jsx)("a",{href:"mailto:hotro@futa.vn",children:"hotro@futa.vn"})]}),(0,j.jsx)("p",{children:"\u0110i\u1ec7n tho\u1ea1i: 02838386852"}),(0,j.jsx)("p",{children:"Fax: 02838386853"})]}),(0,j.jsxs)("div",{className:d,children:[(0,j.jsx)("h4",{children:"T\u1ea2I APP FUTA"}),(0,j.jsxs)("div",{className:h,children:[(0,j.jsx)("img",{src:1,alt:"CH Play"}),(0,j.jsx)("img",{src:1,alt:"App Store"})]})]}),(0,j.jsxs)("div",{className:_,children:[(0,j.jsxs)("div",{className:x,children:[(0,j.jsx)("h4",{children:"FUTA Bus Lines"}),(0,j.jsxs)("ul",{children:[(0,j.jsx)("li",{children:(0,j.jsx)("a",{href:"/",children:"V\u1ec1 ch\xfang t\xf4i"})}),(0,j.jsx)("li",{children:(0,j.jsx)("a",{href:"/",children:"L\u1ecbch tr\xecnh"})}),(0,j.jsx)("li",{children:(0,j.jsx)("a",{href:"/",children:"Tuy\u1ec3n d\u1ee5ng"})}),(0,j.jsx)("li",{children:(0,j.jsx)("a",{href:"/",children:"Tin t\u1ee9c & S\u1ef1 ki\u1ec7n"})}),(0,j.jsx)("li",{children:(0,j.jsx)("a",{href:"/",children:"M\u1ea1ng l\u01b0\u1edbi v\u0103n ph\xf2ng"})})]})]}),(0,j.jsxs)("div",{className:x,children:[(0,j.jsx)("h4",{children:"H\u1ed7 tr\u1ee3"}),(0,j.jsxs)("ul",{children:[(0,j.jsx)("li",{children:(0,j.jsx)("a",{href:"/",children:"Tra c\u1ee9u th\xf4ng tin \u0111\u1eb7t v\xe9"})}),(0,j.jsx)("li",{children:(0,j.jsx)("a",{href:"/",children:"\u0110i\u1ec1u kho\u1ea3n s\u1eed d\u1ee5ng"})}),(0,j.jsx)("li",{children:(0,j.jsx)("a",{href:"/",children:"C\xe2u h\u1ecfi th\u01b0\u1eddng g\u1eb7p"})}),(0,j.jsx)("li",{children:(0,j.jsx)("a",{href:"/",children:"H\u01b0\u1edbng d\u1eabn \u0111\u1eb7t v\xe9 tr\xean Web"})}),(0,j.jsx)("li",{children:(0,j.jsx)("a",{href:"/",children:"H\u01b0\u1edbng d\u1eabn n\u1ea1p ti\u1ec1n tr\xean App"})})]})]})]}),(0,j.jsxs)("div",{className:g,children:[(0,j.jsx)("img",{src:1,alt:"FUTA Bus Lines"}),(0,j.jsx)("img",{src:1,alt:"FUTA Express"}),(0,j.jsx)("img",{src:1,alt:"FUTA Advertising"}),(0,j.jsx)("img",{src:1,alt:"Ph\xfac L\u1ed9c Rest Stop"})]})]})});var u=t(2871);const v=()=>(0,j.jsxs)("div",{className:r.homepage,children:[(0,j.jsx)(s.A,{}),(0,j.jsx)("section",{className:r.heroSection,children:(0,j.jsx)("img",{src:c,alt:"Banner",className:r.heroBanner})}),(0,j.jsx)("section",{className:r.bookingSection,children:(0,j.jsx)(u.A,{})}),(0,j.jsx)(m,{})]}),p=n.memo(v)},8908:(e,a,t)=>{t.d(a,{A:()=>_});var n=t(5043);const r={navbar:"Navbar_navbar__-317I",navbarContainer:"Navbar_navbarContainer__YXCWh",navbarLeft:"Navbar_navbarLeft__h0was",navbarRight:"Navbar_navbarRight__BabMd",languageSelect:"Navbar_languageSelect__ZxTd3",downloadApp:"Navbar_downloadApp__7D0VB",logo:"Navbar_logo__nAd6d",navLinks:"Navbar_navLinks__CUZKc",btnLogin:"Navbar_btnLogin__tD97t"};var s=t(3216),c=t(5475);const i=t.p+"static/media/logo.7ff5ff77a08c8285be2b.webp";var l=t(3003),o=t(1906),d=t(579);const h=()=>{const e=(0,l.wA)(),a=(0,s.Zp)(),t=(0,s.zy)(),n=(0,l.d4)((e=>e.user.userInfo));return(0,d.jsxs)("header",{className:r.navbar,children:[(0,d.jsxs)("div",{className:r.navbarContainer,children:[(0,d.jsxs)("div",{className:r.navbarLeft,children:[(0,d.jsxs)("select",{className:r.languageSelect,children:[(0,d.jsx)("option",{value:"vi",children:"VI"}),(0,d.jsx)("option",{value:"en",children:"EN"})]}),(0,d.jsx)("button",{className:r.downloadApp,children:"T\u1ea3i \u1ee9ng d\u1ee5ng"})]}),(0,d.jsx)("div",{className:r.navbarMiddle,children:(0,d.jsx)(c.N_,{to:"/",children:(0,d.jsx)("img",{src:i,alt:"Logo",className:r.logo})})}),(0,d.jsx)("div",{className:r.navbarRight,children:n?(0,d.jsxs)(d.Fragment,{children:[(0,d.jsxs)("span",{children:["Welcome, ",n.fullName,"!"]}),(0,d.jsx)("button",{onClick:()=>{e((0,o.ri)()),a("/")},className:r.btnLogout,children:"Logout"})]}):(0,d.jsx)("a",{href:"/login",onClick:e=>{e.preventDefault(),a("/login",{state:{from:t}})},className:r.btnLogin,children:"\u0110\u0103ng nh\u1eadp/\u0110\u0103ng k\xfd"})})]}),(0,d.jsxs)("nav",{className:r.navLinks,children:[(0,d.jsx)(c.N_,{to:"/",children:"Trang ch\u1ee7"}),(0,d.jsx)(c.N_,{to:"/lich-trinh",children:"L\u1ecbch tr\xecnh"}),(0,d.jsx)(c.N_,{to:"/tra-cuu-ve",children:"Tra c\u1ee9u v\xe9"}),(0,d.jsx)(c.N_,{to:"/tin-tuc",children:"Tin t\u1ee9c"}),(0,d.jsx)(c.N_,{to:"/hoa-don",children:"H\xf3a \u0111\u01a1n"}),(0,d.jsx)(c.N_,{to:"/lien-he",children:"Li\xean h\u1ec7"}),(0,d.jsx)(c.N_,{to:"/ve-chung-toi",children:"V\u1ec1 ch\xfang t\xf4i"})]})]})},_=n.memo(h)}}]);
//# sourceMappingURL=513.fd50de0e.chunk.js.map