const orderIDNumber = [];
const orderSeqNumber = [];

// -----------------------------------------

// 畫出路線圖
// Step 0: set up containers for the map  + panel
const mapContainer = document.getElementById('map');
const routeInstructionsContainer = document.getElementById('panel');

// Step 1: initialize communication with the platform
const platform = new H.service.Platform({
  app_id,
  app_code,
  useCIT: true,
  useHTTPS: true
});
const defaultLayers = platform.createDefaultLayers();

// Step 2: initialize a map - this map is centered over Taiwan
const map = new H.Map(document.getElementById('map'),
  defaultLayers.normal.map, {
    center: {
      lat: 25,
      lng: 121
    },
    zoom: 6
  });
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

const locationsContainer = document.getElementById('panel');

// Step 3: make the map interactive
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
const behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
const ui = H.ui.UI.createDefault(map, defaultLayers);

function moveMapToTaipei(m) {
  m.setCenter({
    lat: 25.0192822,
    lng: 121.5395547
  });
  m.setZoom(14);
}

// Step 4:use the map as required...
window.onload = function () {
  moveMapToTaipei(map);
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

setBaseLayer(map, platform);

// 泡泡資訊窗
let bubble;

function openBubble(position, text) {
  if (!bubble) {
    bubble = new H.ui.InfoBubble(
      position, {
        content: text
      }
    );
    ui.addBubble(bubble);
  } else {
    bubble.setPosition(position);
    bubble.setContent(text);
    bubble.open();
  }
}

// 路徑規劃的線畫在地圖上 H.map.Polyline
function addRouteShapeToMap(route) {
  const lineString = new H.geo.LineString();
  const routeShape = route.shape;

  routeShape.forEach((point) => {
    const parts = point.split(',');
    lineString.pushLatLngAlt(parts[0], parts[1]);
  });

  const polyline = new H.map.Polyline(lineString, {
    style: {
      lineWidth: 10,
      strokeColor: 'rgba(0, 128, 255, 0.7)'
    },
    arrows: {
      fillColor: 'white',
      frequency: 2,
      width: 0.8,
      length: 0.7
    }
  });
  // Add the polyline to the map
  map.addObject(polyline);
  // And zoom to its bounding rectangle
  map.setViewBounds(polyline.getBounds(), true);
}

// 路徑規劃上的點畫在地圖上H.map.Marker points on Map
function addManueversToMap(route) {
  /* var svgMarkup = '<svg width="18" height="18" ' +
    'xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="8" cy="8" r="8" ' +
      'fill="#1b468d" stroke="white" stroke-width="1"  />' +
    '</svg>', */
  // var dotIcon = new H.map.Icon();
  const group = new H.map.Group();
  let i;
  let j;

  // Add a marker for each maneuver
  for (i = 0; i < route.leg.length; i += 1) {
    for (j = 0; j < route.leg[i].maneuver.length; j += 1) {
      // Get the next maneuver.
      maneuver = route.leg[i].maneuver[j];
      // Add a marker to the maneuvers group
      const marker = new H.map.Marker({
        lat: maneuver.position.latitude,
        lng: maneuver.position.longitude
      });
      // {
      //   icon: dotIcon
      // }
      marker.instruction = maneuver.instruction;
      group.addObject(marker);
    }
  }

  group.addEventListener('tap', (evt) => {
    map.setCenter(evt.target.getPosition());
    // openBubble(
    //   evt.target.getPosition(), evt.target.instruction
    // );
  }, false);

  // Add the maneuvers group to the map
  map.addObject(group);
}

// 路徑規劃上的點(起點、迄點)顯示在Panel上 H.map.Marker points on Panel
function addWaypointsToPanel(waypoints) {
  const nodeH3 = document.createElement('h3');
  const waypointLabels = [];
  let i;


  for (i = 0; i < waypoints.length; i += 1) {
    waypointLabels.push(waypoints[i].label);
  }

  nodeH3.textContent = waypointLabels.join(' - ');

  routeInstructionsContainer.innerHTML = '';
  routeInstructionsContainer.appendChild(nodeH3);
}

// 路徑規劃的總里程、預估旅行時間顯示在Panel上 H.map.Marker points on Panel
function addSummaryToPanel(summary) {
  const summaryDiv = document.createElement('div');
  let content = '';
  content += `<b>Total distance</b>: ${summary.distance}m. <br/>`;
  content += `<b>Travel Time</b>: ${summary.travelTime.toMMSS()} (in current traffic)`;


  summaryDiv.style.fontSize = 'small';
  summaryDiv.style.marginLeft = '5%';
  summaryDiv.style.marginRight = '5%';
  summaryDiv.innerHTML = content;
  routeInstructionsContainer.appendChild(summaryDiv);
}

// 路徑規劃上的點(中途幾個點)顯示在Panel上 H.map.Marker points on Panel
function addManueversToPanel(route) {
  const nodeOL = document.createElement('ol');
  let i;
  let j;

  nodeOL.style.fontSize = 'small';
  nodeOL.style.marginLeft = '5%';
  nodeOL.style.marginRight = '5%';
  nodeOL.className = 'directions';

  // Add a marker for each maneuver
  for (i = 0; i < route.leg.length; i += 1) {
    for (j = 0; j < route.leg[i].maneuver.length; j += 1) {
      // Get the next maneuver.
      maneuver = route.leg[i].maneuver[j];

      const li = document.createElement('li');
      const spanArrow = document.createElement('span');
      const spanInstruction = document.createElement('span');

      spanArrow.className = `arrow ${maneuver.action}`;
      spanInstruction.innerHTML = maneuver.instruction;
      li.appendChild(spanArrow);
      li.appendChild(spanInstruction);

      nodeOL.appendChild(li);
    }
  }

  routeInstructionsContainer.appendChild(nodeOL);
}

function onSuccess(result) {
  const route = result.response.route[0];

  addRouteShapeToMap(route);
  // addManueversToMap(route);
  addWaypointsToPanel(route.waypoint);
  addManueversToPanel(route);
  addSummaryToPanel(route.summary);
}

function onError(error) {
  alert('Can\'t reach the remote server');
}

// 路徑規劃
function calculateRouteFromAtoB(p) {
  const router = p.getRoutingService();
  const routeRequestParams = {
    mode: 'fastest;car',
    representation: 'display',
    routeattributes: 'waypoints,summary,shape,legs',
    maneuverattributes: 'direction,action',
    waypoint0: window.Origin, // Brandenburg Gate
    waypoint1: window.Destination // Friedrichstraße Railway Station
  };


  router.calculateRoute(
    routeRequestParams,
    onSuccess,
    onError
  );
}

// 總旅行時間
Number.prototype.toMMSS = function () {
  return `${Math.floor(this / 60)} minutes ${this % 60} seconds.`;
};

// Now use the map as required...
// calculateRouteFromAtoB (platform);

// 取得json的資料並傳入element
function processFormData(data) {
  const orderIcon = new H.map.Icon('../img/order.png');

  $.each(data, (index, element) => {
    // window.Origin =`${element.origin.farmLatitude}, ${element.origin.farmLongitude}`
    window.Origin = '25.0786063,121.526246';
    $.each(element.orders, (i, item) => {
      window.Destination = `${item.latitude},${item.longitude}`;
      calculateRouteFromAtoB(platform);

      const orderpointMarker = new H.map.Marker({
        lat: `${item.latitude}`,
        lng: `${item.longitude}`
      }, {
        icon: orderIcon
      });
      map.setCenter(orderpointMarker.getPosition());
      map.setZoom(14);
      map.addObject(orderpointMarker);

      window.Origin = window.Destination;
    });
  });
}

// -----------------------------------------

function hideOrderItems() {
  $('.order').hide();
  $('.order__content').hide();
  $('#orders .list__item').children('div:nth-child(2)').hide();
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
        break;
      }
    }

    $(`#route${routeIDNumber} .order .order__item`).eq(orderContentSeq)
      .children('.order__content').children(`.user${element.id}`)
      .text(element.name);
    $(`#route${routeIDNumber} .order .order__item`).eq(orderContentSeq)
      .children('.order__content').children(`.phone${element.id}`)
      .text(element.cellphone);
    $(`#route${routeIDNumber} .order .order__item`).eq(orderContentSeq)
      .children('.order__content').children(`.price${element.id}`)
      .text(element.profit);
  });

  $.each(orders, (index, element) => {
    const date = new Date(element.arrivalTime);
    $('#orders>.list').append(`<div class="list__item">
            <div class="dropdown">
              <i class="fa fa-angle-right"></i>
              <h3>order ${element.id}</h3>
            </div>
            <div>
              USER : ${element.name} <br>
              PHONE: ${element.cellphone} <br>
              DATE : ${date.toDateString()} <br>
              ADDR : ${element.address} <br>
            </div>
          </div>`);
    $('#orders .list__item').eq(index).attr('id', `order${element.id}`);
  });
}

function appendOrderItems(orders, routeID) {
  const seqArr = [];
  const idArr = [];

  $.each(orders, (index, element) => {
    const seq = element.orderSequence;
    const date = new Date(element.arrivalTime);
    $(`#route${routeID} .order .order__item`).eq((seq - 1)).append(`<div class="order__content">
      USER : <span class="user${element.orderID}"></span> <br>
      ID &nbsp;&nbsp;: ${element.orderID} <br>
      DATE : ${date.toDateString()} <br>
      PHONE: <span class="phone${element.orderID}"></span> <br>
      ADDR : ${element.orderAddress} <br>
      PRICE: <span class="price${element.orderID}"></span> <br>
      LIST : <br>
    </div>`);
    seqArr.push(seq - 1);
    idArr.push(element.orderID);
  });
  orderSeqNumber.push(seqArr);
  orderIDNumber.push(idArr);
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

function getOrders() {
  $.get('https://graduation.jj97181818.me/api/orders?history=0')
    .done((req) => {
      appendOrderContent(req, orderSeqNumber, orderIDNumber);
    })
    .fail(() => {
      alert('Error!');
    })
    .always(() => {
      hideOrderItems();
    });
}

function getRoutes() {
  $.get('https://graduation.jj97181818.me/api/routes')
    .done((req) => {
      appendListItems(req.routes);
      processFormData(req.routes);
    })
    .fail(() => {
      alert('Error!');
    })
    .always(() => {
      getOrders();
    });
}

$(document).ready(() => {
  getRoutes(); // TODO: 定時更新
  $('.list').hide();
  $('.tag').css('left', '0');
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
    $('.tag').css('left', '250px');
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
    console.log(index);
  }
});