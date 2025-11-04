// Active nav highlighting based on URL path
(function () {
    const links = Array.from(document.querySelectorAll('header nav a'));
    const path = location.pathname.split('/').pop() || 'index.html';
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const matches = (href === path) || (href === 'index.html' && path === '');
        link.classList.toggle('is-active', matches);
        if (matches) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });
})();

// Theme toggle with persisted preference and system fallback
(function () {
	const root = document.documentElement;
    const toggle = document.getElementById('themeToggle');
    const fab = document.getElementById('themeFab');
	const storageKey = 'theme-preference';
    const headerEl = document.querySelector('header');
    const heroEl = document.getElementById('home');

	function getPreferred() {
		const stored = localStorage.getItem(storageKey);
		if (stored === 'light' || stored === 'dark') return stored;
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

    function setIcon(theme) {
        const iconEl = document.querySelector('.theme-fab__icon');
        if (iconEl) iconEl.textContent = theme === 'dark' ? '☀' : '🌙';
    }

    function applyTheme(theme) {
		if (theme === 'dark') {
			root.setAttribute('data-theme', 'dark');
			if (toggle) toggle.setAttribute('aria-pressed', 'true');
            if (fab) fab.setAttribute('aria-pressed', 'true');
		} else {
			root.removeAttribute('data-theme');
			if (toggle) toggle.setAttribute('aria-pressed', 'false');
            if (fab) fab.setAttribute('aria-pressed', 'false');
		}
        setIcon(theme);
	}

	const current = getPreferred();
	applyTheme(current);

    // --- Hero sizing based on header height to avoid extra scroll ---
    function setHeaderHeightVar() {
        const headerHeight = headerEl ? headerEl.offsetHeight : 0;
        root.style.setProperty('--header-h', headerHeight + 'px');
    }

    setHeaderHeightVar();
    window.addEventListener('resize', setHeaderHeightVar);

    function handleToggleClick() {
        const newTheme = (root.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
        localStorage.setItem(storageKey, newTheme);
        applyTheme(newTheme);
    }

    if (toggle) toggle.addEventListener('click', handleToggleClick);
    if (fab) fab.addEventListener('click', handleToggleClick);

	// React to OS theme changes if user hasn't explicitly chosen
	if (window.matchMedia) {
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			const stored = localStorage.getItem(storageKey);
			if (!stored) applyTheme(e.matches ? 'dark' : 'light');
		});
	}
})();


// Page fade transitions between internal links
(function () {
    document.addEventListener('DOMContentLoaded', () => {
        document.body.classList.add('is-loaded');
    });

    function isInternalLink(anchor) {
        if (!anchor || anchor.target === '_blank') return false;
        const url = new URL(anchor.href, location.href);
        return url.origin === location.origin && !url.hash && !anchor.hasAttribute('download') && !anchor.getAttribute('rel');
    }

    document.addEventListener('click', (e) => {
        const anchor = e.target.closest('a');
        if (!anchor || !isInternalLink(anchor)) return;
        e.preventDefault();
        document.body.classList.add('is-leaving');
        const href = anchor.getAttribute('href');
        setTimeout(() => { window.location.href = href; }, 180);
    });
})();


