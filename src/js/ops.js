const section = $("section");
const display = $(".wrapper__main");
const sideMenu = $(".fixed-menu");
const menuItems = sideMenu.find(".fixed-menu__item");

const mobileDetect = new MobileDetect(window.navigator.userAgent);
const isMobile = mobileDetect.mobile();

let inScroll = false;

section.first().addClass("active");

const countSectionPosition = (sectionEq) => {
  const position = sectionEq * -100;

  if (isNaN(position)) {
    console.error("передано не верное значение в countSectionPosition");
    return 0;
  }

  return position;
};

const performTransition = sectionEq => {
  if(inScroll == false) {
      inScroll = true;
      const position = countSectionPosition(sectionEq);
      
      display.css({
          transform: `translateY(${position}%)`
      });
      
      section.eq(sectionEq).addClass("active").siblings().removeClass("active");
      
      setTimeout(() => {
          inScroll = false;
  
          sideMenu
          .find(".fixed-menu__item")
          .eq(sectionEq)
          .addClass("fixed-menu__item--active")
          .siblings()
          .removeClass("fixed-menu__item--active");
      }, 1300);
  }
  };

const viewportScroller = () => {
  const activeSection = section.filter(".active")
  const nextSection = activeSection.next();
  const prevSection = activeSection.prev();

  return {
    next() {
      if (nextSection.length) {
        performTransition(nextSection.index());
      }
    },
    prev() {
      if (prevSection.length) {
        performTransition(prevSection.index());
      }
    },
  };
};

$(window).on("wheel", e => {
  const deltaY = e.originalEvent.deltaY;
  const scroller = viewportScroller();

  if (deltaY > 0) {
    scroller.next();
  }
  
  if (deltaY < 0) {
    scroller.prev();
  }
});

$(window).on("keydown", e => {
  const tagName = e.target.tagName.toLowerCase();
  const userTypingInInputs = tagName == "input" || tagName == "textarea";
  const scroller = viewportScroller();

  if (userTypingInInputs) return;

  switch (e.keyCode) {
    case 38:
      scroller.prev();
      break;
      
    case 40:
      scroller.next();    
      break;
  }
});

$(".wrapper").on("touchmove", e => e.preventDefault());

$("[data-scroll-to]").click(e => {
  e.preventDefault();
  
  const $this = $(e.currentTarget);
  const target = $this.attr("data-scroll-to");
  const reqSection = $(`[data-section-id=${target}]`);

  performTransition(reqSection.index());
});

if (isMobile) {
  // https://github.com/mattbryson/TouchSwipe-Jquery-Plugin
  $("body").swipe({
    swipe: function (event, direction) {
      const scroller = viewportScroller();
      let scrollDirection = "";
      
      if (direction == "up") scrollDirection = "next";
      if (direction == "down") scrollDirection = "prev";
      
      scroller[scrollDirection]();
    },
  });
};