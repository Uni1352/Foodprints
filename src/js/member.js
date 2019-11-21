function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toGMTString()}`;
  document.cookie = `${cname}=${cvalue};${expires};domain=graduation.jj97181818.me;path=/`;
}

function getCookie(cname) {
  const name = `${cname}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    const c = ca[i].trim();
    if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
  }
  return '';
}

$(document).ready(() => {
  const usertype = getCookie('userType');

  if (usertype === 'farmer') {
    $('#restaurant').hide();
  } else if (usertype === 'restaurant') {
    $('#farmer').hide();
  }
});

$('#logout').click(() => {
  $.ajax({
    type: 'delete',
    url: 'https://graduation.jj97181818.me/api/session',
    contentType: 'application/json',
    proccessData: false,
    success(res) {
      alert(res.message);
      setCookie('userID', '', -1);
      setCookie('userType', '', -1);
      window.location = 'https://graduation.jj97181818.me';
    },
    error() {
      alert('Failed to logout.');
    }
  });
});