/* WhatsApp number (country code + digits, no + or spaces): +91 85889 91413 */
const WA_NUMBER="918588991413";

const PLANS=[{mbps:50,price:{1:449,3:1249,6:2499,12:4999}},{mbps:100,price:{1:499,3:1399,6:2799,12:5599}},{mbps:150,price:{1:549,3:1499,6:2999,12:6299}},{mbps:200,price:{1:599,3:1649,6:3399,12:6999}},{mbps:300,price:{1:699,3:1899,6:3899,12:7999}},{mbps:400,price:{1:849,3:2349,6:4899,12:9899}},{mbps:600,price:{1:1199,3:3299,6:6599,12:13199}},{mbps:1000,price:{1:1999,3:5499,6:10999,12:21999}}];
/* OTT platforms: edit this list. Add a third value like "ott/hoichoi.png" (put the file in the ott folder) to show a logo image instead of the name tile. */
const OTT=[["JioHotstar","#1f4fd8","ott/jiohotstar.png"],["SonyLIV","#7a7a7a","ott/sonyliv.png"],["ZEE5","#7a2bd9","ott/zee5.png"],["Prime Video","#0a8ad6"],["Discovery+","#1d5cff"],["Lionsgate Play","#d4161c"],["Sun NXT","#f08a00"],["Aha","#f26b00"],["Hoichoi","#e5262b"],["ALTBalaji","#e5262b","ott/altbalaji.png"],["Eros Now","#c4122f"],["ShemarooMe","#e8590c"],["Hungama Play","#e11d74"],["Chaupal","#2e7d32"],["Planet Marathi","#c2185b"],["FanCode","#f5821f"],["Epic On","#8e24aa"],["Docubay","#00796b"],["Klikk","#d81b60"],["MX Player","#1e88e5"]];
const TERMS=[1,3,6,12],FEATS=["5G router free to use*","350 IPTV channels","20 OTT apps","Zero installation charges*","Free landline*"];
const $=id=>document.getElementById(id),inr=n=>n.toLocaleString("en-IN"),waLink=m=>"https://wa.me/"+WA_NUMBER+"?text="+encodeURIComponent(m);
const sn=m=>m>=1000?m/1000+" Gbps":m+" Mbps",su=m=>m>=1000?[m/1000,"Gbps"]:[m,"Mbps"];
const lbl=t=>t+(t===1?" month":" months");
let term=3;
const root=(document.querySelector('link[href$="style.css"]').getAttribute("href")).replace("style.css","");

document.querySelectorAll("[data-wa]").forEach(a=>{a.href=waLink(a.dataset.wa);a.target="_blank";a.rel="noopener"});
$("yr").textContent=new Date().getFullYear();
const mb=$("menuBtn"),mn=$("menu");mb.onclick=()=>mb.setAttribute("aria-expanded",mn.classList.toggle("open"));

/* counters */
function countUp(el){const n=+el.dataset.n,s=el.dataset.s||"",p=el.dataset.p||"";if(!n){el.textContent=p+n+s;return}
const t0=performance.now();(function f(t){const k=Math.min((t-t0)/1200,1);el.textContent=p+Math.round(n*(1-Math.pow(1-k,3)))+s;if(k<1)requestAnimationFrame(f)})(t0)}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.querySelectorAll("[data-n]").forEach(countUp);io.unobserve(e.target)}}),{threshold:.4});
document.querySelectorAll(".stats").forEach(s=>io.observe(s));

/* home: gauge + plan rail + speed race */
if($("gn")){const sp=[50,100,150,200,300,400,600,1000];let k=7,cur=1000;$("gf").style.transition="none";
  const set=v=>{const g=v>=999.5;$("gn").textContent=g?1:Math.round(v);$("gu").textContent=g?"Gbps":"Mbps";$("gf").style.strokeDashoffset=540*(1-v/1000*.78)};set(1000);
  setInterval(()=>{k=(k+1)%8;const from=cur,to=sp[k],t0=performance.now();(function f(t){const p=Math.min((t-t0)/900,1);cur=from+(to-from)*(1-Math.pow(1-p,3));set(cur);if(p<1)requestAnimationFrame(f)})(t0)},2400);
  $("rail").innerHTML=PLANS.map(p=>`<a href="plans/${p.mbps}-mbps.html"><b>${su(p.mbps)[0]}</b><span>${su(p.mbps)[1]} unlimited</span><em>From Rs ${inr(p.price[1])}</em><small>per month</small></a>`).join("");
  const rows=[...document.querySelectorAll(".rrow")],fmt=m=>{const s=16000/m;return s<60?Math.round(s)+" seconds":(s/60).toFixed(1)+" minutes"};
  rows.forEach(r=>r.querySelector("span").textContent="2 GB in "+fmt(+r.dataset.m));let raf;
  $("raceBtn").onclick=()=>{cancelAnimationFrame(raf);rows.forEach(r=>{r.classList.remove("done");r.querySelector("i").style.width="0";r.querySelector("span").textContent="downloading"});
    const t0=performance.now();(function f(t){let live=0;rows.forEach(r=>{const m=+r.dataset.m,d=8000*50/m,p=Math.min((t-t0)/d,1);r.querySelector("i").style.width=p*100+"%";
      if(p>=1&&!r.classList.contains("done")){r.classList.add("done");r.querySelector("span").textContent="done in "+fmt(m)}if(p<1)live=1});if(live)raf=requestAnimationFrame(f)})(t0);$("raceBtn").textContent="Race again"};
}

/* plans page */
function cards(){
  $("seg").innerHTML=TERMS.map(t=>`<button type="button" data-t="${t}" aria-pressed="${t===term}">${lbl(t)}</button>`).join("");
  $("grid").innerHTML=PLANS.map(p=>{const tot=p.price[term],pm=Math.round(tot/term),sv=p.price[1]*term-tot;
    const per=term===1?"Pay month to month":`Rs ${inr(pm)} a month`+(sv>0?` <mark>Save Rs ${inr(sv)}</mark>`:"");
    return `<article class="card" data-m="${p.mbps}"><span class="tag" style="display:none">Suggested for you</span><div class="mbps">${su(p.mbps)[0]}<small>${su(p.mbps)[1]}</small></div><div class="unl">Unlimited internet</div><div class="price"><sup>Rs</sup><span class="pn" data-m="${p.mbps}" data-v="${tot}">${inr(tot)}</span></div><div class="per">${per}</div><ul>${FEATS.map(f=>`<li>${f}</li>`).join("")}</ul><div class="oapps"><span>Included OTT apps</span><div>${OTT.filter(o=>o[2]).map(o=>`<img src="${root}${o[2]}" alt="${o[0]}" title="${o[0]}">`).join("")}<em>+${OTT.length-OTT.filter(o=>o[2]).length} more</em></div></div>
    <a class="btn" target="_blank" rel="noopener" href="${waLink(`Hi Shri Fibernet, I want the ${sn(p.mbps)} plan for ${lbl(term)} (Rs ${tot}).`)}">Get started</a><a class="more" href="plans/${p.mbps}-mbps.html">Plan details</a></article>`}).join("");
  window._pv=window._pv||{};
  document.querySelectorAll(".pn").forEach(el=>{const to=+el.dataset.v,m=el.dataset.m,from=window._pv[m]===undefined?to:window._pv[m];window._pv[m]=to;if(from===to)return;
    const t0=performance.now();(function f(t){const k=Math.min((t-t0)/550,1);el.textContent=inr(Math.round(from+(to-from)*(1-Math.pow(1-k,3))));if(k<1)requestAnimationFrame(f)})(t0)});
  $("tbl").innerHTML=`<tr><th>Speed</th>${TERMS.map(t=>`<th>${lbl(t)}</th>`).join("")}<th>Best per month</th></tr>`+PLANS.map(p=>`<tr><td><a href="plans/${p.mbps}-mbps.html">${sn(p.mbps)}</a></td>${TERMS.map(t=>`<td>Rs ${inr(p.price[t])}</td>`).join("")}<td>Rs ${inr(Math.round(p.price[12]/12))}</td></tr>`).join("");
  finder()}
const USES=[{k:"Browsing & calls",d:"Social, email, WhatsApp",m:5},{k:"HD streaming",d:"OTT, TV, online classes",m:12},{k:"4K & work from home",d:"Video meetings, 4K shows",m:25},{k:"Gaming & big downloads",d:"Online games, updates",m:40}];let use=1;
function finder(){const p=+$("people").value,d=+$("devices").value;$("peopleOut").textContent=p;$("devOut").textContent=d;
  const need=(p*USES[use].m+d*2)*1.25,rec=PLANS.map(x=>x.mbps).find(m=>m>=need)||1000,pl=PLANS.find(x=>x.mbps===rec);
  $("recNum").textContent=su(rec)[0];$("recUnit").textContent=su(rec)[1];$("recBar").style.width=rec/10+"%";
  $("recText").textContent=`${p} ${p===1?"person":"people"} and ${d} devices doing ${USES[use].k.toLowerCase()} need roughly ${Math.round(need)} Mbps with headroom.`+(need>1000?" That is above our top plan, so 1 Gbps is the best fit.":"");
  $("recBtn").href=waLink(`Hi Shri Fibernet, I want the ${sn(rec)} plan for ${lbl(term)} (Rs ${pl.price[term]}).`);
  document.querySelectorAll(".card").forEach(c=>{c.classList.toggle("rec",+c.dataset.m===rec);c.querySelector(".tag").style.display=+c.dataset.m===rec?"":"none"})}
if($("grid")){
  $("use").innerHTML=USES.map((u,i)=>`<button type="button" data-u="${i}" aria-pressed="${i===use}">${u.k}<small>${u.d}</small></button>`).join("");
  $("use").onclick=e=>{const b=e.target.closest("button");if(!b)return;use=+b.dataset.u;document.querySelectorAll("#use button").forEach(x=>x.setAttribute("aria-pressed",x===b));finder()};
  $("seg").onclick=e=>{const b=e.target.closest("button");if(b){term=+b.dataset.t;cards()}};
  ["people","devices"].forEach(i=>$(i).oninput=finder);cards();
}

/* plan detail page */
if($("detail")){const p=PLANS.find(x=>x.mbps===+$("detail").dataset.m);
  $("detail").innerHTML=`<h3 style="font-size:24px;padding:18px 0 4px">Choose your duration</h3>`+TERMS.map(t=>{const tot=p.price[t],sv=p.price[1]*t-tot;
  return `<div class="prow"><div><b>Rs ${inr(tot)}</b><span>${lbl(t)}`+(t>1?` · Rs ${inr(Math.round(tot/t))} a month`+(sv>0?` · save Rs ${inr(sv)}`:""):" · pay monthly")+`</span></div><a class="btn btn-red" target="_blank" rel="noopener" href="${waLink(`Hi Shri Fibernet, I want the ${sn(p.mbps)} plan for ${lbl(t)} (Rs ${tot}).`)}">Get started</a></div>`}).join("")}

/* services: tabs + download bars */
function dlBars(){document.querySelectorAll(".dl[data-t]").forEach(r=>{const m=+r.dataset.t,s=16000/m;r.querySelector("span").textContent="about "+(s<60?Math.round(s)+" seconds":(s/60).toFixed(1)+" minutes");
  const i=r.querySelector("i");i.style.width="0";requestAnimationFrame(()=>requestAnimationFrame(()=>i.style.width=m/10+"%"))})}
if($("tabs")){$("tabs").onclick=e=>{const b=e.target.closest("button");if(!b)return;document.querySelectorAll("#tabs button").forEach(x=>x.setAttribute("aria-selected",x===b));
  document.querySelectorAll(".pane").forEach(p=>p.classList.toggle("on",p.dataset.pane===b.dataset.p));if(b.dataset.p==="0")dlBars()};dlBars()}

const tile=o=>`<span class="otile${o[2]?" im":""}" style="--c:${o[1]}" title="${o[0]}">${o[2]?`<img src="${root}${o[2]}" alt="${o[0]}">`:`<i></i><b>${o[0]}</b>`}</span>`;
document.querySelectorAll("[data-ott]").forEach(el=>{
  const all=OTT.map(tile).join("");
  if(el.dataset.ott==="marquee"){el.classList.add("marq");const rv=OTT.slice().reverse().map(tile).join("");el.innerHTML=`<div class="mtrack">${all}${all}</div><div class="mtrack rev">${rv}${rv}</div>`}
  else{el.classList.add("ogrid");el.innerHTML=all}
});

/* corporate page */
if($("corpForm")){
  const CU=[{k:"Email and web",d:"Browsing, cloud documents",m:3},{k:"Cloud apps and video calls",d:"Meetings, CRM, backups",m:8},{k:"Heavy uploads and CCTV",d:"Design files, cameras, servers",m:15}];let cu=1;
  const calc=()=>{const n=+$("cEmp").value;$("cEmpOut").textContent=n;const need=n*CU[cu].m*.7+20,rec=PLANS.map(x=>x.mbps).find(m=>m>=need)||1000,u=su(rec);
    $("cNum").textContent=u[0];$("cUnit").textContent=u[1];$("cBar").style.width=rec/10+"%";
    $("cText").textContent=`${n} ${n===1?"person":"people"} doing ${CU[cu].k.toLowerCase()} need roughly ${Math.round(need)} Mbps with room to grow.`+(need>1000?" This is above our fastest plan, so message us to plan the right setup.":"");
    $("cBtn").href=waLink(`Hi Shri Fibernet, I want business internet for ${n} people. The ${sn(rec)} plan looks right. Please advise.`)};
  $("cUse").innerHTML=CU.map((u,i)=>`<button type="button" data-u="${i}" aria-pressed="${i===cu}">${u.k}<small>${u.d}</small></button>`).join("");
  $("cUse").onclick=e=>{const b=e.target.closest("button");if(!b)return;cu=+b.dataset.u;document.querySelectorAll("#cUse button").forEach(x=>x.setAttribute("aria-pressed",x===b));calc()};
  $("cEmp").oninput=calc;calc();
  $("corpForm").onsubmit=e=>{e.preventDefault();const f=e.target,v=n=>f.elements[n].value.trim();
    if(!v("biz")||!v("name")){$("corpErr").textContent="Please enter your business name and your name.";return}
    $("corpErr").textContent="";
    const req=[...f.querySelectorAll("input[name=req]:checked")].map(x=>x.value);
    const lines=["Hi Shri Fibernet, I want internet for my business.","","Business: "+v("biz"),"Name: "+v("name")];
    if(v("emp"))lines.push("People: "+v("emp"));lines.push("Speed: "+f.elements.speed.value);
    if(v("addr"))lines.push("Address: "+v("addr"));if(req.length)lines.push("Needs: "+req.join(", "));
    window.open(waLink(lines.join("\n")),"_blank","noopener")}
}

/* heading underlines */
(function(){const hs=[...document.querySelectorAll(".sec h2")];if(!("IntersectionObserver"in window)){hs.forEach(h=>h.classList.add("uline"));return}
  const o=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("uline");o.unobserve(x.target)}}),{threshold:.6});hs.forEach(h=>o.observe(h))})();

/* scroll effects: reveal, progress bar, header shadow, mobile bar */
(function(){
  const els=[...document.querySelectorAll(".sec .wrap>*,.bundle a,.card,.rail a,.vals div,details,.fbox,.cform,.pricebox,.art,.race,.stats .wrap>div,.phead .wrap>*")];
  els.forEach((e,i)=>{e.classList.add("rv");e.style.transitionDelay=(i%4)*70+"ms"});
  if(!("IntersectionObserver"in window)){els.forEach(e=>e.classList.add("in"))}
  else{const o=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){const e=x.target;e.classList.add("in");o.unobserve(e);setTimeout(()=>{e.classList.remove("rv","in");e.style.transitionDelay=""},1100)}}),{threshold:.08,rootMargin:"0px 0px -4% 0px"});els.forEach(e=>o.observe(e))}
  const pr=$("prog"),hd=document.querySelector("header"),mbar=document.querySelector(".mbar");
  const sc=()=>{const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;pr.style.width=(h>0?y/h*100:0)+"%";hd.classList.toggle("sc",y>10);mbar.classList.toggle("show",y>320)};
  addEventListener("scroll",sc,{passive:true});sc();
})();
