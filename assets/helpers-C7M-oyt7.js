import{c as o}from"./index-qa29ia9X.js";/**
 * @license lucide-react v0.383.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=o("Star",[["polygon",{points:"12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",key:"8f66p6"}]]),a=e=>e?new Date(e).toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}):"N/A",c=e=>{if(!e)return"N/A";const t=Math.floor(e/60),r=e%60;return t>0?`${t}h ${r}m`:`${r}m`},i=e=>e?e>=1e6?`${(e/1e6).toFixed(1)}M`:e>=1e3?`${(e/1e3).toFixed(1)}K`:e.toString():"0",s=e=>e>=8?"#22c55e":e>=6?"#eab308":e>=4?"#f97316":"#ef4444",u=(e,t=150)=>e?e.length<=t?e:e.slice(0,t).trimEnd()+"…":"",d=e=>e?new Date(e).getFullYear():"",g=["#ff3d31","#ff6b61","#ff9e97","#ffcec9","#38bdf8","#7dd3fc","#0ea5e9","#0284c7","#a3e635","#86efac","#4ade80","#22c55e","#fbbf24","#f59e0b","#d97706","#92400e"],l=(e,t="w500")=>e?`https://image.tmdb.org/t/p/${t}${e}`:"https://via.placeholder.com/500x750?text=No+Image";export{g as G,f as S,c as a,i as b,l as c,d,a as f,s as g,u as t};
