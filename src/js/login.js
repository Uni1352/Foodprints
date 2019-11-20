function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toGMTString()}`;
  document.cookie = `${cname}=${cvalue};${expires};domain=recycle.likey.com.tw;path=/`;
}

$('#login').click(() => {
  const user = {
    // TODO: 刪除 platform
    platform: 'web',
    identity: $('input[name=usertype]:checked').val(),
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
      setCookie('userType', user.identity, 1);
      window.location = 'https://recycle.likey.com.tw/foodprints/src/pages/member.html';
    },
    error() {
      alert('Login Failed!');
      $('#username').val('');
      $('#userpassword').val('');
    }
  });
});