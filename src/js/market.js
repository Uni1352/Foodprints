class OrderItem {
  constructor() {
    this.foodName = '';
    this.farmerName = '';
    this.foodQuantity = 0;
    this.foodPrice = 0;
    this.cost = 0;
    this.date = '';
  }
}

const item = {
  name: '',
  farmer: '',
  quantity: 0,
  price: 0,
  total: 0
};
let userdata = {};
let farmers = {};
let orders = [];
let orderIndex = 0;

function getCookie(cname) {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return '';
}

function getUserData(idnum) {
  $.get(`https://graduation.jj97181818.me/api/users/${idnum}`)
    .done((res) => res)
    .fail(() => {
      alert('Failed to get user data.');
    });
}

function getFarmersData() {
  $.get('https://graduation.jj97181818.me/api/farmers')
    .done((res) => res);
}

function appendTableDataAboutVegetable(vege) {
  $.each(farmers, (index, element) => {
    if (element.vegetables.foodName === vege) {
      $('#positionselect>table').children('tbody').append(`<tr>
        <td>${element.name}</td>
        <td>${element.address}</td>
        <td>${element.vegetables.vegeQuantity}</td>
        <td>${element.vegetables.vegePrice}</td>
        <td><button class="btn--icon"><i class="fas fa-plus"></i></button></td>
      </tr>`);
    }
  });
}

// 上傳訂購物件
function postOrders(order) {
  $.each(order, (index, element) => {
    const data = {
      userID: parseInt(getCookie('userID'), 10),
      status: 0,
      profit: element.cost,
      orderDate: element.date,
      address: userdata.address,
      items: {
        foodName: element.foodName,
        farmer: element.farmerName,
        foodQuantity: element.foodQuantity,
        foodPrice: element.foodPrice
      }
    };

    $.ajax({
      type: 'post',
      url: 'https://graduation.jj97181818.me/api/orders',
      contentType: 'application/json',
      proccessData: false,
      data: JSON.stringify(data),
      error() {
        alert('Failed to post orders.');
      }
    });
  });
}

$(document).ready(() => {
  const userID = getCookie('userID');

  userdata = getUserData(userID);
  farmers = getFarmersData();

  $('#positionselect').hide();
  $('#ordercomfirm').hide();
});

// 選擇要購買的蔬果
$('.card__item').click(function () {
  item.name = $(this).children('h3').text();
  appendTableDataAboutVegetable(item.name);

  $('#foodselect').hide();
  $('#positionselect').fadeIn(500);
});

// 選擇店家
$('#positionselect').on('click', '.btn--icon', function () {
  const index = $('.btn--icon').index($(this));

  // 取得 table 資料
  item.farmerName = $('tbody').children().eq(index).children()
    .eq(0)
    .text();
  item.quantity = parseInt($('tbody').children().eq(index).children()
    .eq(2)
    .text(), 10);
  item.price = parseInt($('tbody').children().eq(index).children()
    .eq(3)
    .text(), 10);

  // 彈出詢問視窗
  $('.addItems').children().eq(0).children()
    .text(item.name);
  for (let i = 1; i <= item.quantity; i += 1) {
    $('<option>').text(i).appendTo('select');
  }
  $('.addItems').fadeIn(100);
});

// 新增到購物車
$('.addItems').on('click', 'button', function () {
  const index = $('.addItems button').index($(this));
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

  if (index === 1) {
    // 取得選取的蔬果數量
    item.quantity = parseInt($('select :selected').text(), 10);
    item.total = item.price * item.quantity;

    // 新增 OrderItem 物件
    orders.push(new OrderItem());
    orders[orderIndex].foodName = item.name;
    orders[orderIndex].farmerName = item.farmer;
    orders[orderIndex].foodQuantity = item.quantity;
    orders[orderIndex].foodPrice = item.price;
    orders[orderIndex].cost = item.total;
    orders[orderIndex].date = date.join('-');

    // 放進購物車
    $('.shoppingcart__list').append(
      `<div class="shoppingcart__listitem">  
        <div style="display:flex;justify-content:space-between;align-items: center;"> 
          <button class="btn--icon delete"><i class="fas fa-times"></i></button>&nbsp;&nbsp;                     
          <p><span>${orders[orderIndex].foodName}</span></p>
        </div>
        <p><span>${orders[orderIndex].foodQuantity}</span>&nbsp;kg</p>
        <p><span>${orders[orderIndex].cost}</span>&nbsp;元</p>              
      </div>`
    );
    orderIndex += 1;
  }

  $('.addItems').fadeOut(100);
});

// 刪除購物車內的訂單
$('.shoppingcart__list').on('click', '.delete', function () {
  const index = $(this).parent().parent().index();

  $(this).parent().parent().remove();
  orders.splice(index, 1);
  orderIndex -= 1;
});

// 購物車按鈕
$('.shoppingcart__button').on('click', () => {
  $('.shoppingcart__list').toggle();
});

// FIXME: 前往確認結帳畫面
$('#positionselect').on('click', '.btn', function () {
  const index = $('.btn').index($(this));
  let totalCost = 0;

  $('#positionselect').hide();
  switch (index) {
    case 1:
      $('#foodselect').fadeIn(500);
      break;
    case 2:
      $('.shoppingcart__button').hide();
      $('#ordercomfirm').fadeIn(500);
      // 放進確認結帳畫面
      for (let i = 0; i < orders.length; i += 1) {
        $('#ordercomfirm tbody').append(
          `<tr>
              <td>${orders[i].foodName}</td>
              <td>${orders[i].farmerName}</td>
              <td>${orders[i].foodQuantity}</td>
              <td>${orders[i].foodPrice}</td>
            </tr>`
        );

        // 計算總金額
        totalCost += orders[i].foodPrice;
      }
      $('#totalCost').text(totalCost);
      console.log(orders);
      break;
    default:
      break;
  }
});

$('#ordercomfirm').on('click', '.btn', function () {
  const index = $('.btn').index($(this));

  if (index === 4) {
    postOrders(orders);
    alert('訂購成功!!!');
  }

  // 歸零
  orderIndex = 0;
  orders = [];
  $('.shoppingcart__list').empty();
  $('#ordercomfirm tbody').empty();

  $('#ordercomfirm').hide();
  $('#foodselect').show();
  $('.shoppingcart__button').show();
});