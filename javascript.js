// =====================================================
// AYTIZ PERFUME — MAIN JAVASCRIPT
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const aytMenuButton = document.getElementById("aytMenuButton");
    const aytMobileNav = document.getElementById("aytMobileNav");

    const aytSearchButton = document.getElementById("aytSearchButton");
    const aytSearchBox = document.getElementById("aytSearchBox");
    const aytSearchInput = document.getElementById("aytSearchInput");

    const aytCartButton = document.getElementById("aytCartButton");
    const aytCartDrawer = document.getElementById("aytCartDrawer");
    const aytCartOverlay = document.getElementById("aytCartOverlay");
    const aytCloseCart = document.getElementById("aytCloseCart");

    const aytCartCount = document.getElementById("aytCartCount");
    const aytCartContent = document.getElementById("aytCartContent");
    const aytCartQuantity = document.getElementById("aytCartQuantity");
    const aytWhatsappOrder = document.getElementById("aytWhatsappOrder");

    const aytShopSearch = document.getElementById("aytShopSearch");
    const aytShopSearchButton = document.getElementById("aytShopSearchButton");

    // =====================================================
    // SETTINGS
    // =====================================================

    const AYTIZ_CART_KEY = "aytizCart";

    // AYTIZ WhatsApp number
    const AYTIZ_WHATSAPP = "2348103269866";

    // =====================================================
    // MOBILE MENU
    // =====================================================

    function openAytMobileNav() {

        if (!aytMobileNav || !aytMenuButton) return;

        aytMobileNav.classList.add("ayt-mobile-open");

        aytMenuButton.setAttribute("aria-expanded", "true");

        const menuLines = aytMenuButton.querySelectorAll("span");

        if (menuLines.length >= 3) {
            menuLines[0].style.transform =
                "rotate(45deg) translate(5px, 5px)";

            menuLines[1].style.opacity = "0";

            menuLines[2].style.transform =
                "rotate(-45deg) translate(5px, -5px)";
        }
    }


    function closeAytMobileNav() {

        if (!aytMobileNav || !aytMenuButton) return;

        aytMobileNav.classList.remove("ayt-mobile-open");

        aytMenuButton.setAttribute("aria-expanded", "false");

        const menuLines = aytMenuButton.querySelectorAll("span");

        if (menuLines.length >= 3) {
            menuLines[0].style.transform = "";
            menuLines[1].style.opacity = "";
            menuLines[2].style.transform = "";
        }
    }


    if (aytMenuButton && aytMobileNav) {

        aytMenuButton.addEventListener("click", () => {

            const isOpen =
                aytMobileNav.classList.contains("ayt-mobile-open");

            if (isOpen) {
                closeAytMobileNav();
            } else {
                openAytMobileNav();
            }

        });
    }


    // Close mobile menu after clicking a navigation link
    document.querySelectorAll(".ayt-mobile-nav a").forEach(link => {

        link.addEventListener("click", () => {
            closeAytMobileNav();
        });

    });


    // =====================================================
    // ACTIVE NAVIGATION
    // HOME / ABOUT / SHOP
    // =====================================================

    function setActiveAytNavigation() {

        const currentPath =
            window.location.pathname.toLowerCase();

        let currentPage = "home";

        if (
            currentPath.includes("about.html") ||
            currentPath.endsWith("/about")
        ) {
            currentPage = "about";
        }

        if (
            currentPath.includes("shop.html") ||
            currentPath.endsWith("/shop")
        ) {
            currentPage = "shop";
        }


        // Desktop navigation
        document.querySelectorAll(".ayt-nav-links a").forEach(link => {

            const href =
                (link.getAttribute("href") || "").toLowerCase();

            link.classList.remove("active");

            if (
                (currentPage === "home" &&
                    (href === "index.html" ||
                     href === "./" ||
                     href === "/")) ||

                (currentPage === "about" &&
                    href.includes("about.html")) ||

                (currentPage === "shop" &&
                    href.includes("shop.html"))
            ) {
                link.classList.add("active");
            }

        });


        // Mobile navigation
        document.querySelectorAll(".ayt-mobile-nav a").forEach(link => {

            const href =
                (link.getAttribute("href") || "").toLowerCase();

            link.classList.remove("active");

            if (
                (currentPage === "home" &&
                    (href === "index.html" ||
                     href === "./" ||
                     href === "/")) ||

                (currentPage === "about" &&
                    href.includes("about.html")) ||

                (currentPage === "shop" &&
                    href.includes("shop.html"))
            ) {
                link.classList.add("active");
            }

        });

    }

    setActiveAytNavigation();


    // =====================================================
    // SEARCH BOX
    // =====================================================

    function openAytSearch() {

        if (!aytSearchBox) return;

        aytSearchBox.classList.add("ayt-search-open");

        if (aytSearchInput) {
            setTimeout(() => {
                aytSearchInput.focus();
            }, 100);
        }
    }


    function closeAytSearch() {

        if (!aytSearchBox) return;

        aytSearchBox.classList.remove("ayt-search-open");
    }


    if (aytSearchButton) {

        aytSearchButton.addEventListener("click", () => {

            if (
                aytSearchBox &&
                aytSearchBox.classList.contains("ayt-search-open")
            ) {
                closeAytSearch();
            } else {
                openAytSearch();
            }

        });

    }


    // Search from main navbar
    if (aytSearchInput) {

        aytSearchInput.addEventListener("keydown", event => {

            if (event.key !== "Enter") return;

            const searchValue =
                aytSearchInput.value.trim();

            if (!searchValue) return;

            // If already on Shop, filter products
            if (
                document.querySelector(".ayt-shop-page")
            ) {

                if (aytShopSearch) {
                    aytShopSearch.value = searchValue;
                    applyShopFilters();
                }

                closeAytSearch();

                return;
            }


            // Otherwise take the user to Shop
            window.location.href =
                "shop.html?search=" +
                encodeURIComponent(searchValue);

        });

    }


    // =====================================================
    // CART STORAGE
    // =====================================================

    let aytizCart = [];

    try {

        const savedCart =
            JSON.parse(
                localStorage.getItem(AYTIZ_CART_KEY)
            );

        if (Array.isArray(savedCart)) {
            aytizCart = savedCart;
        }

    } catch (error) {

        aytizCart = [];

    }


    function saveAytizCart() {

        localStorage.setItem(
            AYTIZ_CART_KEY,
            JSON.stringify(aytizCart)
        );

    }


    function formatAytizPrice(price) {

        return "₦" +
            Number(price).toLocaleString("en-NG");

    }


    // =====================================================
    // CART COUNT
    // =====================================================

    function updateAytizCartCount() {

        const totalQuantity =
            aytizCart.reduce(
                (total, product) =>
                    total + Number(product.quantity || 0),
                0
            );


        if (aytCartCount) {
            aytCartCount.textContent = totalQuantity;
        }


        if (aytCartQuantity) {
            aytCartQuantity.textContent = totalQuantity;
        }

    }


    // =====================================================
    // OPEN CART
    // =====================================================

    function openAytCart() {

        if (!aytCartDrawer) return;

        aytCartDrawer.classList.add("ayt-open");
        aytCartDrawer.setAttribute("aria-hidden", "false");

        if (aytCartButton) {
            aytCartButton.setAttribute("aria-expanded", "true");
        }

        if (aytCartOverlay) {
            aytCartOverlay.classList.add("ayt-show");
            aytCartOverlay.setAttribute("aria-hidden", "false");
        }

        document.body.classList.add("ayt-cart-is-open");

    }


    // =====================================================
    // CLOSE CART
    // =====================================================

    function closeAytCart() {

        if (aytCartDrawer) {
            aytCartDrawer.classList.remove("ayt-open");
            aytCartDrawer.setAttribute("aria-hidden", "true");
        }

        if (aytCartButton) {
            aytCartButton.setAttribute("aria-expanded", "false");
        }

        if (aytCartOverlay) {
            aytCartOverlay.classList.remove("ayt-show");
            aytCartOverlay.setAttribute("aria-hidden", "true");
        }

        document.body.classList.remove("ayt-cart-is-open");

    }


    if (aytCartButton) {
        aytCartButton.addEventListener(
            "click",
            openAytCart
        );
    }


    if (aytCloseCart) {
        aytCloseCart.addEventListener(
            "click",
            closeAytCart
        );
    }


    if (aytCartOverlay) {
        aytCartOverlay.addEventListener(
            "click",
            closeAytCart
        );
    }


    // =====================================================
    // ADD PRODUCT TO CART
    // =====================================================

    function addAytizProduct(product) {

        if (!product.name) return;

        const existingProduct =
            aytizCart.find(
                item => item.name === product.name
            );


        if (existingProduct) {

            existingProduct.quantity += 1;

        } else {

            aytizCart.push({

                name: product.name,

                price: Number(product.price) || 0,

                image: product.image || "",

                quantity: 1

            });

        }


        saveAytizCart();

        updateAytizCart();

        openAytCart();

    }


    // =====================================================
    // REMOVE PRODUCT
    // =====================================================

    function removeAytizProduct(productName) {

        aytizCart =
            aytizCart.filter(
                product =>
                    product.name !== productName
            );


        saveAytizCart();

        updateAytizCart();

    }


    // =====================================================
    // CHANGE QUANTITY
    // =====================================================

    function changeAytizQuantity(
        productName,
        amount
    ) {

        const product =
            aytizCart.find(
                item => item.name === productName
            );


        if (!product) return;


        product.quantity += amount;


        if (product.quantity <= 0) {

            removeAytizProduct(productName);

            return;

        }


        saveAytizCart();

        updateAytizCart();

    }


    // =====================================================
    // CART RENDER
    // =====================================================

    function updateAytizCart() {

        updateAytizCartCount();


        if (!aytCartContent) return;


        if (aytizCart.length === 0) {

            aytCartContent.innerHTML = `

                <div class="ayt-empty-cart">

                    <div class="ayt-empty-cart-icon">
                        🛒
                    </div>

                    <h3>Your cart is empty</h3>

                    <p>
                        Add a fragrance to your cart
                        and it will appear here.
                    </p>

                </div>

            `;

            return;

        }


        let cartHTML = "";
        let cartTotal = 0;
        let totalItems = 0;


        aytizCart.forEach(product => {

            const quantity =
                Number(product.quantity) || 1;

            const price =
                Number(product.price) || 0;

            const itemTotal =
                price * quantity;


            cartTotal += itemTotal;
            totalItems += quantity;


            cartHTML += `

                <div
                    class="ayt-cart-item"
                    data-product-name="${escapeAytizHTML(product.name)}"
                >

                    <div class="ayt-cart-item-image-wrap">

                        ${
                            product.image
                                ? `
                                    <img
                                        src="${escapeAytizHTML(product.image)}"
                                        alt="${escapeAytizHTML(product.name)}"
                                        class="ayt-cart-item-image"
                                    >
                                  `
                                : `
                                    <div class="ayt-cart-item-image-placeholder">
                                        AYTIZ
                                    </div>
                                  `
                        }

                    </div>


                    <div class="ayt-cart-item-info">

                        <h4 class="ayt-cart-item-name">
                            ${escapeAytizHTML(product.name)}
                        </h4>

                        <div class="ayt-cart-item-price">
                            ${formatAytizPrice(price)}
                        </div>


                        <div class="ayt-cart-item-controls">

                            <button
                                type="button"
                                class="ayt-cart-qty-btn"
                                data-action="decrease"
                                data-product="${escapeAytizHTML(product.name)}"
                                aria-label="Decrease quantity"
                            >
                                −
                            </button>


                            <span class="ayt-cart-qty-value">
                                ${quantity}
                            </span>


                            <button
                                type="button"
                                class="ayt-cart-qty-btn"
                                data-action="increase"
                                data-product="${escapeAytizHTML(product.name)}"
                                aria-label="Increase quantity"
                            >
                                +
                            </button>

                        </div>

                    </div>


                    <div class="ayt-cart-item-right">

                        <strong class="ayt-cart-item-total">
                            ${formatAytizPrice(itemTotal)}
                        </strong>

                        <button
                            type="button"
                            class="ayt-cart-remove"
                            data-action="remove"
                            data-product="${escapeAytizHTML(product.name)}"
                        >
                            Remove
                        </button>

                    </div>

                </div>

            `;

        });


        cartHTML += `

            <div class="ayt-cart-total-row">

                <span>
                    Total
                </span>

                <strong>
                    ${formatAytizPrice(cartTotal)}
                </strong>

            </div>

        `;


        aytCartContent.innerHTML = cartHTML;


        // Update footer quantity if it exists
        if (aytCartQuantity) {
            aytCartQuantity.textContent = totalItems;
        }

    }


    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeAytizHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // =====================================================
    // CART BUTTON ACTIONS
    // =====================================================

    if (aytCartContent) {

        aytCartContent.addEventListener(
            "click",
            event => {

                const button =
                    event.target.closest(
                        "[data-action]"
                    );

                if (!button) return;


                const action =
                    button.dataset.action;

                const productName =
                    button.dataset.product;


                if (!productName) return;


                if (action === "increase") {

                    changeAytizQuantity(
                        productName,
                        1
                    );

                }


                if (action === "decrease") {

                    changeAytizQuantity(
                        productName,
                        -1
                    );

                }


                if (action === "remove") {

                    removeAytizProduct(
                        productName
                    );

                }

            }
        );

    }


    // =====================================================
    // PRODUCT BUTTONS
    // =====================================================

    document.querySelectorAll(
        ".ayt-add-product, " +
        ".ayt-product-quick-add, " +
        ".ayt-featured-cart, " +
        "#aytAddToCart"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                let productName =
                    button.dataset.product;

                let productPrice =
                    button.dataset.price;

                let productImage =
                    button.dataset.image;


                // Home page fallback
                if (!productName) {
                    productName = "AYTIZ Perfume";
                }


                // Find product card if image/price
                // wasn't directly supplied
                const productCard =
                    button.closest(
                        ".ayt-product-card"
                    );


                if (productCard) {

                    if (!productPrice) {

                        productPrice =
                            productCard.dataset.price;

                    }


                    if (!productImage) {

                        const cardImage =
                            productCard.querySelector(
                                "img"
                            );

                        if (cardImage) {
                            productImage =
                                cardImage.getAttribute(
                                    "src"
                                );
                        }

                    }

                }


                // Featured/home image fallback
                if (!productImage) {

                    const nearbyImage =
                        button
                            .closest(
                                ".ayt-featured-product, " +
                                ".ayt-hero-content, " +
                                ".ayt-product-card"
                            )
                            ?.querySelector("img");


                    if (nearbyImage) {
                        productImage =
                            nearbyImage.getAttribute(
                                "src"
                            );
                    }

                }


                // Don't add sold-out products
                const card =
                    button.closest(
                        ".ayt-product-card"
                    );


                if (
                    card &&
                    (
                        card.classList.contains(
                            "sold-out"
                        ) ||
                        card.dataset.soldOut === "true"
                    )
                ) {
                    return;
                }


                addAytizProduct({

                    name: productName,

                    price: Number(productPrice) || 0,

                    image: productImage || ""

                });

            }
        );

    });


    // =====================================================
    // WHATSAPP ORDER
    // =====================================================

    if (aytWhatsappOrder) {

        aytWhatsappOrder.addEventListener(
            "click",
            event => {

                event.preventDefault();


                if (aytizCart.length === 0) {

                    alert(
                        "Your cart is empty. Please add a fragrance first."
                    );

                    return;

                }


                let message =
                    "Hello AYTIZ, I would like to place an order:%0A%0A";


                let total = 0;


                aytizCart.forEach(
                    (product, index) => {

                        const quantity =
                            Number(product.quantity) || 1;

                        const price =
                            Number(product.price) || 0;

                        const itemTotal =
                            quantity * price;


                        total += itemTotal;


                        message +=
                            `${index + 1}. ` +
                            `${product.name} x${quantity} ` +
                            `— ${formatAytizPrice(itemTotal)}%0A`;

                    }
                );


                message +=
                    `%0A*Total: ${formatAytizPrice(total)}*` +
                    `%0A%0APlease confirm availability and delivery details.`;


                const whatsappURL =
                    `https://wa.me/${AYTIZ_WHATSAPP}?text=${message}`;


                window.open(
                    whatsappURL,
                    "_blank"
                );

            }
        );

    }


    // =====================================================
    // SHOP SEARCH + CATEGORY FILTER
    // =====================================================

    let activeShopCategory = "all";


    function applyShopFilters() {

        const productCards =
            document.querySelectorAll(
                ".ayt-product-card"
            );


        if (!productCards.length) return;


        const searchValue =
            aytShopSearch
                ? aytShopSearch.value
                    .trim()
                    .toLowerCase()
                : "";


        let visibleProducts = 0;


        productCards.forEach(card => {

            const category =
                (
                    card.dataset.category ||
                    ""
                ).toLowerCase();


            const name =
                (
                    card.dataset.name ||
                    card.textContent ||
                    ""
                ).toLowerCase();


            const brand =
                (
                    card.dataset.brand ||
                    ""
                ).toLowerCase();


            const searchableText =
                `${name} ${brand} ${category}`;


            const categoryMatch =
                activeShopCategory === "all" ||
                category
                    .split(" ")
                    .includes(activeShopCategory);


            const searchMatch =
                !searchValue ||
                searchableText.includes(
                    searchValue
                );


            if (
                categoryMatch &&
                searchMatch
            ) {

                card.style.display = "";

                visibleProducts++;

            } else {

                card.style.display = "none";

            }

        });


        const noProducts =
            document.getElementById(
                "aytNoProducts"
            );


        if (noProducts) {

            noProducts.style.display =
                visibleProducts === 0
                    ? "block"
                    : "none";

        }

    }


    // Category buttons
    document.querySelectorAll(
        ".ayt-category-btn"
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                activeShopCategory =
                    button.dataset.category ||
                    "all";


                document.querySelectorAll(
                    ".ayt-category-btn"
                ).forEach(categoryButton => {

                    categoryButton.classList.remove(
                        "active"
                    );

                });


                button.classList.add("active");


                applyShopFilters();

            }
        );

    });


    // Shop search typing
    if (aytShopSearch) {

        aytShopSearch.addEventListener(
            "input",
            applyShopFilters
        );


        // If user arrived through navbar search
        const urlParams =
            new URLSearchParams(
                window.location.search
            );


        const initialSearch =
            urlParams.get("search");


        if (initialSearch) {

            aytShopSearch.value =
                initialSearch;

            applyShopFilters();

        }

    }


    if (aytShopSearchButton) {

        aytShopSearchButton.addEventListener(
            "click",
            applyShopFilters
        );

    }


    // =====================================================
    // KEYBOARD CONTROLS
    // =====================================================

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") return;

            closeAytCart();

            closeAytSearch();

            closeAytMobileNav();

        }
    );


    // =====================================================
    // CLICK OUTSIDE SEARCH
    // =====================================================

    document.addEventListener(
        "click",
        event => {

            if (!aytSearchBox) return;

            if (
                !aytSearchBox.contains(event.target) &&
                !event.target.closest(
                    "#aytSearchButton"
                )
            ) {

                closeAytSearch();

            }

        }
    );


    // =====================================================
    // INITIAL CART LOAD
    // =====================================================

    updateAytizCart();


    // =====================================================
    // INITIAL SHOP FILTER
    // =====================================================

    applyShopFilters();

});