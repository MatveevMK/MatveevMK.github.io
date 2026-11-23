const examples = [
 ['Good ideas deserve<br>to be understood.', 'Хорошие идеи заслуживают<br>того, чтобы их понимали.'],
 ['Make everyday work<br>a little easier.', 'Сделайте повседневную работу<br>немного проще.'],
 ['Your next idea<br>starts here.', 'Ваша следующая идея<br>начинается здесь.']
];
let current = 0;
document.querySelector('#next-example').addEventListener('click', () => {
 current = (current + 1) % examples.length;
 document.querySelector('#source-text').innerHTML = examples[current][0];
 document.querySelector('#result-text').innerHTML = examples[current][1];
});

// Each project occupies one slide; additional products can use the same structure.
const projects = document.querySelector('#projects');
const lumaDetails = document.querySelector('#luma-details');
const navigator = document.querySelector('#navigator');
const lumaCard = projects.querySelector('.project');
const carousel = document.createElement('div');
carousel.className = 'carousel';
carousel.setAttribute('role', 'region');
carousel.setAttribute('aria-roledescription', 'карусель');
carousel.setAttribute('aria-label', 'Мои продукты');
carousel.tabIndex = 0;
const viewport = document.createElement('div');
viewport.className = 'carousel-viewport';
const track = document.createElement('div');
track.className = 'carousel-track';
const slides = [document.createElement('div'), document.createElement('div')];
slides.forEach((slide, i) => {
 slide.className = 'product-slide';
 slide.setAttribute('role', 'group');
 slide.setAttribute('aria-roledescription', 'слайд');
 slide.setAttribute('aria-label', `${i + 1} из 2: ${i ? 'Navigator' : 'Luma'}`);
 track.append(slide);
});
slides[0].append(lumaCard);
const more = document.createElement('details');
more.className = 'product-more';
more.innerHTML = '<summary>Возможности и подробности Luma <span>+</span></summary>';
lumaDetails.classList.remove('wrap', 'details');
more.append(lumaDetails);
slides[0].append(more);
slides[1].append(navigator.querySelector('.project'), navigator.querySelector('details'));
navigator.remove();
viewport.append(track);
const controls = document.createElement('div');
controls.className = 'carousel-controls';
controls.innerHTML = `<div class="product-switch" role="group" aria-label="Выберите продукт"><span class="switch-pill" aria-hidden="true"></span><button type="button" data-slide="0" aria-pressed="true">Luma <span>✳</span></button><button type="button" data-slide="1" aria-pressed="false">Navigator <span>⌘</span></button></div><div class="slide-navigation"><span class="slide-count" aria-live="polite">01 <span>/ 02</span></span><button class="slide-prev" type="button" aria-label="Предыдущий продукт">‹</button><button class="slide-next" type="button" aria-label="Следующий продукт">›</button></div>`;
carousel.append(controls, viewport);
projects.append(carousel);
projects.querySelector('.section-heading h2').textContent = 'Мои продукты';
projects.querySelector('.section-heading > span').textContent = 'Листайте. Исследуйте. Пробуйте.';
let activeSlide = 0;
const tabs = [...controls.querySelectorAll('[data-slide]')];
function resizeSlide() { viewport.style.height = `${slides[activeSlide].getBoundingClientRect().height}px`; }
function showSlide(index) {
 activeSlide = (index + slides.length) % slides.length;
 track.style.transform = `translateX(-${activeSlide * 100}%)`;
 controls.style.setProperty('--active', activeSlide);
 slides.forEach((slide, i) => {
  slide.inert = i !== activeSlide;
  slide.setAttribute('aria-hidden', String(i !== activeSlide));
  tabs[i].setAttribute('aria-pressed', String(i === activeSlide));
 });
 controls.querySelector('.slide-count').innerHTML = `0${activeSlide + 1} <span>/ 02</span>`;
 resizeSlide();
}
tabs.forEach((button, i) => button.addEventListener('click', () => showSlide(i)));
controls.querySelector('.slide-prev').addEventListener('click', () => showSlide(activeSlide - 1));
controls.querySelector('.slide-next').addEventListener('click', () => showSlide(activeSlide + 1));
carousel.addEventListener('keydown', event => {
 if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
  event.preventDefault(); showSlide(activeSlide + (event.key === 'ArrowRight' ? 1 : -1));
 }
});
let touchStart;
viewport.addEventListener('touchstart', event => { touchStart = event.touches[0]; }, {passive:true});
viewport.addEventListener('touchend', event => {
 if (!touchStart) return;
 const end = event.changedTouches[0], dx = end.clientX - touchStart.clientX, dy = end.clientY - touchStart.clientY;
 if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5) showSlide(activeSlide + (dx < 0 ? 1 : -1));
 touchStart = null;
}, {passive:true});
new ResizeObserver(resizeSlide).observe(slides[0]);
new ResizeObserver(resizeSlide).observe(slides[1]);
document.querySelector('a[href="#luma-details"]').addEventListener('click', () => { more.open = true; });
showSlide(0);
