(() => {
    const filterButtons = [...document.querySelectorAll('.filter-btn')];
    const searchInput = document.querySelector('#productSearch');
    const maxPriceInput = document.querySelector('#maxPrice');
    const pricedOnlyInput = document.querySelector('#pricedOnly');
    const sortSelect = document.querySelector('#sortProducts');
    const clearButton = document.querySelector('#clearSearch');
    const resultCount = document.querySelector('.results-count');
    let category = new URLSearchParams(location.search).get('category') || 'all';

    function filterProducts() {
        const term = (searchInput?.value || '').trim().toLowerCase();
        const maxPrice = maxPriceInput?.value ? Number(maxPriceInput.value) : null;
        const pricedOnly = Boolean(pricedOnlyInput?.checked);
        let visible = 0;
        const cards = [...document.querySelectorAll('.accessory-card')];
        cards.forEach((card) => {
            const text = card.textContent.toLowerCase();
            const price = card.dataset.price === '' ? null : Number(card.dataset.price);
            const matches = (category === 'all' || card.dataset.category === category)
                && (!term || text.includes(term))
                && (maxPrice === null || (price !== null && price <= maxPrice))
                && (!pricedOnly || price !== null);
            card.hidden = !matches;
            if (matches) visible += 1;
        });
        const grid = document.querySelector('[data-catalogue-products]');
        if (grid && sortSelect?.value !== 'default') {
            cards.sort((a, b) => {
                if (sortSelect.value === 'name') return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
                const first = a.dataset.price === '' ? Number.POSITIVE_INFINITY : Number(a.dataset.price);
                const second = b.dataset.price === '' ? Number.POSITIVE_INFINITY : Number(b.dataset.price);
                return sortSelect.value === 'price-desc' ? second - first : first - second;
            }).forEach((card) => grid.appendChild(card));
        }
        if (resultCount) resultCount.textContent = visible ? `${visible} product${visible === 1 ? '' : 's'} shown` : 'No products match. Try another search or clear filters.';
    }

    filterButtons.forEach((button) => button.addEventListener('click', () => {
        category = button.dataset.filter;
        filterButtons.forEach((item) => item.classList.toggle('active', item === button));
        filterProducts();
    }));
    searchInput?.addEventListener('input', filterProducts);
    maxPriceInput?.addEventListener('input', filterProducts);
    pricedOnlyInput?.addEventListener('change', filterProducts);
    sortSelect?.addEventListener('change', filterProducts);
    clearButton?.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (maxPriceInput) maxPriceInput.value = '';
        if (pricedOnlyInput) pricedOnlyInput.checked = false;
        category = 'all';
        filterButtons.forEach((item) => item.classList.toggle('active', item.dataset.filter === 'all'));
        filterProducts();
        searchInput?.focus();
    });

    document.addEventListener('DOMContentLoaded', () => {
        const categoryButton = filterButtons.find((button) => button.dataset.filter === category) || filterButtons[0];
        categoryButton?.classList.add('active');
        filterButtons.forEach((item) => { if (item !== categoryButton) item.classList.remove('active'); });
        document.addEventListener('unique-products-rendered', filterProducts, { once: true });
    });

    // Add keyboard support for search input
    searchInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            filterProducts();
        }
    });
})();
