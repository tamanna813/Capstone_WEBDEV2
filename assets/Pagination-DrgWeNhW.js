import{c as d,j as e}from"./index-qa29ia9X.js";/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=d("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c=d("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);function w({page:n,totalPages:i,onNext:h,onPrev:o,onGoTo:a}){const l=[];let r=Math.max(1,n-Math.floor(2.5)),s=Math.min(i,r+5-1);s-r<4&&(r=Math.max(1,s-5+1));for(let t=r;t<=s;t++)l.push(t);return i<=1?null:e.jsxs("div",{className:"flex items-center justify-center gap-1.5 mt-10",children:[e.jsx("button",{onClick:o,disabled:n===1,className:"w-9 h-9 flex items-center justify-center rounded-xl bg-dark-700 text-white/60 hover:bg-dark-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all",children:e.jsx(x,{size:16})}),r>1&&e.jsxs(e.Fragment,{children:[e.jsx("button",{onClick:()=>a(1),className:"w-9 h-9 rounded-xl bg-dark-700 text-white/60 hover:bg-dark-600 hover:text-white text-sm transition-all",children:"1"}),r>2&&e.jsx("span",{className:"text-white/30 px-1",children:"…"})]}),l.map(t=>e.jsx("button",{onClick:()=>a(t),className:`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${t===n?"brand-gradient text-white shadow-lg shadow-brand-500/30":"bg-dark-700 text-white/60 hover:bg-dark-600 hover:text-white"}`,children:t},t)),s<i&&e.jsxs(e.Fragment,{children:[s<i-1&&e.jsx("span",{className:"text-white/30 px-1",children:"…"}),e.jsx("button",{onClick:()=>a(i),className:"w-9 h-9 rounded-xl bg-dark-700 text-white/60 hover:bg-dark-600 hover:text-white text-sm transition-all",children:i})]}),e.jsx("button",{onClick:h,disabled:n===i,className:"w-9 h-9 flex items-center justify-center rounded-xl bg-dark-700 text-white/60 hover:bg-dark-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all",children:e.jsx(c,{size:16})})]})}export{w as P};
