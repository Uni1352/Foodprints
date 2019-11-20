const orderIDNumber = [];
const orderSeqNumber = [];

function hideOrderItems() {
  $('.order').hide();
  $('.order__content').hide();
  $('#orders .list__item').children('div:nth-child(2)').hide();
}

function appendOrderContent(orders, seqNum, idNum) {
  let seqNumPos = 0;
  let routeIDNumber = 0;
  let orderContentSeq = 0;

  $.each(orders, (index, element) => {
    for (let i = 0; i < idNum.length; i += 1) {
      seqNumPos = idNum[i].indexOf(element.id);
      if (seqNumPos !== -1) {
        routeIDNumber = i + 1;
        orderContentSeq = seqNum[i][seqNumPos];
        break;
      }
    }

    $(`#route${routeIDNumber} .order .order__item`).eq(orderContentSeq)
      .children('.order__content').children(`.user${element.id}`)
      .text(element.name);
    $(`#route${routeIDNumber} .order .order__item`).eq(orderContentSeq)
      .children('.order__content').children(`.phone${element.id}`)
      .text(element.cellphone);
    $(`#route${routeIDNumber} .order .order__item`).eq(orderContentSeq)
      .children('.order__content').children(`.price${element.id}`)
      .text(element.profit);
  });

  $.each(orders, (index, element) => {
    const date = new Date(element.arrivalTime);
    $('#orders>.list').append(`<div class="list__item">
            <div class="dropdown">
              <i class="fa fa-angle-right"></i>
              <h3>order ${element.id}</h3>
            </div>
            <div>
              USER : ${element.name} <br>
              PHONE: ${element.cellphone} <br>
              DATE : ${date.toDateString()} <br>
              ADDR : ${element.address} <br>
            </div>
          </div>`);
    $('#orders .list__item').eq(index).attr('id', `order${element.id}`);
  });
}

function appendOrderItems(orders, routeID) {
  const seqArr = [];
  const idArr = [];

  $.each(orders, (index, element) => {
    const seq = element.orderSequence;
    const date = new Date(element.arrivalTime);
    $(`#route${routeID} .order .order__item`).eq((seq - 1)).append(`<div class="order__content">
      USER : <span class="user${element.orderID}"></span> <br>
      ID &nbsp;&nbsp;: ${element.orderID} <br>
      DATE : ${date.toDateString()} <br>
      PHONE: <span class="phone${element.orderID}"></span> <br>
      ADDR : ${element.orderAddress} <br>
      PRICE: <span class="price${element.orderID}"></span> <br>
      LIST : <br>
    </div>`);
    seqArr.push(seq - 1);
    idArr.push(element.orderID);
  });
  orderSeqNumber.push(seqArr);
  orderIDNumber.push(idArr);
}

function appendListItems(data) {
  $.each(data, (index, element) => {
    $('#routes>.list').append(`<div class="list__item">
            <div class="dropdown">
              <i class="fa fa-chevron-right"></i>
              <h3>route ${element.routeID}</h3>
            </div>
            <div class="order"></div>
          </div>`);
    $('.list__item').eq(index).attr('id', `route${element.routeID}`);

    for (let j = 0; j < element.orders.length; j += 1) {
      $(`#route${element.routeID} .order`).append(`<div class="order__item">
                <div class="dropdown">
                  <i class="fa fa-angle-right"></i>
                  <h4>order ${j + 1}</h4>
                </div>
              </div>`);
      console.log(element.orders[j].latitude);
    }

    appendOrderItems(element.orders, element.routeID);
  });
}

function getOrders() {
  $.get('https://recycle.likey.com.tw/api/orders?history=0')
    .done((req) => {
      appendOrderContent(req, orderSeqNumber, orderIDNumber);
    })
    .fail(() => {
      alert('Error!');
    })
    .always(() => {
      hideOrderItems();
    });
}

function getRoutes() {
  $.get('https://recycle.likey.com.tw/api/routes')
    .done((req) => {
      appendListItems(req.routes);
    })
    .fail(() => {
      alert('Error!');
    })
    .always(() => {
      getOrders();
    });
}

$(document).ready(() => {
  getRoutes();
  $('.list').hide();
  $('.tag').css('left', '0');
});

// 標籤切換 & 收放
$('.sidebar').on('click', '.tag', () => {
  if ($(this).hasClass('tag--open')) {
    if ($(this).siblings('.list').is(':hidden')) {
      $(this).parent().siblings().children('.list')
        .hide();
      $(this).parent().siblings().children('.tag')
        .css('background-color', 'rgb(211, 211, 211)');
      $(this).siblings('.list').show();
      $(this).css('background-color', 'white');
    } else {
      $('.tag').removeClass('tag--open');
      $(this).siblings('.list').hide();
      $('.tag').css('left', '0');
    }
  } else {
    $('.tag').addClass('tag--open');
    $(this).siblings('.list').show();
    $('.tag').css('left', '250px');
  }
});

// Dropdown
$('.list').on('click', '.dropdown', function () {
  const re = /^route/;

  $(this).siblings('div').slideToggle();

  if ($(this).hasClass('dropdown--clicked')) {
    $(this).children('i').css('transform', 'rotate(0deg)');
    $(this).removeClass('dropdown--clicked');
  } else {
    $(this).children('i').css('transform', 'rotate(90deg)');
    $(this).addClass('dropdown--clicked');
  }

  if (re.exec($(this).parent().attr('id'))) {
    const index = $(this).parent().index();
    console.log(index);
  }
});