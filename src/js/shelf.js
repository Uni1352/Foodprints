class VegeItem {
  constructor() {
    this.vegeName = '';
    this.vegeQuantity = 0;
    this.vegePrice = 0;
  }
}

const oldVeges = [];
const newVeges = [];
let numOfVegesOnShelf = 0;

function getCookie(cname) {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return '';
}

const farmerID = getCookie('userID');

// 修改架上蔬果資料
function putVegesOnShelf(veges, index) {
  $.ajax({
    type: 'put',
    url: `https://graduation.jj97181818.me/api/items/${index}`,
    contentType: 'application/json',
    proccessData: false,
    data: JSON.stringify(veges),
    error() {
      alert('Failed to modify items.');
    }
  });
}

// 新增新的蔬果資料
function postVegesOnShelf(veges) {
  $.ajax({
    type: 'post',
    url: 'https://graduation.jj97181818.me/api/items',
    contentType: 'application/json',
    proccessData: false,
    data: JSON.stringify(veges),
    error() {
      alert('Failed to post items.');
    }
  });
}

function appendVegesHasBeOnSelf(veges) {
  for (let i = 0; i < numOfVegesOnShelf; i += 1) {
    $('.vegetable>:last-child').before(`<div class="vegetable__item">
            <input type="text" name="vegeName" placeholder="蔬果名稱" value="${veges[i].vegeName}">
            <span>
              <input type="number" name="vegeQuantity" min="0" placeholder="數量" value="${veges[i].vegeQuantity}">
              公斤
            </span>
            <span>
              <input type="number" name="vegePrice" min="0" placeholder="單價" value="${veges[i].vegePrice}">
              元/公斤
            </span>
            <span style="align-self: center;">
              <div class="btn--icon delete"><i class="fas fa-times"></i></div>
            </span>
          </div>`);
  }
}

function addNewVeges(veges, length) {
  // TODO: 判斷 type=number 的輸入是否為整數
  for (let i = 0; i < length; i += 1) {
    if (i < numOfVegesOnShelf) {
      oldVeges[i].vegeName = $('.vegetable .vegetable__item').eq(i).children('input[name=vegeName]').val();
      oldVeges[i].vegeQuantity = parseInt($('.vegetable .vegetable__item').eq(i).children('span').children('input[name=vegeQuantity]')
        .val(), 10);
      oldVeges[i].vegePrice = parseInt($('.vegetable .vegetable__item').eq(i).children('span').children('input[name=vegePrice]')
        .val(), 10);
    } else {
      vege = new VegeItem();
      vege.vegeName = $('.vegetable .vegetable__item').eq(i).children('input[name=vegeName]').val();
      vege.vegeQuantity = parseInt($('.vegetable .vegetable__item').eq(i).children('span').children('input[name=vegeQuantity]')
        .val(), 10);
      vege.vegePrice = parseInt($('.vegetable .vegetable__item').eq(i).children('span').children('input[name=vegePrice]')
        .val(), 10);
      veges.push(vege);
    }
  }
}

// 取得所有已上架蔬果
function getAllVeges() {
  $.get(`https://graduation.jj97181818.me/api/farmers/${farmerID}`)
    .done((req) => {
      $.each(req.vegetables, (index, element) => {
        oldVeges.push(element);
      });
      numOfVegesOnShelf = req.vegetables.length;

      appendVegesHasBeOnSelf(oldVeges);
    })
    .fail(() => {
      alert('Error!');
    });
}

$(document).ready(() => {
  getAllVeges();
});

// 新增上架列表
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

// 刪除上架列表
$('.vegetable').on('click', '.delete', function () {
  const index = $(this).parent().index();

  if (index < numOfVegesOnShelf) {
    // TODO: 刪除已上架的蔬果資料
    numOfVegesOnShelf -= 1;
  }
  $(this).parent().parent().remove();
});

// 商品上架
$('#shelf').click(() => {
  const itemLength = $('.vegetable').children('.vegetable__item').length;

  addNewVeges(newVeges, itemLength);
  for (let i = 0; i < itemLength; i += 1) {
    if (i < numOfVegesOnShelf) {
      newVeges[i].id = i + 1;
      putVegesOnShelf(oldVeges[i], i);
    } else {
      newVeges[i].id = i + 1;
      newVeges[i].FarmerID = farmerID;
      postVegesOnShelf(newVeges[i]);
    }
  }

  window.location.reload();
});