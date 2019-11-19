function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toGMTString()}`;
  document.cookie = `${cname}=${cvalue};${expires};domain=recycle.likey.com.tw;path=/`;
}

$('#login').click(() => {
  const user = {
    platform: 'web',
    username: $('#username').val(),
    password: $('#userpassword').val()
  };

  $.ajax({
    type: 'post',
    url: 'https://recycle.likey.com.tw/api/session',
    contentType: 'application/json',
    proccessData: false,
    data: JSON.stringify(user),
    success(res) {
      alert(res.message);
      setCookie('user', user.username, 1);
      window.location = 'https://recycle.likey.com.tw/foodprints/src/pages/member.html';
    },
    error() {
      alert('Login Failed!');
      $('#username').val('');
      $('#userpassword').val('');
    }
  });
});