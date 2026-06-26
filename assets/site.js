/* 統域領導力發展 — shared site behaviour */
(function(){
  // Scroll position save / restore for back-navigation
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  // Save position when leaving via any same-origin link
  document.addEventListener('click', function(e) {
    var link = e.target.closest('a[href]');
    if (link && !link.target && link.origin === location.origin &&
        link.pathname !== location.pathname) {
      sessionStorage.setItem('bdh:scrollY:' + location.pathname, String(window.scrollY));
    }
  }, true);

  // Restore position on back / forward navigation
  var navEntry = performance && performance.getEntriesByType &&
    performance.getEntriesByType('navigation')[0];
  if (navEntry && navEntry.type === 'back_forward') {
    var saved = sessionStorage.getItem('bdh:scrollY:' + location.pathname);
    if (saved !== null) {
      window.scrollTo(0, parseInt(saved, 10));
    }
  }

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

  // Mobile nav
  var toggle = document.querySelector('.menu-toggle');
  var drawer = document.querySelector('.mobile-nav');
  function closeDrawer(){ if(drawer){drawer.classList.remove('open'); document.body.style.overflow='';} }
  if(toggle && drawer){
    toggle.addEventListener('click', function(){ drawer.classList.add('open'); document.body.style.overflow='hidden'; });
    drawer.querySelectorAll('[data-close]').forEach(function(el){ el.addEventListener('click', closeDrawer); });
    drawer.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeDrawer); });
  }

  // Mobile accordion
  document.querySelectorAll('.m-accordion-toggle').forEach(function(btn){
    btn.addEventListener('click', function(){
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      var body = btn.nextElementSibling;
      if(body) body.classList.toggle('open', !expanded);
    });
  });

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
