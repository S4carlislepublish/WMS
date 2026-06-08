import { useState, useMemo } from "react";


const projectData = [
  { clientName:"Elsevier",  projectName:"Medical Science",  milestone:"Copy Editing",  batch:"B001", startDate:"2026-05-29", dueDate:"2026-06-05", remarks:"In Progress",      loginDate:"2026-05-29", completedDate:null,         nextStageDate:"2026-06-02" },
  { clientName:"Springer",  projectName:"Data Analytics",   milestone:"XML",           batch:"B002", startDate:"2026-05-28", dueDate:"2026-06-08", remarks:"Pending Review", loginDate:"2026-05-28", completedDate:null,         nextStageDate:"2026-06-05" },
  { clientName:"WK",        projectName:"Health Guide",     milestone:"Proof Reading", batch:"B003", startDate:"2026-05-27", dueDate:"2026-06-15", remarks:"Assigned",       loginDate:"2026-05-27", completedDate:null,         nextStageDate:"2026-06-10" },
  { clientName:"Pearson",   projectName:"Physics Guide",    milestone:"Final Pages",   batch:"B004", startDate:"2026-05-25", dueDate:"2026-06-12", remarks:"Completed",      loginDate:"2026-05-25", completedDate:"2026-06-10", nextStageDate:null },
  { clientName:"McGraw Hill",projectName:"Chemistry Basics",milestone:"Printer",       batch:"B005", startDate:"2026-05-24", dueDate:"2026-06-15", remarks:"Ready For Print", loginDate:"2026-05-24", completedDate:null,         nextStageDate:"2026-06-13" },
  { clientName:"Oxford",    projectName:"Biology Atlas",    milestone:"Indexing",      batch:"B006", startDate:"2026-06-01", dueDate:"2026-06-20", remarks:"Not Started",    loginDate:"2026-06-01", completedDate:null,         nextStageDate:"2026-06-16" },
  { clientName:"Elsevier",  projectName:"Neuroscience Rev", milestone:"Copyediting",   batch:"B007", startDate:"2026-06-03", dueDate:"2026-06-18", remarks:"In Progress",    loginDate:"2026-06-03", completedDate:null,         nextStageDate:"2026-06-11" },
];


const EVENT_META = {
  login:    { label:"Login",     color:"#2563eb", bg:"#eff6ff", border:"#bfdbfe" },
  start:    { label:"Started",   color:"#0891b2", bg:"#ecfeff", border:"#a5f3fc" },
  milestone:{ label:"Milestone", color:"#7c3aed", bg:"#f5f3ff", border:"#ddd6fe" },
  due:      { label:"Due",       color:"#d97706", bg:"#fffbeb", border:"#fde68a" },
  complete: { label:"Done",      color:"#059669", bg:"#ecfdf5", border:"#a7f3d0" },
  overdue:  { label:"Overdue",   color:"#dc2626", bg:"#fef2f2", border:"#fecaca" },
};


function buildEvents() {
  const events = [];
  const today = new Date(); today.setHours(0,0,0,0);
  projectData.forEach(p => {
    if (p.loginDate) events.push({ id:`${p.batch}-lg`, date:p.loginDate, type:"login",     ...p });
    if (p.startDate) events.push({ id:`${p.batch}-st`, date:p.startDate, type:"start",     ...p });
    if (p.nextStageDate) events.push({ id:`${p.batch}-ms`, date:p.nextStageDate, type:"milestone", ...p });
    if (p.dueDate) {
      const isOD = new Date(p.dueDate) < today && p.remarks !== "Completed";
      events.push({ id:`${p.batch}-du`, date:p.dueDate, type: isOD ? "overdue" : "due", ...p });
    }
    if (p.completedDate) events.push({ id:`${p.batch}-cp`, date:p.completedDate, type:"complete", ...p });
  });
  return events;
}


const ALL_EVENTS = buildEvents();


function pad(n){ return String(n).padStart(2,"0"); }
function dateStr(y,m,d){ return `${y}-${pad(m+1)}-${pad(d)}`; }


const DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];


export default function CalendarPage() {
  const [cur, setCur] = useState(new Date(2026,4,29));
  const [sel, setSel] = useState("2026-05-29");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [newEv, setNewEv] = useState({ date:"", type:"due", projectName:"", clientName:"", milestone:"", batch:"", priority:"medium", notes:"" });


  const year = cur.getFullYear(), month = cur.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();


  const today = useMemo(() => { const d=new Date(); d.setHours(0,0,0,0); return d; },[]);


  const filteredEvents = useMemo(() =>
    ALL_EVENTS.filter(e => filter==="all" || e.type===filter), [filter]);


  const eventsForDate = (ds) => filteredEvents.filter(e => e.date===ds);


  const selEvents = sel ? eventsForDate(sel) : [];


  const stats = {
    total: ALL_EVENTS.length,
    overdue: ALL_EVENTS.filter(e=>e.type==="overdue").length,
    done: ALL_EVENTS.filter(e=>e.type==="complete").length,
    thisWeek: ALL_EVENTS.filter(e=>{ const d=new Date(e.date); const diff=Math.ceil((d-today)/(864e5)); return diff>=0&&diff<=7; }).length,
  };


  const cells = [];
  for(let i=0;i<firstDay;i++) cells.push(null);
  for(let d=1;d<=daysInMonth;d++) cells.push(d);


  const isToday = (d) => d && new Date(year,month,d).getTime()===today.getTime();
  const isSel = (d) => d && dateStr(year,month,d)===sel;


  const handleSave = () => {
    if(newEv.projectName && newEv.date) setShowModal(false);
  };


  const prevMonth = () => {
    if (month === 0) {
      setCur(new Date(year - 1, 11, 1));
    } else {
      setCur(new Date(year, month - 1, 1));
    }
  };


  const nextMonth = () => {
    if (month === 11) {
      setCur(new Date(year + 1, 0, 1));
    } else {
      setCur(new Date(year, month + 1, 1));
    }
  };


  const goToToday = () => {
    const now = new Date();
    setCur(new Date(now.getFullYear(), now.getMonth(), 1));
    setSel(dateStr(now.getFullYear(), now.getMonth(), now.getDate()));
  };


  // Upcoming events with deadlines (next 14 days)
  const upcoming = useMemo(() => {
    const dueEvents = ALL_EVENTS
      .filter(e => e.type === "due" || e.type === "overdue")
      .map(e => {
        const eventDate = new Date(e.date);
        const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (864e5));
        return { ...e, daysUntil, isPast: daysUntil < 0 };
      })
      .filter(e => e.daysUntil >= 0 && e.daysUntil <= 14)
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 8);
    
    return dueEvents;
  }, [today]);


  // Get days until deadline text
  const getDaysUntilText = (days: number) => {
    if (days === 0) return "Due Today";
    if (days === 1) return "Due Tomorrow";
    if (days <= 3) return `Due in ${days} days`;
    if (days <= 7) return `Due in ${days} days`;
    return `Due in ${days} days`;
  };


  return (
    <div style={{ minHeight:"100vh", background:"#faf9f6", fontFamily:"'Segoe UI', 'Georgia', sans-serif", color:"#1a1a1a" }}>


      {/* Top strip */}
      <div style={{ background:"#1a1a1a", color:"#faf9f6", padding:"12px 32px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{ fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", opacity:0.8 }}>
          {today.toLocaleDateString("en-IN",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})}
        </div>
        <div style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", opacity:0.8 }}>
          Selva Bharath · Editorial Services
        </div>
      </div>


      {/* Masthead */}
      <div style={{ borderBottom:"3px solid #1a1a1a", padding:"28px 32px 24px", display:"flex", alignItems:"flex-end", justifyContent:"space-between", background:"#faf9f6" }}>
        <div>
          <div style={{ fontSize:11, letterSpacing:"0.2em", textTransform:"uppercase", color:"#6b5e4e", marginBottom:8 }}>Project Calendar</div>
          <h1 style={{ fontSize:56, fontWeight:700, lineHeight:1, margin:0, letterSpacing:"-0.02em", color:"#1a1a1a" }}>
            {MONTHS[month]} <span style={{ color:"#6b5e4e", fontWeight:400 }}>{year}</span>
          </h1>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button onClick={prevMonth}
            style={{ width:40,height:40,border:"2px solid #1a1a1a",background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,borderRadius:4,transition:"all 0.2s",boxShadow:"0 2px 4px rgba(0,0,0,0.1)" }}>‹</button>
          <button onClick={goToToday}
            style={{ padding:"10px 24px",border:"2px solid #1a1a1a",background:"#1a1a1a",color:"#fff",cursor:"pointer",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",borderRadius:4,fontWeight:600,transition:"all 0.2s" }}>Today</button>
          <button onClick={nextMonth}
            style={{ width:40,height:40,border:"2px solid #1a1a1a",background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,borderRadius:4,transition:"all 0.2s",boxShadow:"0 2px 4px rgba(0,0,0,0.1)" }}>›</button>
          <button onClick={()=>{ setNewEv({...newEv,date:sel||dateStr(year,month,1)}); setShowModal(true); }}
            style={{ padding:"10px 24px",border:"2px solid #c2410c",background:"#c2410c",color:"#fff",cursor:"pointer",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",borderRadius:4,fontWeight:600,transition:"all 0.2s",marginLeft:8 }}>+ Add Event</button>
        </div>
      </div>


      {/* Stat ribbon */}
      <div style={{ borderBottom:"1px solid #d4cfc8", background:"#f0ece4", display:"flex" }}>
        {[
          { label:"Total Events", val:stats.total, accent:"#1a1a1a" },
          { label:"Overdue",      val:stats.overdue, accent:"#dc2626" },
          { label:"Completed",    val:stats.done,    accent:"#059669" },
          { label:"This Week",    val:stats.thisWeek, accent:"#2563eb" },
        ].map((s,i) => (
          <div key={i} style={{ flex:1, padding:"16px 28px", borderRight: i<3?"1px solid #d4cfc8":"none", display:"flex", alignItems:"center", gap:14 }}>
            <span style={{ fontSize:36, fontWeight:700, color:s.accent, fontVariantNumeric:"tabular-nums", lineHeight:1 }}>{s.val}</span>
            <span style={{ fontSize:11, textTransform:"uppercase", letterSpacing:"0.12em", color:"#6b5e4e", lineHeight:1.4 }}>{s.label}</span>
          </div>
        ))}
      </div>


      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", minHeight:"calc(100vh - 240px)" }}>


        {/* Calendar + Upcoming */}
        <div style={{ borderRight:"1px solid #d4cfc8" }}>


          {/* Day headers */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", borderBottom:"2px solid #1a1a1a", background:"#f0ece4" }}>
            {DAYS.map(d => (
              <div key={d} style={{ padding:"12px 0", textAlign:"center", fontSize:11, letterSpacing:"0.2em", fontFamily:"'Segoe UI',serif", color:"#6b5e4e", fontWeight:700 }}>{d}</div>
            ))}
          </div>


          {/* Calendar grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)" }}>
            {cells.map((day,idx) => {
              if(!day) return <div key={idx} style={{ minHeight:130, borderBottom:"1px solid #e8e2d9", borderRight:"1px solid #e8e2d9", background:"#f7f5f0" }} />;
              const ds = dateStr(year,month,day);
              const evs = eventsForDate(ds);
              const tod = isToday(day);
              const selected = isSel(day);
              return (
                <div key={idx} onClick={()=>setSel(ds)}
                  style={{ minHeight:130, borderBottom:"1px solid #e8e2d9", borderRight:"1px solid #e8e2d9",
                    padding:"10px 8px", cursor:"pointer", position:"relative",
                    background: selected ? "#fff8f0" : tod ? "#fff" : "#faf9f6",
                    outline: selected ? "3px solid #c2410c" : tod ? "2px solid #1a1a1a" : "none",
                    outlineOffset:"-3px",
                    transition:"all 0.15s" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                    <span style={{ fontSize:14, fontWeight: tod||selected ? 700 : 400,
                      color: tod ? "#fff" : selected ? "#c2410c" : "#1a1a1a",
                      background: tod ? "#1a1a1a" : "transparent",
                      width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center",
                      borderRadius:"50%", lineHeight:1 }}>{day}</span>
                    {evs.length>0 && <span style={{ fontSize:10, letterSpacing:"0.1em", color:"#9c8f82", textTransform:"uppercase", fontWeight:600 }}>{evs.length}</span>}
                  </div>
                  <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                    {evs.slice(0,3).map(e => {
                      const m = EVENT_META[e.type]||EVENT_META.due;
                      return (
                        <div key={e.id} style={{ fontSize:9, padding:"3px 6px", borderLeft:`2px solid ${m.color}`,
                          background:m.bg, color:m.color, letterSpacing:"0.05em",
                          textTransform:"uppercase", fontFamily:"'Segoe UI',serif", fontWeight:500,
                          whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", borderRadius:2 }}>
                          {m.label} · {e.projectName.split(" ")[0]}
                        </div>
                      );
                    })}
                    {evs.length>3 && <div style={{ fontSize:9, color:"#9c8f82", paddingLeft:6, letterSpacing:"0.08em", fontWeight:500 }}>+{evs.length-3} more</div>}
                  </div>
                </div>
              );
            })}
          </div>


          {/* Upcoming deadlines strip */}
          <div style={{ borderTop:"2px solid #1a1a1a", padding:"24px 28px 28px", background:"#fff" }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
              <div style={{ width:4, height:4, background:"#c2410c", borderRadius:"50%" }} />
              <div style={{ fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:"#6b5e4e", fontWeight:700 }}>Upcoming Deadlines — Next 14 Days</div>
            </div>
            {upcoming.length === 0 ? (
              <div style={{ textAlign:"center", padding:"20px", color:"#9c8f82", fontSize:11 }}>No upcoming deadlines</div>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
                {upcoming.map(e => {
                  const m = EVENT_META[e.type]||EVENT_META.due;
                  const d = new Date(e.date);
                  const daysText = getDaysUntilText(e.daysUntil);
                  const isUrgent = e.daysUntil <= 3;
                  return (
                    <div key={e.id} onClick={()=>setSel(e.date)}
                      style={{ padding:"14px 14px", borderLeft:`4px solid ${m.color}`, background:m.bg,
                        cursor:"pointer", border:`1px solid ${m.border}`, borderLeftWidth:4, borderRadius:4,
                        transition:"all 0.2s", boxShadow: isUrgent ? "0 2px 8px rgba(217,119,6,0.2)" : "none" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                        <div style={{ fontSize:9, color:m.color, textTransform:"uppercase", letterSpacing:"0.12em", fontWeight:700 }}>
                          {m.label}
                        </div>
                        {isUrgent && <div style={{ fontSize:9, color:"#dc2626", fontWeight:700, letterSpacing:"0.08em" }}>⚠ URGENT</div>}
                      </div>
                      <div style={{ fontSize:12, fontWeight:600, color:"#1a1a1a", lineHeight:1.4, marginBottom:4 }}>{e.projectName}</div>
                      <div style={{ fontSize:10, color:"#6b5e4e", marginBottom:6 }}>{e.clientName} · {e.batch}</div>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        <div style={{ fontSize:9, color:e.daysUntil <= 3 ? "#dc2626" : "#d97706", fontWeight:600, letterSpacing:"0.05em" }}>
                          {daysText}
                        </div>
                        <div style={{ width:1, height:10, background:"#d4cfc8" }} />
                        <div style={{ fontSize:9, color:"#9c8f82", fontWeight:500 }}>
                          {d.toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>


        {/* Right panel */}
        <div style={{ background:"#faf9f6", display:"flex", flexDirection:"column" }}>


          {/* Filter section */}
          <div style={{ padding:"20px 20px 0", borderBottom:"1px solid #e8e2d9" }}>
            <div style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"#6b5e4e", marginBottom:14, fontWeight:700 }}>Filter by Type</div>
            <div style={{ display:"flex", flexDirection:"column", gap:4, paddingBottom:16 }}>
              {[
                { v:"all", label:"All Events", count:ALL_EVENTS.length, color:"#1a1a1a" },
                ...Object.entries(EVENT_META).map(([k,v])=>({ v:k, label:v.label, count:ALL_EVENTS.filter(e=>e.type===k).length, color:v.color }))
              ].map(f => (
                <button key={f.v} onClick={()=>setFilter(f.v)}
                  style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                    padding:"9px 12px", border:"none", cursor:"pointer", borderRadius:4,
                    background: filter===f.v ? "#1a1a1a" : "transparent",
                    color: filter===f.v ? "#faf9f6" : "#6b5e4e",
                    textAlign:"left", transition:"all 0.15s", fontWeight:500 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <span style={{ width:10, height:10, borderRadius:"50%", background: filter===f.v?"#faf9f6":f.color, display:"inline-block", boxShadow: filter===f.v?"none":"0 1px 2px rgba(0,0,0,0.1)" }}/>
                    <span style={{ fontSize:11, letterSpacing:"0.08em", textTransform:"uppercase", fontFamily:"'Segoe UI',serif" }}>{f.label}</span>
                  </div>
                  <span style={{ fontSize:11, opacity:0.7, fontWeight:600 }}>{f.count}</span>
                </button>
              ))}
            </div>
          </div>


          {/* Selected date events */}
          <div style={{ flex:1, padding:"20px", overflowY:"auto" }}>
            <div style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:"#6b5e4e", marginBottom:14, fontWeight:700 }}>
              {sel ? `${new Date(sel).toLocaleDateString("en-IN",{day:"2-digit",month:"long",year:"numeric"})}` : "Select a Date"}
            </div>
            {selEvents.length===0 ? (
              <div style={{ textAlign:"center", padding:"40px 20px", color:"#9c8f82" }}>
                <div style={{ fontSize:32, marginBottom:10, opacity:0.5 }}>○</div>
                <div style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:500 }}>No events for this date</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {selEvents.map(e => {
                  const m = EVENT_META[e.type]||EVENT_META.due;
                  return (
                    <div key={e.id} style={{ padding:"16px 16px", background:"#fff", border:`1px solid ${m.border}`,
                      borderLeft:`4px solid ${m.color}`, borderRadius:4, boxShadow:"0 1px 3px rgba(0,0,0,0.05)" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
                        <span style={{ fontSize:9, textTransform:"uppercase", letterSpacing:"0.14em",
                          color:m.color, fontWeight:700 }}>{m.label}</span>
                        <span style={{ fontSize:9, color:"#9c8f82", textTransform:"uppercase", letterSpacing:"0.08em", fontWeight:500 }}>{e.batch}</span>
                      </div>
                      <div style={{ fontSize:14, fontWeight:600, color:"#1a1a1a", marginBottom:4 }}>{e.projectName}</div>
                      <div style={{ fontSize:11, color:"#6b5e4e", marginBottom:6 }}>{e.clientName}</div>
                      {e.milestone && <div style={{ fontSize:10, color:"#9c8f82", borderTop:"1px solid #e8e2d9", paddingTop:8, marginTop:8 }}>
                        <span style={{ fontWeight:600 }}>Milestone:</span> {e.milestone}
                      </div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>


      {/* Modal */}
      {showModal && (
        <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:20 }}
          onClick={()=>setShowModal(false)}>
          <div onClick={e=>e.stopPropagation()}
            style={{ background:"#faf9f6",width:"100%",maxWidth:460,borderRadius:4,boxShadow:"0 25px 60px rgba(0,0,0,0.35)",overflow:"hidden" }}>
            <div style={{ background:"#1a1a1a",color:"#faf9f6",padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <span style={{ fontSize:11,letterSpacing:"0.16em",textTransform:"uppercase",fontWeight:600 }}>Add New Event</span>
              <button onClick={()=>setShowModal(false)} style={{ background:"transparent",border:"none",color:"#faf9f6",cursor:"pointer",fontSize:20,lineHeight:1,opacity:0.8 }}>×</button>
            </div>
            <div style={{ padding:"24px",display:"flex",flexDirection:"column",gap:16 }}>
              {[
                { label:"Date *", key:"date", type:"date" },
                { label:"Project Name *", key:"projectName", type:"text", ph:"Project name" },
                { label:"Client Name", key:"clientName", type:"text", ph:"Client" },
                { label:"Milestone", key:"milestone", type:"text", ph:"e.g. Copy Editing" },
                { label:"Batch", key:"batch", type:"text", ph:"e.g. B001" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display:"block",fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:"#6b5e4e",marginBottom:6,fontWeight:600 }}>{f.label}</label>
                  <input type={f.type} value={newEv[f.key]} placeholder={f.ph}
                    onChange={e=>setNewEv({...newEv,[f.key]:e.target.value})}
                    style={{ width:"100%",border:"1.5px solid #d4cfc8",borderRadius:4,padding:"10px 14px",fontSize:13,background:"#fff",fontFamily:"'Segoe UI',sans-serif",color:"#1a1a1a",boxSizing:"border-box",outline:"none",transition:"border 0.2s" }} />
                </div>
              ))}
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                <div>
                  <label style={{ display:"block",fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:"#6b5e4e",marginBottom:6,fontWeight:600 }}>Type</label>
                  <select value={newEv.type} onChange={e=>setNewEv({...newEv,type:e.target.value})}
                    style={{ width:"100%",border:"1.5px solid #d4cfc8",borderRadius:4,padding:"10px 14px",fontSize:13,background:"#fff",fontFamily:"'Segoe UI',sans-serif",color:"#1a1a1a",outline:"none" }}>
                    {Object.entries(EVENT_META).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display:"block",fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:"#6b5e4e",marginBottom:6,fontWeight:600 }}>Priority</label>
                  <select value={newEv.priority} onChange={e=>setNewEv({...newEv,priority:e.target.value})}
                    style={{ width:"100%",border:"1.5px solid #d4cfc8",borderRadius:4,padding:"10px 14px",fontSize:13,background:"#fff",fontFamily:"'Segoe UI',sans-serif",color:"#1a1a1a",outline:"none" }}>
                    <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display:"block",fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:"#6b5e4e",marginBottom:6,fontWeight:600 }}>Notes</label>
                <textarea value={newEv.notes} onChange={e=>setNewEv({...newEv,notes:e.target.value})}
                  placeholder="Additional notes…" rows={3}
                  style={{ width:"100%",border:"1.5px solid #d4cfc8",borderRadius:4,padding:"10px 14px",fontSize:13,background:"#fff",fontFamily:"'Segoe UI',sans-serif",color:"#1a1a1a",resize:"vertical",boxSizing:"border-box",outline:"none" }} />
              </div>
              <div style={{ display:"flex",gap:12,paddingTop:8 }}>
                <button onClick={()=>setShowModal(false)}
                  style={{ flex:1,padding:"12px",border:"2px solid #1a1a1a",background:"transparent",cursor:"pointer",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",borderRadius:4,fontWeight:600,transition:"all 0.2s" }}>Cancel</button>
                <button onClick={handleSave}
                  style={{ flex:1,padding:"12px",border:"2px solid #c2410c",background:"#c2410c",color:"#fff",cursor:"pointer",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",borderRadius:4,fontWeight:600,transition:"all 0.2s",boxShadow:"0 2px 4px rgba(194,65,12,0.3)" }}>Save Event</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}