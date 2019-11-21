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
      url: 'https://graduation.jj97181818.me/api/users',
      contentType: 'application/json',
      proccessData: false,
      data: JSON.stringify(newUser),
      success() {
        alert('Create account successfully!');
        window.location = 'https://graduation.jj97181818.me';
      },
      error() {
        alert('Failed to create account.');
        window.location.reload();
      }
    });
  } else if (usertype === 'farmer') {
    $.ajax({
      type: 'post',
      url: 'https://graduation.jj97181818.me/api/farmers',
      contentType: 'application/json',
      proccessData: false,
      data: JSON.stringify(newUser),
      success() {
        alert('Create account successfully!');
        window.location = 'https://graduation.jj97181818.me';
      },
      error() {
        alert('Failed to create account.');
        window.location.reload();
      }
    });
  }
});