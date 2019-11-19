class VegeItem {
  constructor() {
    this.vegeName = '';
    this.vegeQuantity = 0;
    this.vegePrice = 0;
  }
}

let usertype = '';

function checkUserType() {
  usertype = $('input[name=usertype]:checked').val();

  if (usertype === 'farmer') {
    $('.vegetable').show();
  } else {
    $('.vegetable').hide();
  }
}

function getItems(arr) {
  const itemLength = $('.vegetable').children('.vegetable__item').length;

  // TODO: 判斷 type=number 的輸入是否為整數
  for (let i = 0; i < itemLength; i += 1) {
    item = new VegeItem();
    item.vegeName = $('.vegetable .vegetable__item').eq(i).children('input[name=vegeName]').val();
    item.vegeQuantity = parseInt($('.vegetable .vegetable__item').eq(i).children('span').children('input[name=vegeQuantity]')
      .val(), 10);
    item.vegePrice = parseInt($('.vegetable .vegetable__item').eq(i).children('span').children('input[name=vegePrice]')
      .val(), 10);

    arr.push(item);
  }
}

$(document).ready(() => {
  checkUserType();
});

$('input[name=usertype]').click(() => {
  checkUserType();
});

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
  const count = $('.vegetable').children('.vegetable__item').length;
  if (count === 1) {
    alert('Please Enter At Least One Kind of Vegetable.');
  } else {
    $(this).parent().parent().remove();
  }
});

$('#register').click(() => {
  const newUser = {
    platform: 'web',
    name: $('#name').val(),
    username: $('#username').val(),
    password: $('#userpassword').val(),
    email: $('#useremail').val(),
    address: $('#useraddress').val(),
    cellphone: $('#userphone').val(),
    identity: 0,
    items: []
  };

  if (usertype === 'restaurant') {
    newUser.identity = 1;
  } else if (usertype === 'farmer') {
    newUser.identity = 2;
    getItems(newUser.items);
  }

  // $.ajax({
  //   type: 'post',
  //   url: 'https://recycle.likey.com.tw/api/users',
  //   contentType: 'application/json',
  //   proccessData: false,
  //   data: JSON.stringify(newUser),
  //   success() {
  //     alert('Success!');
  //     window.location = 'https://recycle.likey.com.tw/foodprints/index.html';
  //   },
  //   error() {
  //     alert('Failed!');
  //   }
  // });
});