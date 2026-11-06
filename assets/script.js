const cfg=window.TEJYASH_CONFIG||{};
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});}
const year=document.getElementById('year'); if(year) year.textContent=new Date().getFullYear();
const fullAddress=[cfg.addressLine1,cfg.addressLine2,cfg.state,cfg.postalCode,cfg.country].filter(Boolean).join(', ');
document.querySelectorAll('[data-config]').forEach(el=>{
  const key=el.dataset.config;
  let value=key==='address'?fullAddress:cfg[key];
  const valid=value && !String(value).includes('[REPLACE:') && !String(value).includes('XXXXXXXX');
  if(valid) el.textContent=value;
  else if(key==='website'){el.hidden=true; if(el.parentElement?.tagName==='P')el.parentElement.hidden=true;}
  const hrefKey=el.dataset.href;
  if(hrefKey){
    let href=hrefKey==='mobileDial'?'tel:'+cfg.mobileDial:hrefKey==='officialEmail'?'mailto:'+cfg.officialEmail:hrefKey==='website'?cfg.website:'';
    if(href && !href.includes('XXXXXXXX')) el.href=href;
    else if(hrefKey==='website') el.hidden=true;
  }
});
document.querySelectorAll('[data-whatsapp]').forEach(a=>{
  if(cfg.whatsapp && /^\\d{10,15}$/.test(cfg.whatsapp)) a.href='https://wa.me/'+cfg.whatsapp;
  else a.hidden=true;
});
document.querySelectorAll('[data-maps]').forEach(a=>{
  if(cfg.googleMapsUrl) a.href=cfg.googleMapsUrl;
  else a.hidden=true;
});
document.querySelectorAll('[data-social]').forEach(a=>{
  const v=cfg[a.dataset.social];
  if(v && /^https:\/\//i.test(v)){a.href=v;a.hidden=false;}
  else a.hidden=true;
});
const form=document.getElementById('contactForm');
if(form){form.addEventListener('submit',async e=>{
  e.preventDefault();const d=new FormData(form);
  const payload={name:d.get('name'),email:d.get('email'),phone:d.get('phone'),service:d.get('service'),message:d.get('message')};
  if(cfg.contactFormEndpoint){
    try{const r=await fetch(cfg.contactFormEndpoint,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload)});if(!r.ok)throw new Error('Request failed');document.getElementById('formNote').textContent='Thank you. Your enquiry has been submitted.';form.reset();}
    catch(err){document.getElementById('formNote').textContent='Unable to submit right now. Please email us directly at '+cfg.officialEmail+'.';}
  }else if(cfg.officialEmail){
    const subject=encodeURIComponent('Website enquiry - '+payload.service);
    const body=encodeURIComponent('Name: '+payload.name+'\\nEmail: '+payload.email+'\\nPhone: '+payload.phone+'\\nService: '+payload.service+'\\n\\nProject details:\\n'+payload.message);
    window.location.href='mailto:'+cfg.officialEmail+'?subject='+subject+'&body='+body;
    document.getElementById('formNote').textContent='Your email application should open with the enquiry prepared. Please send the email to complete your enquiry.';
  }else{document.getElementById('formNote').textContent='Please email us directly.';}
});}
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const topBtn=document.querySelector('[data-back-top]');
if(topBtn){window.addEventListener('scroll',()=>topBtn.classList.toggle('visible',window.scrollY>500));topBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));}
document.querySelectorAll('.faq-question').forEach(btn=>btn.addEventListener('click',()=>{const item=btn.closest('.faq-item');const open=item.classList.toggle('active');btn.setAttribute('aria-expanded',String(open));}));
const appSearch=document.getElementById('appSearch');
if(appSearch){const cards=[...document.querySelectorAll('.app-card')];const status=document.getElementById('appSearchStatus');appSearch.addEventListener('input',()=>{const q=appSearch.value.trim().toLowerCase();let shown=0;cards.forEach(card=>{const match=card.textContent.toLowerCase().includes(q);card.hidden=!match;if(match)shown++;});if(status)status.textContent=`Showing ${shown} of ${cards.length} apps.`;});}
