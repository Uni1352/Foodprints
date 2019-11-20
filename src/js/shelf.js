class VegeItem {
  constructor() {
    this.vegeName = '';
    this.vegeQuantity = 0;
    this.vegePrice = 0;
  }
}

function getVege(vege) {
  const itemLength = $('.vegetable').children('.vegetable__item').length;

  // TODO: 判斷 type=number 的輸入是否為整數
  for (let i = 0; i < itemLength; i += 1) {
    item = new VegeItem();
    item.vegeName = $('.vegetable .vegetable__item').eq(i).children('input[name=vegeName]').val();
    item.vegeQuantity = parseInt($('.vegetable .vegetable__item').eq(i).children('span').children('input[name=vegeQuantity]')
      .val(), 10);
    item.vegePrice = parseInt($('.vegetable .vegetable__item').eq(i).children('span').children('input[name=vegePrice]')
      .val(), 10);

    vege.push(item);
  }
}

$('.vegetable>:last-child').click(() => {
  $('.vegetable>:last-child').before(`<div class="vegetable__item">
            <input type="text" name="vegeName" placeholder="蔬果名稱">
            <span>
              <input type="number" name="vegeQuantity" min="0" placeholder="數量">
              公斤
            </span>
            <span>
              <input type="number" name="vegePrice" min="0" placeholder="單價">
              元/公斤
            </span>
            <span style="align-self: center;">
              <div class="btn--icon delete"><i class="fas fa-times"></i></div>
            </span>
          </div>`);
});

$('.vegetable').on('click', '.delete', function () {
  $(this).parent().parent().remove();
});

$('#shelf').click(() => {
  const vegeOnShelf = [];

  getVege(vegeOnShelf);
  console.log(vegeOnShelf);
  // $.ajax({
  //   type: 'put',
  //   url: 'https://recycle.likey.com.tw/api/drivers',
  //   contentType: 'application/json',
  //   proccessData: false,
  //   data: JSON.stringify(vegeOnShelf),
  //   success(res) {
  //     alert(res.message);
  //     window.location = 'https://recycle.likey.com.tw/foodprints/src/pages/member.html';
  //   },
  //   error() {
  //     alert('Update Failed!');
  //   }
  // });
});