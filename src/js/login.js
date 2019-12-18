function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toGMTString()}`;
  document.cookie = `${cname}=${cvalue};${expires};domain=graduation.jj97181818.me;path=/`;
}

// 登入
$('#login').click(() => {
  const user = {
    identity: $('input[name=usertype]:checked').val(),
    username: $('#username').val(),
    password: $('#userpassword').val()
  };

  $.ajax({
    type: 'post',
    url: 'https://graduation.jj97181818.me/api/session',
    contentType: 'application/json',
    proccessData: false,
    data: JSON.stringify(user),
    success(res) {
      setCookie('userID', res.ID, 1);
      setCookie('userType', user.identity, 1);
      window.location = 'https://graduation.jj97181818.me/';
    },
    error() {
      alert('Failed to login. Please try once again.');
      window.location.reload();
    }
  });
});