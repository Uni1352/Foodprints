$('#register').click(() => {
  const usertype = $('input[name=usertype]:checked').val();
  const newUser = {
    name: $('#name').val(),
    username: $('#username').val(),
    password: $('#userpassword').val(),
    email: $('#useremail').val(),
    address: $('#useraddress').val(),
    cellphone: $('#userphone').val(),
  };

  if (usertype === 'restaurant') {
    $.ajax({
      type: 'post',
      url: 'https://recycle.likey.com.tw/api/users',
      contentType: 'application/json',
      proccessData: false,
      data: JSON.stringify(newUser),
      success() {
        alert('Success!');
        window.location = 'https://recycle.likey.com.tw/foodprints/index.html';
      },
      error() {
        alert('Failed!');
      }
    });
  } else if (usertype === 'farmer') {
    $.ajax({
      type: 'post',
      url: 'https://recycle.likey.com.tw/api/farmers',
      contentType: 'application/json',
      proccessData: false,
      data: JSON.stringify(newUser),
      success() {
        alert('Success!');
        window.location = 'https://recycle.likey.com.tw/foodprints/index.html';
      },
      error() {
        alert('Failed!');
      }
    });
  }
});