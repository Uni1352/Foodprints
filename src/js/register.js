let addressLocation = '';

const platform = new H.service.Platform({
  apikey: '9-5DYn8Zq0T6i8t46hNl0E2w5m-00Mx2nzW6h5CtuEA',
  useCIT: true,
  useHTTPS: true
});

function postUserData(loc) {
  const usertype = $('input[name=usertype]:checked').val();
  const newUser = {
    name: $('#name').val(),
    username: $('#username').val(),
    password: $('#userpassword').val(),
    email: $('#useremail').val(),
    address: $('#useraddress').val(),
    cellphone: $('#userphone').val(),
    location: {}
  };

  newUser.location.latitude = loc[0].location.displayPosition.latitude;
  newUser.location.longitude = loc[0].location.displayPosition.longitude;
  if (usertype === 'restaurant') {
    $.ajax({
      type: 'post',
      url: 'https://graduation.jj97181818.me/api/users',
      contentType: 'application/json',
      proccessData: false,
      data: JSON.stringify(newUser),
      success() {
        alert('建立成功');
        window.location = 'https://graduation.jj97181818.me';
      },
      error() {
        alert('建立失敗');
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
        alert('建立成功');
        window.location = 'https://graduation.jj97181818.me';
      },
      error() {
        alert('建立失敗');
      }
    });
  }
  window.location.reload();
}

function onSuccess(result) {
  const locations = result.response.view[0].result;

  postUserData(locations);
}

function onError() {
  alert('Can\'t reach the remote server');
}

// 接收platform的訊息做geocoding
function geocode(p) {
  const geocoder = p.getGeocodingService();
  const geocodingParameters = {
    searchText: addressLocation,
    jsonattributes: 1
  };

  geocoder.geocode(
    geocodingParameters,
    onSuccess,
    onError
  );
}

$('#register').click(() => {
  addressLocation = $('#useraddress').val();
  geocode(platform);
});