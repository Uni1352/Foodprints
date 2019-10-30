const req = new XMLHttpRequest();

$('#login').click(() => {
  req.open('GET', 'https://recycle.likey.com.tw/api/users', true);
  req.send();
  if (req.status === 200) {
    alert(req.responseText);
  } else {
    alert('There was a problem with the request.');
  }
});