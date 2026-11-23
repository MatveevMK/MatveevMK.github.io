const root = document.documentElement;
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('#motion-toggle');
let motionOff = reducedMotion.matches;
try { const saved = localStorage.getItem('portfolio-motion'); if (saved) motionOff = saved === 'off'; } catch {}
function applyMotion() {
 root.classList.toggle('motion-off', motionOff);
 motionButton.setAttribute('aria-pressed', String(motionOff));
 motionButton.textContent = `Анимации: ${motionOff ? 'выключены' : 'включены'}`;
}
motionButton.addEventListener('click', () => {
 motionOff = !motionOff; applyMotion();
 try { localStorage.setItem('portfolio-motion', motionOff ? 'off' : 'on'); } catch {}
});
applyMotion();
const noMotion = () => motionOff || reducedMotion.matches;
const stage = document.querySelector('.product-stage');
const products = [...document.querySelectorAll('[data-product]')];
const panels = [...stage.querySelectorAll('.product-panel')];
const filters = [...document.querySelectorAll('[data-filter]')];
let selected = 'luma';
let panelAnimation;
function selectProduct(id) {
 if (id === selected) return;
 if (panelAnimation) panelAnimation.cancel();
 selected = id;
 stage.dataset.product = id;
 const incoming = document.querySelector(`#product-${id}`);
 panels.forEach(panel => {
  const active = panel === incoming;
  panel.hidden = !active;
  panel.inert = !active;
  panel.setAttribute('aria-hidden', String(!active));
 });
 products.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.product === id)));
 if (!noMotion()) panelAnimation = incoming.animate([{opacity:.25},{opacity:1}],{duration:220,easing:'ease-out'});
 const visible = products.filter(button => !button.hidden);
 document.querySelector('.selection-status').textContent = `${incoming.dataset.name} · проект ${visible.findIndex(button => button.dataset.product === id)+1} из ${visible.length}`;
}
products.forEach(button => button.addEventListener('click', () => selectProduct(button.dataset.product)));
filters.forEach(button => button.addEventListener('click', () => {
 const category = button.dataset.filter;
 filters.forEach(b => b.setAttribute('aria-pressed',String(b === button)));
 products.forEach(b => { b.hidden = category !== 'all' && !b.dataset.category.split(' ').includes(category); });
 const visible = products.filter(b => !b.hidden);
 if (!visible.some(b => b.dataset.product === selected)) selectProduct(visible[0].dataset.product);
 else document.querySelector('.selection-status').textContent = `${document.querySelector(`#product-${selected}`).dataset.name} · проект ${visible.findIndex(b => b.dataset.product === selected)+1} из ${visible.length}`;
}));
// Product selectors use normal buttons with optional keyboard shortcuts.
document.querySelector('.project-picker').addEventListener('keydown', event => {
 if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
 const visible = products.filter(b => !b.hidden);
 let i = visible.indexOf(document.activeElement);
 if (i < 0) return;
 event.preventDefault();
 i = event.key === 'Home' ? 0 : event.key === 'End' ? visible.length-1 : (i+(event.key === 'ArrowRight'?1:-1)+visible.length)%visible.length;
 visible[i].focus(); selectProduct(visible[i].dataset.product);
});
let start;
stage.addEventListener('touchstart', e => { start = e.touches[0]; },{passive:true});
stage.addEventListener('touchend', e => {
 if (!start) return;
 const end = e.changedTouches[0], dx = end.clientX-start.clientX, dy = end.clientY-start.clientY;
 const visible = products.filter(b => !b.hidden), i = visible.findIndex(b => b.dataset.product === selected);
 if (Math.abs(dx)>70 && Math.abs(dx)>Math.abs(dy)*1.5) selectProduct(visible[(i+(dx<0?1:-1)+visible.length)%visible.length].dataset.product);
 start=null;
},{passive:true});
const examples = [['Good ideas deserve<br>to be understood.','Хорошие идеи заслуживают<br>того, чтобы их понимали.'],['Make everyday work<br>a little easier.','Сделайте повседневную работу<br>немного проще.'],['Your next idea<br>starts here.','Ваша следующая идея<br>начинается здесь.']];
let example=0;
document.querySelector('#next-example').addEventListener('click',()=>{
 example=(example+1)%examples.length;
 document.querySelector('#source-text').innerHTML=examples[example][0];
 document.querySelector('#result-text').innerHTML=examples[example][1];
});
document.querySelector('a[href="#luma-details"]').addEventListener('click',()=>{document.querySelector('#luma-details').open=true;});
// Screenshot slots have the same footprint as the default illustrations.
for (const panel of panels) {
 const visual = panel.querySelector('.visual');
 const mock = document.createElement('div'); mock.className='visual-mock';
 mock.append(...visual.childNodes);
 const placeholder=document.createElement('div'); placeholder.className='screenshot-slot'; placeholder.hidden=true;
 placeholder.innerHTML='<span class="screenshot-icon" aria-hidden="true">▣</span><h4>Скриншот скоро появится</h4><p>Реальный интерфейс пока не добавлен.<br>Здесь будет галерея продукта.</p>';
 if (panel.id==='product-bi') placeholder.innerHTML='<span class="screenshot-icon" aria-hidden="true">◈</span><h4>Это концепт</h4><p>Демонстрационный дизайн дашборда.<br>Скриншотов готового продукта нет.</p>';
 const toggle=document.createElement('button'); toggle.type='button'; toggle.className='preview-toggle'; toggle.setAttribute('aria-pressed','false');toggle.textContent='Реальный интерфейс';
 visual.append(mock,placeholder,toggle);
 toggle.addEventListener('click',()=>{
  const showing=toggle.getAttribute('aria-pressed')==='true';
  toggle.setAttribute('aria-pressed',String(!showing));mock.hidden=!showing;placeholder.hidden=showing;
  toggle.textContent=showing?'Реальный интерфейс':'Вернуть иллюстрацию';
  if(!noMotion()) (showing?mock:placeholder).animate([{opacity:.3},{opacity:1}],{duration:220,easing:'ease-out'});
 });
}
const menuToggle=document.querySelector('.menu-toggle'),menu=document.querySelector('#main-nav');
function closeMenu(returnFocus=false){menuToggle.setAttribute('aria-expanded','false');menu.classList.remove('menu-open');if(returnFocus)menuToggle.focus();}
menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';menuToggle.setAttribute('aria-expanded',String(open));menu.classList.toggle('menu-open',open);if(open)menu.querySelector('a').focus();});
menu.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.classList.contains('menu-open'))closeMenu(true);});
document.addEventListener('click',e=>{if(!menu.contains(e.target)&&!menuToggle.contains(e.target))closeMenu();});
matchMedia('(min-width: 851px)').addEventListener('change',()=>closeMenu());


