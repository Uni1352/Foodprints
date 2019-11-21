function getCookie(cname) {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return '';
}

function appendTableData(items) {
  $.each(items, (index, element) => {
    $('tbody').append(`<tr>
      <td>${element.vegeName}</td>
      <td>${element.vegeQuantity}</td>
      <td>${element.vegePrice}</td>
    </tr>`);
  });
}

function getVegeItems() {
  const farmerID = getCookie('userID');

  // $.get(`https://recycle.likey.com.tw/api/farmers/${farmerID}`)
  //   .done((req) => {
  //     appendTableData(req.vegetables);
  //   })
  //   .fail(() => {
  //     alert('Error!');
  //   })
  //   .always(() => {});
}

$(document).ready(() => {
  getVegeItems();
});