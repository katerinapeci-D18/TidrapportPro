const DB_KEY="tidrapport_pro_v6";
function emptyDb(){return{profile:{},companies:[{id:"default-company",name:"Diga.nu",org:"",email:"",phone:""}],projects:[{id:"default-project",number:"P1012",name:"Standardprojekt"}],customers:[],workplaces:[],reports:[],drives:[],settings:{theme:"light"}}}
function loadDb(){try{return{...emptyDb(),...JSON.parse(localStorage.getItem(DB_KEY)||"{}")}}catch{return emptyDb()}}
function saveDb(db){localStorage.setItem(DB_KEY,JSON.stringify(db))}
function id(){return crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random())}
function num(v){const n=Number(v);return Number.isFinite(n)?n:0}
function getReports(){return loadDb().reports||[]}function getDrives(){return loadDb().drives||[]}
function saveProfile(profile){const db=loadDb();db.profile=profile;saveDb(db)}
function addEntity(type,data){const db=loadDb();db[type].push({id:id(),...data});saveDb(db)}
function deleteEntity(type,itemId){const db=loadDb();db[type]=db[type].filter(x=>x.id!==itemId);saveDb(db)}
function validateReport(r){const e=[];if(!r.date)e.push("Datum saknas");if(num(r.hours)<=0)e.push("Timmar måste vara mer än 0");return{valid:e.length===0,errors:e}}
function addReport(data){const v=validateReport(data);if(!v.valid)return{success:false,errors:v.errors};const db=loadDb();const report={id:id(),date:data.date,companyId:data.companyId,projectId:data.projectId,customerId:data.customerId,workplaceId:data.workplaceId,startTime:data.startTime||"",endTime:data.endTime||"",breakMinutes:num(data.breakMinutes),hours:num(data.hours),km:num(data.km),parking:num(data.parking),toll:num(data.toll),material:num(data.material),comment:(data.comment||"").trim(),attachments:data.attachments||[],createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()};db.reports.push(report);db.last={companyId:report.companyId,projectId:report.projectId,customerId:report.customerId,workplaceId:report.workplaceId};saveDb(db);return{success:true,report}}
function updateReport(reportId,data){const db=loadDb();const i=db.reports.findIndex(r=>r.id===reportId);if(i<0)return{success:false,errors:["Rapporten hittades inte"]};const merged={...db.reports[i],...data,hours:num(data.hours),km:num(data.km),parking:num(data.parking),toll:num(data.toll),material:num(data.material),breakMinutes:num(data.breakMinutes),updatedAt:new Date().toISOString()};const v=validateReport(merged);if(!v.valid)return{success:false,errors:v.errors};db.reports[i]=merged;saveDb(db);return{success:true,report:merged}}
function deleteReport(reportId){const db=loadDb();db.reports=db.reports.filter(r=>r.id!==reportId);saveDb(db)}
function clearReports(){const db=loadDb();db.reports=[];saveDb(db)}
function getReport(reportId){return getReports().find(r=>r.id===reportId)||null}
function saveDrive(data){const db=loadDb();db.drives.push({id:id(),date:data.date,start:data.start||"",end:data.end||"",purpose:data.purpose||"",km:num(data.km),rate:num(data.rate),createdAt:new Date().toISOString()});saveDb(db)}
function deleteDrive(driveId){const db=loadDb();db.drives=db.drives.filter(d=>d.id!==driveId);saveDb(db)}
function byId(type,itemId){return (loadDb()[type]||[]).find(x=>x.id===itemId)||null}
function sortedReports(){return getReports().sort((a,b)=>b.date.localeCompare(a.date))}
function sortedDrives(){return getDrives().sort((a,b)=>b.date.localeCompare(a.date))}
function total(items,key){return items.reduce((s,r)=>s+num(r[key]),0)}
function reportCost(r){return num(r.parking)+num(r.toll)+num(r.material)}
function todayReports(){const t=new Date().toISOString().slice(0,10);return getReports().filter(r=>r.date===t)}
function monthReports(){const n=new Date();const p=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`;return getReports().filter(r=>r.date.startsWith(p))}
function monthDrives(){const n=new Date();const p=`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,"0")}`;return getDrives().filter(r=>r.date.startsWith(p))}
function weekReports(){const n=new Date();const s=new Date(n);s.setDate(n.getDate()-((n.getDay()+6)%7));s.setHours(0,0,0,0);const e=new Date(s);e.setDate(s.getDate()+7);return getReports().filter(r=>{const d=new Date(r.date+"T00:00:00");return d>=s&&d<e})}
function projectTotals(){const map={};getReports().forEach(r=>{const p=byId("projects",r.projectId);const name=p?`${p.number||""} ${p.name||""}`.trim():"Projekt saknas";if(!map[name])map[name]={hours:0,cost:0};map[name].hours+=num(r.hours);map[name].cost+=reportCost(r)});return map}
function backupData(){return JSON.stringify(loadDb(),null,2)}
function restoreData(json){const data=JSON.parse(json);saveDb({...emptyDb(),...data})}