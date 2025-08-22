
async function loadJSON(url){const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error('Failed '+url);return r.json();}
function formatINR(a){return new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(a);}
let products = []; let cart = {};
function saveCart(){localStorage.setItem('kh_cart', JSON.stringify(cart)); renderCartCount();}
function loadCart(){cart = JSON.parse(localStorage.getItem('kh_cart')||'{}'); renderCartCount();}
function renderCartCount(){const c=Object.values(cart).reduce((s,i)=>s+i.qty,0); document.getElementById('cartCount').textContent = c;}
function renderProducts(){const grid=document.getElementById('productsGrid');grid.innerHTML=''; products.forEach(p=>{const card=document.createElement('div');card.className='card';card.innerHTML=`<img src="${p.images[0]||'/assets/logo.svg'}"><div class="card-body"><div class="title">${p.title}</div><div class="price">${formatINR(p.price)}</div><div style="margin-top:8px"><button onclick="addToCart('${p.id}')" style="padding:8px 12px;border-radius:8px;border:1px solid var(--accent);background:transparent;color:var(--accent)">Add</button></div></div>`;grid.appendChild(card);});}
function addToCart(id){const p=products.find(x=>x.id===id); if(!p) return; if(cart[id]) cart[id].qty++; else cart[id]={...p,qty:1}; saveCart(); alert('Added to cart');}
function showCart(){const modal=document.getElementById('cartModal'); const items=document.getElementById('cartItems'); items.innerHTML=''; let total=0; Object.values(cart).forEach(it=>{total += it.price*it.qty; const div=document.createElement('div'); div.style.marginBottom='8px'; div.innerHTML=`<div>${it.title} x ${it.qty} — ${formatINR(it.price*it.qty)} <button onclick="removeOne('${it.id}')" style="margin-left:8px">-</button></div>`; items.appendChild(div);}); document.getElementById('cartTotal').textContent = formatINR(total); modal.style.display='block';}
function hideCart(){document.getElementById('cartModal').style.display='none';}
function removeOne(id){ if(!cart[id]) return; cart[id].qty--; if(cart[id].qty<=0) delete cart[id]; saveCart(); showCart();}
document.getElementById('cartBtn').addEventListener('click',showCart);
document.getElementById('closeCart').addEventListener('click',hideCart);
document.getElementById('checkoutBtn').addEventListener('click', async ()=>{
  // send items to serverless to create Stripe Checkout session
  const items = Object.values(cart).map(i=>({id:i.id,price:i.price,quantity:i.qty,title:i.title}));
  if(items.length===0){ alert('Cart empty'); return; }
  const res = await fetch('/.netlify/functions/create-checkout-session', {
    method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({items})
  });
  const data = await res.json();
  if(data.url) window.location = data.url; else alert('Checkout failed');
});
// init
(async()=>{
  try{ products = await loadJSON('/data/products.json'); renderProducts(); loadCart(); }catch(e){ console.error(e); }
})();