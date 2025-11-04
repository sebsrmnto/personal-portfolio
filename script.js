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
	const storageKey = 'theme-preference';

	function getPreferred() {
		const stored = localStorage.getItem(storageKey);
		if (stored === 'light' || stored === 'dark') return stored;
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	function applyTheme(theme) {
		if (theme === 'dark') {
			root.setAttribute('data-theme', 'dark');
			if (toggle) toggle.setAttribute('aria-pressed', 'true');
		} else {
			root.removeAttribute('data-theme');
			if (toggle) toggle.setAttribute('aria-pressed', 'false');
		}
	}

	const current = getPreferred();
	applyTheme(current);

	if (toggle) {
		toggle.addEventListener('click', () => {
			const newTheme = (root.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
			localStorage.setItem(storageKey, newTheme);
			applyTheme(newTheme);
		});
	}

	// React to OS theme changes if user hasn't explicitly chosen
	if (window.matchMedia) {
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			const stored = localStorage.getItem(storageKey);
			if (!stored) applyTheme(e.matches ? 'dark' : 'light');
		});
	}
})();


