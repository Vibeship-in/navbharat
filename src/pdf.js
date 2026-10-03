(function(root,factory){
  if(typeof module==='object') module.exports=factory(require('./core.js'),require('jspdf').jsPDF,require('jspdf-autotable').autoTable,require('./pdf-assets.js'));
  else root.QuotePDF=factory(root.QuoteCore,root.jspdf.jsPDF,(d,o)=>d.autoTable(o),root.QuoteAssets);
})(globalThis,function(A,jsPDF,autoTable,Assets){
'use strict';
const disclaimer='Estimated subsidy is subject to eligibility, inspection and approval. It is paid directly to the customer and is not deducted from vendor dues. No subsidy approval or payment timeline is promised.';
const money=x=>'Rs. '+Number(x).toLocaleString('en-IN',{maximumFractionDigits:2});
const ascii=s=>String(s??'').replace(/₹/g,'Rs. ').replace(/[–—]/g,'-').replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/[^\x20-\x7e\n\r]/g,'?');
function isTestBank(c){return c.ifsc==='TEST0000001'&&c.account==='0000000000'&&c.bankName==='TEST ONLY - NOT FOR PAYMENT';}
function bankErrors(c){const e=[];if(!c.bankName.trim()||!c.account.trim())e.push('Enter bank account name and number.');return e;}
function equipmentTableRows(equipment){const rows=[];for(const group of A.normalizeEquipment(equipment)){if(!group.enabled)continue;const items=group.items.filter(item=>item.enabled);const shared=items.every(item=>item.warranty===items[0]?.warranty);items.forEach((item,i)=>rows.push([i===0?group.name:'',item.description,item.quantity,shared?(i===0?item.warranty:''):item.warranty]));}return rows;}
function buildPDF(q){
  const unsupported=/[^\x20-\x7e\n\r₹–—‘’“”]/;
  const printable=[...Object.values(q.company),q.number,q.customer.name,q.customer.address,q.customer.phone,q.customer.email,q.customer.consumer,q.generation,q.life,q.maintenance,q.terms,q.documents,...A.equipmentRows(q.equipment).flatMap(r=>[r.name,r.description,r.quantity,r.warranty])];
  const errors=[...A.validate(q),...bankErrors(q.company)];
  if(printable.some(s=>typeof s==='string'&&unsupported.test(s)))errors.push('This PDF version supports English/basic Latin only. Use English or transliterated text in quotation fields; unsupported characters were not exported.');
  if(errors.length)throw Error(errors.join('\n'));
  if(!Assets?.solar||!Assets?.identity)throw Error('The original proposal artwork is missing. Rebuild the app before exporting.');
  const d=new jsPDF({unit:'mm',format:'a4',compress:false});
  d.setProperties({title:`Quotation ${q.number}`,author:q.company.name,subject:'Rooftop solar system proposal'});
  const C={blue:[17,64,132],navy:[25,49,104],ink:[28,35,47],muted:[98,108,124],line:[210,219,231],pale:[241,245,251],gold:[249,242,210]};
  const X=16,W=178,BOTTOM=279;
  let y=0,section='';
  const date=q.date.split('-').reverse().join('/');
  function font(size=12,bold=false,color=C.ink){d.setFont('helvetica',bold?'bold':'normal');d.setFontSize(size);d.setTextColor(...color);}
  function lines(s,w,size=12,bold=false){font(size,bold);return d.splitTextToSize(ascii(s),w);}
  function block(s,x,top,w,{size=12,bold=false,color=C.ink,leading=5.5,align='left'}={}){const ll=lines(s,w,size,bold);font(size,bold,color);d.text(ll,x,top,{lineHeightFactor:leading/(size*.352778),align});return top+ll.length*leading;}
  function fit(s,x,top,w,size,bold=false,color=C.ink){font(size,bold,color);let text=ascii(s);while(d.getTextWidth(text)>w&&size>10){size-=.5;font(size,bold,color);}if(d.getTextWidth(text)>w){while(text.length&&d.getTextWidth(text+'...')>w)text=text.slice(0,-1);text+='...';}d.text(text,x,top);}
  function rule(top){d.setDrawColor(...C.line);d.setLineWidth(.25);d.line(X,top,X+W,top);}
  function smallHeader(){fit(q.company.name,X,19,115,11,true,C.navy);font(9,false,C.muted);d.text(ascii(`Quotation ${q.number}  |  ${date}`),194,19,{align:'right'});rule(25);}
  function page(name){d.addPage();section=name;smallHeader();y=38;}
  function continuation(){page(section);font(16,true,C.navy);d.text(ascii(section+' - continued'),X,y);y+=12;}
  function room(h){if(y+h>BOTTOM)continuation();}
  function heading(s){room(19);font(14,true,C.navy);d.text(ascii(s),X,y);y+=4;rule(y);y+=8;}
  function paragraph(s,{size=12,leading=5.7,bold=false,bullet=false}={}){
    const ll=lines(s,W-(bullet?6:0),size,bold);const needed=ll.length*leading+3;
    if(needed<BOTTOM-48)room(needed);
    for(let i=0;i<ll.length;i++){room(leading+2);font(size,bold);if(bullet&&i===0){d.setFillColor(...C.blue);d.circle(X+1.5,y-1.1,.65,'F');}d.text(ll[i],X+(bullet?6:0),y);y+=leading;}
    y+=1.5;
  }
  // 01 / Original cover: strong blue name, quotation metadata, contact box,
  // customer details, the owner's circular solar artwork and original mark strip.
  font(9,true,C.muted);d.text(ascii(`QUOTATION ${q.number}`),194,18,{align:'right'});
  font(9,false,C.muted);d.text(date,194,24,{align:'right'});
  block(q.company.name,X,25,125,{size:23,bold:true,color:C.navy,leading:9});
  block(q.company.tagline,X,37,124,{size:10,color:C.muted,leading:4.8});
  d.setFillColor(...C.blue);d.roundedRect(145,38,49,23,3,3,'F');
  font(9,false,[255,255,255]);d.text('MOBILE / WHATSAPP',169.5,46,{align:'center'});
  const phoneLines=lines(q.company.phone,44,12,true);font(12,true,[255,255,255]);d.text(phoneLines.slice(0,2),169.5,53,{align:'center',lineHeightFactor:1.2});
  font(20,true,C.blue);d.text('HYBRID ROOFTOP SOLAR',X,78);
  font(20,true,C.blue);d.text('SYSTEM QUOTATION',X,88);
  font(14,true,C.blue);d.text(ascii(`${q.capacity} kW`),194,88,{align:'right'});
  if(q.panelType){font(10,true,C.muted);d.text(ascii(q.panelType),194,94,{align:'right'});}
  rule(98);
  font(10,true,C.muted);d.text('PREPARED FOR',X,111);
  const customerOverflow=[];
  const nameLines=lines(q.customer.name,W,17,true);font(17,true,C.ink);d.text(nameLines.slice(0,2),X,122,{lineHeightFactor:1.1});
  let cy=122+Math.min(nameLines.length,2)*6.6;
  if(nameLines.length>2)customerOverflow.push(['Customer name',q.customer.name]);
  const addressLines=lines(q.customer.address,W,12);font(12,false);d.text(addressLines.slice(0,2),X,cy+2,{lineHeightFactor:1.25});cy+=Math.min(addressLines.length,2)*5.3+10;
  if(addressLines.length>2)customerOverflow.push(['Address',q.customer.address]);
  font(9,true,C.muted);d.text('MOBILE / WHATSAPP',X,cy);d.text('ELECTRICITY CONSUMER NO.',111,cy);
  fit(q.customer.phone||'Not provided',X,cy+6,86,11);fit(q.customer.consumer||'Not provided',111,cy+6,83,11);
  if(q.customer.phone.length>40)customerOverflow.push(['Mobile / WhatsApp',q.customer.phone]);
  if(q.customer.consumer.length>40)customerOverflow.push(['Electricity consumer number',q.customer.consumer]);
  if(q.customer.email){fit(q.customer.email,X,cy+13,W,10,false,C.muted);if(q.customer.email.length>95)customerOverflow.push(['Customer email',q.customer.email]);}
  if(customerOverflow.length){font(9,false,C.muted);d.text('Full customer details continue after this cover.',X,172.5);}
  d.addImage(Assets.solar,'JPEG',0,174,210,99.75,undefined,'FAST');
  d.setFillColor(...C.blue);d.rect(16,239,178,24,'F');
  fit(`${q.company.name}  |  GSTIN: ${q.company.gstin}`,22,246,166,10,true,[255,255,255]);
  const address=lines(q.company.address,166,9);font(9,false,[255,255,255]);d.text(address.slice(0,2),22,251,{lineHeightFactor:1.15});
  fit(q.company.email,22,259,166,9,false,[255,255,255]);
  d.setFillColor(255,255,255);d.rect(0,264,210,27,'F');d.addImage(Assets.identity,'PNG',16,265,178,25.81,undefined,'FAST');
  // User-entered overflow is never thrown away to fit a photographic cover.
  if(customerOverflow.length){page('Customer details');heading('Customer details');for(const [label,value] of customerOverflow){heading(label);paragraph(value);}}
  // 02 / Keep the original four-column equipment table and pricing immediately below.
  page('System Configuration');
  d.setFillColor(...C.blue);d.rect(X,32,W,14,'F');
  font(15,true,[255,255,255]);d.text(ascii(`${q.capacity} kW${q.panelType?` / ${q.panelType}`:''} (HYBRID) Solar System Configuration`),105,41,{align:'center'});
  autoTable(d,{startY:49,margin:{top:34,bottom:22,left:X,right:X},tableWidth:W,
    head:[['Particulars','Items / specification','Qty','Warranty']],
    body:equipmentTableRows(q.equipment).map(row=>row.map(ascii)),
    theme:'grid',styles:{font:'helvetica',fontSize:10.5,cellPadding:{top:.45,bottom:.45,left:2.5,right:2.5},overflow:'linebreak',lineColor:C.line,lineWidth:.22,textColor:C.ink,valign:'top'},
    headStyles:{fillColor:C.gold,textColor:C.navy,fontStyle:'bold',fontSize:11,cellPadding:2.1},
    columnStyles:{0:{cellWidth:39,fillColor:[244,247,251],fontStyle:'bold'},1:{cellWidth:82},2:{cellWidth:26},3:{cellWidth:31}},rowPageBreak:'avoid',
    didDrawPage:info=>{if(info.pageNumber>1)smallHeader();}
  });
  y=d.lastAutoTable.finalY+8;
  const pricingHeight=56;room(pricingHeight);
  heading('Investment summary');
  const entries=[['Total system cost (incl. GST) / vendor due',money(q.cost)],['Estimated government subsidy',money(q.subsidy)],['Indicative cost after approved subsidy',money(A.amounts(q).net)]];
  entries.forEach((r,i)=>{d.setFillColor(...(i===2?C.pale:[255,255,255]));d.rect(X,y-5,W,10,'F');font(i===2?11.5:11,i===2,C.ink);d.text(r[0],X+3,y+1);font(i===2?15:12,true,C.navy);d.text(r[1],191,y+1,{align:'right'});y+=10;});
  y+=4;paragraph(disclaimer,{size:9.5,leading:4.3});
  // 03 / Preserve original document hierarchy, but use prose rather than report tables.
  page('System details & terms');
  heading('Solar System Details');
  const sourceDetails=[`Plant capacity: ${q.capacity} kW${q.panelType?` (${q.panelType})`:''}`,`Estimated electricity generation / year: ${q.generation}`,`Expected life: ${q.life}`,`Maintenance service: ${q.maintenance}`];
  for(const [i,s] of sourceDetails.entries())paragraph(s,{bullet:true,bold:i>1,size:12,leading:5.5});
  y+=3;heading('Terms & Conditions / Important Notes');
  let termText=q.terms;
  const financeMatches=termText.match(/Financing, if requested, is subject to lender assessment and terms\./g)||[];
  const siteNote='Actual rate may vary after site visit.';
  termText=termText.replaceAll(siteNote,'').replaceAll('Financing, if requested, is subject to lender assessment and terms.','');
  for(const t of termText.split('\n').map(s=>s.trim()).filter(Boolean))paragraph(t,{bullet:true,size:11.5,leading:5.2});
  y+=2;heading('Documents Required for PM Surya Ghar');
  for(const doc of q.documents.split(/[;\n]/).map(s=>s.trim()).filter(Boolean))paragraph(doc,{bullet:true,size:11.5,leading:5.2});
  y+=2;heading('Payment Terms');
  const paymentLabels=['Advance with work order','After material delivery on site','After installation & commissioning'];
  paymentLabels.forEach((label,i)=>paragraph(`${q.payments[i]}% - ${label} (${money(q.cost*q.payments[i]/100)})`,{bullet:true,size:11.5,leading:5.2}));
  if(financeMatches.length){y+=4;heading('Loan / Finance');paragraph(financeMatches.join(' '),{size:11.5,leading:5.2});}
  // 04 / Original validity, payment modes, bank details and sign-off order.
  page('Payment & acceptance');
  font(18,true,C.navy);d.text('Payment & Acceptance',X,y);y+=14;
  paragraph(siteNote,{bold:true,size:13,leading:6});
  d.setFillColor(...C.pale);d.rect(X,y-2,W,17,'F');font(13,true,C.blue);d.text(ascii(`This quotation is valid for ${q.validity} days from ${date}`),105,y+8,{align:'center'});y+=28;
  heading('Payment Mode');paragraph('NEFT / RTGS / UPI / Cheque',{bold:true,size:12});y+=6;
  heading('Bank Details');
  if(isTestBank(q.company))paragraph('Fictional bank details for download testing only. Do not make payment.',{size:11,leading:5.2});
  const bankRows=[['Account name',q.company.bankName],['Account number',q.company.account],['IFSC code',q.company.ifsc]];
  for(const [label,value] of bankRows){const ll=lines(value,126,12);room(Math.max(11,ll.length*5.5+4));font(10,true,C.muted);d.text(label,X,y);font(12,true,C.ink);d.text(ll,X+48,y,{lineHeightFactor:1.3});y+=Math.max(11,ll.length*5.5+4);}
  y+=12;room(90);heading(q.company.name);
  font(11,false,C.ink);d.text('Authorized signatory name',X,y);d.setDrawColor(...C.line);d.line(X+63,y+1,194,y+1);y+=19;
  d.text('Signature',X,y);d.line(X+26,y+1,116,y+1);d.text('Date',139,y);d.line(152,y+1,194,y+1);y+=26;
  heading('Accepted By');font(11,false,C.ink);d.text('Customer name',X,y);d.line(X+43,y+1,194,y+1);y+=19;
  d.text('Signature',X,y);d.line(X+26,y+1,116,y+1);d.text('Date',139,y);d.line(152,y+1,194,y+1);
  // Repeated original blue baseline, unified folios, and explicit test-only marking.
  const count=d.getNumberOfPages();
  for(let i=1;i<=count;i++){
    d.setPage(i);
    if(isTestBank(q.company)){font(8,true,[153,55,38]);d.text('TEST ONLY - NOT FOR PAYMENT',105,7,{align:'center'});}
    d.setFillColor(...C.blue);d.rect(0,292,210,5,'F');
    font(8,false,[255,255,255]);d.text(ascii(`Quotation ${q.number}`),X,295.4);d.text(`Page ${i} of ${count}`,194,295.4,{align:'right'});
  }
  return d;
}
return {buildPDF,bankErrors,money,disclaimer,isTestBank,equipmentTableRows};
});
