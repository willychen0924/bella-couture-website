(() => {
  'use strict';
  const products = [
    ['sakura','天然粉紅珠母貝《櫻花》項鏈',6980,'項鍊'],['cross','天然淡水珍珠十字架項鍊',3980,'項鍊'],['topaz','天然拓帕石 925 純銀耳環',5980,'耳環'],['pearl','6mm 天然淡水珍珠耳環',6980,'耳環'],['amethyst-earrings','天然紫水晶 925 純銀耳環',5980,'耳環'],['amethyst-necklace','天然紫水晶 925 純銀項鍊',9800,'項鍊'],['aquamarine','天然海水藍寶 925 純銀項鍊',9800,'項鍊'],['akoya','14K Akoya 海水珍珠耳環 7mm',9800,'耳環'],['tanzanite','天然丹泉石 925 純銀手鍊',9800,'手鍊']
  ].map(([id,name,price,category])=>({id,name,price,category,image:`assets/assets-v2-${id}.png`}));
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const money = n => 'NT$ '+n.toLocaleString('en-US');
  const get = (key, fallback) => {try{return JSON.parse(localStorage.getItem(key)) ?? fallback}catch{return fallback}};
  const save = (key,value) => {try{localStorage.setItem(key,JSON.stringify(value))}catch{}};
  let favorites = get('bella-v2-preview-favorites',[]), cart = get('bella-v2-preview-cart',[]), quantity=1, filter='all', timer;
  if(!Array.isArray(favorites)) favorites=[];
  if(!Array.isArray(cart)) cart=[];
  cart=cart.filter(x=>products.some(p=>p.id===x.id)&&Number.isInteger(x.quantity)&&x.quantity>0);
  const dialog=$('#ui-dialog');
  function toast(text){$('.toast').textContent=text;$('.toast').classList.add('visible');clearTimeout(timer);timer=setTimeout(()=>$('.toast').classList.remove('visible'),2600)}
  function open(title,html){$('#dialog-title').textContent=title;$('#dialog-body').innerHTML=html;if(!dialog.open)dialog.showModal()}
  function update(){
    $$('.cart-count').forEach(e=>e.textContent=cart.reduce((sum,p)=>sum+p.quantity,0)||'');
    $$('[data-action="favorite"]').forEach(e=>{const active=favorites.includes(e.dataset.id);e.setAttribute('aria-pressed',String(active));e.textContent=active?'♥':'♡'});
    save('bella-v2-preview-cart',cart);save('bella-v2-preview-favorites',favorites);
  }
  function add(id,count=1){const p=products.find(p=>p.id===id);if(!p)return;const row=cart.find(p=>p.id===id);if(row)row.quantity=Math.min(99,row.quantity+count);else cart.push({id,quantity:count});update();toast('已加入預覽購物車')}
  function showCart(){
    let total=0;
    const rows=cart.map(row=>{const p=products.find(p=>p.id===row.id);total+=p.price*row.quantity;return `<div class="cart-row"><img src="${p.image}" alt="${p.name}"><div>${p.name}<p>${money(p.price)} × ${row.quantity}</p></div><button type="button" data-action="remove" data-id="${p.id}">移除</button></div>`}).join('');
    open('Your selection.',rows?`${rows}<div class="cart-total"><span>商品小計</span><span>${money(total)}</span></div><p>這是網站設計預覽，商品不會送出訂單或進行付款。</p><button class="button outline" data-action="continue">繼續挑選</button>`:'<p>購物車還是空的。從一件喜歡的珠寶開始。</p><a class="button" href="melody.html">探索 Melody　↗</a>');
  }
  function product(id){const p=products.find(p=>p.id===id);if(!p)return;open(p.name,`<img class="dialog-product" src="${p.image}" alt="${p.name}"><p>MELODY / ${p.category}</p><p>${money(p.price)}</p><p>材質、尺寸與供貨資訊請聯繫 Bella 團隊確認。</p><button class="button" data-action="quick-add" data-id="${p.id}">加入預覽購物車　↗</button> ${id==='sakura'?'<a class="textlink" href="product.html">查看完整商品頁　↗</a>':''}`)}
  function contact(){open('與 Bella 相遇。','<p>台北新光三越天母一館 1F<br>台北市天母東路 68 號</p><p>電話：<a href="tel:0958331689">0958-331-689</a></p><p>試戴、作品尺寸、送禮搭配與保養需求，歡迎與 Bella 團隊聯繫。</p><a class="button outline" href="tel:0958331689">電話聯繫　↗</a>')}
  function search(){open('Find your melody.','<label for="search-input">搜尋作品名稱或類別</label><input class="search-input" id="search-input" type="search" placeholder="例如：櫻花、珍珠、耳環" autocomplete="off"><div class="search-results" aria-live="polite"></div>');const input=$('#search-input');const render=()=>{const query=input.value.trim().toLowerCase();const found=products.filter(p=>(p.name+p.category).toLowerCase().includes(query));$('.search-results').innerHTML=found.length?found.map(p=>`<button type="button" class="search-result" data-action="product" data-id="${p.id}"><img src="${p.image}" alt=""><span>${p.name}<br>${money(p.price)}</span></button>`).join(''):'<p>目前沒有符合的作品，試試其他關鍵字。</p>'};input.addEventListener('input',render);render();input.focus()}
  function catalog(){
    if(!$('.catalog'))return;
    const budget=$('#budget-filter').value,sort=$('#sort').value,cards=$$('.catalog .card');
    cards.sort((a,b)=>sort==='recommended'?products.findIndex(p=>p.id===a.dataset.id)-products.findIndex(p=>p.id===b.dataset.id):sort==='low'?Number(a.dataset.price)-Number(b.dataset.price):Number(b.dataset.price)-Number(a.dataset.price));
    let visible=0;cards.forEach(card=>{card.hidden=!(filter==='all'||card.dataset.category===filter)||(budget!=='all'&&Number(card.dataset.price)>Number(budget));if(!card.hidden)visible++;$('.catalog').append(card)});
    $('.filters .count').textContent=visible+' 件作品';$$('[data-filter]').forEach(b=>{b.classList.toggle('active',b.dataset.filter===filter);b.setAttribute('aria-pressed',String(b.dataset.filter===filter))});
    if(!$('.empty-results')){$('.catalog').insertAdjacentHTML('afterend','<p class="empty-results" hidden>目前沒有符合條件的作品，請調整分類或預算。</p>')}$('.empty-results').hidden=visible!==0;
  }
  $('.mobile-toggle').addEventListener('click',e=>{const open=$('.mobile-nav').classList.toggle('is-open');e.currentTarget.setAttribute('aria-expanded',String(open));e.currentTarget.textContent=open?'×':'☰'});
  $$('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>{$('.mobile-nav').classList.remove('is-open');$('.mobile-toggle').setAttribute('aria-expanded','false');$('.mobile-toggle').textContent='☰'}));
  $('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const b=dialog.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)dialog.close()}});
  document.addEventListener('click',e=>{
    const f=e.target.closest('[data-filter]');if(f){filter=f.dataset.filter;catalog();return}
    const button=e.target.closest('[data-action]');if(!button)return;e.preventDefault();const a=button.dataset.action,id=button.dataset.id;
    if(a==='search')search();
    if(a==='cart')showCart();
    if(a==='contact')contact();
    if(a==='product')product(id);
    if(a==='collection-info')open(button.querySelector('h3')?.textContent||'珠寶系列','<p>本次預覽提供 Melody 小旋律系列。其他系列作品歡迎與 Bella 團隊洽詢。</p><a class="button" href="melody.html">探索 Melody　↗</a>');
    if(a==='favorite'){favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];update();toast(favorites.includes(id)?'已加入收藏':'已移除收藏')}
    if(a==='minus'||a==='plus'){quantity=Math.max(1,Math.min(99,quantity+(a==='plus'?1:-1)));$('#quantity').value=quantity;$('#quantity').textContent=quantity}
    if(a==='add')add('sakura',quantity);
    if(a==='quick-add')add(id);
    if(a==='remove'){cart=cart.filter(p=>p.id!==id);update();showCart()}
    if(a==='continue')dialog.close();
    if(a==='thumb'){const index=Number(button.dataset.index),im=$('.gallery .main img');im.src=button.querySelector('img').src;im.classList.toggle('is-detail',index===1);$$('.thumb').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));$('.gallery-foot small').textContent=`0${index+1} / 03　產品・細節・情境`}
    if(a==='zoom'){open('Sakura — 細節',`<img style="width:100%" src="${$('.gallery .main img').src}" alt="櫻花項鏈放大圖">`)}
  });
  $('#budget-filter')?.addEventListener('change',catalog);$('#sort')?.addEventListener('change',catalog);
  update();catalog();
})();
