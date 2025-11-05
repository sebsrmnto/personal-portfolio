// Active nav highlighting based on visible section
(function () {
    const sectionIds = ["home", "about", "projects", "skills", "contact"];
    const links = Array.from(document.querySelectorAll('header nav a'));
    const idToLink = new Map(links.map(a => [a.getAttribute('href')?.replace('#',''), a]));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const link = idToLink.get(id);
            if (!link) return;
            if (entry.isIntersecting) {
                links.forEach(l => { l.classList.remove('is-active'); l.removeAttribute('aria-current'); });
                link.classList.add('is-active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }, { threshold: 0.6 });

    sectionIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
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


// (removed) page fade transitions


// Section reveal animations
(function () {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sections = Array.from(document.querySelectorAll('main section'));
    if (prefersReduced || sections.length === 0) return;

    sections.forEach(sec => sec.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    sections.forEach(sec => observer.observe(sec));
})();

