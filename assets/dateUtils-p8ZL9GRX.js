import{c as i}from"./index-pPWDgRKD.js";/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const l=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],g=i("plus",l);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const u=[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]],k=i("save",u);/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]],m=i("trash-2",d),y=t=>{const n=typeof t=="string"?new Date(t):t;return new Intl.DateTimeFormat("en-US",{year:"numeric",month:"short",day:"numeric"}).format(n)},p=t=>{const n=typeof t=="string"?new Date(t):t,h=new Date().getTime()-n.getTime(),f=Math.floor(h/1e3),o=Math.floor(f/60),s=Math.floor(o/60),a=Math.floor(s/24),r=Math.floor(a/7),c=Math.floor(a/30);return f<60?"just now":o<60?`${o} minute${o>1?"s":""} ago`:s<24?`${s} hour${s>1?"s":""} ago`:a<7?`${a} day${a>1?"s":""} ago`:r<4?`${r} week${r>1?"s":""} ago`:c<12?`${c} month${c>1?"s":""} ago`:y(n)},w=t=>{const n=new Date,e=new Date;switch(t){case"week":e.setDate(e.getDate()-7);break;case"month":e.setMonth(e.getMonth()-1);break;case"quarter":e.setMonth(e.getMonth()-3);break;case"year":e.setFullYear(e.getFullYear()-1);break}return{start:e.toISOString().split("T")[0],end:n.toISOString().split("T")[0]}};export{g as P,k as S,m as T,p as a,y as f,w as g};
