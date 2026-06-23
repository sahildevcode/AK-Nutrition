// ==========================================
// 1. DATA CENTER CATALOG STRUCT
// ==========================================
const products = [
    { id: 1, name: "Iso-Whey Protein", price: 4500, tag: "Protein", img: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=400&auto=format&fit=crop" },
    { id: 2, name: "Pre-Workout Nitro", price: 2500, tag: "Energy", img: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=400&auto=format&fit=crop" },
    { id: 3, name: "Micronized Creatine", price: 1500, tag: "Power", img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop" },
    { id: 4, name: "BCAA Recovery", price: 2200, tag: "Recovery", img: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=400&auto=format&fit=crop" },
    { id: 5, name: "Mass Gainer Pro", price: 3800, tag: "Bulk", img: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?q=80&w=400&auto=format&fit=crop" },
    { id: 6, name: "Anabolic Multi-Vit", price: 1200, tag: "Health", img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400&auto=format&fit=crop" },
    { id: 7, name: "High-Protein Peanut Butter", price: 499, tag: "Pure Nut", img: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?q=80&w=400&auto=format&fit=crop" }
];

const bestSellerIds = [3, 1, 7, 5];
let cart = [];

// DOM Bindings
const grid = document.getElementById('product-grid');
const bestsellerGrid = document.getElementById('bestseller-grid');
const searchInput = document.getElementById('search-input');
const priceRange = document.getElementById('price-range');
const priceVal = document.getElementById('price-val');
const cartBtn = document.getElementById('cart-btn');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const cartItemsDiv = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');

// Checkout DOM Connectors
const checkoutBtn = document.getElementById('checkout-btn');
const buyNowBtn = document.getElementById('buy-now-btn');
const backToCartBtn = document.getElementById('back-to-cart-btn');
const cartMainScreen = document.getElementById('cart-main-screen');
const cartPaymentScreen = document.getElementById('cart-payment-screen');
const cartTitleText = document.getElementById('cart-title-text');
const paymentTotal = document.getElementById('payment-total');

// Mobile UI Nodes Links
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileSidebar = document.getElementById('mobile-sidebar');
const closeMobileMenu = document.getElementById('close-mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const cartBtnMobile = document.getElementById('cart-btn-mobile');
const cartCountMobile = document.getElementById('cart-count-mobile');
const policyMobileBtn = document.getElementById('policy-mobile-btn');

// ==========================================
// 2. RUNTIME CORE LAYERING HOOKS
// ==========================================
function displayProducts(filteredProds) {
    grid.innerHTML = "";
    if (filteredProds.length === 0) {
        grid.innerHTML = `<p class="text-zinc-600 text-center col-span-full py-8 text-xs uppercase tracking-wider">No catalog items match.</p>`;
        return;
    }
    filteredProds.forEach(prod => {
        grid.innerHTML += `
            <div class="glow-effect rounded-lg overflow-hidden flex flex-col justify-between product-card opacity-0">
                <div class="prod-img-container p-8 flex justify-center items-center h-64 relative">
                    <span class="absolute top-3 left-3 bg-red-600 text-[9px] font-black px-2 py-0.5 rounded tracking-widest text-white">${prod.tag}</span>
                    <img src="${prod.img}" alt="${prod.name}" class="h-full object-contain">
                </div>
                <div class="p-6 bg-black">
                    <h3 class="text-md font-bold mb-2 uppercase tracking-wide text-zinc-200">${prod.name}</h3>
                    <div class="flex justify-between items-center mt-4">
                        <span class="text-lg font-black text-red-500">₹${prod.price}</span>
                        <button onclick="addToCart(${prod.id})" class="bg-red-600 hover:bg-white text-white hover:text-black font-bold text-[11px] uppercase px-4 py-2.5 rounded transition-all duration-300 flex items-center gap-2">
                            <i class="fas fa-shopping-basket"></i> Add Item
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    ScrollTrigger.refresh();
}

function displayBestSellers() {
    bestsellerGrid.innerHTML = "";
    const featured = products.filter(p => bestSellerIds.includes(p.id));
    featured.forEach(prod => {
        bestsellerGrid.innerHTML += `
            <div class="glow-effect rounded-lg overflow-hidden flex flex-col justify-between bestseller-card opacity-0">
                <div class="prod-img-container p-6 flex justify-center items-center h-56 relative">
                    <span class="absolute top-3 left-3 bg-red-600 text-[9px] font-black px-2 py-0.5 rounded tracking-widest text-white">🔥 POPULAR</span>
                    <img src="${prod.img}" alt="${prod.name}" class="h-full object-contain">
                </div>
                <div class="p-5 bg-black">
                    <h3 class="text-sm font-bold mb-1 uppercase tracking-wide text-zinc-200">${prod.name}</h3>
                    <p class="text-xs text-zinc-500 mb-3">Premium Elite Grade Formulation</p>
                    <div class="flex justify-between items-center">
                        <span class="text-md font-black text-red-500">₹${prod.price}</span>
                        <button onclick="addToCart(${prod.id})" class="bg-red-600 hover:bg-white text-white hover:text-black font-bold text-[10px] uppercase px-3 py-2 rounded transition-all duration-300 flex items-center gap-1">
                            <i class="fas fa-shopping-basket"></i> Add
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    ScrollTrigger.refresh();
}

function filterProducts() {
    const searchTxt = searchInput.value.toLowerCase();
    const maxPrice = parseInt(priceRange.value);
    priceVal.innerText = `₹${maxPrice}`;
    const filtered = products.filter(p => p.name.toLowerCase().includes(searchTxt) && p.price <= maxPrice);
    displayProducts(filtered);
    gsap.to(".product-card", { opacity: 1, y: 0, duration: 0.4, stagger: 0.05 });
}

searchInput.addEventListener('input', filterProducts);
priceRange.addEventListener('input', filterProducts);

// Boot operations
displayProducts(products);
displayBestSellers();

// ==========================================
// 3. CART FLUID INTERACTIONS LOGIC 
// ==========================================
cartBtn.addEventListener('click', () => { cartSidebar.classList.remove('translate-x-full'); resetCartToMainScreen(); });
closeCart.addEventListener('click', () => cartSidebar.classList.add('translate-x-full'));

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) { alert("Bhai, pehle cart me kuch add toh kar lo! 😉"); return; }
    gsap.to(cartMainScreen, { opacity: 0, duration: 0.2, onComplete: () => {
        cartMainScreen.classList.add('hidden');
        cartPaymentScreen.classList.remove('hidden');
        cartTitleText.innerText = "Checkout";
        gsap.fromTo(cartPaymentScreen, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.3 });
    }});
});

backToCartBtn.addEventListener('click', () => {
    gsap.to(cartPaymentScreen, { opacity: 0, duration: 0.2, onComplete: () => {
        cartPaymentScreen.classList.add('hidden');
        cartMainScreen.classList.remove('hidden');
        cartTitleText.innerText = "Your Cart";
        gsap.fromTo(cartMainScreen, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3 });
    }});
});

function resetCartToMainScreen() {
    cartMainScreen.classList.remove('hidden'); cartMainScreen.style.opacity = 1;
    cartPaymentScreen.classList.add('hidden'); cartTitleText.innerText = "Your Cart";
}

buyNowBtn.addEventListener('click', () => {
    const selectedMethod = document.querySelector('input[name="payment"]:checked').value;
    let methodText = selectedMethod === "card" ? "Credit/Debit Card" : (selectedMethod === "cod" ? "Cash on Delivery" : "UPI");
    alert(`⚡ Order Placed Successfully! \n💰 Amount: ${cartTotal.innerText} \n🛡️ Method: ${methodText} \n\nThank you for choosing AK NUTRITION!`);
    cart = []; updateCart(); resetCartToMainScreen(); cartSidebar.classList.add('translate-x-full');
});

window.addToCart = function(id) {
    const item = products.find(p => p.id === id); const existing = cart.find(c => c.id === id);
    if (existing) { existing.qty++; } else { cart.push({...item, qty: 1}); }
    updateCart();
    gsap.fromTo("#cart-btn", {scale: 0.7}, {scale: 1, duration: 0.3, ease: "back.out(2)"});
};

window.removeFromCart = function(id) { cart = cart.filter(c => c.id !== id); updateCart(); };

function updateCart() {
    const count = cart.reduce((acc, c) => acc + c.qty, 0);
    cartCount.innerText = count; if(cartCountMobile) cartCountMobile.innerText = count;
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `<p class="text-zinc-600 text-center py-4 text-sm">Your cart is empty.</p>`;
        cartTotal.innerText = "₹0"; paymentTotal.innerText = "₹0"; return;
    }
    cartItemsDiv.innerHTML = ""; let total = 0;
    cart.forEach(item => {
        total += (item.price * item.qty);
        cartItemsDiv.innerHTML += `
            <div class="flex justify-between items-center border-b border-zinc-900 pb-3">
                <div><h4 class="font-bold text-xs uppercase text-zinc-300">${item.name}</h4><p class="text-xs text-red-500">₹${item.price} x ${item.qty}</p></div>
                <button onclick="removeFromCart(${item.id})" class="text-zinc-600 hover:text-red-500 transition-colors"><i class="fas fa-trash"></i></button>
            </div>`;
    });
    cartTotal.innerText = `₹${total}`; paymentTotal.innerText = `₹${total}`;
}

// ==========================================
// 4. BUTTERY INERTIA SMOOTH SCROLL (LENIS)
// ==========================================
const lenis = new Lenis({ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), direction: 'vertical', smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

document.querySelectorAll('nav a, #hero-text a, .mobile-nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetID = this.getAttribute('href');
        if (targetID && targetID.startsWith("#")) {
            e.preventDefault(); if(!this.classList.contains('nav-link')) mobileSidebar.classList.add('translate-x-full');
            const targetElement = document.querySelector(targetID);
            if (targetElement) lenis.scrollTo(targetElement, { offset: 0, duration: 1.5 });
        }
    });
});

// Mobile Nav Event hooks
mobileMenuToggle.addEventListener('click', () => { mobileSidebar.classList.remove('translate-x-full'); gsap.fromTo("#mobile-sidebar a, #mobile-sidebar button", {opacity: 0, x: 20}, {opacity: 1, x: 0, duration: 0.4, stagger: 0.05, delay: 0.1}); });
closeMobileMenu.addEventListener('click', () => mobileSidebar.classList.add('translate-x-full'));
policyMobileBtn.addEventListener('click', () => { mobileSidebar.classList.add('translate-x-full'); setTimeout(() => document.getElementById('policy-nav-btn').click(), 300); });
cartBtnMobile.addEventListener('click', () => { mobileSidebar.classList.add('translate-x-full'); setTimeout(() => cartSidebar.classList.remove('translate-x-full'), 300); });

// ==========================================
// 5. MOTION GRAPHICS SCROLL MATRIX (GSAP)
// ==========================================
gsap.registerPlugin(ScrollTrigger);
gsap.from("nav", { yPercent: -100, duration: 1, ease: "power4.out" });
gsap.from("#hero-text > *", { opacity: 0, x: -60, duration: 1.2, stagger: 0.15, ease: "power4.out" });
gsap.from("#hero-img img", { opacity: 0, scale: 0.85, duration: 1.6, ease: "power3.out", delay: 0.3 });

gsap.fromTo("#shop-title, #shop-filters", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: "#shop", start: "top 80%", toggleActions: "play none none reverse" } });
gsap.fromTo(".product-card", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: "#product-grid", start: "top 85%", toggleActions: "play none none reverse" } });
gsap.fromTo("#bestseller-title", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power4.out", scrollTrigger: { trigger: "#best-sellers", start: "top 80%", toggleActions: "play none none reverse" } });
gsap.fromTo(".bestseller-card", { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: "#bestseller-grid", start: "top 85%", toggleActions: "play none none reverse" } });

gsap.fromTo(".about-img", { opacity: 0, scale: 0.9, x: -40 }, { opacity: 1, scale: 1, x: 0, duration: 1.4, scrollTrigger: { trigger: "#about", start: "top 75%", toggleActions: "play none none reverse" } });
gsap.fromTo(".about-text", { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 1.4, scrollTrigger: { trigger: "#about", start: "top 70%", toggleActions: "play none none reverse" } });
gsap.from(".stat-box", { scale: 0.8, opacity: 0, duration: 1, stagger: 0.2, ease: "back.out(1.5)", scrollTrigger: { trigger: ".about-text", start: "bottom 90%" } });

gsap.fromTo("#contact-form", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: "#contact", start: "top 70%", toggleActions: "play none none reverse" } });
gsap.fromTo("#contact-right-zone", { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: "#contact", start: "top 65%", toggleActions: "play none none reverse" } });

// ==========================================
// 6. COMPLIANCE LEGAL TAB STORAGE ENGINE
// ==========================================
const policyModal = document.getElementById('policy-modal'), policyNavBtn = document.getElementById('policy-nav-btn'), closePolicyModal = document.getElementById('close-policy-modal'), policyContentBox = document.getElementById('policy-content-box');
const policyDatabase = {
    privacy: `<h2 class="text-xl font-bold text-white mb-2 uppercase tracking-wide">Privacy Policy</h2><p class="text-xs text-zinc-500">// Last Updated: June 2026</p><p>At AK NUTRITION, accessible from our web interface, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of data logs collected.</p><h3 class="text-md font-bold text-red-500 mt-4">Information We Collect</h3><p>When purchasing, we securely collect names, contact markers, and email parameters to map freight logistics.</p>`,
    terms: `<h2 class="text-xl font-bold text-white mb-2 uppercase tracking-wide">Terms & Conditions</h2><p class="text-xs text-zinc-500">// Legal Terms</p><p>Welcome to AK NUTRITION. By entering our store networks, you comply fully with trademark jurisprudence frameworks listed.</p>`,
    refund: `<h2 class="text-xl font-bold text-white mb-2 uppercase tracking-wide">Cancellation & Refund Policy</h2><p class="text-xs text-zinc-500">// Gateway Compliance</p><p>Cancellations accepted within 12 hours before freight handovers. Seal-broken supplement canisters strictly cannot be returned due to nutritional public health codes. Refunds processed to original parameters within 5-7 banking days.</p>`,
    shipping: `<h2 class="text-xl font-bold text-white mb-2 uppercase tracking-wide">Shipping & Delivery Policy</h2><p class="text-xs text-zinc-500">// Logistics Execution</p><p>Invoices clear within 24-48 hours. Priority freight transits drop packages within 3 to 7 working business days across national parameters.</p>`
};

policyNavBtn.addEventListener('click', () => { policyModal.classList.remove('pointer-events-none'); switchPolicyTab('privacy'); gsap.to(policyModal, { opacity: 1, duration: 0.3 }); });
closePolicyModal.addEventListener('click', () => { policyModal.classList.add('pointer-events-none'); gsap.to(policyModal, { opacity: 0, duration: 0.2 }); });
window.addEventListener('click', (e) => { if (e.target === policyModal) { policyModal.classList.add('pointer-events-none'); gsap.to(policyModal, { opacity: 0, duration: 0.2 }); } });

window.switchPolicyTab = function(key) {
    policyContentBox.innerHTML = policyDatabase[key]; const tabButtons = document.querySelectorAll('.policy-tab-btn');
    tabButtons.forEach(btn => {
        if(btn.innerText.toLowerCase().includes(key)) { btn.classList.add('text-red-500', 'border-l-2', 'border-red-600', 'bg-zinc-950'); btn.classList.remove('text-zinc-500'); }
        else { btn.classList.remove('text-red-500', 'border-l-2', 'border-red-600', 'bg-zinc-950'); btn.classList.add('text-zinc-500'); }
    });
    policyContentBox.scrollTop = 0; gsap.fromTo("#policy-content-box > *", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, stagger: 0.05 });
};

document.getElementById('contact-form').addEventListener('submit', (e) => { e.preventDefault(); alert('🔥 Tactical transmission received! Our core division will connect with you soon.'); e.target.reset(); });