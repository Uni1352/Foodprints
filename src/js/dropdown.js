$(document).ready(() => {
  $('.order').hide();
  $('.order__item').children('div:nth-child(2)').hide();
});

$('.list__item>.dropdown').click(function () {
  const index = $(this).index();
  $(this).siblings('.order').toggle();
  console.log(index);
});

$('.order__item').click(function () {
  const index = $(this).index();
  $(this).children('div:nth-child(2)').toggle();
  console.log(index);
});