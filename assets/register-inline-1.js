
(function(){
  emailjs.init('ilfx_GKG4h2g6M7nR');

  var form = document.getElementById('regForm');
  var err = document.getElementById('formError');
  var success = document.getElementById('successBox');
  var submitBtn = form.querySelector('button[type="submit"]');

  var requiredIds = ['name', 'phone', 'email'];
  requiredIds.forEach(function(id){
    document.getElementById(id).addEventListener('input', function(){
      this.classList.remove('invalid');
      if(!form.querySelector('.invalid')) err.style.display = 'none';
    });
  });
  document.getElementById('agree').addEventListener('change', function(){
    this.closest('.check').classList.remove('invalid');
    if(!form.querySelector('.invalid')) err.style.display = 'none';
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var nameEl  = document.getElementById('name');
    var phoneEl = document.getElementById('phone');
    var emailEl = document.getElementById('email');
    var agreeEl = document.getElementById('agree');

    var name  = nameEl.value.trim();
    var phone = phoneEl.value.trim();
    var email = emailEl.value.trim();
    var session    = document.getElementById('session').value;
    var source     = document.getElementById('source').value;
    var motivation = document.getElementById('motivation').value.trim();
    var agree  = agreeEl.checked;
    var emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

    // Reset invalid states
    [nameEl, phoneEl, emailEl].forEach(function(el){ el.classList.remove('invalid'); });
    agreeEl.closest('.check').classList.remove('invalid');

    if(!name || !phone || !emailOk){
      if(!name)    nameEl.classList.add('invalid');
      if(!phone)   phoneEl.classList.add('invalid');
      if(!emailOk) emailEl.classList.add('invalid');
      err.textContent = '請完成必填欄位';
      err.style.display = 'block';
      (form.querySelector('input.invalid') || nameEl).focus();
      return;
    }

    if(!agree){
      agreeEl.closest('.check').classList.add('invalid');
      err.textContent = '請確認核選方塊';
      err.style.display = 'block';
      agreeEl.focus();
      return;
    }

    err.style.display = 'none';
    submitBtn.disabled = true;
    submitBtn.innerHTML = '傳送中… <span class="arr">→</span>';

    var params = {
      name: name,
      phone: phone,
      email: email,
      session: session || '尚未決定／請顧問建議',
      source: source || '（未選擇）',
      motivation: motivation || '（未填寫）'
    };

    Promise.all([
      emailjs.send('service_BDH', 'template_1kubbkh', params),
      emailjs.send('service_BDH', 'template_zjbpx31', params)
    ]).then(function(){
      form.style.display = 'none';
      success.classList.add('show');
      window.scrollTo({top: Math.max(0, success.getBoundingClientRect().top + window.scrollY - 120), behavior:'smooth'});
    }).catch(function(){
      submitBtn.disabled = false;
      submitBtn.innerHTML = '送出諮詢表單<span class="arr">→</span>';
      err.textContent = '送出失敗，請稍後再試或直接聯繫 marketing@bedo-have.com';
      err.style.display = 'block';
    });
  });
})();
