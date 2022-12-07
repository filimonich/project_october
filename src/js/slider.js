const slider = $('.slider').bxSlider({
  pager: false,
  controls: false
})

$('.slider-control__icon--direction--prev').click(e => {
  e.preventDefault();
  slider.goToPrevSlide();
})

$('.slider-control__icon--direction--next').click(e => {
  e.preventDefault();
  slider.goToNextSlide();
});