function getCookie(cname) {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return '';
}

function appendHistoryOrderItems(orders, idnum) {
  $.each(orders, (index, element) => {
    if (element.userID === parseInt(idnum, 10)) {
      const date = new Date(element.orderDate);
      $('tbody').append(`<tr>
          <td>${date.toDateString()}</td>
          <td>${element.items.foodName}</td>
          <td>${element.items.farmerName}</td>
          <td>${element.items.foodQuantity}</td>
          <td>${element.profit}</td>
        </tr>`);
    }
  });
}

function getOrders() {
  const idNumber = getCookie('userID');
  const usertype = getCookie('userType');

  if (usertype === 'restaurant') {
    $.get('https://graduation.jj97181818.me/api/orders?history=1')
      .done((req) => {
        appendHistoryOrderItems(req, idNumber);
      })
      .fail(() => {
        alert('Error!');
      });
  } else if (usertype === 'farmer') {
    // 抓已完成的路線
    // $.get('https://graduation.jj97181818.me/api/routes')
    //   .done((req) => {
    //     appendOrderItems(req);
    //   })
    //   .fail(() => {
    //     alert('Error!');
    //   });
  }
}

$(document).ready(() => {
  // TODO: 定時更新
  getOrders();
});