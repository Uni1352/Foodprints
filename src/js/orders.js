function appendOrderItems(orders) {
  $.each(orders, (index, element) => {
    const date = new Date(element.arrivalTime);
    $('tbody').append(`<tr>
      <td>${date.toDateString()}</td>
      <td>NO DATA</td>
      <td>${element.address}</td>
      <td>${element.weight}</td>
      <td>${element.profit}</td>
    </tr>`);
  });
}

function getOrders() {
  $.get('https://recycle.likey.com.tw/api/orders')
    .done((req) => {
      appendOrderItems(req);
    })
    .fail(() => {
      alert('Error!');
    });
}

getOrders();