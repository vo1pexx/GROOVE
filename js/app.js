/* =====================================================================
   GROOVE — інтерактивність сайту (ЛР: JavaScript)
   Один файл, без бібліотек. Підключається на кожній сторінці:
   <script src="js/app.js" defer></script>
   Стани (кошик, обране, замовлення, користувач) зберігаються в localStorage.
   ===================================================================== */
(function () {
  'use strict';

  /* Захист: якщо скрипт підключено на сторінці двічі, виконується лише перше підключення */
  if (window.__grooveApp) return;
  window.__grooveApp = true;

  /* ===== 1. ДАНІ ===== */
  const PRODUCTS = [
    { id: 1, slug: "tykhi-orbity", title: "Тихі орбіти", artist: "Vira Nova", genre: "Electronic", year: 2024, price: 1190, fmt: "2LP", cond: "Нова", new: true, stock: true },
    { id: 2, slug: "synia-kimnata", title: "Синя кімната", artist: "Quartet 82", genre: "Jazz", year: 2021, price: 1280, fmt: "LP", cond: "Нова", new: false, stock: false },
    { id: 3, slug: "nichnyi-tramvai", title: "Нічний трамвай", artist: "Atlas 7", genre: "Jazz", year: 2023, price: 1350, fmt: "2LP, 180 г", cond: "Нова", new: false, stock: true },
    { id: 4, slug: "teplyi-shum", title: "Теплий шум", artist: "Misto Tapes", genre: "Electronic", year: 2024, price: 1050, fmt: "LP", cond: "Нова", new: true, stock: true },
    { id: 5, slug: "pislia-doshchu", title: "Після дощу", artist: "Sontse Club", genre: "Indie", year: 2022, price: 890, fmt: "LP", cond: "Відмінний", new: false, stock: true },
    { id: 6, slug: "zolota-hodyna", title: "Золота година", artist: "Kalyna Drive", genre: "Pop", year: 2019, price: 990, fmt: "LP", cond: "Відмінний", new: true, stock: true },
    { id: 7, slug: "hlyboky-synii", title: "Глибокий синій", artist: "Vira Nova", genre: "Rock", year: 2015, price: 1450, fmt: "2LP", cond: "Дуже добрий", new: false, stock: true },
    { id: 8, slug: "pivdennyi-viter", title: "Південний вітер", artist: "Misto Tapes", genre: "Soul", year: 2018, price: 1100, fmt: "LP", cond: "Нова", new: true, stock: true },
    { id: 9, slug: "piv-na-druhu", title: "Пів на другу", artist: "Atlas 7", genre: "Jazz", year: 2020, price: 920, fmt: "LP", cond: "Відмінний", new: false, stock: true }
  ];

  const EXTRA = {
    1: { rating: 4.7, reviews: 31, about: '«Тихі орбіти» — дебют Vira Nova: повільна електроніка з аналоговими синтезаторами, що звучить як нічна подорож містом. Видання 2LP із друкованим вкладишем.', tracks: ['Старт', 'Нічна зміна', 'Тихі орбіти', 'Апогей', 'Невагомість', 'Посадка'] },
    2: { rating: 4.6, reviews: 18, about: 'Камерний джаз квартету Quartet 82, записаний на один мікрофон у вітальні: теплий контрабас, приглушена труба й тиша між нотами. Тираж обмежений.', tracks: ['Синя кімната', 'Тиха ніч', 'Свічка', 'Пів на третю', 'Крізь штору', 'Ранок'] },
    3: { rating: 4.8, reviews: 24, about: '«Нічний трамвай» — третій альбом квінтету Atlas 7: камерний джаз з електронними фактурами, записаний уночі в порожньому депо. Видання 2LP на 180-грамовому вінілі з щільним конвертом.', tracks: ['Нічний трамвай', 'Останній вагон', 'Мокрий асфальт', 'Мовчазна зупинка', 'Диспетчер', 'Кільцева'], off: 4 },
    4: { rating: 4.5, reviews: 12, about: 'Misto Tapes збирають ритми зі стрічок і міських шумів: тепла електроніка для вечора вдома. Новий тираж, чорний вініл.', tracks: ['Теплий шум', 'Вініловий дощ', 'Лампи', 'Тихий гул', 'Ефір', 'Вихід'] },
    5: { rating: 4.4, reviews: 9, about: 'Інді-альбом Sontse Club про вечори після дощу: гітари, живі барабани та м’який вокал. Платівка у відмінному стані.', tracks: ['Калюжі', 'Після дощу', 'Парасолька', 'Мокре листя', 'Сонце крізь хмари', 'Додому'] },
    6: { rating: 4.3, reviews: 15, about: 'Яскравий поп-альбом Kalyna Drive 2019 року: танцювальні ритми та літній настрій. Платівка у відмінному стані, конверт без потертостей.', tracks: ['Золота година', 'Захід', 'Літній вечір', 'Танцмайданчик', 'Останній сеанс', 'Тепле світло'], off: 4 },
    7: { rating: 4.9, reviews: 42, about: 'Рок-альбом Vira Nova 2015 року: щільні гітари, глибокий бас і довгі інструментальні переходи. Перевидання на 2LP, стан дуже добрий.', tracks: ['Глибокий синій', 'Хвиля', 'Маяк', 'Нічна зміна', 'Шторм', 'Тиша після'] },
    8: { rating: 4.6, reviews: 21, about: 'Соул від Misto Tapes із тепла духовою секцією та настроєм морського узбережжя. Новий тираж.', tracks: ['Південний вітер', 'Узбережжя', 'Сіль', 'Повільний танець', 'Вечірній порт', 'Знову на південь'] },
    9: { rating: 4.5, reviews: 14, about: 'Атмосферний джаз Atlas 7, записаний у нічному барі: контрабас, щітки по барабану й тихі розмови за сусіднім столиком.', tracks: ['Пів на другу', 'Бар на розі', 'Останній гість', 'Тихі келихи', 'Джем', 'Розвиднюється'] }
  };

  const ARTISTS = {
    'Vira Nova': { genre: 'Electronic', bio: 'Електронний проєкт: аналогові синтезатори, повільні ритми й атмосферні мелодії для вечірнього прослуховування.' },
    'Quartet 82': { genre: 'Jazz', bio: 'Джазовий квартет, що записується наживо без накладань: контрабас, труба, рояль і барабани.' },
    'Atlas 7': { genre: 'Jazz', bio: 'Квінтет, який поєднує камерний джаз з електронікою та польовими записами міста. Платівки записують наживо на аналогове обладнання, тому кожен тираж звучить тепло й живо.' },
    'Misto Tapes': { genre: 'Electronic', bio: 'Дует, що збирає ритми зі стрічок і міських звуків: тепла електроніка та соул.' },
    'Sontse Club': { genre: 'Indie', bio: 'Інді-гурт: гітарні мелодії, живі барабани й тихі вокальні гармонії.' },
    'Kalyna Drive': { genre: 'Pop', bio: 'Поп-тріо з танцювальними ритмами та літнім настроєм.' }
  };

  const DELIVERY = { np: 120, courier: 180, pickup: 0 };
  const FREE_FROM = 2500;
  const NB = '\u00a0';

  /* ===== 2. ДОПОМІЖНІ ФУНКЦІЇ ===== */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NB) + NB + '₴';
  const plural = (n, f) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? f[0] : (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? f[1] : f[2]); };
  const recordsWord = (n) => n + NB + plural(n, ['платівка', 'платівки', 'платівок']);
  const byId = (id) => PRODUCTS.find((p) => p.id === Number(id));
  const byTitle = (t) => PRODUCTS.find((p) => p.title === String(t).trim());
  const params = new URLSearchParams(location.search);
  const page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';

  const ICON_PATHS = {
    heart: '<path d="M12 20.5s-7.5-4.6-9.2-9.4C1.6 7.7 3.7 4.5 7 4.5c2 0 3.4 1 5 3 1.6-2 3-3 5-3 3.3 0 5.4 3.2 4.2 6.6-1.7 4.8-9.2 9.4-9.2 9.4Z"/>',
    trash: '<path d="M4 7h16M10 11v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7v6m0 3.5v.5"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    bag: '<path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    box: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>',
    play: '<path d="M7 5v14l12-7L7 5Z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>'
  };
  const ico = (n) => '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + ICON_PATHS[n] + '</svg>';

  /* ===== 3. СХОВИЩЕ ===== */
  const mem = {};
  const store = {
    get(k, def) { try { const v = localStorage.getItem('groove.' + k); return v === null ? def : JSON.parse(v); } catch (e) { return k in mem ? mem[k] : def; } },
    set(k, v) { try { localStorage.setItem('groove.' + k, JSON.stringify(v)); } catch (e) { mem[k] = v; } }
  };
  if (!store.get('seeded', false)) { // стартовий стан збігається з макетом
    store.set('cart', [{ id: 1, qty: 1 }, { id: 5, qty: 1 }]);
    store.set('wish', [7]);
    store.set('seeded', true);
  }
  const getCart = () => store.get('cart', []);
  const setCart = (c) => { store.set('cart', c); renderCounts(); };
  const getWish = () => store.get('wish', []);
  const setWish = (w) => { store.set('wish', w); renderCounts(); };
  const inWish = (id) => getWish().includes(Number(id));

  function addToCart(id, n) {
    const cart = getCart(); const it = cart.find((i) => i.id === id);
    if (it) it.qty = Math.min(10, it.qty + n); else cart.push({ id, qty: Math.min(10, n) });
    setCart(cart);
  }
  function removeFromCart(id) { setCart(getCart().filter((i) => i.id !== id)); }
  function setQty(id, q) { const cart = getCart(); const it = cart.find((i) => i.id === id); if (it) { it.qty = q; setCart(cart); } }
  function toggleWish(id) {
    id = Number(id); const w = getWish(); const i = w.indexOf(id);
    if (i >= 0) { w.splice(i, 1); setWish(w); return false; }
    w.push(id); setWish(w); return true;
  }
  const cartItems = () => getCart().map((i) => ({ p: byId(i.id), qty: i.qty })).filter((x) => x.p);
  const subtotal = () => cartItems().reduce((s, x) => s + x.p.price * x.qty, 0);
  const deliveryCost = (sub, kind) => (sub === 0 || sub >= FREE_FROM) ? 0 : (DELIVERY[kind || 'np'] || 0);

  /* ===== 4. ДОДАТКОВІ СТИЛІ (інжектуються скриптом) ===== */
  const style = document.createElement('style');
  style.textContent = [
    '[hidden]{display:none!important}',
    '.toast-region{position:fixed;right:1rem;bottom:1rem;z-index:300;display:grid;gap:.75rem;width:min(28rem,calc(100% - 2rem))}',
    '.toast{animation:toast-in .25s ease}',
    '@keyframes toast-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}',
    '.toast__btn{flex:none;border:0;background:none;color:var(--color-beige);font-weight:700;text-decoration:underline;cursor:pointer;padding:.5rem;min-height:2.75rem}',
    '.toast__close{flex:none;border:0;background:none;color:var(--color-text-muted);cursor:pointer;width:2rem;height:2rem;font-size:1.25rem;line-height:1}',
    '.btn.is-done{background:var(--color-success);border-color:var(--color-success);color:var(--color-on-accent)}',
    '.empty-wrap{grid-column:1/-1}'
  ].join('\n');
  document.head.appendChild(style);

  /* ===== 5. СПОВІЩЕННЯ (toast) ===== */
  let region = null;
  function toast(msg, opt) {
    opt = opt || {};
    if (!region) { region = document.createElement('div'); region.className = 'toast-region'; region.setAttribute('role', 'status'); region.setAttribute('aria-live', 'polite'); document.body.appendChild(region); }
    const kind = opt.kind || 'success';
    const t = document.createElement('div');
    t.className = 'toast toast--' + kind;
    t.innerHTML = ico(kind === 'error' ? 'alert' : 'check') + '<p>' + msg + '</p>';
    if (opt.href) { const a = document.createElement('a'); a.href = opt.href; a.textContent = opt.label || 'Перейти'; t.appendChild(a); }
    if (opt.action) { const b = document.createElement('button'); b.type = 'button'; b.className = 'toast__btn'; b.textContent = opt.label || 'Скасувати'; b.addEventListener('click', () => { opt.action(); t.remove(); }); t.appendChild(b); }
    const x = document.createElement('button'); x.type = 'button'; x.className = 'toast__close'; x.setAttribute('aria-label', 'Закрити сповіщення'); x.textContent = '×'; x.addEventListener('click', () => t.remove()); t.appendChild(x);
    region.appendChild(t);
    while (region.children.length > 3) region.firstChild.remove();
    setTimeout(() => t.remove(), opt.ms || 4500);
  }

  /* ===== 6. ШАПКА: ЛІЧИЛЬНИКИ ТА ПРОФІЛЬ ===== */
  function renderCounts() {
    const set = (href, n, word) => {
      const a = $('.header-actions a[href="' + href + '"]'); if (!a) return;
      let c = $('.count', a);
      if (!n) { if (c) c.remove(); return; }
      if (!c) { c = document.createElement('span'); c.className = 'count'; a.appendChild(c); }
      c.innerHTML = n + '<span class="visually-hidden"> ' + word + '</span>';
    };
    set('wishlist.html', getWish().length, 'у обраному');
    set('cart.html', getCart().reduce((s, i) => s + i.qty, 0), 'у кошику');
  }
  function enhanceHeader() {
    renderCounts();
    const user = store.get('user', null);
    const a = $('.header-actions a[href="login.html"]');
    if (a && user) a.setAttribute('href', 'profile.html');
  }

  /* ===== 7. ШАБЛОНИ ===== */
  function cardHTML(p, o) {
    o = o || {}; const t = esc(p.title); const out = !p.stock;
    let badge = ''; if (p.new && p.stock) badge = '<span class="badge badge--new">Новинка</span>'; if (out) badge = '<span class="badge badge--out">Немає в наявності</span>';
    const fav = o.wish ? '' : '<button class="icon-btn product-card__fav" type="button" aria-pressed="' + inWish(p.id) + '" aria-label="' + (inWish(p.id) ? 'Прибрати' : 'Додати') + ' «' + t + '» ' + (inWish(p.id) ? 'з обраного' : 'до обраного') + '">' + ico('heart') + '</button>';
    const buy = '<button class="btn btn--primary btn--block" type="button"' + (out ? ' disabled' : '') + '>' + (out ? 'Немає в наявності' : 'Додати до кошика') + '<span class="visually-hidden">: ' + t + '</span></button>';
    const rm = o.wish ? '<button class="btn btn--ghost btn--block" type="button">' + ico('trash') + ' Видалити з обраного<span class="visually-hidden">: ' + t + '</span></button>' : '';
    const href = 'product.html?id=' + p.id;
    return '<li><article class="product-card' + (out ? ' product-card--out' : '') + '" data-id="' + p.id + '"><div class="product-card__media"><a href="' + href + '" tabindex="-1" aria-hidden="true"><img src="images/covers/' + p.slug + '.svg" alt="Обкладинка альбому «' + t + '», ' + esc(p.artist) + '" width="600" height="600" loading="lazy"></a>' + fav +
      '<a class="btn btn--sm product-card__view" href="' + href + '">Переглянути<span class="visually-hidden"> «' + t + '»</span></a></div><div class="product-card__badges">' + badge + '</div><h3 class="product-card__title"><a href="' + href + '">' + t + '</a></h3><p class="product-card__meta">' + esc(p.artist) + ' · ' + p.genre + ' · ' + p.year + '</p><p class="product-card__price">' + money(p.price) + '</p><div class="product-card__actions">' + buy + rm + '</div></article></li>';
  }
  function stateHTML(icon, title, text, actions, kind) {
    return '<div class="state' + (kind ? '' : '') + '"><div class="state__icon' + (kind ? ' state__icon--' + kind : '') + '">' + ico(icon) + '</div><h2>' + title + '</h2><p>' + text + '</p><div class="state__actions">' + actions + '</div></div>';
  }
  const linkBtn = (href, text, cls) => '<a class="btn ' + (cls || 'btn--primary') + '" href="' + href + '">' + text + '</a>';
  const qtyHTML = (id, val) => '<div class="qty" role="group" aria-label="Кількість"><button type="button" aria-label="Зменшити кількість"' + (val <= 1 ? ' disabled' : '') + '>−</button><label class="visually-hidden" for="' + id + '">Кількість</label><input id="' + id + '" type="number" value="' + val + '" min="1" max="10" inputmode="numeric"><button type="button" aria-label="Збільшити кількість"' + (val >= 10 ? ' disabled' : '') + '>+</button></div>';

  /* Прив'язка посилань і стану до карток, створених у HTML */
  function enhanceCards(root) {
    $$('.product-card', root).forEach((card) => {
      const a = $('.product-card__title a', card); if (!a) return;
      const p = byTitle(a.textContent); if (!p) return;
      card.dataset.id = p.id;
      $$('a[href="product.html"]', card).forEach((l) => l.setAttribute('href', 'product.html?id=' + p.id));
      const f = $('.product-card__fav', card);
      if (f) { const on = inWish(p.id); f.setAttribute('aria-pressed', String(on)); f.setAttribute('aria-label', (on ? 'Прибрати «' : 'Додати «') + p.title + (on ? '» з обраного' : '» до обраного')); }
    });
    $$('.cart-item h3 a', root).forEach((l) => { const p = byTitle(l.textContent); if (p) l.setAttribute('href', 'product.html?id=' + p.id); });
    $$('.genre-card a', root).forEach((l) => { const h = $('h3', l); if (h) l.setAttribute('href', 'catalog.html?genre=' + encodeURIComponent(h.textContent.trim())); });
    $$('.artist-card a', root).forEach((l) => { const h = $('h3', l); if (h) l.setAttribute('href', 'artist.html?name=' + encodeURIComponent(h.textContent.trim())); });
  }

  /* ===== 8. ГЛОБАЛЬНІ ОБРОБНИКИ КЛІКІВ ===== */
  function flashAdded(btn) {
    if (!btn) return; const old = btn.innerHTML; btn.classList.add('is-done'); btn.innerHTML = ico('check') + ' Додано';
    setTimeout(() => { btn.classList.remove('is-done'); btn.innerHTML = old; }, 1400);
  }
  function setFav(btn, p, on) {
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', (on ? 'Прибрати «' : 'Додати «') + p.title + (on ? '» з обраного' : '» до обраного'));
  }
  function clampQty(inp, v) {
    const min = Number(inp.min || 1), max = Number(inp.max || 10);
    v = Math.max(min, Math.min(max, Math.round(Number(v)) || min)); inp.value = v;
    const q = inp.closest('.qty'); const [minus, plus] = $$('button', q); if (minus) minus.disabled = v <= min; if (plus) plus.disabled = v >= max; return v;
  }
  document.addEventListener('click', (e) => {
    const t = e.target;
    /* кількість +/− */
    const qb = t.closest('.qty button');
    if (qb) { const inp = $('input', qb.closest('.qty')); const dir = (qb.getAttribute('aria-label') || '').indexOf('Зменшити') === 0 ? -1 : 1; clampQty(inp, Number(inp.value) + dir); inp.dispatchEvent(new Event('change', { bubbles: true })); return; }
    /* картка: у кошик */
    const card = t.closest('.product-card');
    if (card) {
      const id = Number(card.dataset.id); const p = byId(id); if (!p) return;
      const fav = t.closest('.product-card__fav');
      if (fav) { const on = toggleWish(id); setFav(fav, p, on); toast(on ? '«' + esc(p.title) + '» додано до обраного' : '«' + esc(p.title) + '» прибрано з обраного', { href: 'wishlist.html', label: 'Обране', kind: on ? 'success' : 'info' }); return; }
      const btn = t.closest('.product-card__actions .btn');
      if (btn && !btn.disabled) {
        if (btn.classList.contains('btn--primary')) { addToCart(id, 1); flashAdded(btn); toast('«' + esc(p.title) + '» додано до кошика', { href: 'cart.html', label: 'У кошик' }); }
        else if (btn.classList.contains('btn--ghost') && page === 'wishlist') { setWish(getWish().filter((w) => w !== id)); toast('«' + esc(p.title) + '» прибрано з обраного', { kind: 'info', label: 'Скасувати', action: () => { const w = getWish(); w.push(id); setWish(w); renderWishlist(); } }); renderWishlist(); }
      }
    }
  });

  /* ===== 9. КОШИК ===== */
  function summaryHTML(sub, kind) {
    const d = deliveryCost(sub, kind);
    return '<div><dt>Проміжна сума</dt><dd>' + money(sub) + '</dd></div><div><dt>Доставка</dt><dd>' + (d === 0 && sub > 0 ? 'Безкоштовно' : money(d)) + '</dd></div><div class="summary__total"><dt>Загальна сума</dt><dd>' + money(sub + d) + '</dd></div>';
  }
  function cartHint(sub) {
    if (sub >= FREE_FROM) return 'Доставка для вас безкоштовна.';
    return 'Додайте ще на ' + money(FREE_FROM - sub) + ' — і доставка буде безкоштовною.';
  }
  function itemHTML(x) {
    const p = x.p; const t = esc(p.title);
    return '<li class="cart-item" data-id="' + p.id + '"><img src="images/covers/' + p.slug + '.svg" alt="Обкладинка альбому «' + t + '», ' + esc(p.artist) + '" width="600" height="600" loading="lazy"><div><h3><a href="product.html?id=' + p.id + '">' + t + '</a></h3><p>' + esc(p.artist) + ' · ' + esc(p.fmt) + '</p><button class="btn btn--ghost btn--sm cart-item__remove" type="button">' + ico('trash') + ' Видалити<span class="visually-hidden">: ' + t + '</span></button></div>' + qtyHTML('qty-' + p.id, x.qty) + '<p class="cart-item__price">' + money(p.price * x.qty) + '</p></li>';
  }
  function renderCart() {
    const box = $('.cart') || $('.cart-empty'); if (!box) return;
    const items = cartItems();
    if (!items.length) { box.className = 'cart-empty'; box.innerHTML = stateHTML('bag', 'Ваш кошик порожній', 'Додайте платівки з каталогу — і вони з’являться тут.', linkBtn('catalog.html', 'Перейти до каталогу')); return; }
    const sub = subtotal();
    box.className = 'cart';
    box.innerHTML = '<section aria-labelledby="cart-items"><h2 id="cart-items" class="visually-hidden">Товари в кошику</h2><ul class="cart-list">' + items.map(itemHTML).join('') + '</ul><p class="mt-6"><a class="link-arrow" href="catalog.html">' + ico('arrow') + ' Повернутися до каталогу</a></p></section>' +
      '<aside class="summary" aria-labelledby="summary-title"><h2 id="summary-title">Підсумок</h2><dl>' + summaryHTML(sub) + '</dl><p class="summary__hint">' + cartHint(sub) + '</p><a class="btn btn--primary btn--block" href="checkout.html">Оформити замовлення ' + ico('arrow') + '</a><p class="summary__note">Безпечна оплата · Повернення протягом 14 днів</p></aside>';
  }
  function refreshCartNumbers() {
    const sub = subtotal();
    cartItems().forEach((x) => { const li = $('.cart-item[data-id="' + x.p.id + '"]'); if (li) $('.cart-item__price', li).textContent = money(x.p.price * x.qty); });
    const dl = $('.cart .summary dl'); if (dl) dl.innerHTML = summaryHTML(sub);
    const h = $('.summary__hint'); if (h) h.textContent = cartHint(sub);
  }
  function initCart() {
    if (!$('.cart')) return; renderCart();
    document.addEventListener('change', (e) => {
      const inp = e.target.closest('.cart-item .qty input'); if (!inp) return;
      const id = Number(inp.closest('.cart-item').dataset.id); const v = clampQty(inp, inp.value); setQty(id, v); refreshCartNumbers();
    });
    document.addEventListener('click', (e) => {
      const b = e.target.closest('.cart-item__remove'); if (!b) return;
      const li = b.closest('.cart-item'); const id = Number(li.dataset.id); const it = getCart().find((i) => i.id === id); const p = byId(id);
      removeFromCart(id); renderCart();
      toast('«' + esc(p.title) + '» видалено з кошика', { kind: 'info', label: 'Скасувати', action: () => { const c = getCart(); c.push({ id, qty: it.qty }); setCart(c); renderCart(); } });
      const first = $('.cart-item__remove'); if (first) first.focus();
    });
  }

  /* ===== 10. ОБРАНЕ ===== */
  function renderWishlist() {
    const grid = $('main .grid-products') || $('.grid-empty'); if (!grid || page !== 'wishlist') return;
    const items = getWish().map(byId).filter(Boolean);
    if (!items.length) { grid.outerHTML = '<div class="grid-empty">' + stateHTML('heart', 'У обраному поки нічого немає', 'Натискайте на серце в картці платівки, щоб зберегти її на потім.', linkBtn('catalog.html', 'Знайти платівки')) + '</div>'; return; }
    const holder = $('.grid-empty'); const html = '<ul class="grid-products grid-products--3">' + items.map((p) => cardHTML(p, { wish: true })).join('') + '</ul>';
    if (holder) holder.outerHTML = html; else grid.outerHTML = html;
  }

  /* ===== 11. КАТАЛОГ ===== */
  function initCatalog() {
    const form = $('#filters'); const grid = $('.catalog ul.grid-products'); if (!form || !grid) return;
    const items = $$('li', grid).map((li, idx) => { const c = $('.product-card', li); return { li, idx, p: c && byId(c.dataset.id) }; }).filter((x) => x.p);
    const countEl = $('.catalog-tools__row p'); const pag = $('.pagination'); const sortSel = $('#sort-catalog');
    const condNames = ['Нова', 'Відмінний', 'Дуже добрий'];
    const g = params.get('genre');
    if (g) { const r = $$('input[name="genre"]', form).find((x) => x.value === g); $$('input[name="genre"]', form).forEach((x) => { x.checked = false; }); if (r) r.checked = true; }
    let empty = null;
    function apply() {
      const fd = new FormData(form);
      const genre = (fd.get('genre') || 'Усі'); const artist = fd.get('artist') || 'Усі виконавці';
      const years = fd.getAll('year').map(Number); const conds = fd.getAll('cond').map((i) => condNames[Number(i)]);
      const min = parseInt(fd.get('min'), 10); const max = parseInt(fd.get('max'), 10); const stock = fd.get('stock');
      const gParam = g && !$$('input[name="genre"]', form).some((x) => x.checked) ? g : null;
      let shown = 0;
      items.forEach((x) => {
        const p = x.p; let ok = true;
        if (gParam) ok = ok && p.genre === gParam; else if (genre !== 'Усі') ok = ok && p.genre === genre;
        if (artist !== 'Усі виконавці') ok = ok && p.artist === artist;
        if (years.length) ok = ok && years.some((y) => (y === 0 && p.year >= 2020) || (y === 1 && p.year >= 2010 && p.year <= 2019) || (y === 2 && p.year < 2010));
        if (conds.length) ok = ok && conds.includes(p.cond);
        if (!isNaN(min)) ok = ok && p.price >= min; if (!isNaN(max)) ok = ok && p.price <= max;
        if (stock) ok = ok && p.stock;
        x.li.hidden = !ok; if (ok) shown++;
      });
      const mode = sortSel ? sortSel.selectedIndex : 0; const sorted = items.slice().sort((a, b) => {
        if (mode === 1) return (b.p.year - a.p.year) || (Number(b.p.new) - Number(a.p.new));
        if (mode === 2) return a.p.price - b.p.price; if (mode === 3) return b.p.price - a.p.price;
        if (mode === 4) return a.p.title.localeCompare(b.p.title, 'uk'); return a.idx - b.idx;
      });
      sorted.forEach((x) => grid.appendChild(x.li));
      if (countEl) countEl.innerHTML = 'Знайдено: <strong>' + recordsWord(shown) + '</strong>';
      if (!empty) { empty = document.createElement('div'); empty.className = 'catalog-empty'; empty.hidden = true; empty.innerHTML = stateHTML('search', 'Нічого не знайдено', 'Спробуйте змінити фільтри або скинути їх.', '<button class="btn btn--primary" type="button" data-reset>Скинути фільтри</button>'); grid.after(empty); }
      empty.hidden = shown > 0;
      if (pag) pag.hidden = !shown;
    }
    form.addEventListener('submit', (e) => { e.preventDefault(); apply(); const t = $('#filters-toggle'); if (t) t.checked = false; });
    form.addEventListener('change', apply);
    form.addEventListener('reset', () => setTimeout(() => { if (g) history.replaceState(null, '', 'catalog.html'); apply(); }, 0));
    if (sortSel) sortSel.addEventListener('change', apply);
    document.addEventListener('click', (e) => { if (e.target.closest('[data-reset]')) { form.reset(); } });
    apply();
  }

  /* ===== 12. ПОШУК ===== */
  function initSearch() {
    const form = $('#search-q'); const grid = $('main ul.grid-products'); if (!form || page !== 'search') return;
    const q = (params.get('q') || '').trim(); form.value = q;
    const h1 = $('.page-head h1'); const count = $('.catalog-tools__row p'); const sortSel = $('#sort-search');
    const hint = $('main p.mt-12');
    function render() {
      const needle = q.toLowerCase();
      let res = needle ? PRODUCTS.filter((p) => (p.title + ' ' + p.artist + ' ' + p.genre + ' ' + p.year).toLowerCase().includes(needle)) : [];
      const mode = sortSel ? sortSel.selectedIndex : 0;
      res.sort((a, b) => mode === 1 ? (b.year - a.year) : mode === 2 ? a.price - b.price : mode === 3 ? b.price - a.price : mode === 4 ? a.title.localeCompare(b.title, 'uk') : 0);
      h1.textContent = q || 'Пошук';
      if (hint) hint.hidden = true;
      if (!q) { count.innerHTML = 'Введіть назву альбому або виконавця'; grid.outerHTML = '<div class="grid-empty">' + stateHTML('search', 'Що шукаємо?', 'Введіть назву альбому, виконавця чи жанр у поле вище.', linkBtn('catalog.html', 'Переглянути каталог')) + '</div>'; return; }
      count.innerHTML = 'За запитом «' + esc(q) + '» знайдено: <strong>' + recordsWord(res.length) + '</strong>';
      const cur = $('main ul.grid-products') || $('main .grid-empty');
      cur.outerHTML = res.length ? '<ul class="grid-products grid-products--3">' + res.map((p) => cardHTML(p)).join('') + '</ul>' : '<div class="grid-empty">' + stateHTML('search', 'Нічого не знайдено', 'Спробуйте змінити запит або перевірити написання.', linkBtn('catalog.html', 'Скинути пошук') + linkBtn('index.html#genres', 'Переглянути жанри', 'btn--secondary')) + '</div>';
    }
    if (sortSel) sortSel.addEventListener('change', render);
    render();
  }

  /* ===== 13. СТОРІНКА ПЛАТІВКИ ===== */
  let player = null;
  function dur(id, i) { return (3 + (id + i * 2) % 4) + ':' + String((id * 13 + i * 17) % 50 + 10); }
  function trackHTML(p, i, t, off) {
    const d = dur(p.id, i);
    return '<li class="track' + (off ? ' track--unavailable' : '') + '" data-dur="' + d + '"><span class="track__num">' + (i + 1) + '</span><button class="icon-btn" type="button"' + (off ? ' disabled aria-label="Відтворення недоступне: ' + esc(t) + '"' : ' aria-label="Відтворити: ' + esc(t) + '"') + '>' + ico('play') + '</button><p class="track__title">' + esc(t) + (off ? '<span class="track__note">Аудіо недоступне</span>' : '') + '</p><span class="track__time">' + d + '</span></li>';
  }
  function stopPlayer() {
    if (!player) return; clearInterval(player.timer);
    const li = player.li; li.classList.remove('track--active'); const pr = $('.track__progress', li); if (pr) pr.remove();
    const b = $('.icon-btn', li); b.innerHTML = ico('play'); b.setAttribute('aria-label', b.getAttribute('aria-label').replace('Поставити на паузу', 'Відтворити')); player = null;
  }
  function startPlayer(li) {
    const title = $('.track__title', li).textContent; const b = $('.icon-btn', li);
    b.innerHTML = ico('pause'); b.setAttribute('aria-label', 'Поставити на паузу: ' + title); li.classList.add('track--active');
    const total = 30; let sec = 0; const pr = document.createElement('div'); pr.className = 'track__progress';
    pr.innerHTML = '<label class="visually-hidden" for="prog">Прогрес відтворення «' + esc(title) + '»</label><progress id="prog" value="0" max="' + total + '">0%</progress><span>0:00 / 0:30</span>'; li.appendChild(pr);
    player = { li, timer: setInterval(() => { sec++; $('progress', pr).value = sec; $('span', pr).textContent = '0:' + String(sec).padStart(2, '0') + ' / 0:30'; if (sec >= total) stopPlayer(); }, 1000) };
  }
  function initProduct() {
    const root = $('.product'); if (!root || page !== 'product') return;
    const p = byId(params.get('id')) || byId(3); const ex = EXTRA[p.id];
    document.title = p.title + ' — ' + p.artist + ' — GROOVE';
    const img = $('.product__main img'); img.src = 'images/covers/' + p.slug + '.svg'; img.alt = 'Обкладинка альбому «' + p.title + '», ' + p.artist;
    const thumbs = $('.product__thumbs');
    if (p.id === 3) { /* для цього альбому є додаткові фото — лишаємо галерею з HTML */
      $$('a', thumbs).forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); const im = $('img', a); img.src = im.src; img.alt = im.alt; $$('a', thumbs).forEach((x) => x.removeAttribute('aria-current')); a.setAttribute('aria-current', 'true'); }));
    } else { thumbs.hidden = true; }
    $('.breadcrumb ol').innerHTML = '<li><a href="catalog.html">Каталог</a></li><li><a href="catalog.html?genre=' + encodeURIComponent(p.genre) + '">' + p.genre + '</a></li><li aria-current="page">' + esc(p.title) + '</li>';
    const art = $('.product__artist'); art.textContent = p.artist; art.href = 'artist.html?name=' + encodeURIComponent(p.artist);
    $('.product__info h1').textContent = p.title;
    $('.rating').innerHTML = '<span class="rating__stars" style="--rating:' + ex.rating + '" aria-hidden="true"></span><span><strong>' + String(ex.rating).replace('.', ',') + '</strong> з 5 <span class="text-muted">(' + ex.reviews + ' ' + plural(ex.reviews, ['відгук', 'відгуки', 'відгуків']) + ')</span></span>';
    $('.specs').innerHTML = '<div><dt>Жанр</dt><dd>' + p.genre + '</dd></div><div><dt>Рік</dt><dd>' + p.year + '</dd></div><div><dt>Формат</dt><dd>' + esc(p.fmt) + '</dd></div><div><dt>Стан</dt><dd>' + esc(p.cond) + '</dd></div>';
    $('.product__price').textContent = money(p.price);
    const av = $('.badge--stock, .badge--out').parentElement;
    av.innerHTML = p.stock ? '<span class="badge badge--stock">В наявності</span> <span class="text-muted text-small">· відправлення за 48 годин</span>' : '<span class="badge badge--out">Немає в наявності</span> <span class="text-muted text-small">· повідомимо, коли платівка повернеться</span>';
    const buy = $('.product__buy .btn--primary'); const qtyInp = $('#qty-product');
    if (!p.stock) { buy.disabled = true; buy.textContent = 'Немає в наявності'; $$('.qty button, .qty input', root).forEach((x) => { x.disabled = true; }); }
    else buy.addEventListener('click', () => { const n = clampQty(qtyInp, qtyInp.value); addToCart(p.id, n); flashAdded(buy); toast('«' + esc(p.title) + '» (' + n + ' шт.) додано до кошика', { href: 'cart.html', label: 'У кошик' }); });
    qtyInp.addEventListener('change', () => clampQty(qtyInp, qtyInp.value));
    const wish = $('.product__wish');
    const syncWish = () => { const on = inWish(p.id); wish.setAttribute('aria-pressed', String(on)); wish.innerHTML = ico('heart') + (on ? ' В обраному' : ' Додати до обраного'); };
    syncWish(); wish.addEventListener('click', () => { const on = toggleWish(p.id); syncWish(); toast(on ? '«' + esc(p.title) + '» додано до обраного' : '«' + esc(p.title) + '» прибрано з обраного', { kind: on ? 'success' : 'info', href: 'wishlist.html', label: 'Обране' }); });
    const about = $('#about-album').parentElement; $$('p', about).forEach((x) => x.remove()); about.insertAdjacentHTML('beforeend', '<p>' + esc(ex.about) + '</p>');
    $('.tracklist').innerHTML = ex.tracks.map((t, i) => trackHTML(p, i, t, ex.off === i)).join('');
    $('.tracklist').addEventListener('click', (e) => {
      const b = e.target.closest('.icon-btn'); if (!b || b.disabled) return; const li = b.closest('.track');
      if (player && player.li === li) { stopPlayer(); return; } stopPlayer(); startPlayer(li);
    });
    const similar = PRODUCTS.filter((x) => x.id !== p.id).sort((a, b) => (Number(b.genre === p.genre) - Number(a.genre === p.genre)) || (a.id - b.id)).slice(0, 4);
    $('#similar-title').closest('section').querySelector('ul.grid-products').innerHTML = similar.map((x) => cardHTML(x)).join('');
  }

  /* ===== 14. СТОРІНКА ВИКОНАВЦЯ ===== */
  function initArtist() {
    const hero = $('.artist-hero'); if (!hero || page !== 'artist') return;
    let name = params.get('name'); if (!ARTISTS[name]) name = 'Atlas 7'; const a = ARTISTS[name]; const slug = name.toLowerCase().replace(/\s+/g, '-');
    document.title = name + ' — виконавець — GROOVE';
    const im = $('img', hero); im.src = 'images/artists/' + slug + '.svg'; im.alt = 'Ілюстрація-заглушка: виконавець ' + name;
    $('h1', hero).textContent = name; $('.artist-hero__genre', hero).textContent = a.genre; $('.artist-hero__bio', hero).textContent = a.bio;
    $('.breadcrumb [aria-current="page"]').textContent = name;
    $('#albums-title').textContent = 'Платівки ' + name;
    const list = PRODUCTS.filter((p) => p.artist === name);
    $('#albums-title').closest('section').querySelector('ul.grid-products').innerHTML = list.map((p) => cardHTML(p)).join('');
  }

  /* ===== 15. ФОРМИ: ВАЛІДАЦІЯ ===== */
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function setError(inp, msg) {
    clearError(inp); inp.setAttribute('aria-invalid', 'true');
    const id = inp.id + '-err'; const m = document.createElement('p'); m.className = 'error-msg'; m.id = id; m.setAttribute('role', 'alert'); m.innerHTML = ico('alert') + ' ' + msg;
    const fld = inp.closest('.field'); if (fld) fld.appendChild(m); else (inp.closest('.check') || inp).insertAdjacentElement('afterend', m);
    inp.setAttribute('aria-describedby', id);
  }
  function clearError(inp) {
    inp.removeAttribute('aria-invalid'); const m = document.getElementById(inp.id + '-err'); if (m) m.remove(); inp.removeAttribute('aria-describedby');
  }
  const rules = {
    name: (v) => v.trim().length < 2 ? 'Вкажіть ім’я та прізвище' : '',
    phone: (v) => v.replace(/\D/g, '').length < 10 ? 'Вкажіть телефон у форматі +38 0XX XXX-XX-XX' : '',
    email: (v) => !EMAIL.test(v.trim()) ? 'Вкажіть адресу у форматі name@example.com' : '',
    required: (v) => !v.trim() ? 'Заповніть це поле' : '',
    pass: (v) => v.length < 8 ? 'Пароль має містити щонайменше 8 символів' : ''
  };
  function validate(form, spec) {
    let first = null;
    Object.keys(spec).forEach((id) => {
      const inp = $('#' + id, form); if (!inp) return;
      const msg = spec[id](inp.type === 'checkbox' ? (inp.checked ? 'ok' : '') : inp.value, inp);
      if (msg) { setError(inp, msg); if (!first) first = inp; } else clearError(inp);
    });
    if (first) first.focus(); return !first;
  }
  function liveClear(form) { form.noValidate = true; $$('input[name="agree"]', form).forEach((c) => { if (!c.id) c.id = 'agree'; }); form.addEventListener('input', (e) => { if (e.target.getAttribute && e.target.getAttribute('aria-invalid')) clearError(e.target); }); form.addEventListener('change', (e) => { if (e.target.type === 'checkbox' && e.target.getAttribute('aria-invalid')) clearError(e.target); }); }
  const agreeRule = (v) => v ? '' : 'Підтвердьте згоду, щоб продовжити';

  /* ===== 16. ОФОРМЛЕННЯ ЗАМОВЛЕННЯ ===== */
  function initCheckout() {
    const form = $('.checkout form'); if (!form) return;
    const side = $('.checkout .summary'); const mini = $('.mini-list', side);
    const emailInp = $('#c-email'); if (emailInp) { emailInp.type = 'email'; emailInp.value = ''; clearError(emailInp); const old = $('#c-email-err'); if (old) old.remove(); emailInp.removeAttribute('aria-invalid'); }
    const items = cartItems();
    if (!items.length) { $('.checkout').innerHTML = '<div class="empty-wrap">' + stateHTML('bag', 'Кошик порожній', 'Щоб оформити замовлення, додайте до кошика хоча б одну платівку.', linkBtn('catalog.html', 'Перейти до каталогу')) + '</div>'; $('.checkout').style.gridTemplateColumns = '1fr'; const st = $('.stepper'); if (st) st.hidden = true; return; }
    mini.innerHTML = items.map((x) => '<li><img src="images/covers/' + x.p.slug + '.svg" alt="Обкладинка альбому «' + esc(x.p.title) + '»" width="600" height="600"><div><p class="mini-list__title">' + esc(x.p.title) + '</p><p class="text-muted">' + esc(x.p.artist) + ' · ' + x.qty + ' шт.</p></div><p>' + money(x.p.price * x.qty) + '</p></li>').join('');
    const kind = () => ($('input[name="delivery"]:checked', form) || {}).value || 'np';
    function recalc() {
      const sub = subtotal(); $('dl', side).innerHTML = summaryHTML(sub, kind());
      $$('.choice', form).forEach((c) => { const v = $('input', c).value; const pr = $('.choice__price', c); if (!pr || !(v in DELIVERY) || v === 'pickup') return; pr.textContent = sub >= FREE_FROM ? 'Безкоштовно' : money(DELIVERY[v]); });
    }
    recalc(); form.addEventListener('change', (e) => { if (e.target.name === 'delivery') recalc(); });
    /* підсвічування поточного кроку */
    const steps = $$('.stepper li'); const blocks = [$$('.form-block', form)[0], $$('.form-block', form)[1], $$('.form-block', form)[2], $('section', form)];
    form.addEventListener('focusin', (e) => { const i = blocks.findIndex((b) => b && b.contains(e.target)); if (i < 0) return; steps.forEach((s, k) => { s.classList.toggle('is-current', k === i); if (k === i) s.setAttribute('aria-current', 'step'); else s.removeAttribute('aria-current'); }); });
    liveClear(form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = validate(form, { 'c-name': rules.name, 'c-phone': rules.phone, 'c-email': rules.email, 'd-city': rules.required, 'd-branch': rules.required, agree: agreeRule });
      if (!ok) { toast('Перевірте виділені поля форми', { kind: 'error' }); return; }
      const orders = store.get('orders', []); const num = 10308 + orders.length; const sub = subtotal(); const total = sub + deliveryCost(sub, kind());
      const d = new Date(); const date = String(d.getDate()).padStart(2, '0') + '.' + String(d.getMonth() + 1).padStart(2, '0') + '.' + d.getFullYear();
      orders.unshift({ num, date, titles: cartItems().map((x) => x.p.title + (x.qty > 1 ? ' ×' + x.qty : '')).join(', '), total });
      store.set('orders', orders); setCart([]);
      const u = store.get('user', null); if (u) { u.phone = $('#c-phone').value; store.set('user', u); }
      location.href = 'states.html?order=' + num + '#success';
    });
  }

  /* ===== 17. АВТОРИЗАЦІЯ ТА ПРОФІЛЬ ===== */
  function initAuth() {
    const login = $('#l-email'), reg = $('#r-email'), forgot = $('#f-email');
    const inp = login || reg || forgot; if (!inp) return; const form = inp.closest('form'); liveClear(form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (login) {
        if (!validate(form, { 'l-email': rules.email, 'l-pass': rules.required })) return;
        const old = store.get('user', null); store.set('user', { name: (old && old.name) || login.value.split('@')[0], email: login.value.trim(), phone: (old && old.phone) || '', city: (old && old.city) || '' });
        toast('Вітаємо! Ви увійшли в акаунт'); setTimeout(() => { location.href = 'profile.html'; }, 600);
      } else if (reg) {
        const p1 = $('#r-pass'), p2 = $('#r-pass2');
        if (!validate(form, { 'r-name': rules.name, 'r-email': rules.email, 'r-pass': rules.pass, 'r-pass2': (v) => v !== p1.value ? 'Паролі не збігаються' : rules.required(v), agree: agreeRule })) return;
        store.set('user', { name: $('#r-name').value.trim(), email: reg.value.trim(), phone: '', city: '' });
        toast('Акаунт створено. Переходимо до профілю'); setTimeout(() => { location.href = 'profile.html'; }, 700);
      } else {
        if (!validate(form, { 'f-email': rules.email })) return;
        form.innerHTML = '<div class="state">' + '<div class="state__icon state__icon--success">' + ico('check') + '</div><h2>Перевірте пошту</h2><p>Якщо акаунт із адресою ' + esc(forgot.value.trim()) + ' існує, ми надіслали на неї посилання для нового пароля.</p><div class="state__actions">' + linkBtn('login.html', 'Повернутися до входу') + '</div></div>';
      }
    });
  }
  function initProfile() {
    if (page !== 'profile') return;
    const user = store.get('user', null);
    if (user) { $('#p-name').value = user.name || ''; $('#p-email').value = user.email || ''; if (user.phone) $('#p-phone').value = user.phone; if (user.city) $('#p-city').value = user.city; }
    const form = $('#data form'); liveClear(form);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate(form, { 'p-name': rules.name, 'p-email': rules.email, 'p-phone': rules.phone })) return;
      store.set('user', { name: $('#p-name').value.trim(), email: $('#p-email').value.trim(), phone: $('#p-phone').value.trim(), city: $('#p-city').value.trim() }); toast('Зміни збережено');
    });
    const tbody = $('#orders tbody'); store.get('orders', []).slice().reverse().forEach((o) => { tbody.insertAdjacentHTML('afterbegin', '<tr><th scope="row">№ ' + o.num + '</th><td>' + o.date + '</td><td>' + esc(o.titles) + '</td><td>' + money(o.total) + '</td><td><span class="status status--way">Оформлено</span></td></tr>'); });
    const saved = $('#saved'); const grid = $('ul.grid-products', saved); const items = getWish().map(byId).filter(Boolean).slice(0, 3);
    grid.outerHTML = items.length ? '<ul class="grid-products grid-products--3">' + items.map((p) => cardHTML(p)).join('') + '</ul>' : '<p class="text-muted">У обраному поки нічого немає.</p>';
    if (user) { const ul = $('.profile-nav ul'); const li = document.createElement('li'); li.innerHTML = '<a href="login.html" id="logout">Вийти</a>'; ul.appendChild(li); $('#logout').addEventListener('click', (e) => { e.preventDefault(); store.set('user', null); toast('Ви вийшли з акаунта', { kind: 'info' }); setTimeout(() => { location.href = 'index.html'; }, 600); }); }
  }

  /* ===== 18. СТАНОВІ ЕКРАНИ ===== */
  function initStates() {
    if (page !== 'states') return;
    const n = params.get('order'); if (n) { $$('.order-no').forEach((x) => { x.textContent = '№ ' + n; }); const s = $('#success'); if (s) s.scrollIntoView(); }
    const retry = $('#load-error .btn'); if (retry) retry.addEventListener('click', () => { retry.classList.add('is-loading'); setTimeout(() => { retry.classList.remove('is-loading'); toast('Дані оновлено'); }, 1200); });
    const notify = $('#notify'); if (notify) notify.closest('form').addEventListener('submit', (e) => { e.preventDefault(); if (!EMAIL.test(notify.value.trim())) { setError(notify, 'Вкажіть коректну адресу пошти'); notify.focus(); return; } clearError(notify); toast('Ми повідомимо вас, щойно платівка повернеться'); notify.value = ''; });
  }

  /* ===== 19. ІНІЦІАЛІЗАЦІЯ ===== */
  function init() {
    enhanceHeader(); enhanceCards(document);
    initCart(); renderWishlist(); initCatalog(); initSearch(); initProduct(); initArtist(); initCheckout(); initAuth(); initProfile(); initStates();
    enhanceCards(document);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
