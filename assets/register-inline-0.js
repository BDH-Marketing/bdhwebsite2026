
document.querySelectorAll('.s-toggle').forEach(function(btn){
  btn.addEventListener('click', function(){
    var isOpen = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    this.nextElementSibling.classList.toggle('open', !isOpen);
    this.querySelector('.s-label').textContent = isOpen ? '顯示更多' : '收起';
  });
});
