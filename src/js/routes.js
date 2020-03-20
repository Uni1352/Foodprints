const orderIDNumber = [];
const orderSeqNumber = [];
const farmerLocation = {
  name: '',
  lat: '',
  lng: ''
};
const restaurantLocations = [];
const mapContainer = document.getElementById('map');
const platform = new H.service.Platform({
  apikey: '9-5DYn8Zq0T6i8t46hNl0E2w5m-00Mx2nzW6h5CtuEA',
  useCIT: true,
  useHTTPS: true
});
const defaultLayers = platform.createDefaultLayers();
const map = new H.Map(mapContainer, defaultLayers.raster.normal.map, {
  zoom: 12.75,
  center: {
    lat: 25.0216828,
    lng: 121.5264134
  }
});
const ui = H.ui.UI.createDefault(map, defaultLayers);
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
const markerGroup = new H.map.Group();
const markerGroups = [];
const routeLineColor = {
  r: 0,
  g: 0,
  b: 0
};

// 切換語言
function setBaseLayer(m, p) {
  const mapTileService = p.getMapTileService({
    type: 'base'
  });
  const parameters = {
    lg: 'cht'
  };
  const tileLayer = mapTileService.createTileLayer(
    'maptile',
    'normal.day',
    256,
    'png8',
    parameters
  );
  m.setBaseLayer(tileLayer);
}

function addInfoBubble(markerPos) {
  markerPos.addEventListener('tap', (evt) => {
    const bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
      content: `${evt.target.getData()}`
    });
    ui.addBubble(bubble);
  });
}

function addRouteShapeToMap(r) {
  const routeShape = r.shape;
  const lineString = new H.geo.LineString();

  routeShape.forEach((point) => {
    const parts = point.split(',');
    lineString.pushLatLngAlt(parts[0], parts[1]);
  });

  const routeOutline = new H.map.Polyline(lineString, {
    style: {
      lineWidth: 5,
      strokeColor: `rgba(${routeLineColor.r}, ${routeLineColor.g}, ${routeLineColor.b}, 1)`,
      lineTailCap: 'arrow-tail',
      lineHeadCap: 'arrow-head'
    }
  });
  const routeArrows = new H.map.Polyline(lineString, {
    style: {
      lineWidth: 5,
      fillColor: 'white',
      strokeColor: 'rgba(255, 255, 255, 1)',
      lineDash: [0, 2],
      lineTailCap: 'arrow-tail',
      lineHeadCap: 'arrow-head'
    }
  });

  const routeLine = new H.map.Group();

  map.addObject(routeLine);
  routeLine.addObject(routeOutline);
  routeLine.addObject(routeArrows);
  map.getViewModel().setLookAtData({
    bounds: routeLine.getBoundingBox()
  }, true);
}

function addPositionMarker(pos, index, seq) {
  const svgMarkup = `<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <rect stroke="white" fill="#ed0034" x="1" y="1" width="22" height="22" />
                    <text x="12" y="18" font-size="12pt" font-family="Arial" font-weight="bold" 
                          text-anchor="middle" fill="white">${seq}</text>
                  </svg>`;
  const numberDestination = new H.map.Icon(svgMarkup);
  const marker = new H.map.Marker({
    lat: pos.lat,
    lng: pos.lng
  }, {
    icon: numberDestination
  });
  let positionName = '';

  if (seq === 0) {
    positionName = farmerLocation.name;
  } else {
    positionName = restaurantLocations[index][seq - 1].name;
  }
  marker.setData(positionName);
  markerGroup.addObject(marker);
  addInfoBubble(marker);
}

function onResult(result) {
  const route = result.response.route[0];

  addRouteShapeToMap(route);
}

function drawRoutes(routes) {
  const router = platform.getRoutingService();

  for (let i = 0; i < routes.length; i += 1) {
    const routingParameters = {
      mode: 'fastest;car',
      representation: 'display',
      routeattributes: 'waypoints,summary,shape,legs',
      waypoint0: `${farmerLocation.lat},${farmerLocation.lng}`,
      waypoint1: `${routes[i][0].lat},${routes[i][0].lng}`
    };

    routeLineColor.r = Math.floor(Math.random() * 180);
    routeLineColor.g = Math.floor(Math.random() * 256);
    routeLineColor.b = Math.floor(Math.random() * 256);
    console.log(routeLineColor);

    // 小農 -> 餐廳
    router.calculateRoute(routingParameters, onResult,
      (error) => {
        alert(error.message);
      });
    addPositionMarker(farmerLocation, i, 0);

    for (let k = 0; k < routes[i].length; k += 1) {
      // 餐廳 -> 餐廳
      if (k !== routes[i].length - 1) {
        routingParameters.waypoint0 = `${routes[i][k].lat},${routes[i][k].lng}`;
        routingParameters.waypoint1 = `${routes[i][k + 1].lat},${routes[i][k + 1].lng}`;
      } else {
        // 餐廳 -> 小農
        routingParameters.waypoint0 = `${routes[i][k].lat},${routes[i][k].lng}`;
        routingParameters.waypoint1 = `${farmerLocation.lat},${farmerLocation.lng}`;
      }

      router.calculateRoute(routingParameters, onResult,
        (error) => {
          alert(error.message);
        });
      addPositionMarker(routes[i][k], i, k + 1);
    }
    markerGroups.push(markerGroup);
  }
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

function datetimeFormat(d) {
  const date = [d.getFullYear(), d.getMonth() + 1, d.getDate()];

  if (date[1] < 10) {
    date[1] = `0${date[1]}`;
  }
  if (date[2] < 10) {
    date[2] = `0${date[2]}`;
  }

  return date.join('-');
}

function appendOrderContent(orders, seqNum, idNum) {
  let seqNumPos = 0;
  let routeIDNumber = 0;
  let orderContentSeq = 0;

  $.each(orders, (index, element) => {
    for (let i = 0; i < idNum.length; i += 1) {
      seqNumPos = idNum[i].indexOf(element.id);
      if (seqNumPos !== -1) {
        routeIDNumber = i + 1;
        orderContentSeq = seqNum[i][seqNumPos];
        restaurantLocations[i][orderContentSeq].name = element.userName;

        const orderContentData = $(`#route${routeIDNumber} .order .order__item`).eq(orderContentSeq)
          .children('.order__content');

        orderContentData.children(`.user${element.id}`).text(element.userName);
        orderContentData.children(`.phone${element.id}`).text(element.userCellphone);
        orderContentData.children(`.profit${element.id}`).text(element.profit);
        orderContentData.children(`.food${element.id}`).text(element.items.foodName);
        orderContentData.children(`.weight${element.id}`).text(element.items.foodQuantity);
        break;
      }
    }
  });
}

function appendOrderItems(orders, routeID) {
  const seqArr = [];
  const idArr = [];

  $.each(orders, (index, element) => {
    const seq = element.orderSequence;
    const orderDate = datetimeFormat(new Date(element.arrivalTime));

    $(`#route${routeID} .order .order__item`).eq((seq - 1)).append(`<div class="order__content">
      ID &nbsp;&nbsp;: ${element.orderID} <br />
      FOOD &nbsp;: <span class="food${element.orderID}"></span> <br />
      WEIGHT: <span class="weight${element.orderID}"></span> kg <br />
      PROFIT: NT$ <span class="profit${element.orderID}"></span> <br />
      USER &nbsp;: <span class="user${element.orderID}"></span> <br />
      DATE &nbsp;: ${orderDate} <br />
      PHONE : <span class="phone${element.orderID}"></span> <br />
      ADDR &nbsp;: ${element.orderAddress} <br />
    </div>`);
    seqArr.push(seq - 1);
    idArr.push(element.orderID);
  });
  orderSeqNumber.push(seqArr);
  orderIDNumber.push(idArr);
  console.log(orderSeqNumber);
  console.log(orderIDNumber);
}

function appendListItems(data) {
  $.each(data, (index, element) => {
    $('#routes>.list').append(`<div class="list__item">
            <div class="dropdown">
              <i class="fa fa-chevron-right"></i>
              <h3>route ${element.routeID}</h3>
            </div>
            <div class="order"></div>
          </div>`);
    $('.list__item').eq(index).attr('id', `route${element.routeID}`);

    for (let j = 0; j < element.orders.length; j += 1) {
      $(`#route${element.routeID} .order`).append(`<div class="order__item">
                <div class="dropdown">
                  <i class="fa fa-angle-right"></i>
                  <h4>order ${j + 1}</h4>
                </div>
              </div>`);
    }
    appendOrderItems(element.orders, element.routeID);
  });
}

function getFarmer(id) {
  $.ajax({
    type: 'get',
    url: `https://graduation.jj97181818.me/api/farmers/${id}`,
    async: false,
    success(res) {
      farmerLocation.name = res.name;
      farmerLocation.lat = res.location.latitude;
      farmerLocation.lng = res.location.longitude;
    },
    error() {
      alert('資料讀取失敗');
    }
  });
}

function getRoutes(id) {
  const routeList = [];
  const restaurantPositionSingleRoute = [];

  $.ajax({
    type: 'get',
    url: 'https://graduation.jj97181818.me/api/routes',
    async: false,
    success(res) {
      $.each(res.routes, (index, element) => {
        if (element.farmerID === parseInt(id, 10)) {
          routeList.push(element);
          restaurantPositionSingleRoute.length = element.orders.length;

          $.each(element.orders, (indexValue, item) => {
            restaurantPositionSingleRoute[item.orderSequence - 1] = {
              lat: item.latitude,
              lng: item.longitude
            };
          });
        }
        restaurantLocations.push(restaurantPositionSingleRoute);
      });

      appendListItems(routeList);
    },
    error() {
      alert('資料讀取失敗');
    }
  });
}

function getOrders() {
  $.ajax({
    type: 'get',
    url: 'https://graduation.jj97181818.me/api/orders',
    async: false,
    success(res) {
      appendOrderContent(res, orderSeqNumber, orderIDNumber);
    },
    error() {
      alert('資料讀取失敗');
    }
  });
}

$(document).ready(() => {
  const farmerID = getCookie('userID');

  getFarmer(farmerID);
  getRoutes(farmerID);
  getOrders();

  window.addEventListener('resize', () => map.getViewPort().resize());
  map.addObject(markerGroup);
  setBaseLayer(map, platform);
  drawRoutes(restaurantLocations);


  $('.list').hide();
  $('.tag').css('left', '0');
  $('.order').hide();
  $('.order__content').hide();
  $('#orders .list__item').children('div:nth-child(2)').hide();
});

// 標籤切換 & 收放
$('.sidebar').on('click', '.tag', function () {
  if ($(this).hasClass('tag--open')) {
    if ($(this).siblings('.list').is(':hidden')) {
      $(this).parent().siblings().children('.list')
        .hide();
      $(this).parent().siblings().children('.tag')
        .css('background-color', 'rgb(211, 211, 211)');
      $(this).siblings('.list').show();
      $(this).css('background-color', 'white');
    } else {
      $('.tag').removeClass('tag--open');
      $(this).siblings('.list').hide();
      $('.tag').css('left', '0');
    }
  } else {
    $('.tag').addClass('tag--open');
    $(this).siblings('.list').show();
    $(this).parent().siblings().children('.tag')
      .css('background-color', 'rgb(211, 211, 211)');
    $(this).css('background-color', 'white');
    $('.tag').css('left', '300px');
  }
});

// Dropdown
$('.list').on('click', '.dropdown', function () {
  const re = /^route/;

  $(this).siblings('div').slideToggle();

  if ($(this).hasClass('dropdown--clicked')) {
    $(this).children('i').css('transform', 'rotate(0deg)');
    $(this).removeClass('dropdown--clicked');
  } else {
    $(this).children('i').css('transform', 'rotate(90deg)');
    $(this).addClass('dropdown--clicked');
  }

  if (re.exec($(this).parent().attr('id'))) {
    const index = $(this).parent().index();

    map.getViewModel().setLookAtData({
      bounds: markerGroups[index].getBoundingBox()
    }, true);
  }
});