(function() {
    document.addEventListener('DOMContentLoaded', function() {
        var mainNav = document.querySelector('.main-nav');
        var toggleBtn = document.querySelector('.main-nav__toggle');

        toggleBtn.addEventListener('click', function() {
            mainNav.classList.toggle('main-nav--open');
        });
    });
})();
