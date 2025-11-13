// Smart Mall Navigator - Frontend only simulation

const ITEMS = [
  { id: 'Apples', name: 'Apples', brand: 'Local', rate: 120, unit: 'kg', discount: 0, floor: 'ground', desc:'Fresh red apples'},
  { id: 'Oranges', name: 'Oranges', brand: 'CitrusCo', rate: 90, unit: 'kg', discount: 5, floor: 'ground', desc:'Juicy oranges'},
  { id: 'Jeans', name: "Levi's Jeans", brand: "Levi's", rate: 2499, unit: 'piece', discount: 10, floor: 'first', desc:'Slim fit jeans'},
  { id: 'Shoes', name: 'Nike Shoes', brand: 'Nike', rate: 4299, unit: 'pair', discount: 15, floor: 'first', desc:'Running shoes'},
  { id: 'TV', name: 'Samsung Smart TV', brand: 'Samsung', rate: 45999, unit: 'piece', discount: 8, floor: 'second', desc:'4K Smart TV'},
  { id: 'Fridge', name: 'LG Refrigerator', brand: 'LG', rate: 32499, unit: 'piece', discount: 12, floor: 'second', desc:'Double door fridge'}
];

let state = {
  lang: 'en',
  floor: 'ground',
  items: [...ITEMS],
  cart: [],
  multiSelect: false,
  shopkeeperMode: false,
  shopperPos: {x:8, y:72},
  destination: null
};

const itemsContainer = document.getElementById('itemsContainer');
const cartItems = document.getElementById('cartItems');
const totalLabel = document.getElementById('totalLabel');
const floorSelect = document.getElementById('floorSelect');
const shopper = document.getElementById('shopper');
const pathLine = document.getElementById('pathLine');
const pathSvg = document.getElementById('pathSvg');
const infoModal = document.getElementById('infoModal');
const modalText = document.getElementById('modalText');
const langSelect = document.getElementById('langSelect');
const voiceToggle = document.getElementById('voiceToggle');
const shopkeeperModeToggle = document.getElementById('shopkeeperMode');
const shopkeeperPanel = document.getElementById('shopkeeperPanel');
const liveLocation = document.getElementById('liveLocation');
const destinationInfo = document.getElementById('destinationInfo');

const T = {
  en: {
    items: 'Items', cart: 'Cart', total: 'Total', pay: 'Pay', selectFloor: 'Select Floor', destinationReached: 'You have reached the destination!',
    added: 'Added to cart', pleaseSelect: 'Please select an item and floor!', facilities: 'Facilities', washroom: 'Washroom', office: 'Mall Office'
  },
  kn: {
    items: 'ವಸ್ತುಗಳು', cart: 'ಕಾರ್ಟ್', total: 'ಒಟ್ಟು', pay: 'ಪಾವತಿಸಿ', selectFloor: 'ಮಾಳಿಗೆಯ ಮೆಟ್ಟಲು ಆಯ್ಕೆಮಾಡಿ', destinationReached: 'ನೀವು ಗುರಿಯನ್ನು ತಲುಪಿದ್ದೀರಿ!',
    added: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿದೆ', pleaseSelect: 'ದಯವಿಟ್ಟು ವಸ್ತು ಮತ್ತು ಮಹಡಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ!', facilities: 'ಸೌಕರ್ಯಗಳು', washroom: 'ಶೌಚಾಲಯ', office: 'ಮಾಲ್ ಕಚೇರಿ'
  }
};

function speak(msg){
  if (voiceToggle.checked && 'speechSynthesis' in window){
    const u = new SpeechSynthesisUtterance(msg);
    u.lang = state.lang === 'kn' ? 'kn-IN' : 'en-IN';
    speechSynthesis.speak(u);
  }
}

function init(){
  renderItems();
  renderCart();
  updateFloorView();
  bindEvents();
  startLiveSim();
  localize();
}

function bindEvents(){
  floorSelect.addEventListener('change', e=>{ state.floor = e.target.value; updateFloorView(); });
  document.getElementById('multiSelectBtn').addEventListener('click', ()=>{ state.multiSelect = !state.multiSelect; document.getElementById('multiSelectBtn').classList.toggle('active', state.multiSelect); });
  document.getElementById('showFacilities').addEventListener('click', showFacilities);
  document.getElementById('modalClose').addEventListener('click', ()=>infoModal.classList.remove('is-open'));
  document.getElementById('payBtn').addEventListener('click', simulatePayment);
  document.getElementById('clearSearch').addEventListener('click', ()=>{document.getElementById('search').value=''; renderItems();});
  document.getElementById('search').addEventListener('input', renderItems);
  langSelect.addEventListener('change', (e)=>{ state.lang = e.target.value; localize(); });
  shopkeeperModeToggle.addEventListener('change', (e)=>{ state.shopkeeperMode = e.target.checked; shopkeeperPanel.classList.toggle('hidden', !state.shopkeeperMode); });
  document.getElementById('addItemBtn').addEventListener('click', addItemByShopkeeper);

  document.querySelectorAll('.node').forEach(n=>{
    n.addEventListener('click', ()=>{ onNodeClick(n.dataset.id); });
  });
}

function localize(){
  const L = T[state.lang];
  document.getElementById('itemsHeading').innerText = L.items;
  document.getElementById('cartHeading').innerText = L.cart;
  totalLabel.innerText = `${L.total}: ₹${calcTotal()}`;
  document.getElementById('floorTitle').innerText = L.selectFloor;
}

function renderItems(){
  const q = document.getElementById('search').value.toLowerCase();
  itemsContainer.innerHTML='';
  state.items.filter(it=>it.floor===state.floor && (it.name.toLowerCase().includes(q) || it.brand.toLowerCase().includes(q))).forEach(it=>{
    const card = document.createElement('div'); card.className='item-card';
    const left = document.createElement('div'); left.innerHTML=`<strong>${it.name}</strong><div class="item-meta">${it.brand} • ${it.desc}</div>`;
    const right = document.createElement('div');
    const price = Math.round(it.rate*(1 - (it.discount||0)/100));
    right.innerHTML = `<div style="text-align:right"><div>₹${price}${it.unit?('/'+it.unit):''}</div><div class="item-meta">${it.discount?it.discount+'% off':''}</div><div style="margin-top:6px"><button data-id="${it.id}" class="addBtn">+ Add</button></div></div>`;
    card.appendChild(left); card.appendChild(right);
    itemsContainer.appendChild(card);
  });
  document.querySelectorAll('.addBtn').forEach(b=>b.addEventListener('click', (e)=>{ addToCart(e.target.dataset.id); }));
}

function addToCart(id){
  const it = state.items.find(x=>x.id===id);
  if (!it) return;
  const existing = state.cart.find(c=>c.id===id);
  if (existing) existing.qty++;
  else state.cart.push({ ...it, qty:1 });
  renderCart();
  speak(`${it.name} ${T[state.lang].added}`);
}

function renderCart(){
  cartItems.innerHTML='';
  state.cart.forEach(c=>{
    const row = document.createElement('div'); row.className='item-card';
    row.innerHTML = `<div>${c.name} <div class="item-meta">${c.brand} • ₹${c.rate} • ${c.discount}% off</div></div>
      <div style="text-align:right">Q:${c.qty} <div style="margin-top:6px"><button data-remove="${c.id}" class="rm">Remove</button></div></div>`;
    cartItems.appendChild(row);
  });
  document.querySelectorAll('.rm').forEach(b=>b.addEventListener('click', e=>{ const id=e.target.dataset.remove; state.cart=state.cart.filter(c=>c.id!==id); renderCart(); }));
  totalLabel.innerText = `${T[state.lang].total}: ₹${calcTotal()}`;
}

function calcTotal(){
  return state.cart.reduce((s,c)=>{
    const price = Math.round(c.rate*(1-(c.discount||0)/100));
    return s + price*c.qty;
  },0);
}

function onNodeClick(id){
  const target = state.items.find(i=>i.id===id);
  if (!target) return;
  if (state.multiSelect){ addToCart(id); return; }
  startNavigationTo(id);
}

function startNavigationTo(id){
  const nodeEl = document.querySelector(`.node[data-id="${id}"]`);
  if (!nodeEl) return alert(T[state.lang].pleaseSelect);
  const floor = state.items.find(i=>i.id===id).floor;
  state.floor = floor; floorSelect.value=floor; updateFloorView();
  const shopperRect = {x: state.shopperPos.x, y: state.shopperPos.y};
  const styleLeft = parseFloat(nodeEl.style.left);
  const styleTop = parseFloat(nodeEl.style.top);
  animatePath(shopperRect, {x: styleLeft, y: styleTop}, ()=>{
    state.destination = id; destinationInfo.innerText = `Destination: ${id}`;
    speak(`${id} ${T[state.lang].destinationReached}`);
    showModal(T[state.lang].destinationReached, `${id} • ${state.items.find(i=>i.id===id).brand} • ₹${state.items.find(i=>i.id===id).rate}`);
  });
}

function animatePath(from, to, cb){
  const w = pathSvg.clientWidth; const h = pathSvg.clientHeight;
  const p1 = [(from.x/100)*w, (from.y/100)*h];
  const p2 = [(to.x/100)*w, (to.y/100)*h];
  pathLine.setAttribute('points', `${p1[0]},${p1[1]} ${p2[0]},${p2[1]}`);
  shopper.style.left = to.x + '%'; shopper.style.top = to.y + '%';
  state.shopperPos = {x:to.x,y:to.y};
  setTimeout(()=>{ if (cb) cb(); }, 1800);
}

function showModal(title, text){
  document.getElementById('modalTitle').innerText = title;
  modalText.innerText = text || '';
  infoModal.classList.add('is-open');
}

function updateFloorView(){
  document.querySelectorAll('.floor').forEach(f=>f.classList.add('hidden'));
  document.querySelector(`.floor-${state.floor}`).classList.remove('hidden');
  renderItems();
}

function showFacilities(){
  const L = T[state.lang];
  const f = document.querySelector(`.floor-${state.floor} .facility`);
  if (!f) return showModal(L.facilities, '—');
  showModal(L.facilities, `${f.dataset.type}: ${f.innerText}`);
}

function simulatePayment(){
  if (state.cart.length===0) return alert('Cart empty');
  const total = calcTotal();
  const ok = confirm(`Pay ₹${total}? (simulated)`);
  if (!ok) return;
  state.cart = [];
  renderCart();
  showModal('Payment', 'Payment successful — thank you!');
}

function addItemByShopkeeper(){
  const name = document.getElementById('newName').value.trim();
  const brand = document.getElementById('newBrand').value.trim();
  const rate = parseFloat(document.getElementById('newRate').value);
  const discount = parseFloat(document.getElementById('newDiscount').value)||0;
  const floor = document.getElementById('newFloor').value;
  if (!name || !brand || !rate) return alert('Please fill name, brand and rate');
  const id = name.replace(/\s+/g,'');
  const newItem = { id, name, brand, rate, discount, floor, unit:'piece', desc:'' };
  state.items.push(newItem);
  const floorEl = document.querySelector(`.floor-${floor}`);
  const nx = Math.floor(10 + Math.random()*80);
  const ny = Math.floor(10 + Math.random()*80);
  const node = document.createElement('div'); node.className='node'; node.dataset.id = id; node.style.left = nx+'%'; node.style.top = ny+'%'; node.innerHTML = `${name}<br><small>₹${rate}</small>`;
  node.addEventListener('click', ()=>onNodeClick(id));
  floorEl.appendChild(node);
  renderItems();
}

function startLiveSim(){
  setInterval(()=>{
    const dx = (Math.random()-0.5)*4; const dy = (Math.random()-0.5)*4;
    state.shopperPos.x = Math.max(2, Math.min(98, state.shopperPos.x + dx));
    state.shopperPos.y = Math.max(2, Math.min(98, state.shopperPos.y + dy));
    shopper.style.left = state.shopperPos.x + '%'; shopper.style.top = state.shopperPos.y + '%';
    liveLocation.innerText = `Live: ${state.floor} (x:${Math.round(state.shopperPos.x)},y:${Math.round(state.shopperPos.y)})`;
  }, 2500);
}

localize = function(){ const L = T[state.lang]; document.getElementById('itemsHeading').innerText = L.items; document.getElementById('cartHeading').innerText = L.cart; totalLabel.innerText = `${L.total}: ₹${calcTotal()}`; document.getElementById('floorTitle').innerText = L.selectFloor; }

document.querySelector('footer').addEventListener('dblclick', ()=>{
  document.querySelector('.container').style.transform = 'translateY(50px) scale(.95)';
  document.querySelector('.container').style.transition = 'transform .6s ease';
  setTimeout(()=>{ alert('Exiting mall (simulated)'); }, 700);
});

init();
