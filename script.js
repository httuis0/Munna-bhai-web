// ---------- Mobile nav toggle ----------
(function () {
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('mainNav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
})();

// ---------- Full Menu page: category chips + search ----------
(function () {
  var categoryNav = document.getElementById('categoryNav');
  var searchInput = document.getElementById('menuSearch');
  if (!categoryNav && !searchInput) return; // not the menu page

  var categories = Array.prototype.slice.call(document.querySelectorAll('.menu-category'));
  var chips = categoryNav ? Array.prototype.slice.call(categoryNav.querySelectorAll('button')) : [];
  var noResults = document.getElementById('noResults');

  // Click a chip: smooth scroll to that category and mark active
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      var target = document.getElementById(chip.dataset.target);
      if (target) {
        var offset = 150;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // Highlight the chip for whichever category is in view
  if ('IntersectionObserver' in window && categories.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          chips.forEach(function (c) {
            c.classList.toggle('active', c.dataset.target === entry.target.id);
          });
        }
      });
    }, { rootMargin: '-160px 0px -70% 0px', threshold: 0 });
    categories.forEach(function (cat) { observer.observe(cat); });
  }

  // Search filter across item names/notes
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      var q = searchInput.value.trim().toLowerCase();
      var anyVisible = false;

      categories.forEach(function (cat) {
        var items = Array.prototype.slice.call(cat.querySelectorAll('.menu-item'));
        var catHasVisible = false;

        items.forEach(function (item) {
          var text = item.textContent.toLowerCase();
          var match = q === '' || text.indexOf(q) !== -1;
          item.classList.toggle('hidden', !match);
          if (match) catHasVisible = true;
        });

        cat.classList.toggle('hidden', !catHasVisible);
        if (catHasVisible) anyVisible = true;
      });

      if (noResults) noResults.classList.toggle('visible', !anyVisible);
    });
  }
})();
