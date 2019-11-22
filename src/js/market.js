class OrderItem {
  constructor() {
    this.vegeName = '';
    this.farmerName = '';
    this.farmerID = 0;
    this.vegeQuantity = 0;
    this.vegePrice = 0;
    this.profit = 0;
    this.orderDate = '';
  }
}

const item = {
  name: '',
  farmer: '',
  farmerID: 0,
  quantity: 0,
  price: 0,
  total: 0
};
const farmers = [];
const farmersID = [];
let userAddress = '';
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

function getUserData(id) {
  $.get(`https://graduation.jj97181818.me/api/users/${id}`)
    .done((res) => {
      userAddress = res.address;
    })
    .fail(() => {
      alert('Failed to get user data.');
    });
}

function getFarmersData() {
  $.get('https://graduation.jj97181818.me/api/farmers')
    .done((res) => {
      $.each(res, (index, element) => {
        farmers.push(element);
      });
    });
}

// 上傳訂購物件
function postOrders(list) {
  // FIXME: 地址經緯度
  $.each(list, (index, element) => {
    const order = {
      userID: parseInt(getCookie('userID'), 10),
      status: 0,
      profit: element.profit,
      orderDate: element.orderDate,
      address: userAddress,
      location: {
        latitude: '',
        longtitude: ''
      },
      items: {
        foodName: element.vegeName,
        farmerID: element.farmerID,
        foodQuantity: element.vegeQuantity,
        foodPrice: element.vegePrice
      }
    };

    console.log(order);
    $.ajax({
      type: 'post',
      url: 'https://graduation.jj97181818.me/api/orders',
      contentType: 'application/json',
      proccessData: false,
      data: JSON.stringify(order),
      error() {
        alert('Failed to post order.');
      }
    });
  });
}

// Step 0: initial
$(document).ready(() => {
  const userID = getCookie('userID');

  getUserData(userID);
  getFarmersData();

  $('#positionselect').hide();
  $('#ordercomfirm').hide();
});

// Step 1: 選擇要購買的蔬果
$('.card__item').click(function () {
  item.name = $(this).children('h3').text();

  // 擁有該蔬果的店家列表
  $.each(farmers, (index, element) => {
    $.each(element.vegetables, (indexValue, vegeItem) => {
      if (vegeItem.vegeName === item.name) {
        $('#positionselect>table').children('tbody').append(`<tr>
          <td>${element.name}</td>
          <td>${element.address}</td>
          <td>${vegeItem.vegeQuantity}</td>
          <td>${vegeItem.vegePrice}</td>
          <td><button class="btn--icon add"><i class="fas fa-plus"></i></button></td>
        </tr>`);
        farmersID.push(element.id);
      }
    });
  });

  $('#foodselect').hide();
  $('#positionselect').fadeIn(500);
});

// Step 2: 新增訂購蔬果資料
$('#positionselect').on('click', '.add', function () {
  const index = $('.add').index($(this));

  // get table data
  item.farmer = $('tbody').children().eq(index).children()
    .eq(0)
    .text();
  item.quantity = parseInt($('tbody').children().eq(index).children()
    .eq(2)
    .text(), 10);
  item.price = parseInt($('tbody').children().eq(index).children()
    .eq(3)
    .text(), 10);
  item.farmerID = farmersID[index];

  // 彈出詢問視窗
  $('.addItems ').children().eq(0).children()
    .text(item.name);
  for (let i = 1; i <= item.quantity; i += 1) {
    $('<option>').text(i).appendTo('select');
  }
  $('.addItems ').fadeIn(100);
});

// Step 3: 新增到購物車
$('.addItems').on('click', 'button', function () {
  const index = $('.addItems button').index($(this));

  if (index === 1) {
    // 取得選取的蔬果數量
    item.quantity = parseInt($('select :selected').text(), 10);
    item.total = item.price * item.quantity;

    // 新增 OrderItem 物件
    orders.push(new OrderItem());
    orders[orderIndex].vegeName = item.name;
    orders[orderIndex].farmerName = item.farmer;
    orders[orderIndex].farmerID = item.farmerID;
    orders[orderIndex].vegeQuantity = item.quantity;
    orders[orderIndex].vegePrice = item.price;
    orders[orderIndex].profit = item.total;
    orders[orderIndex].orderDate = new Date();

    // 放進購物車
    $('.shoppingcart__list').append(
      `<div class="shoppingcart__listitem">  
        <div style="display:flex;justify-content:space-between;align-items: center;"> 
          <button class="btn--icon delete"><i class="fas fa-times"></i></button>&nbsp;&nbsp;                     
          <p><span>${orders[orderIndex].vegeName}</span></p>
        </div>
        <p><span>${orders[orderIndex].vegeQuantity}</span>&nbsp;kg</p>
        <p><span>${orders[orderIndex].profit}</span>&nbsp;元</p>              
      </div>`
    );
    orderIndex += 1;
  }

  $('.addItems').fadeOut(100);
});

// Step 4: 刪除購物車內的訂單
$('.shoppingcart__list').on('click', '.delete', function () {
  const index = $(this).parent().parent().index();

  $(this).parent().parent().remove();
  orders.splice(index, 1);
  orderIndex -= 1;
});

// Step 5: 前往確認結帳畫面
$('#positionselect').on('click', '.btn', function () {
  const index = $('.btn').index($(this));
  let totalCost = 0;

  $('#positionselect').hide();
  switch (index) {
    case 1:
      $('#foodselect').fadeIn(500);
      $('#positionselect tbody').empty();
      break;
    case 2:
      $('.shoppingcart__button').hide();
      $('#ordercomfirm').fadeIn(500);
      // 放進確認結帳畫面
      for (let i = 0; i < orders.length; i += 1) {
        $('#ordercomfirm tbody').append(
          `<tr>
              <td>${orders[i].vegeName}</td>
              <td>${orders[i].farmerName}</td>
              <td>${orders[i].vegeQuantity}</td>
              <td>${orders[i].profit}</td>
            </tr>`
        );

        // 計算總金額
        totalCost += orders[i].profit;
      }
      $('#totalCost').text(totalCost);

      break;
    default:
      break;
  }
});

// Step 6: 確認結帳
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
  $('#positionselect tbody').empty();
  $('#ordercomfirm tbody').empty();

  $('#ordercomfirm').hide();
  $('#foodselect').show();
  $('.shoppingcart__button').show();
});


// 購物車按鈕
$('.shoppingcart__button').on('click', () => {
  $('.shoppingcart__list').toggle();
});