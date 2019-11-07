$(document).ready(() => {
  $('.order').hide();
  $('.order__item').children('div:nth-child(2)').hide();
});

$('.list__item>.dropdown').click(function () {
  $(this).siblings('.order').toggle();
});

$('.order__item').click(function () {
  $(this).children('div:nth-child(2)').toggle();
});