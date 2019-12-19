let userID = '';
let usertype = '';
let addressLocation = '';

const platform = new H.service.Platform({
  apikey: '9-5DYn8Zq0T6i8t46hNl0E2w5m-00Mx2nzW6h5CtuEA',
  useCIT: true,
  useHTTPS: true
});

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

function putUserData(loc) {
  const modifiedData = {
    name: $('input[name=name]').val(),
    email: $('input[name=userEmail]').val(),
    address: $('input[name=userAddress]').val(),
    cellphone: $('input[name=userPhone]').val(),
    location: {
      latitude: '',
      longitude: ''
    }
  };

  modifiedData.location.latitude = loc[0].location.displayPosition.latitude;
  modifiedData.location.longitude = loc[0].location.displayPosition.longitude;

  if (usertype === 'restaurant') {
    $.ajax({
      type: 'put',
      url: `https://graduation.jj97181818.me/api/users/${userID}`,
      contentType: 'application/json',
      proccessData: false,
      data: JSON.stringify(modifiedData),
      success() {
        alert('Change user data successfully!');
      },
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
      success() {
        alert('Change user data successfully!');
      },
      error() {
        alert('Failed to modify user data.');
      }
    });
  }
}

function onSuccess(result) {
  const locations = result.response.view[0].result;

  putUserData(locations);
}

function onError() {
  alert('Can\'t reach the remote server');
}

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

$(document).ready(() => {
  userID = getCookie('userID');
  usertype = getCookie('userType');
  getUserData();
});

$('#modify').click(() => {
  addressLocation = $('input[name=userAddress]').val();
  geocode(platform);
});