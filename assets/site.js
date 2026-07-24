/* 統域領導力發展 — shared site behaviour (CSP-safe, external) */
(function(){
  // Header scroll state. If page has a hero, header starts transparent (.on-hero)
  var header = document.querySelector('.site-header');
  var hasHero = document.body.hasAttribute('data-hero');
  function onScroll(){
    var y = window.scrollY || window.pageYOffset;
    if(!header) return;
    if(y > 40){
      header.classList.add('scrolled');
      header.classList.remove('on-hero');
    }else{
      header.classList.remove('scrolled');
      if(hasHero) header.classList.add('on-hero');
    }
  }
  if(hasHero && header) header.classList.add('on-hero');
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Mobile nav drawer
  var toggle = document.querySelector('.menu-toggle');
  var drawer = document.querySelector('.mobile-nav');
  function closeDrawer(){ if(drawer){drawer.classList.remove('open'); document.body.style.overflow='';} }
  if(toggle && drawer){
    toggle.addEventListener('click', function(){ drawer.classList.add('open'); document.body.style.overflow='hidden'; });
    drawer.querySelectorAll('[data-close]').forEach(function(el){ el.addEventListener('click', closeDrawer); });
    drawer.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeDrawer); });
  }

  // Mobile accordion (submenu) toggles
  document.querySelectorAll('.m-accordion-toggle').forEach(function(btn){
    btn.addEventListener('click', function(){
      var open = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', open ? 'false' : 'true');
      var body = this.nextElementSibling;
      if(body && body.classList.contains('m-accordion-body')){
        body.classList.toggle('open', !open);
      }
    });
  });

  // Latest-news photo lightbox
  var lightbox = document.getElementById('newsLightbox');
  if(lightbox){
    var lbImg = document.getElementById('lightboxImg');
    var lbTitle = document.getElementById('lightboxTitle');
    var lbCaption = document.getElementById('lightboxCaption');
    var lbCloseBtn = lightbox.querySelector('.lightbox-close');
    var lastFocused = null;
    var openLightbox = function(trigger){
      var srcImg = trigger.querySelector('img');
      lbImg.src = srcImg ? srcImg.src : '';
      lbImg.alt = srcImg ? srcImg.alt : '';
      lbTitle.textContent = trigger.getAttribute('data-lightbox-title') || '';
      lbCaption.textContent = trigger.getAttribute('data-lightbox-caption') || '';
      lastFocused = document.activeElement;
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      lbCloseBtn.focus();
    };
    var closeLightbox = function(){
      lightbox.hidden = true;
      lbImg.src = '';
      document.body.style.overflow = '';
      if(lastFocused && lastFocused.focus) lastFocused.focus();
    };
    document.querySelectorAll('.mc-img-btn').forEach(function(trigger){
      trigger.addEventListener('click', function(){ openLightbox(trigger); });
    });
    lightbox.querySelectorAll('[data-lightbox-close]').forEach(function(el){
      el.addEventListener('click', closeLightbox);
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }

  // Scroll reveal
  var els = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){ io.observe(el); });
  }else{
    els.forEach(function(el){ el.classList.add('in'); });
  }
})();
