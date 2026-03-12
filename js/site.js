document.addEventListener('DOMContentLoaded', function () {
  var mobileMenuQuery = window.matchMedia('(max-width: 980px)');
  var header = document.querySelector('header');
  var headerWrapper = header ? header.querySelector('.wrapper') : null;
  var nav = header ? header.querySelector('nav') : null;
  var submenuItems = Array.from(document.querySelectorAll('header nav > ul > li'));
  var menuToggle = null;

  if (header && headerWrapper && nav) {
    if (!nav.id) nav.id = 'site-navigation';

    menuToggle = document.createElement('button');
    menuToggle.type = 'button';
    menuToggle.className = 'menu-toggle';
    menuToggle.setAttribute('aria-controls', nav.id);
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Abrir menu');
    menuToggle.innerHTML = '<span></span><span></span><span></span>';

    headerWrapper.insertBefore(menuToggle, nav);

    menuToggle.addEventListener('click', function () {
      if (!mobileMenuQuery.matches) return;

      var isOpen = header.classList.toggle('menu-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });
  }

  submenuItems.forEach(function (item) {
    var trigger = item.querySelector(':scope > a');
    var submenu = item.querySelector(':scope > ul');

    if (!trigger || !submenu) return;

    item.classList.add('has-submenu');
    trigger.setAttribute('aria-expanded', 'false');

    trigger.addEventListener('click', function (event) {
      if (!mobileMenuQuery.matches) return;

      var isOpen = item.classList.contains('is-open');
      event.preventDefault();

      submenuItems.forEach(function (otherItem) {
        if (otherItem !== item) {
          otherItem.classList.remove('is-open');
          var otherTrigger = otherItem.querySelector(':scope > a');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('is-open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  function closeResponsiveMenu() {
    submenuItems.forEach(function (item) {
      item.classList.remove('is-open');
      var trigger = item.querySelector(':scope > a');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });

    if (header) header.classList.remove('menu-open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
    }
  }

  function syncMenuState() {
    if (!mobileMenuQuery.matches) {
      closeResponsiveMenu();
    }
  }

  if (typeof mobileMenuQuery.addEventListener === 'function') {
    mobileMenuQuery.addEventListener('change', syncMenuState);
  } else if (typeof mobileMenuQuery.addListener === 'function') {
    mobileMenuQuery.addListener(syncMenuState);
  }

  if (nav) {
    nav.addEventListener('click', function (event) {
      if (!mobileMenuQuery.matches) return;

      var link = event.target.closest('a');
      if (!link) return;
      if (link.nextElementSibling && link.nextElementSibling.tagName === 'UL') return;

      closeResponsiveMenu();
    });
  }

  syncMenuState();
});
