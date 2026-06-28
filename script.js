let cart = [];

// DOM Interfaces
const searchInput = document.getElementById('search-input'), priceRange = document.getElementById('price-range'), priceVal = document.getElementById('price-val');
const cartBtn = document.getElementById('cart-btn'), cartSidebar = document.getElementById('cart-sidebar'), closeCart = document.getElementById('close-cart');
const cartItemsDiv = document.getElementById('cart-items'), cartCount = document.getElementById('cart-count'), cartTotal = document.getElementById('cart-total');

// Form & View Swap Nodes
const checkoutBtn = document.getElementById('checkout-btn'), backToCartBtn = document.getElementById('back-to-cart-btn');
const cartMainScreen = document.getElementById('cart-main-screen'), cartLoginScreen = document.getElementById('cart-login-screen'), cartTitleText = document.getElementById('cart-title-text');
const orderSubmitForm = document.getElementById('order-submit-form');

// Mobile UI Nodes
const mobileMenuToggle = document.getElementById('mobile-menu-toggle'), mobileSidebar = document.getElementById('mobile-sidebar'), closeMobileMenu = document.getElementById('close-mobile-menu'), mobileNavLinks = document.querySelectorAll('.mobile-nav-link'), cartBtnMobile = document.getElementById('cart-btn-mobile'), cartCountMobile = document.getElementById('cart-count-mobile'), policyMobileBtn = document.getElementById('policy-mobile-btn');


// ==========================================
// 1. FILTER ENGINE (Targets HTML Data Attributes)
// ==========================================
function filterProducts() {
    const searchTxt = searchInput.value.toLowerCase();
    const maxPrice = parseInt(priceRange.value);
    priceVal.innerText = `₹${maxPrice}`;

    // Target hardcoded HTML elements
    const cards = document.querySelectorAll('#product-grid .product-card');
    cards.forEach(card => {
        const name = card.getAttribute('data-name');
        const price = parseInt(card.getAttribute('data-price'));
        
        if (name.includes(searchTxt) && price <= maxPrice) {
            card.style.display = 'flex';
            gsap.to(card, { opacity: 1, duration: 0.3 });
        } else {
            card.style.display = 'none';
        }
    });
    ScrollTrigger.refresh();
}
searchInput.addEventListener('input', filterProducts);
priceRange.addEventListener('input', filterProducts);


// ==========================================
// 2. CART SYSTEM & EMAIL FORM LOGIC
// ==========================================
cartBtn.addEventListener('click', () => { cartSidebar.classList.remove('translate-x-full'); resetCartToMainScreen(); });
closeCart.addEventListener('click', () => cartSidebar.classList.add('translate-x-full'));

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) { alert("Cart is empty! Add products first."); return; }
    gsap.to(cartMainScreen, { opacity: 0, duration: 0.2, onComplete: () => {
        cartMainScreen.classList.add('hidden');
        cartLoginScreen.classList.remove('hidden');
        cartTitleText.innerText = "Order Details";
        gsap.fromTo(cartLoginScreen, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.3 });
    }});
});

backToCartBtn.addEventListener('click', () => {
    gsap.to(cartLoginScreen, { opacity: 0, duration: 0.2, onComplete: () => {
        cartLoginScreen.classList.add('hidden');
        cartMainScreen.classList.remove('hidden');
        cartTitleText.innerText = "Your Cart";
        gsap.fromTo(cartMainScreen, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3 });
    }});
});

function resetCartToMainScreen() {
    cartMainScreen.classList.remove('hidden'); cartMainScreen.style.opacity = 1;
    cartLoginScreen.classList.add('hidden'); cartTitleText.innerText = "Your Cart";
}

// ==========================================
// 🔥 EMAILJS INITIALIZATION (Top par add karo)
// ==========================================
// Apni EmailJS ki "Public Key" yahan daalo
emailjs.init("YOUR_PUBLIC_KEY"); 

// ... (Baki saara tumhara purana variables aur product render logic waise hi rahega) ...


// ==========================================
// 2. CART SYSTEM & 🔥 REAL EMAIL FORM LOGIC
// ==========================================
cartBtn.addEventListener('click', () => { cartSidebar.classList.remove('translate-x-full'); resetCartToMainScreen(); });
closeCart.addEventListener('click', () => cartSidebar.classList.add('translate-x-full'));

checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) { alert("Cart is empty! Add products first."); return; }
    gsap.to(cartMainScreen, { opacity: 0, duration: 0.2, onComplete: () => {
        cartMainScreen.classList.add('hidden');
        cartLoginScreen.classList.remove('hidden');
        cartTitleText.innerText = "Order Details";
        gsap.fromTo(cartLoginScreen, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.3 });
    }});
});

backToCartBtn.addEventListener('click', () => {
    gsap.to(cartLoginScreen, { opacity: 0, duration: 0.2, onComplete: () => {
        cartLoginScreen.classList.add('hidden');
        cartMainScreen.classList.remove('hidden');
        cartTitleText.innerText = "Your Cart";
        gsap.fromTo(cartMainScreen, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3 });
    }});
});

function resetCartToMainScreen() {
    cartMainScreen.classList.remove('hidden'); cartMainScreen.style.opacity = 1;
    cartLoginScreen.classList.add('hidden'); cartTitleText.innerText = "Your Cart";
}

// 🔥 REAL EMAIL DISPATCH LOGIC
orderSubmitForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Button state update taaki user form ko dobara submit na kare
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "Processing Order...";
    submitBtn.disabled = true;

    // Form inputs extract karna
    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const email = document.getElementById('cust-email').value;
    const address = document.getElementById('cust-address').value;
    
    // Cart Data ko text array me format karna
    let orderSummary = cart.map(i => `• ${i.name} (Qty: ${i.qty}) - ₹${i.price * i.qty}`).join('\n');
    let totalAmount = cartTotal.innerText;

    // Template parameters set karna (EmailJS template me in variables ka use karna)
    const templateParams = {
        from_name: name,
        customer_phone: phone,
        customer_email: email,
        customer_address: address,
        order_summary: orderSummary,
        total_amount: totalAmount
    };

    // 🔥 EmailJS Send Function
    // DHYAN DEIN: 'YOUR_SERVICE_ID' aur 'YOUR_TEMPLATE_ID' ko apne dashboard wale ID se badalna
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
            alert(`✉️ SUCCESS! Order Placed Successfully.\nWe have sent the confirmation to your email. Total: ${totalAmount}`);
            cart = []; 
            updateCart(); 
            resetCartToMainScreen(); 
            cartSidebar.classList.add('translate-x-full'); 
            e.target.reset();
        }, function(error) {
            alert('❌ Technical Issue! Order failed to send. Please connect with us on WhatsApp.\nError: ' + JSON.stringify(error));
        })
        .finally(() => {
            // Button wapas normal state me
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        });
});

// ... (Baki saara add to cart, update cart, Lenis aur GSAP ka code same rahega) ...

// EMAIL DISPATCH LOGIC (Alert simulation)
// orderSubmitForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const name = document.getElementById('cust-name').value;
//     const phone = document.getElementById('cust-phone').value;
//     const email = document.getElementById('cust-email').value;
//     const address = document.getElementById('cust-address').value;
    
//     let orderSummary = cart.map(i => `• ${i.name} (Qty: ${i.qty}) - ₹${i.price * i.qty}`).join('\n');
    
//     alert(`✉️ SUCCESS! Order details routed to Email.\n\n👤 Customer: ${name}\n📱 Phone: ${phone}\n📬 Email: ${email}\n📍 Address: ${address}\n\n📦 CART ITEMS:\n${orderSummary}\n\n💰 TOTAL AMOUNT: ${cartTotal.innerText}\n\n[System] Confirmation email triggered!`);
    
//     cart = []; updateCart(); resetCartToMainScreen(); cartSidebar.classList.add('translate-x-full'); e.target.reset();
// });

// DIRECT HTML ONCLICK WILL CALL THIS
window.addToCart = function(id, name, price) {
    const existing = cart.find(c => c.id === id);
    if (existing) { existing.qty++; } else { cart.push({ id, name, price, qty: 1 }); }
    updateCart(); 
    gsap.fromTo("#cart-btn", {scale: 0.7}, {scale: 1, duration: 0.3, ease: "back.out(2)"});
};

window.removeFromCart = function(id) { cart = cart.filter(c => c.id !== id); updateCart(); };

function updateCart() {
    const count = cart.reduce((acc, c) => acc + c.qty, 0); 
    cartCount.innerText = count; 
    if(cartCountMobile) cartCountMobile.innerText = count;
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = `<p class="text-zinc-600 text-center py-4 text-sm">Your cart is empty.</p>`; 
        cartTotal.innerText = "₹0"; return;
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
    cartTotal.innerText = `₹${total}`;
}

// ==========================================
// 3. LENIS BUTTERY SCROLL CONTROLS
// ==========================================
const lenis = new Lenis({ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), direction: 'vertical', smooth: true });
function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
requestAnimationFrame(raf);
lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((time) => { lenis.raf(time * 1000); }); gsap.ticker.lagSmoothing(0);

document.querySelectorAll('nav a, #hero-text a, .mobile-nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetID = this.getAttribute('href');
        if (targetID && targetID.startsWith("#")) {
            e.preventDefault(); if(!this.classList.contains('nav-link')) mobileSidebar.classList.add('translate-x-full');
            const targetElement = document.querySelector(targetID); if (targetElement) lenis.scrollTo(targetElement, { offset: 0, duration: 1.5 });
        }
    });
});

mobileMenuToggle.addEventListener('click', () => { mobileSidebar.classList.remove('translate-x-full'); gsap.fromTo("#mobile-sidebar a, #mobile-sidebar button", {opacity: 0, x: 20}, {opacity: 1, x: 0, duration: 0.4, stagger: 0.05, delay: 0.1}); });
closeMobileMenu.addEventListener('click', () => mobileSidebar.classList.add('translate-x-full'));
policyMobileBtn.addEventListener('click', () => { mobileSidebar.classList.add('translate-x-full'); setTimeout(() => document.getElementById('policy-nav-btn').click(), 300); });
cartBtnMobile.addEventListener('click', () => { mobileSidebar.classList.add('translate-x-full'); setTimeout(() => cartSidebar.classList.remove('translate-x-full'), 300); });

// ==========================================
// 4. GSAP SCROLL KINETICS TRIGGER MATRIX
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
gsap.fromTo(".about-text", { opacity: 0, x: 40 }, { opacity: 1, scale: 1, x: 0, duration: 1.4, scrollTrigger: { trigger: "#about", start: "top 70%", toggleActions: "play none none reverse" } });
gsap.from(".stat-box", { scale: 0.8, opacity: 0, duration: 1, stagger: 0.2, ease: "back.out(1.5)", scrollTrigger: { trigger: ".about-text", start: "bottom 90%" } });

gsap.fromTo("#contact-form", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: "#contact", start: "top 70%", toggleActions: "play none none reverse" } });
gsap.fromTo("#contact-right-zone", { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: "#contact", start: "top 65%", toggleActions: "play none none reverse" } });

// ==========================================
// 5. COMPLIANCE LEGAL DATA MODALS
// ==========================================
const policyModal = document.getElementById('policy-modal'), policyNavBtn = document.getElementById('policy-nav-btn'), closePolicyModal = document.getElementById('close-policy-modal'), policyContentBox = document.getElementById('policy-content-box');
const policyDatabase = {
    privacy: `<h2 class="text-xl font-bold text-white mb-2 uppercase tracking-wide">Privacy Policy</h2><p>At AK NUTRITION, accessible from our web interface, one of our main priorities is privacy.</p>`,
    terms: `<h2 class="text-xl font-bold text-white mb-2 uppercase tracking-wide">Terms & Conditions</h2><p>By entering our store networks, you comply fully with industrial guidelines.</p>`,
    refund: `<h2 class="text-xl font-bold text-white mb-2 uppercase tracking-wide">Cancellation & Refund Policy</h2><p>Seal-broken supplement canisters cannot be returned due to nutritional public health codes.</p>`,
    shipping: `<h2 class="text-xl font-bold text-white mb-2 uppercase tracking-wide">Shipping & Delivery Policy</h2><p>Standard transits drop packages within 3 to 7 working business days across national parameters.</p>`
};
policyNavBtn.addEventListener('click', () => { policyModal.classList.remove('pointer-events-none'); switchPolicyTab('privacy'); gsap.to(policyModal, { opacity: 1, duration: 0.3 }); });
closePolicyModal.addEventListener('click', () => { policyModal.classList.add('pointer-events-none'); gsap.to(policyModal, { opacity: 0, duration: 0.2 }); });
window.switchPolicyTab = function(key) {
    policyContentBox.innerHTML = policyDatabase[key]; const tabButtons = document.querySelectorAll('.policy-tab-btn');
    tabButtons.forEach(btn => { btn.innerText.toLowerCase().includes(key) ? btn.classList.add('text-red-500') : btn.classList.remove('text-red-500'); });
    policyContentBox.scrollTop = 0; gsap.fromTo("#policy-content-box > *", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
};