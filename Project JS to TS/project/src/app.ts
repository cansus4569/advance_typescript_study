// utils
function $(selector) {
  return document.querySelector(selector);
}
function getUnixTimestamp(date) {
  return new Date(date).getTime();
}

// DOM
const confirmedTotal = $('.confirmed-total');
const deathsTotal = $('.deaths');
const recoveredTotal = $('.recovered');
const lastUpdatedTime = $('.last-updated-time');
const rankList = $('.rank-list');
const deathsList = $('.deaths-list');
const recoveredList = $('.recovered-list');
const deathSpinner = createSpinnerElement('deaths-spinner');
const recoveredSpinner = createSpinnerElement('recovered-spinner');

function createSpinnerElement(id) {
  const wrapperDiv = document.createElement('div');
  wrapperDiv.setAttribute('id', id);
  wrapperDiv.setAttribute(
    'class',
    'spinner-wrapper flex justify-center align-center'
  );
  const spinnerDiv = document.createElement('div');
  spinnerDiv.setAttribute('class', 'ripple-spinner');
  spinnerDiv.appendChild(document.createElement('div'));
  spinnerDiv.appendChild(document.createElement('div'));
  wrapperDiv.appendChild(spinnerDiv);
  return wrapperDiv;
}

// state
let isDeathLoading = false;
let isRecoveredLoading = false;
const baseURL =
  `http://apis.data.go.kr/1352000/ODMS_COVID_04/callCovid04Api?serviceKey=${API_KEY}&apiType=json`;

// xmlToJson
function xmlToJson(xml) {
  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) {
    // element
    // do attributes
    if (xml.attributes.length > 0) {
      obj['@attributes'] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) {
    // text
    obj = xml.nodeValue;
  }

  // do children
  // If all text nodes inside, get concatenated text from them.
  var textNodes = [].slice.call(xml.childNodes).filter(function (node) {
    return node.nodeType === 3;
  });
  if (xml.hasChildNodes() && xml.childNodes.length === textNodes.length) {
    obj = [].slice.call(xml.childNodes).reduce(function (text, node) {
      return text + node.nodeValue;
    }, '');
  } else if (xml.hasChildNodes()) {
    for (var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof obj[nodeName] == 'undefined') {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof obj[nodeName].push == 'undefined') {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}

// api
function fetchCovidSummary() {
  const url = `${baseURL}&std_day=2021-12-15`;
  return axios.get(url);
}

function fetchCountryInfo(countryCode) {
  // params: confirmed, recovered, deaths
  const url = `${baseURL}&numOfRows=7&gubun=${encodeURIComponent(countryCode)}`;
  return axios.get(url);
}

// methods
function startApp() {
  setupData();
  initEvents();
}

// events
function initEvents() {
  rankList.addEventListener('click', handleListClick);
}

async function handleListClick(event) {
  let selectedId;
  if (
    event.target instanceof HTMLParagraphElement ||
    event.target instanceof HTMLSpanElement
  ) {
    selectedId = event.target.parentElement.id;
  }
  if (event.target instanceof HTMLLIElement) {
    selectedId = event.target.id;
  }
  if (isDeathLoading) {
    return;
  }

  clearDeathList();
  clearRecoveredList();
  startLoadingAnimation();
  isDeathLoading = true;

  const xmlString = await fetchCountryInfo(selectedId);
  let xmlNode = new DOMParser().parseFromString(xmlString.data, 'text/xml');
  const jsonData = xmlToJson(xmlNode);
  const data = jsonData.response.body.items.item;

  // const { data: deathResponse } = await fetchCountryInfo(selectedId, 'deathCnt');
  // const { data: recoveredResponse } = await fetchCountryInfo(
  //   selectedId,
  //   'isolClearCnt'
  // );
  // const { data: confirmedResponse } = await fetchCountryInfo(
  //   selectedId,
  //   'defCnt'
  // );
  endLoadingAnimation();
  setDeathsList(data);
  setTotalDeathsByCountry(data);
  setRecoveredList(data);
  setTotalRecoveredByCountry(data);
  setChartData(data);
  isDeathLoading = false;
}

function setDeathsList(data) {
  const sorted = data.sort((a, b) => getUnixTimestamp(b.stdDay) - getUnixTimestamp(a.stdDay));
  sorted.forEach((value) => {
    const li = document.createElement('li');
    li.setAttribute('class', 'list-item-b flex align-center');
    const span = document.createElement('span');
    span.textContent = value.deathCnt;
    span.setAttribute('class', 'deaths');
    const p = document.createElement('p');
    p.textContent = new Date(value.stdDay).toLocaleDateString().slice(0, -1);
    li.appendChild(span);
    li.appendChild(p);
    deathsList.appendChild(li);
  });
}

function clearDeathList() {
  deathsList.innerHTML = null;
}

function setTotalDeathsByCountry(data) {
  deathsTotal.innerText = data.reduce((total, current) => total += parseInt(current.deathCnt), 0);
  // deathsTotal.innerText = data[0].Cases;
}

function setRecoveredList(data) {
  const sorted = data.sort(
    (a, b) => getUnixTimestamp(b.stdDay) - getUnixTimestamp(a.stdDay)
  );
  sorted.forEach((value) => {
    const li = document.createElement('li');
    li.setAttribute('class', 'list-item-b flex align-center');
    const span = document.createElement('span');
    span.textContent = value.isolClearCnt;
    span.setAttribute('class', 'recovered');
    const p = document.createElement('p');
    p.textContent = new Date(value.stdDay).toLocaleDateString().slice(0, -1);
    li.appendChild(span);
    li.appendChild(p);
    recoveredList.appendChild(li);
  });
}

function clearRecoveredList() {
  recoveredList.innerHTML = null;
}

function setTotalRecoveredByCountry(data) {
  recoveredTotal.innerText = data.reduce((total, current) => total += parseInt(current.isolClearCnt), 0);
  // recoveredTotal.innerText = data[0].Cases;
}

function startLoadingAnimation() {
  deathsList.appendChild(deathSpinner);
  recoveredList.appendChild(recoveredSpinner);
}

function endLoadingAnimation() {
  deathsList.removeChild(deathSpinner);
  recoveredList.removeChild(recoveredSpinner);
}

async function setupData() {
  const xmlString = await fetchCovidSummary();
  let xmlNode = new DOMParser().parseFromString(xmlString.data, 'text/xml');
  const jsonData = xmlToJson(xmlNode);
  const origin_data = jsonData.response.body.items.item;

  // 합계와 검역 데이터 제외
  const data = origin_data.filter(
    (item) => item.gubun !== '합계' && item.gubun !== '검역'
  );

  setTotalConfirmedNumber(data);
  setTotalDeathsByWorld(data);
  setTotalRecoveredByWorld(data);
  setCountryRanksByConfirmedCases(data);
  setLastUpdatedTimestamp(data);
}

function renderChart(data, labels) {
  var ctx = $('#lineChart').getContext('2d');
  Chart.defaults.color = '#f5eaea';
  // Chart.defaults.font.family = 'Exo 2';
  new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Confirmed for the day',
          backgroundColor: '#feb72b',
          borderColor: '#feb72b',
          data,
        },
      ],
    },
    options: {},
  });
}

function setChartData(data) {
  const sorted = data.sort((a, b) => getUnixTimestamp(a.stdDay) - getUnixTimestamp(b.stdDay));
  const chartData = sorted.slice(-7).map((value) => value.defCnt);
  const chartLabel = sorted
    .slice(-7)
    .map((value) => new Date(value.stdDay).toLocaleDateString().slice(0, -1));
  renderChart(chartData, chartLabel);
}

function setTotalConfirmedNumber(data) {
  confirmedTotal.innerText = data.reduce((total, current) => total += parseInt(current.defCnt), 0);
}

function setTotalDeathsByWorld(data) {
  deathsTotal.innerText = data.reduce((total, current) => total += parseInt(current.deathCnt), 0);
}

function setTotalRecoveredByWorld(data) {
  recoveredTotal.innerText = data.reduce((total, current) => total += parseInt(current.isolClearCnt), 0);
}

function setCountryRanksByConfirmedCases(data) {
  const sorted = data.sort((a, b) => b.defCnt - a.defCnt);
  sorted.forEach((value) => {
    const li = document.createElement('li');
    li.setAttribute('class', 'list-item flex align-center');
    li.setAttribute('id', value.gubun);
    const span = document.createElement('span');
    span.textContent = value.defCnt;
    span.setAttribute('class', 'cases');
    const p = document.createElement('p');
    p.setAttribute('class', 'country');
    p.textContent = value.gubun;
    li.appendChild(span);
    li.appendChild(p);
    rankList.appendChild(li);
  });
}

function setLastUpdatedTimestamp(data) {
  lastUpdatedTime.innerText = new Date(data[0].stdDay).toLocaleString();
}

startApp();
