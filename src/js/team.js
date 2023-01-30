const openItem1 = (item) => {
  const container = item.closest(".team__item");
  const contentBlock = container.find(".team__content");
  const textBlock = contentBlock.find(".team__content-block");
  const reqHeight = textBlock.height();

  container.addClass("team__content--active");
  contentBlock.height(reqHeight);
};

const closeEveryItem = (container) => {
  const item = container.find(".team__content");
  const itemContainer = container.find(".team__item");

  itemContainer.removeClass("team__content--active");
  item.height(0);
};

$(".team__title").on("click", (e) => {
  const $this = $(e.currentTarget);
  const container = $this.closest(".team");
  const elemContainer = $this.closest(".team__item");

  if (elemContainer.hasClass("team__content--active")) {
    closeEveryItem(container);
  } else {
    closeEveryItem(container);
    openItem1($this);
  }
});
