// 디디다 홈페이지 동작. 외부 라이브러리 없이, 자바스크립트가 없어도 내용은 다 읽히게 만든다.
(() => {
  // 이 파일이 실제로 실행될 때만 'js' 표시를 붙인다. 파일을 못 받으면 모든 내용이 그대로 보인다.
  document.documentElement.classList.add('js');
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // 출석 체험: 화면 속 예시 숫자만 7 ↔ 8로 바꾼다. 아무것도 저장하거나 보내지 않는다.
  const count = $('[data-testid="attendance-count"]');
  const msg = $('[data-testid="attendance-message"]');
  const attend = $('[data-attend]');
  const reset = $('[data-attend-reset]');
  const fill = $('.attend-card .fill');
  const todayCell = $('.cal [data-today]');
  const GOAL = 12;
  const setCount = (n) => {
    count.textContent = `${n} / ${GOAL}회 목표`;
    fill.style.setProperty('--p', `${Math.round((n / GOAL) * 100)}%`);
  };
  attend.addEventListener('click', () => {
    setCount(8);
    todayCell.classList.add('on');
    msg.textContent = '여덟 번째 발걸음, 잘 쌓았어요!';
    msg.hidden = false;
    attend.disabled = true;
    reset.hidden = false;
    reset.focus();
  });
  reset.addEventListener('click', () => {
    setCount(7);
    todayCell.classList.remove('on');
    msg.hidden = true;
    msg.textContent = '';
    attend.disabled = false;
    reset.hidden = true;
    attend.focus();
  });

  // 휴대폰 메뉴
  const toggle = $('.menu-toggle');
  const nav = $('#main-nav');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
  });

  // 회원/센터 탭 (WAI-ARIA 탭 패턴)
  const tabs = $$('[role="tab"]');
  const select = (tab, focus = false) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      $(`#${t.getAttribute('aria-controls')}`).hidden = !on;
    });
    if (focus) tab.focus();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const last = tabs.length - 1;
      const to = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[e.key];
      if (to === undefined) return;
      e.preventDefault();
      select(tabs[to], true);
    });
  });
  select(tabs[0]);

  // 자주 묻는 질문: 처음에는 접어 둔다 (자바스크립트가 없으면 모두 펼쳐진 채로 읽힌다)
  $$('.faq-item button').forEach((btn) => {
    const answer = $(`#${btn.getAttribute('aria-controls')}`);
    const set = (open) => { btn.setAttribute('aria-expanded', String(open)); answer.hidden = !open; };
    set(false);
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  });

  // 이메일 주소 복사: 막히면 주소를 선택해 두고 직접 복사하라고 알린다.
  const copyBtn = $('[data-copy-email]');
  const copyMsg = $('[data-copy-msg]');
  const addr = $('.mail-addr');
  copyBtn.hidden = false;
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(addr.textContent.trim());
      copyMsg.textContent = '이메일 주소를 복사했어요.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(addr);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      copyMsg.textContent = '복사가 막혀 있어요. 선택된 주소를 직접 복사해 주세요.';
    }
  });

  // 자료 이미지 크게 보기 (자바스크립트가 없으면 링크로 원본이 열린다)
  const dialog = $('.zoom-dialog');
  const opener = $('[data-zoom]');
  if (dialog && typeof dialog.showModal === 'function') {
    opener.addEventListener('click', (e) => { e.preventDefault(); dialog.showModal(); });
    $('[data-zoom-close]', dialog).addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => opener.focus());
  }

  // 짧은 등장 효과
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }
})();
