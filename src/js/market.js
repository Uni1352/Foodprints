/* eslint-disable no-undef */
class Food {
  constructor() {
    this.name = '';
    this.quantity = 0;
    this.price = 0;
    this.carbon = 0;
  }
}

let order = [];
let list = ['', 0, 0, 0];
let id = 0;
let totalCost = 0;
let totalCarbon = 0;

function marketInit() {
  $('#positionselect').hide();
  $('#ordercomfirm').hide();
}

$(document).ready(marketInit);

// foodselect
$('#foodselect').on('click', '.card__item', function () {
  list[0] = $(this).children('h3').text();

  $('#foodselect').hide();
  $('#positionselect').fadeIn(500);
});

// positionselect
$('#positionselect').on('click', '.btn--icon', function () {
  const index = $('.add').index($(this));

  // 取得 table 資料
  list[1] = $('tbody').children().eq(index).children()
    .eq(1)
    .text();
  list[2] = parseInt($('tbody').children().eq(index).children()
    .eq(2)
    .text(), 10);
  list[3] = parseInt($('tbody').children().eq(index).children()
    .eq(4)
    .text(), 10);

  // 彈出詢問視窗
  $('.addItems').children().eq(0).children()
    .text(list[0]);
  for (let i = 1; i <= list[1]; i += 1) {
    $('<option>').text(i).appendTo('select');
  }
  $('.addItems').fadeIn(100);
});

// 新增到購物車
$('.addItems').on('click', 'button', function () {
  const index = $('.addItems button').index($(this));

  if (index === 1) {
    // 取得選取的蔬果數量
    list[1] = parseInt($('select :selected').text(), 10);

    // 新增 order 物件
    order.push(new Food());
    order[id].name = list[0];
    order[id].quantity = list[1];
    order[id].price = list[2] * list[1];
    order[id].carbon = list[3];

    // 放進購物車
    $('.shoppingcart__list').append(
      `<div class="shoppingcart__listitem">  
                <div style="display:flex;justify-content:space-between;align-items: center;">              
                    <button class="delete"><i class="fas fa-times"></i></button>&nbsp;&nbsp;                     
                    <p><span>${order[id].name}</span></p>
                </div>
                <p><span>${order[id].quantity}</span>&nbsp;kg</p>
                <p><span>${order[id].price}</span>&nbsp;元</p>              
            </div>`
    );
  }
  id += 1;

  $('.addItems').fadeOut(100);
});

// 刪除列表物件
$('.shoppingcart__list').on('click', '.delete', function () {
  const index = $('.shoppingcart__list .shoppingcart__listitem').index($(this).parent().parent());
  $(this).parent().parent().remove();
  order.splice(index, 1);
});

$('#positionselect').on('click', '.btn', function () {
  const index = $('.btn').index($(this));
  $('#positionselect').hide();

  switch (index) {
    case 0:
      $('#foodselect').fadeIn(500);
      break;
    case 1:
      $('.shoppingcart__button').hide();
      $('#ordercomfirm').fadeIn(500);
      // 放進確認結帳畫面
      order.forEach((item) => {
        $('#ordercomfirm tbody').append(
          `<tr>  
              <td>${item.name}</td>
              <td>${item.quantity}</td>
              <td>${item.price}</td>               
            </tr>`
        );
      });

      // 計算總金額
      for (let i = 0; i < order.length; i += 1) {
        totalCost += order[i].price;
      }
      $('#totalCost').text(totalCost);

      // 計算總碳足跡
      for (let j = 0; j < order.length; j += 1) {
        totalCarbon += order[j].carbon;
      }
      $('#totalCO2').text(totalCarbon);
      break;
    default:
      break;
  }
});

$('#ordercomfirm').on('click', '.btn', function () {
  const index = $('.btn').index($(this));
  const now = new Date();
  const date = [
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
  ];
  if (now.getMonth() + 1 < 10) {
    date[1] = `0 + ${(now.getMonth() + 1)}`;
  }
  if (now.getDate() + 1 < 10) {
    date[2] = `0 + ${now.getDate()}`;
  }

  if (index === 3) {
    // alert
    alert('訂購成功!!!');
  }

  // 歸零
  id = 0;
  order = [];
  totalCarbon = 0;
  list = ['', 0, 0, 0];
  $('.shoppingcart__list').empty();
  $('#ordercomfirm tbody').empty();

  $('#ordercomfirm').hide();
  $('#foodselect').show();
  $('.shoppingcart__button').show();
});

// 購物車按鈕
$('.shoppingcart__button').on('click', () => {
  $('.shoppingcart__list').toggle();
});