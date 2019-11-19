function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toGMTString()}`;
  document.cookie = `${cname}=${cvalue};${expires};domain=recycle.likey.com.tw;path=/`;
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
  if (getCookie('user') === '') {
    alert('Please Login.');
    window.location = 'https://recycle.likey.com.tw/foodprints';
  }
  console.log(getCookie('user'));
});

$('#logout').click(() => {
  $.ajax({
    type: 'delete',
    url: 'https://recycle.likey.com.tw/api/session',
    contentType: 'application/json',
    proccessData: false,
    success(res) {
      alert(res.message);
      setCookie('user', '', -1);
      window.location = 'https://recycle.likey.com.tw/foodprints';
    },
    error() {
      alert('Error!');
    }
  });
});