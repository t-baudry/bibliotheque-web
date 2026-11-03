
(()=>{const R='[data-o-citations="true"]',P=/\[cite:([^|\]]+)\|([^|\]]+)(?:\|([^\]]+))?\]/g;
const fav=u=>{try{return new URL(u,location.origin).origin+'/favicon.ico'}catch(e){return''}};
const gfav=u=>'https://www.google.com/s2/favicons?sz=64&domain_url='+encodeURIComponent(u);
const first=s=>(s||'?').trim().charAt(0).toUpperCase();
function make(label,url,tip){
  const a=document.createElement('a'),img=document.createElement('img'),fb=document.createElement('span'),txt=document.createElement('span');
  a.className='o-cite';a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.setAttribute('aria-label',tip?`${label}: ${tip}`:label);
  img.className='o-cite__icon';img.src=fav(url);img.alt='';img.loading='lazy';
  img.addEventListener('error',()=>{if(img.dataset.fallbackTried==='true'){a.setAttribute('data-icon-error','true');return}img.dataset.fallbackTried='true';img.src=gfav(url)});
  fb.className='o-cite__fallback';fb.textContent=first(label);
  txt.className='o-cite__label';txt.textContent=label;
  a.append(img,fb,txt);
  if(tip){const t=document.createElement('span');t.className='o-cite__tooltip';t.textContent=tip;a.appendChild(t)}
  return a;
}
function textNode(n){
  const text=n.nodeValue;
  if(!text||!text.includes('[cite:'))return;
  const frag=document.createDocumentFragment();
  let last=0,m;P.lastIndex=0;
  while((m=P.exec(text))){
    const before=text.slice(last,m.index);
    if(before)frag.appendChild(document.createTextNode(before));
    frag.appendChild(make(m[1].trim(),m[2].trim(),(m[3]||'').trim()));
    last=P.lastIndex;
  }
  const after=text.slice(last);
  if(after)frag.appendChild(document.createTextNode(after));
  n.parentNode.replaceChild(frag,n);
}
function enhance(root){
  if(!root)return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){
    const p=n.parentElement;
    if(!p||p.closest('script,style,pre,code,.o-cite'))return NodeFilter.FILTER_REJECT;
    return n.nodeValue.includes('[cite:')?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
  }});
  const nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(textNode);
}
window.initOCitations=function(root=document){
  const scope=(window.jQuery&&root instanceof jQuery)?root[0]:root;
  if(!scope)return;
  const roots=[];
  if(scope.matches&&scope.matches(R))roots.push(scope);
  if(scope.querySelectorAll)roots.push(...scope.querySelectorAll(R));
  if(!roots.length&&scope.textContent&&scope.textContent.includes('[cite:'))roots.push(scope);
  roots.forEach(enhance);
};
window.initOCitations(document);
})();
