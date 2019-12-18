let userID = '';
let usertype = '';

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
  if (usertype === 'restaurant') {
    $.get(`https://graduation.jj97181818.me/api/users/${userID}`)
      .done((res) => {
        $('input[name=name]').val(res.name);
        $('input[name=userEmail]').val(res.email);
        $('input[name=userAddress]').val(res.address);
        $('input[name=userPhone]').val(res.cellphone);
      });
  } else {
    $.get(`https://graduation.jj97181818.me/api/farmers/${userID}`)
      .done((res) => {
        $('input[name=name]').val(res.name);
        $('input[name=userEmail]').val(res.email);
        $('input[name=userAddress]').val(res.address);
        $('input[name=userPhone]').val(res.cellphone);
      });
  }
}

$(document).ready(() => {
  userID = getCookie('userID');
  usertype = getCookie('userType');
  getUserData();
});

$('#modify').click(() => {
  const modifiedData = {
    name: $('input[name=name]').val(),
    email: $('input[name=userEmail]').val(),
    address: $('input[name=userAddress]').val(),
    cellphone: $('input[name=userPhone]').val()
  };

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