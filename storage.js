const STORAGE_KEY="tidrapport_pro_v3";
function safeNumber(v){const n=Number(v);return Number.isFinite(n)?n:0}
function createId(){return crypto.randomUUID?crypto.randomUUID():String(Date.now())}
function getReports(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]")}catch{return[]}}
function saveReports(reports){localStorage.setItem(STORAGE_KEY,JSON.stringify(reports))}
function validateReport(data){const errors=[];if(!data.date)errors.push("Datum saknas");if(!data.project||!data.project.trim())errors.push("Projekt saknas");if(safeNumber(data.hours)<=0)errors.push("Timmar måste vara mer än 0");if(safeNumber(data.hours)>24)errors.push("Timmar kan inte vara mer än 24 per rad");return{valid:errors.length===0,errors}}
function addReport(data){const v=validateReport(data);if(!v.valid)return{success:false,errors:v.errors};const reports=getReports();const report={id:createId(),date:data.date,project:data.project.trim(),customer:(data.customer||"").trim(),location:(data.location||"").trim(),hours:safeNumber(data.hours),km:safeNumber(data.km),parking:safeNumber(data.parking),comment:(data.comment||"").trim(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};reports.push(report);saveReports(reports);return{success:true,report}}
function updateReport(id,data){const reports=getReports();const i=reports.findIndex(r=>r.id===id);if(i===-1)return{success:false,errors:["Rapporten hittades inte"]};const merged={...reports[i],...data,id,createdAt:reports[i].createdAt,updatedAt:new Date().toISOString()};const v=validateReport(merged);if(!v.valid)return{success:false,errors:v.errors};merged.hours=safeNumber(merged.hours);merged.km=safeNumber(merged.km);merged.parking=safeNumber(merged.parking);reports[i]=merged;saveReports(reports);return{success:true,report:merged}}
function deleteReport(id){saveReports(getReports().filter(r=>r.id!==id))}
function clearReports(){localStorage.removeItem(STORAGE_KEY)}
function getReport(id){return getReports().find(r=>r.id===id)||null}
function getSortedReports(){return getReports().sort((a,b)=>b.date.localeCompare(a.date))}
function getReportsBySearch(q){q=(q||"").toLowerCase().trim();if(!q)return getSortedReports();return getSortedReports().filter(r=>[r.date,r.project,r.customer,r.location,r.comment].join(" ").toLowerCase().includes(q))}
function getTotalHours(reports=getReports()){return reports.reduce((s,r)=>s+safeNumber(r.hours),0)}
function getTotalKm(reports=getReports()){return reports.reduce((s,r)=>s+safeNumber(r.km),0)}
function getTotalParking(reports=getReports()){return reports.reduce((s,r)=>s+safeNumber(r.parking),0)}
function getTodayReports(){const t=new Date().toISOString().slice(0,10);return getReports().filter(r=>r.date===t)}
function getCurrentMonthReports(){const n=new Date();const p=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`;return getReports().filter(r=>r.date.startsWith(p))}
function getWeekReports(){const n=new Date();const s=new Date(n);s.setDate(n.getDate()-((n.getDay()+6)%7));s.setHours(0,0,0,0);const e=new Date(s);e.setDate(s.getDate()+7);return getReports().filter(r=>{const d=new Date(r.date+"T00:00:00");return d>=s&&d<e})}
function getProjectTotals(){const map={};getReports().forEach(r=>{if(!map[r.project])map[r.project]={hours:0,km:0,parking:0,count:0};map[r.project].hours+=safeNumber(r.hours);map[r.project].km+=safeNumber(r.km);map[r.project].parking+=safeNumber(r.parking);map[r.project].count++});return map}