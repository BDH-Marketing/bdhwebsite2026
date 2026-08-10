/* 統域領導力發展 — 網站內建對話助手（決策樹選單，非真人客服） */
(function(){
  var TREE = {
    root: {
      bot: "您好，我是統域小助手 👋\n請選擇您想了解的內容：",
      options: [
        {label:"卓越領導工作坊介紹", next:"workshop"},
        {label:"M1 覺察探索", next:"m1"},
        {label:"M2 突破格局", next:"m2"},
        {label:"M3 實踐影響", next:"m3"},
        {label:"費用與梯次", next:"pricing"},
        {label:"立即報名", next:"register"},
        {label:"聯絡我們", next:"contact"}
      ]
    },
    workshop: {
      bot: "「卓越領導工作坊」是統域的核心課程，由 M1 覺察探索、M2 突破格局、M3 實踐影響三個模組構成，帶您從自我覺察走向可被驗證的影響力。",
      options: [
        {label:"查看完整工作坊介紹", href:"workshop.html"},
        {label:"了解 M1", next:"m1"},
        {label:"了解 M2", next:"m2"},
        {label:"了解 M3", next:"m3"},
        {label:"回主選單", next:"root"}
      ]
    },
    m1: {
      bot: "M1｜覺察探索（Awareness）\n整套訓練系統的起點，協助您建立清晰的自我覺知能力，看見信念與行為背後的根源。",
      options: [
        {label:"查看 M1 完整介紹與時間表", href:"m1.html"},
        {label:"了解 M2", next:"m2"},
        {label:"立即報名", next:"register"},
        {label:"回主選單", next:"root"}
      ]
    },
    m2: {
      bot: "M2｜突破格局（Breakthrough）\n延續 M1 的覺察，穿越限制性信念與內在天花板，擴大承擔責任與創造結果的生命容量。",
      options: [
        {label:"查看 M2 完整介紹與時間表", href:"m2.html"},
        {label:"了解 M3", next:"m3"},
        {label:"立即報名", next:"register"},
        {label:"回主選單", next:"root"}
      ]
    },
    m3: {
      bot: "M3｜實踐影響（Actualization）\n以 90 天力行書為節奏，將覺察與突破轉化為可落地、可驗證的行動系統與影響力。",
      options: [
        {label:"查看 M3 完整介紹", href:"m3.html"},
        {label:"立即報名", next:"register"},
        {label:"回主選單", next:"root"}
      ]
    },
    pricing: {
      bot: "課程費用與梯次日期依模組與開課時間而異，目前請洽詢顧問確認最新資訊；我們會在報名後由專人與您聯繫說明。",
      options: [
        {label:"前往報名頁", href:"register.html"},
        {label:"聯絡我們", next:"contact"},
        {label:"回主選單", next:"root"}
      ]
    },
    register: {
      bot: "太好了！請前往報名頁填寫資訊，統域顧問將於 2–3 個工作日內與您聯繫確認梯次與細節。",
      options: [
        {label:"前往報名頁", href:"register.html"},
        {label:"回主選單", next:"root"}
      ]
    },
    contact: {
      bot: "您可以透過報名頁留下聯絡方式，我們會請顧問主動與您聯繫；正式的電話／Email／社群資訊將於頁尾更新後同步提供。",
      options: [
        {label:"前往報名頁留言", href:"register.html"},
        {label:"回主選單", next:"root"}
      ]
    }
  };

  function el(tag, cls, html){
    var e = document.createElement(tag);
    if(cls) e.className = cls;
    if(html !== undefined) e.innerHTML = html;
    return e;
  }

  function build(){
    var wrap = el('div','bdh-chat');
    wrap.innerHTML =
      '<button class="bdh-chat-toggle" aria-label="開啟統域小助手">' +
        '<svg class="ic-chat" viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>' +
        '<svg class="ic-close" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</button>' +
      '<div class="bdh-chat-panel" role="dialog" aria-label="統域小助手對話視窗">' +
        '<div class="bdh-chat-head">' +
          '<img src="assets/img/white_vertical.png" alt="" class="bdh-chat-mark">' +
          '<div><span class="bdh-chat-title">統域小助手</span><span class="bdh-chat-sub">工作時間內將由顧問跟進</span></div>' +
        '</div>' +
        '<div class="bdh-chat-body" id="bdhChatBody"></div>' +
      '</div>';
    document.body.appendChild(wrap);

    var toggle = wrap.querySelector('.bdh-chat-toggle');
    var panel = wrap.querySelector('.bdh-chat-panel');
    var body = wrap.querySelector('#bdhChatBody');
    var opened = false;

    toggle.addEventListener('click', function(){
      opened = !opened;
      panel.classList.toggle('open', opened);
      wrap.classList.toggle('open', opened);
      if(opened && !body.dataset.started){ body.dataset.started = '1'; render('root'); }
    });

    function render(nodeKey){
      var node = TREE[nodeKey];
      if(!node) return;
      var msg = el('div','bdh-msg bot');
      msg.innerHTML = '<div class="bdh-bubble">'+node.bot.replace(/\n/g,'<br>')+'</div>';
      body.appendChild(msg);

      var optsWrap = el('div','bdh-opts');
      node.options.forEach(function(opt){
        var btn = el('button','bdh-opt-btn', opt.label);
        btn.addEventListener('click', function(){
          var picked = el('div','bdh-msg user');
          picked.innerHTML = '<div class="bdh-bubble">'+opt.label+'</div>';
          body.appendChild(picked);
          optsWrap.remove();
          body.scrollTop = body.scrollHeight;
          if(opt.href){
            setTimeout(function(){ window.location.href = opt.href; }, 250);
          } else if(opt.next){
            setTimeout(function(){ render(opt.next); }, 200);
          }
        });
        optsWrap.appendChild(btn);
      });
      body.appendChild(optsWrap);
      body.scrollTop = body.scrollHeight;
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
