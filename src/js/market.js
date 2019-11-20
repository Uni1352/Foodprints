// TODO: 取得小農資料，動態新增 table 內的資料
// TODO: 一個訂單一個品項

class orderItem {
  constructor() {
    this.foodName = '';
    this.farmer = '';
    this.foodQuantity = 0;
    this.foodPrice = 0;
  }
}

const order = {
  items: [],
  cost: 0,
  date: ''
};
let orderIndex = 0;

function market() {
  $('.card__item').click(function () {
    orderItem.foodName = $(this).children('h3').text();

    $('#foodselect').hide();
    $('#positionselect').fadeIn(500);
  });

  $('#positionselect').on('click', '.btn--icon', function () {
    const index = $('.btn--icon').index($(this));

    // 取得 table 資料
    orderItem.farmer = $('tbody').children().eq(index).children()
      .eq(0)
      .text();
    orderItem.foodQuantity = parseInt($('tbody').children().eq(index).children()
      .eq(2)
      .text(), 10);
    orderItem.foodPrice = parseInt($('tbody').children().eq(index).children()
      .eq(3)
      .text(), 10);

    // 彈出詢問視窗
    $('.addItems').children().eq(0).children()
      .text(orderItem.foodName);
    for (let i = 1; i <= orderItem.foodQuantity; i += 1) {
      $('<option>').text(i).appendTo('select');
    }
    $('.addItems').fadeIn(100);
  });

  // 新增到購物車
  $('.addItems').on('click', 'button', function () {
    const index = $('.addItems button').index($(this));

    if (index === 1) {
      // 取得選取的蔬果數量
      orderItem.foodQuantity = parseInt($('select :selected').text(), 10);
      orderItem.foodPrice *= orderItem.foodQuantity;

      // 新增 order 物件
      order.items.push(orderItem);
      console.log(order.items);

      // 放進購物車
      $('.shoppingcart__list').append(
        `<div class="shoppingcart__listitem">  
        <div style="display:flex;justify-content:space-between;align-items: center;"> 
          <button class="btn--icon delete"><i class="fas fa-times"></i></button>&nbsp;&nbsp;                     
          <p><span>${order.items[orderIndex].foodName}</span></p>
        </div>
        <p><span>${order.items[orderIndex].foodQuantity}</span>&nbsp;kg</p>
        <p><span>${order.items[orderIndex].foodPrice}</span>&nbsp;元</p>              
      </div>`
      );
    }
    orderIndex += 1;

    $('.addItems').fadeOut(100);
  });

  $('.shoppingcart__list').on('click', '.delete', function () {
    const index = $(this).parent().parent().index();

    $(this).parent().parent().remove();
    order.items.splice(index, 1);
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
        order.items.forEach((element) => {
          $('#ordercomfirm tbody').append(
            `<tr>  
              <td>${element.foodName}</td>
              <td>${element.farmer}</td>
              <td>${element.foodQuantity}</td>
              <td>${element.foodPrice}</td>               
            </tr>`
          );

          // 計算總金額
          order.cost += element.foodPrice;
        });
        $('#totalCost').text(order.cost);
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
      alert('訂購成功!!!');
      order.date = '-'.join(date);

      console.log(order);
    }

    // 歸零
    orderIndex = 0;
    order.items = [];
    order.cost = 0;
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
}

$(document).ready(() => {
  $('#positionselect').hide();
  $('#ordercomfirm').hide();
  market();
});