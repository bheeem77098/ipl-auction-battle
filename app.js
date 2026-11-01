const socket=io();let roomCode="",isHost=false,lastRoom=null,activePanel="live",playerId=localStorage.getItem("iplPlayerId")||"";const photoCache=new Map();
socket.on("connect",()=>{const savedRoom=localStorage.getItem("iplRoomCode"),token=localStorage.getItem("iplPlayerToken");if(savedRoom&&token)socket.emit("reconnectRoom",{code:savedRoom,token});});
const $=id=>document.getElementById(id);
function show(id){["home","lobby","auction","finished"].forEach(x=>$(x).classList.toggle("hidden",x!==id))}
function toast(s){$("toast").textContent=s;$("toast").style.display="block";setTimeout(()=>$("toast").style.display="none",2600)}
function initials(n){return n.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase()}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function money(n){return `₹${Number(n||0).toFixed(2)} Cr`;}
async function playerPhoto(name){
  if(photoCache.has(name))return photoCache.get(name);
  photoCache.set(name,"");
  try{const res=await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name.replaceAll(" ","_"))}`);if(!res.ok)return "";const data=await res.json();const url=data.thumbnail?.source||"";photoCache.set(name,url);return url;}catch{return "";}
}
function setPhoto(el,name){if(!el)return;playerPhoto(name).then(url=>{if(url){el.style.backgroundImage=`linear-gradient(180deg,#07101a22,#07101a99),url("${url}")`;el.classList.add("has-photo");}});}
function setPanel(name){activePanel=name;document.querySelectorAll(".side-link").forEach(b=>b.classList.toggle("active",b.dataset.panel===name));["live","upcoming","mine","teams","budget"].forEach(x=>$(`${x}Panel`).classList.toggle("hidden",x!==name));if(lastRoom&&name!=="live")renderDetails(lastRoom);}
document.querySelectorAll(".side-link").forEach(b=>b.onclick=()=>setPanel(b.dataset.panel));
$("create").onclick=()=>socket.emit("create",{name:$("name").value.trim()||"Host"});
$("join").onclick=()=>socket.emit("join",{code:$("roomCode").value.trim(),name:$("name").value.trim()||"Player",token:localStorage.getItem("iplPlayerToken")||""});
$("start").onclick=()=>socket.emit("start");
$("simulate").onclick=()=>{if(isHost)socket.emit("simulate");};
$("share").onclick=async()=>{const url=location.origin+"?room="+roomCode;try{await navigator.clipboard.writeText(url);toast("Invite link copied! Share it with your friends.");}catch{toast("Room code: "+roomCode+" — share this with friends.");}};
socket.on("joined",d=>{roomCode=d.code;isHost=d.host;localStorage.setItem("iplRoomCode",d.code);if(d.token){localStorage.setItem("iplPlayerToken",d.token);playerId=d.token.slice(0,12);localStorage.setItem("iplPlayerId",playerId);}$("code").textContent=roomCode;$("sideRoom").textContent=roomCode;$("start").classList.toggle("hidden",!isHost);$("waiting").classList.toggle("hidden",isHost);show("lobby");});
socket.on("errorMsg",toast);
socket.on("room",r=>{lastRoom=r;$("count").textContent=`${r.players.length} / 10`;$("roster").innerHTML=r.players.map((p,i)=>`<div class="slot"><div class="avatar">${initials(p.name)}</div><div><b>${esc(p.name)}</b><small>${i===0?"HOST":"PLAYER"} · ${p.online?"CONNECTED":"OFFLINE"}</small></div></div>`).join("")+Array.from({length:10-r.players.length},()=>'<div class="slot"><div class="avatar">+</div><div><b>Waiting...</b><small>OPEN SLOT</small></div></div>').join("");
if(r.status==="waiting"){show("lobby");return}if(r.status==="finished"||r.status==="simulated"){show("finished");$("simulate").classList.toggle("hidden",!isHost||!!r.simulation);$("simulationWait").textContent=r.simulation?"Season simulation completed.":(isHost?"Ready when you are. The simulation uses each participant’s purchased squad.":"Waiting for the host to simulate the season…");if(r.simulation)renderTournament(r.simulation);else $("results").innerHTML=r.players.slice().sort((a,b)=>b.squad.length-a.squad.length).map((p,i)=>`<div class="slot"><div class="avatar">${i+1}</div><div><b>${esc(p.name)}</b><small>${p.squad.length} players · ${money(p.purse)} left</small></div></div>`).join("");return}show("auction");renderAuction(r);if(activePanel!=="live")renderDetails(r);});
function renderAuction(r){const me=r.players.find(p=>p.id===playerId);if(!r.current)return;
$("lotNo").textContent=`LOT ${String(r.lot).padStart(2,"0")} / ${r.totalLots||r.lot}`;$("timer").textContent=r.seconds;$("myPurse").textContent=money(me?.purse??120);$("upcomingCount").textContent=r.upcoming?.length||0;
$("playerName").textContent=r.current.name;$("initial").textContent=initials(r.current.name);$("role").textContent=r.current.role.toUpperCase();$("country").textContent=r.current.country.toUpperCase();$("playerMeta").textContent=`${r.current.country} · ${r.current.role}`;setPhoto($("currentPlayerArt"),r.current.name);
const s=r.current.wickets?[["WICKETS",r.current.wickets],["BOWLING RATING","Game data"],["BASE PRICE",money(r.current.base)],["ROLE",r.current.role]]:[["RUNS",r.current.runs||"—"],["AVERAGE",r.current.average||"—"],["STRIKE RATE",r.current.strikeRate||"—"],["BASE PRICE",money(r.current.base)]];
$("stats").innerHTML=s.map(x=>`<div class="stat"><small>${x[0]}</small><b>${x[1]}</b></div>`).join("");$("bid").textContent=money(r.bid);const leader=r.players.find(p=>p.id===r.leader);$("leader").textContent=leader?`Leading bid: ${leader.name}`:"No bids yet";
$("mySquad").innerHTML=me?.squad.map(p=>`<span class="chip">${esc(p.name)} · ₹${p.paid}Cr</span>`).join("")||'<span class="muted">No players bought yet</span>';
$("squadCount").textContent=`${me?.squad.length||0} players`;
$("liveRoster").innerHTML=r.players.map(p=>`<div class="liveperson"><div class="avatar">${initials(p.name)}</div><div><b>${esc(p.name)}</b><small>${p.squad.length} players · ₹${p.purse.toFixed(1)}Cr</small></div></div>`).join("");$("activity").innerHTML=r.log.slice().reverse().map(esc).join("<br>");
document.querySelectorAll("[data-add]").forEach(b=>{const amount=Number((r.bid+Number(b.dataset.add)).toFixed(2));b.disabled=!me||amount>me.purse||r.leader===playerId;b.style.opacity=b.disabled?".4":"1";});}
function playerRow(p,extra=""){return `<div class="player-row"><div class="mini-player-photo" data-player="${esc(p.name)}">${initials(p.name)}</div><div class="player-row-main"><b>${esc(p.name)}</b><small>${esc(p.role||"")} · ${esc(p.country||"")}</small></div><strong>${extra||money(p.base)}</strong></div>`;}
function renderDetails(r){const me=r.players.find(p=>p.id===playerId);const upcoming=r.upcoming||[];
$("upcomingList").innerHTML=upcoming.length?upcoming.map(p=>playerRow(p,money(p.base))).join(""):'<div class="empty-state">No upcoming players. The auction is complete.</div>';
$("myBudgetLine").textContent=`Spent: ${money(120-(me?.purse??120))} · Remaining: ${money(me?.purse??120)} · Squad: ${me?.squad.length||0} players`;
$("mySquadFull").innerHTML=me?.squad.length?me.squad.map(p=>playerRow(p,`Paid ${money(p.paid)}`)).join(""):'<div class="empty-state">You have not bought any players yet.</div>';
$("allSquads").innerHTML=r.players.map(p=>`<div class="team-card"><div class="team-card-head"><div><b>${esc(p.name)}</b><small>${p.online?"● ONLINE":"○ OFFLINE"} · ${p.squad.length} players</small></div><strong>${money(p.purse)}</strong></div><div class="team-player-list">${p.squad.length?p.squad.map(x=>`<span class="chip">${esc(x.name)} · ${x.paid} Cr</span>`).join(""):'<span class="muted">No purchases yet</span>'}</div></div>`).join("");
$("budgets").innerHTML=r.players.map(p=>{const spent=120-p.purse;const pct=Math.max(0,Math.min(100,(p.purse/120)*100));return `<div class="budget-card"><div class="team-card-head"><b>${esc(p.name)} ${p.id===playerId?"(YOU)":""}</b><strong>${money(p.purse)}</strong></div><div class="budget-track"><span style="width:${pct}%"></span></div><div class="budget-meta"><span>Spent ${money(spent)}</span><span>Remaining ${money(p.purse)}</span></div></div>`;}).join("");
document.querySelectorAll(".mini-player-photo").forEach(el=>{const name=el.dataset.player;playerPhoto(name).then(url=>{if(url){el.style.backgroundImage=`url("${url}")`;el.textContent="";}});});}
document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>{const r=lastRoom;if(r)socket.emit("bid",{amount:Number((r.bid+Number(b.dataset.add)).toFixed(2))});});
const params=new URLSearchParams(location.search);if(params.get("room")){$("roomCode").value=params.get("room");$("name").value="Player";}

function renderTournament(t){
 const cap=(label,item,emoji)=>item?`<div class="award-card"><div class="eyebrow">${emoji} ${label}</div><h3>${esc(item.player)}</h3><p>${esc(item.team)} · ${item.value} ${label==="ORANGE CAP"?"runs":"wickets"}</p></div>`:`<div class="award-card"><div class="eyebrow">${emoji} ${label}</div><p>Not enough player statistics</p></div>`;
 const champion=`<div class="champion-card"><div class="eyebrow">🏆 IPL AUCTION BATTLE CHAMPIONS</div><h2>${esc(t.champion)}</h2><p>Winner based on the simulated season</p></div>`;
 const runner=`<div class="runner-card"><div class="eyebrow">🥈 RUNNER-UP</div><h2>${esc(t.runnerUp)}</h2></div>`;
 const rows=t.table.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.name)}</td><td>${x.played}</td><td>${x.wins}</td><td>${x.losses}</td><td>${x.points}</td><td>${x.nrr}</td><td>${x.overall}</td></tr>`).join('');
 const matches=[...t.matches,...t.playoffs].map(m=>`<div class="match-row"><b>${esc(m.match)}</b><span>${esc(m.result)}</span></div>`).join('');
 $("results").innerHTML=`<div class="tournament-results">${champion}${runner}<div class="award-grid">${cap('ORANGE CAP',t.orangeCap,'🧡')}${cap('PURPLE CAP',t.purpleCap,'💜')}</div><h3>Points Table</h3><div class="table-wrap"><table><thead><tr><th>#</th><th>Team</th><th>Played</th><th>W</th><th>L</th><th>Pts</th><th>NRR</th><th>Squad rating</th></tr></thead><tbody>${rows}</tbody></table></div><h3>Match Results</h3><div class="match-list">${matches}</div><p class="hint">${esc(t.note)}</p></div>`;
}
