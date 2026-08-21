/* ============================================================
   統域內湖訓練中心 — 場地租借頁 互動
   無外部依賴。所有互動皆以 data-* 屬性綁定。
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 照片佔位：載入失敗時顯示虛線佔位框 ---------- */
  function markPhotos() {
    document.querySelectorAll('.photo').forEach(function (box) {
      var img = box.querySelector('img');
      if (!img) { box.classList.add('is-empty'); return; }
      var fail = function () { box.classList.add('is-empty'); };
      if (img.complete) {
        if (!img.naturalWidth) fail();
      } else {
        img.addEventListener('error', fail);
        img.addEventListener('load', function () { box.classList.remove('is-empty'); });
      }
    });
  }

  /* ---------- 頁面導覽實景：大圖 + 4 小圖 ---------- */
  function initShowcase() {
    var shots = Array.prototype.slice.call(document.querySelectorAll('[data-shot]'));
    if (!shots.length) return;
    shots.forEach(function (shot) {
      var btn = shot.querySelector('.shot__zoom');
      if (!btn) return;
      btn.addEventListener('click', function () {
        shots.forEach(function (s) { s.classList.remove('is-active'); });
        shot.classList.add('is-active');
      });
    });
  }

  /* ---------- 通用分頁（空間 / 配置） ---------- */
  function initTabGroup(groupName) {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-tab="' + groupName + '"]'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-panel="' + groupName + '"]'));
    if (!buttons.length) return;
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-key');
        buttons.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        panels.forEach(function (p) {
          p.hidden = p.getAttribute('data-key') !== key;
        });
      });
    });
  }

  /* ---------- 配置示意圖：以 JS 產生座位方塊 ---------- */
  var SEATS = { classroom: 40, tables: 8, theatre: 112 };
  function fillSeats() {
    Object.keys(SEATS).forEach(function (kind) {
      document.querySelectorAll('.seats--' + kind).forEach(function (el) {
        if (el.childElementCount) return;
        var frag = document.createDocumentFragment();
        for (var i = 0; i < SEATS[kind]; i++) frag.appendChild(document.createElement('i'));
        el.appendChild(frag);
      });
    });
  }

  /* ---------- FAQ 手風琴 ---------- */
  function initFaq() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.faq__item'));
    items.forEach(function (item) {
      var q = item.querySelector('.faq__q');
      if (!q) return;
      q.addEventListener('click', function () {
        var open = item.classList.contains('is-open');
        items.forEach(function (i) {
          i.classList.remove('is-open');
          var b = i.querySelector('.faq__q');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          item.classList.add('is-open');
          q.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ---------- 詢問表單 ----------
     目前僅切換為「已送出」狀態。要真正收件請選一種接法：
     (A) 後端 API：把 fetch 區塊的 URL 換成你的端點
     (B) 表單服務（Formspree / Google Form）：把 <form> 的 action 與 method 填好，
         並移除下方的 e.preventDefault()
     (C) mailto：改為組 mailto: 連結（不推薦，行動裝置體驗差）
  --------------------------------------------------------- */
  function initForm() {
    var form = document.getElementById('rental-form');
    var done = document.getElementById('rental-done');
    if (!form || !done) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });

      /* --- (A) 接後端時解除註解並填入端點 ---
      fetch('/api/venue-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error('送出失敗');
        showDone();
      }).catch(function () {
        alert('送出失敗，請改以電話或 Email 與我們聯繫。');
      });
      return;
      */

      console.log('[venue-inquiry]', data);
      showDone();
    });

    function showDone() {
      form.hidden = true;
      done.hidden = false;
      done.scrollTop = 0;
    }
  }

  function init() {
    markPhotos();
    initShowcase();
    initTabGroup('room');
    initTabGroup('layout');
    fillSeats();
    initFaq();
    initForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
