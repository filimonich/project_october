const slider = $(".slider").bxSlider({
  pager: false,
  controls: false,
});

$(".slider-control__icon--direction--prev").on("click", (e) => {
  e.preventDefault();
  slider.goToPrevSlide();
});

$(".slider-control__icon--direction--next").on("click", (e) => {
  e.preventDefault();
  slider.goToNextSlide();
});
