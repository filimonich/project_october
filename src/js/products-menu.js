function Accordeon(selector) {
  const acco = document.querySelector(selector);
  const items = acco.querySelector('[accordeon-list]').children;

  acco.addEventListener('click', function(e) {
      e.preventDefault();
      const target = e.target.closest('[accordeon-trigger]');

      if (!target) return;
      
      const item = target.parentNode;

      if (item.classList.contains('products-active')) {
          item.classList.remove('products-active');
      } else {
          for (let i = 0; i < items.length; i++) {
              items[i].classList.remove('products-active');
          };

          item.classList.add('products-active');
      }
  });
}

// $(".").on("click", e => {
//   e.preventDefault();
//   $('.products-menu__item').removeClass('products-active');
// })

new Accordeon('#products-m');