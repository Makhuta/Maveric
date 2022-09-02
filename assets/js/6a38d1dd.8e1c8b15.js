"use strict";(self.webpackChunkmaveric_website=self.webpackChunkmaveric_website||[]).push([[682],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>f});var n=r(7294);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,i=function(e,t){if(null==e)return{};var r,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(i[r]=e[r]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(i[r]=e[r])}return i}var s=n.createContext({}),c=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},u=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,i=e.mdxType,o=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),m=c(r),f=i,d=m["".concat(s,".").concat(f)]||m[f]||p[f]||o;return r?n.createElement(d,a(a({ref:t},u),{},{components:r})):n.createElement(d,a({ref:t},u))}));function f(e,t){var r=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=r.length,a=new Array(o);a[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:i,a[1]=l;for(var c=2;c<o;c++)a[c]=r[c];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},8471:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>a,default:()=>p,frontMatter:()=>o,metadata:()=>l,toc:()=>c});var n=r(7462),i=(r(7294),r(3905));const o={sidebar_position:3},a="Profile",l={unversionedId:"commands/profile",id:"commands/profile",title:"Profile",description:"Usage",source:"@site/docs/commands/profile.md",sourceDirName:"commands",slug:"/commands/profile",permalink:"/docs/commands/profile",draft:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Help",permalink:"/docs/commands/help"},next:{title:"Change variable",permalink:"/docs/commands/changevariable"}},s={},c=[{value:"Usage",id:"usage",level:2},{value:"Explanation",id:"explanation",level:3},{value:"Example",id:"example",level:3},{value:"Without (user)",id:"without-user",level:4},{value:"With (user)",id:"with-user",level:4},{value:"Description",id:"description",level:2}],u={toc:c};function p(e){let{components:t,...o}=e;return(0,i.kt)("wrapper",(0,n.Z)({},u,o,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"profile"},"Profile"),(0,i.kt)("h2",{id:"usage"},"Usage"),(0,i.kt)("p",null,"/profile (",(0,i.kt)("code",null,"user"),")"),(0,i.kt)("h3",{id:"explanation"},"Explanation"),(0,i.kt)("p",null,"user - any user within the server in which is the command sent, if left empty it will show sender (you)"),(0,i.kt)("h3",{id:"example"},"Example"),(0,i.kt)("h4",{id:"without-user"},"Without (user)"),(0,i.kt)("p",null,"/profile"),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Profile with Args",src:r(6911).Z,width:"813",height:"399"})),(0,i.kt)("h4",{id:"with-user"},"With (user)"),(0,i.kt)("p",null,"/profile ",(0,i.kt)("code",null,"BulgyJoker")),(0,i.kt)("p",null,(0,i.kt)("img",{alt:"Profile without Args",src:r(347).Z,width:"813",height:"399"})),(0,i.kt)("h2",{id:"description"},"Description"),(0,i.kt)("p",null,"Shows you the the information of selected user (you) like:  "),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"If has voted for bot  "),(0,i.kt)("li",{parentName:"ul"},"Username  "),(0,i.kt)("li",{parentName:"ul"},"User discriminator (the number behind the #)  "),(0,i.kt)("li",{parentName:"ul"},"When has joined Discord platform  "),(0,i.kt)("li",{parentName:"ul"},"When has joined the server where the command was sent "),(0,i.kt)("li",{parentName:"ul"},"User highest role on server where was the command sent (on hover shows any other roles which user has if any) "),(0,i.kt)("li",{parentName:"ul"},"If it is the real owner of the server in which was the command sent")))}p.isMDXComponent=!0},347:(e,t,r)=>{r.d(t,{Z:()=>n});const n=r.p+"assets/images/profile_with_args-b9af0facac990b79fd69b8099bdf497a.gif"},6911:(e,t,r)=>{r.d(t,{Z:()=>n});const n=r.p+"assets/images/profile_without_args-424755fa3551a09913e67c8c81f728cf.gif"}}]);