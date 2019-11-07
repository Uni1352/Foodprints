function hideOrderItems() {
  $('.order').hide();
  $('.order__content').hide();
  $('#orders .list__item').children('div:nth-child(2)').hide();
}

function clickTags() {
  $('.sidebar').on('click', '.tag', function () {
    $(this).parent().siblings().children('.list')
      .hide();
    $(this).parent().siblings().children('.tag')
      .css('background-color', 'rgba(211, 211, 211, 0.75)');
    $(this).siblings('.list').show();
    $(this).css('background-color', 'white');
  });
}

function dropdownItems() {
  $('.list__item>.dropdown').click(function () {
    $(this).siblings('div').slideToggle();

    if ($(this).hasClass('dropdown--clicked')) {
      $(this).children('i').css('transform', 'rotate(0deg)');
      $(this).removeClass('dropdown--clicked');
    } else {
      $(this).children('i').css('transform', 'rotate(90deg)');
      $(this).addClass('dropdown--clicked');
    }
  });

  $('.order__item>.dropdown').click(function () {
    $(this).siblings('.order__content').slideToggle();

    if ($(this).hasClass('dropdown--clicked')) {
      $(this).children('i').css('transform', 'rotate(0deg)');
      $(this).removeClass('dropdown--clicked');
    } else {
      $(this).children('i').css('transform', 'rotate(90deg)');
      $(this).addClass('dropdown--clicked');
    }
  });
}

function appendOrders(orders) {
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
    $('.list__item').eq(index).attr('id', `order${element.id}`);
  });
}

function appendOrderItems(orders, routeID) {
  $.each(orders, (index, element) => {
    const seq = element.orderSequence;
    const date = new Date(element.arrivalTime);
    $(`#route${routeID} .order .order__item`).eq((seq - 1)).append(`<div class="order__content">
      USER: NONAME <br>
      ID &nbsp;: ${element.orderID} <br>
      DATE: ${date.toDateString()} <br>
      ADDR: ${element.orderAddress} <br>
    </div>`);
  });
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
    }

    appendOrderItems(element.orders, element.routeID);
  });
}

function getOrders() {
  $.get('https://recycle.likey.com.tw/api/orders')
    .done((req) => {
      appendOrders(req);
    })
    .fail(() => {
      alert('Error!');
    })
    .always(() => {
      hideOrderItems();
      dropdownItems();
      clickTags();
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
  $('#orders>.list').hide();
});