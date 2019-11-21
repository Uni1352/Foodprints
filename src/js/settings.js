let userID = '';

function getCookie(cname) {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return '';
}

function getUserData() {
  userID = getCookie('userID');

  $.get(`https://graduation.jj97181818.me/api/items/${userID}`)
    .done((res) => {
      $('input[name=name]').val(res.name);
      $('input[name=userEmail]').val(res.email);
      $('input[name=userAddress]').val(res.address);
      $('input[name=userPhone]').val(res.cellphone);
    });
}

$(document).ready(() => {
  getUserData();
});

$('#modify').click(() => {
  const modifiedData = {
    name: $('input[name=name]').val(),
    email: $('input[name=userEmail]').val(),
    address: $('input[name=userAddress]').val(),
    cellphone: $('input[name=userPhone]').val()
  };
  const usertype = getCookie('userType');

  if (usertype === 'restaurant') {
    $.ajax({
      type: 'put',
      url: `https://graduation.jj97181818.me/api/users/${userID}`,
      contentType: 'application/json',
      proccessData: false,
      data: JSON.stringify(modifiedData),
      error() {
        alert('Failed to modify user data.');
      }
    });
  } else if (usertype === 'farmer') {
    $.ajax({
      type: 'put',
      url: `https://graduation.jj97181818.me/api/farmers/${userID}`,
      contentType: 'application/json',
      proccessData: false,
      data: JSON.stringify(modifiedData),
      error() {
        alert('Failed to modify user data.');
      }
    });
  }
});