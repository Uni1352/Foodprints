class VegetableItem {
  constructor() {
    this.vegeName = '';
    this.vegeQuantity = 0;
    this.vegePrice = 0;
  }
}

const oldVegetables = [];
const newVegetables = [];
let farmerID = '';
let oldVegeNames = [];
let newVegeNames = [];

function getCookie(cname) {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return '';
}

// 已上架蔬果列表
function appendVegetablesOnShelf(veges) {
  $.each(veges, (index, element) => {
    $('.vegetable>:last-child').before(`<div class="vegetable__item">
            <input type="text" name="vegeName" placeholder="蔬果名稱" value="${element.vegeName}">
            <span>
              <input type="number" name="vegeQuantity" min="0" placeholder="數量" value="${element.vegeQuantity}">
              公斤
            </span>
            <span>
              <input type="number" name="vegePrice" min="0" placeholder="單價" value="${element.vegePrice}">
              元/公斤
            </span>
            <span style="align-self: center;">
              <div class="btn--icon delete"><i class="fas fa-times"></i></div>
            </span>
          </div>`);
  });
}

// 取得所有已上架蔬果
function getAllVegetableOnShelf(id) {
  $.get(`https://graduation.jj97181818.me/api/farmers/${id}`)
    .done((res) => {
      $.each(res.vegetables, (index, element) => {
        oldVegetables.push(element);
      });
      oldVegeNames = $.map(res.vegetables, (item) => item.vegeName);
      appendVegetablesOnShelf(res.vegetables);
    })
    .fail(() => {
      alert('Error!');
    });
}

// 取得列表上所有的蔬果資料
function getNewVegetables() {
  const newVegetablesLength = $('.vegetable').children('.vegetable__item').length;

  for (let i = 0; i < newVegetablesLength; i += 1) {
    newVegetables.push(new VegetableItem());
    newVegetables[i].vegeName = $('.vegetable__item').eq(i).children('input[name=vegeName]').val();
    newVegetables[i].vegeQuantity = parseInt($('.vegetable__item').eq(i).children('span').children('input[name=vegeQuantity]')
      .val(), 10);
    newVegetables[i].vegePrice = parseInt($('.vegetable__item').eq(i).children('span').children('input[name=vegePrice]')
      .val(), 10);
  }
  newVegeNames = $.map(newVegetables, (item) => item.vegeName);
}

// 新增新的蔬果資料
function postVegetablesOnShelf(veges) {
  $.ajax({
    type: 'post',
    url: 'https://graduation.jj97181818.me/api/items',
    contentType: 'application/json',
    proccessData: false,
    data: JSON.stringify(veges),
    error() {
      alert('Failed to post items.');
      window.location.reload();
    }
  });
}

// 修改現有的蔬果資料
function putVegetablesOnShelf(id, veges) {
  $.ajax({
    type: 'put',
    url: `https://graduation.jj97181818.me/api/items/${id}`,
    contentType: 'application/json',
    proccessData: false,
    data: JSON.stringify(veges),
    error() {
      alert('Failed to post items.');
      window.location.reload();
    }
  });
}

// 刪除已有的蔬果資料
function deleteVegetablesOnShelf(id) {
  $.ajax({
    type: 'delete',
    url: `https://graduation.jj97181818.me/api/items/${id}`,
    contentType: 'application/json',
    proccessData: false,
    error() {
      alert('Failed to delete items.');
      window.location.reload();
    }
  });
}

$(document).ready(() => {
  farmerID = getCookie('userID');
  getAllVegetableOnShelf(farmerID);
});

// 新增新的 input
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

// 要刪除的商品
$('.vegetable').on('click', '.delete', function () {
  $(this).parent().parent().remove();
});

// 商品上架
$('#shelf').click(() => {
  getNewVegetables();

  const vegeToBeDelete = oldVegeNames.filter((item) => newVegeNames.indexOf(item) === -1);
  const vegeToBeModify = newVegeNames.filter((item) => oldVegeNames.indexOf(item) !== -1);
  const vegeToBeAdd = newVegeNames.filter((item) => oldVegeNames.indexOf(item) === -1);

  // 新增上架蔬果
  for (let i = 0; i < vegeToBeAdd.length; i += 1) {
    const index = newVegeNames.indexOf(vegeToBeAdd[i]);

    newVegetables[index].FarmerID = parseInt(farmerID, 10);
    postVegetablesOnShelf(newVegetables[index]);
  }

  // 刪除架上蔬果
  for (let i = 0; i < vegeToBeDelete.length; i += 1) {
    const index = oldVegeNames.indexOf(vegeToBeDelete[i]);

    deleteVegetablesOnShelf(oldVegetables[index].id);
  }

  // 修改架上蔬果
  for (let i = 0; i < vegeToBeModify.length; i += 1) {
    const indexOfOldVeges = oldVegeNames.indexOf(vegeToBeModify[i]);
    const indexOfNewVeges = newVegeNames.indexOf(vegeToBeModify[i]);

    putVegetablesOnShelf(oldVegetables[indexOfOldVeges].id, newVegetables[indexOfNewVeges]);
  }

  alert('put vegetables on shelf successfully!');
  window.location.reload();
});