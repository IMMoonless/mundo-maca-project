/* Mundo Maca 11.11 — lógica de tienda
   CONFIGURACIÓN: reemplaza WHATSAPP_NUMBER por el número del negocio
   en formato internacional, solo dígitos. Ejemplo Colombia: 573001234567.
   Este prototipo guarda datos en localStorage: no es una base de datos compartida.
*/
const WHATSAPP_NUMBER = ""; // <-- configurar antes de probar pedidos reales
const STORAGE_PRODUCTS = "mundoMaca.products.v1";
const STORAGE_CART = "mundoMaca.cart.v1";
const STORAGE_CATEGORIES = "mundoMaca.categories.v1";

const seedProducts = [
  {id:"p1",name:"Botella térmica",price:28000,category:"Hogar",description:"Ideal para llevar tus bebidas favoritas.",emoji:"🥤",image:"",stock:true,featured:true},
  {id:"p2",name:"Audífonos Bluetooth",price:35000,category:"Tecnología",description:"Disfruta tu música donde quieras.",emoji:"🎧",image:"",stock:true,featured:true},
  {id:"p3",name:"Organizador multiusos",price:18000,category:"Hogar",description:"Dale orden a tus espacios fácilmente.",emoji:"🧺",image:"",stock:true,featured:false},
  {id:"p4",name:"Kit de cuidado personal",price:22000,category:"Belleza",description:"Un detalle práctico para tu rutina.",emoji:"🧴",image:"",stock:true,featured:true},
  {id:"p5",name:"Lámpara LED",price:32000,category:"Tecnología",description:"Iluminación práctica para tu escritorio.",emoji:"💡",image:"",stock:true,featured:false},
  {id:"p6",name:"Set de papelería",price:15000,category:"Papelería",description:"Color y creatividad para tus ideas.",emoji:"✏️",image:"",stock:true,featured:false},
  {id:"p7",name:"Accesorio para cabello",price:9000,category:"Accesorios",description:"Un toque especial para tu estilo.",emoji:"🎀",image:"",stock:true,featured:false},
  {id:"p8",name:"Mini parlante",price:42000,category:"Tecnología",description:"Sonido compacto para acompañarte.",emoji:"🔊",image:"",stock:false,featured:false}
];
const defaultCategories = ["Hogar","Tecnología","Belleza","Papelería","Accesorios"];
const money = value => new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(Number(value)||0);
const read = (key,fallback) => { try { const v=JSON.parse(localStorage.getItem(key)); return v ?? fallback; } catch { return fallback; } };
let products = read(STORAGE_PRODUCTS,null);
if (!Array.isArray(products)) { products=seedProducts; localStorage.setItem(STORAGE_PRODUCTS,JSON.stringify(products)); }
let categories = read(STORAGE_CATEGORIES,defaultCategories);
let cart = read(STORAGE_CART,[]);
let activeCategory = "Todos";
let searchTerm = "";

const $ = id => document.getElementById(id);
const escapeHTML = value => String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function persist(){localStorage.setItem(STORAGE_PRODUCTS,JSON.stringify(products));localStorage.setItem(STORAGE_CART,JSON.stringify(cart));localStorage.setItem(STORAGE_CATEGORIES,JSON.stringify(categories));}
function toast(message){const el=$("toast");if(!el)return;el.textContent=message;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2300);}
function imageMarkup(product,extra=""){return product.image?`<img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy" onerror="this.remove()">`:`<span class="product-placeholder ${extra}" aria-hidden="true">${escapeHTML(product.emoji||"🎁")}</span>`;}
function renderCategories(){
  const holder=$("categoryFilters");if(!holder)return;
  const all=["Todos",...categories];
  holder.innerHTML=all.map(c=>`<button class="filter-chip ${activeCategory===c?"active":""}" data-category="${escapeHTML(c)}">${escapeHTML(c)}</button>`).join("");
  holder.querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{activeCategory=btn.dataset.category;renderCategories();renderProducts();}));
}
function renderProducts(){
  const grid=$("productGrid");if(!grid)return;
  const filtered=products.filter(p=>p.stock && (activeCategory==="Todos"||p.category===activeCategory) && (`${p.name} ${p.description} ${p.category}`).toLowerCase().includes(searchTerm));
  $("catalogCount").textContent=`${filtered.length} ${filtered.length===1?"producto disponible":"productos disponibles"}`;
  $("emptyState").classList.toggle("hidden",filtered.length!==0);
  grid.innerHTML=filtered.map(p=>`<article class="product-card">
    <div class="product-visual">${imageMarkup(p)}${p.featured?'<span class="product-badge">DESTACADO</span>':""}</div>
    <div class="product-info"><span class="product-category">${escapeHTML(p.category)}</span><h3>${escapeHTML(p.name)}</h3>
    <p class="product-description">${escapeHTML(p.description||"Un producto especial para ti.")}</p>
    <div class="product-bottom"><strong class="product-price">${money(p.price)}</strong><button class="add-button" data-add="${escapeHTML(p.id)}" aria-label="Agregar ${escapeHTML(p.name)} al pedido">+</button></div></div></article>`).join("");
  grid.querySelectorAll("[data-add]").forEach(btn=>btn.addEventListener("click",()=>addToCart(btn.dataset.add)));
}
function addToCart(id){const p=products.find(x=>x.id===id);if(!p||!p.stock)return;const line=cart.find(x=>x.id===id);if(line)line.qty++;else cart.push({id,qty:1});persist();renderCart();toast(`${p.name} agregado a tu pedido`);}
function updateQty(id,delta){const line=cart.find(x=>x.id===id);if(!line)return;line.qty+=delta;if(line.qty<=0)cart=cart.filter(x=>x.id!==id);persist();renderCart();}
function cartDetails(){return cart.map(line=>({...line,product:products.find(p=>p.id===line.id)})).filter(x=>x.product);}
function cartTotal(){return cartDetails().reduce((sum,x)=>sum+x.product.price*x.qty,0);}
function renderCart(){
  if(!$("cartItems"))return;
  const lines=cartDetails(),count=lines.reduce((n,x)=>n+x.qty,0);
  $("cartCount").textContent=count;$("drawerCount").textContent=`(${count})`;
  $("cartItems").innerHTML=lines.map(x=>`<div class="cart-row"><div class="cart-thumb">${imageMarkup(x.product)}</div><div><h3>${escapeHTML(x.product.name)}</h3><small>${money(x.product.price)} c/u</small><div class="quantity-control"><button data-qty="${escapeHTML(x.id)}" data-delta="-1" aria-label="Restar">−</button><b>${x.qty}</b><button data-qty="${escapeHTML(x.id)}" data-delta="1" aria-label="Sumar">+</button></div></div><strong class="cart-line-total">${money(x.product.price*x.qty)}</strong></div>`).join("");
  $("cartItems").querySelectorAll("[data-qty]").forEach(b=>b.addEventListener("click",()=>updateQty(b.dataset.qty,Number(b.dataset.delta))));
  $("cartEmpty").classList.toggle("hidden",lines.length>0);$("cartFooter").classList.toggle("hidden",lines.length===0);$("cartTotal").textContent=money(cartTotal());
}
function openCart(){ $("cartDrawer").classList.add("open");$("cartDrawer").setAttribute("aria-hidden","false");$("drawerBackdrop").classList.remove("hidden");document.body.style.overflow="hidden";}
function closeCart(){ $("cartDrawer").classList.remove("open");$("cartDrawer").setAttribute("aria-hidden","true");$("drawerBackdrop").classList.add("hidden");document.body.style.overflow="";}
function whatsappUrl(message){
  if(!WHATSAPP_NUMBER || !/^\d{10,15}$/.test(WHATSAPP_NUMBER)){alert("La tienda aún no ha configurado su número de WhatsApp. Contacta al administrador del sitio.");return null;}
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
function sendCart(){
  const lines=cartDetails();if(!lines.length)return;
  const rows=lines.map(x=>`• ${x.product.name} x ${x.qty} — ${money(x.product.price*x.qty)}`).join("\n");
  const message=`¡Hola, Mundo Maca 11.11! Quiero realizar este pedido:\n\n${rows}\n\nTotal estimado: ${money(cartTotal())}\n\nQuisiera confirmar disponibilidad, envío y medios de pago.`;
  const url=whatsappUrl(message);if(url)window.open(url,"_blank","noopener,noreferrer");
}
function bindStore(){
  $("searchInput").addEventListener("input",e=>{searchTerm=e.target.value.trim().toLowerCase();renderProducts();});
  $("openCart").addEventListener("click",openCart);$("closeCart").addEventListener("click",closeCart);$("drawerBackdrop").addEventListener("click",closeCart);
  $("continueShopping").addEventListener("click",()=>{closeCart();$("catalogo").scrollIntoView({behavior:"smooth"});});
  $("checkoutButton").addEventListener("click",sendCart);
  $("requestForm").addEventListener("submit",e=>{e.preventDefault();const name=$("requestedProduct").value.trim();const details=$("requestDetails").value.trim();if(!name)return;const message=`¡Hola, Mundo Maca 11.11! Quisiera consultar y encargar un producto que no vi en el catálogo:\n\nProducto: ${name}\nDetalles: ${details||"Sin detalles adicionales"}\n\n¿Me pueden ayudar a conseguirlo?`;const url=whatsappUrl(message);if(url)window.open(url,"_blank","noopener,noreferrer");});
  $("menuToggle").addEventListener("click",()=>$("mainNav")?.classList.toggle("show"));
  $("year").textContent=new Date().getFullYear();
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeCart();});
}
document.addEventListener("DOMContentLoaded",()=>{const nav=document.querySelector(".main-nav");if(nav)nav.id="mainNav";bindStore();renderCategories();renderProducts();renderCart();});
