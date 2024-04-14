// 라이브러리 로딩 (npm 설치 라이브러리)
// import 변수명 from '라이브러리 이름'
// 변수, 함수 import 문법
// import {} from '파일 상대 경로';
import axios, { AxiosResponse } from 'axios';
import {
  Chart,
  LinearScale,
  LineController,
  CategoryScale,
  LineElement,
  PointElement,
  Filler,
} from 'chart.js';

// 타입 모듈
import { PublicDataPortalResponse, PublicDataPortalInfo } from './covid/index';

// utils
function $(selector: string) {
  return document.querySelector(selector); // Element 타입 반환
}
function getUnixTimestamp(date: Date | string) {
  return new Date(date).getTime();
}

// DOM
// var a: Element | HTMLElement | HTMLParagraphElement
const confirmedTotal = $('.confirmed-total') as HTMLSpanElement; // 타입 단언
const deathsTotal = $('.deaths') as HTMLParagraphElement; // 타입 단언
const recoveredTotal = $('.recovered') as HTMLParagraphElement; // 타입 단언
const lastUpdatedTime = $('.last-updated-time') as HTMLParagraphElement; // 타입 단언
const rankList = $('.rank-list');
const deathsList = $('.deaths-list');
const recoveredList = $('.recovered-list');
const deathSpinner = createSpinnerElement('deaths-spinner');
const recoveredSpinner = createSpinnerElement('recovered-spinner');

function createSpinnerElement(id: string): HTMLDivElement {
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

const api_key = 'abcd';
const baseURL: string = `http://apis.data.go.kr/1352000/ODMS_COVID_04/callCovid04Api?serviceKey=${api_key}&apiType=json`;

// xmlToJson
function xmlToJson(xml: Node): any {
  // Create the return object
  let obj: any = {};

  if (xml.nodeType == 1) {
    // Element
    const element = xml as Element;
    if (element.attributes && element.attributes.length > 0) {
      obj['@attributes'] = {};
      for (let j = 0; j < element.attributes.length; j++) {
        const attribute = element.attributes.item(j);
        obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) {
    // Text Node
    obj = xml.nodeValue;
  }

  // Handle children
  const childNodes = Array.from(xml.childNodes);
  const textNodes = childNodes.filter((node) => node.nodeType === 3);

  if (xml.hasChildNodes() && childNodes.length === textNodes.length) {
    obj = childNodes.reduce(
      (text: string, node: Node) => text + (node.nodeValue || ''),
      ''
    );
  } else if (xml.hasChildNodes()) {
    for (let i = 0; i < childNodes.length; i++) {
      const item = childNodes[i];
      const nodeName = item.nodeName;
      if (typeof obj[nodeName] === 'undefined') {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (!Array.isArray(obj[nodeName])) {
          const old = obj[nodeName];
          obj[nodeName] = [old];
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}

// api
function fetchCovidSummary(): Promise<AxiosResponse<string>> {
  const url = `${baseURL}&std_day=2021-12-15`;
  return axios.get(url);
}

// enum CovidStatus {
//   Confirmed = 'defCnt',
//   Recovered = 'isolClearCnt',
//   Deaths = 'deathCnt',
// }

function fetchCountryInfo(countryCode: string): Promise<AxiosResponse<string>> {
  // params: confirmed, recovered, deaths
  const url = `${baseURL}&numOfRows=7&gubun=${encodeURIComponent(countryCode)}`;
  return axios.get(url);
}

// methods
function startApp(): void {
  setupData();
  initEvents();
}

// events
function initEvents(): void {
  rankList.addEventListener('click', handleListClick);
}

async function handleListClick(event: MouseEvent) {
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
  const xmlNode = new DOMParser().parseFromString(xmlString.data, 'text/xml');
  const jsonData = xmlToJson(xmlNode);
  const data: PublicDataPortalResponse = jsonData.response.body.items.item;

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

function setDeathsList(data: PublicDataPortalResponse): void {
  const sorted = data.sort(
    (a: PublicDataPortalInfo, b: PublicDataPortalInfo) =>
      getUnixTimestamp(b.stdDay) - getUnixTimestamp(a.stdDay)
  );
  sorted.forEach((value: PublicDataPortalInfo) => {
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

function clearDeathList(): void {
  deathsList.innerHTML = null;
}

function setTotalDeathsByCountry(data: PublicDataPortalResponse): void {
  deathsTotal.innerText = data
    .reduce(
      (total: number, current: PublicDataPortalInfo) =>
        (total += parseInt(current.deathCnt)),
      0
    )
    .toString();
  // deathsTotal.innerText = data[0].Cases;
}

function setRecoveredList(data: PublicDataPortalResponse): void {
  const sorted = data.sort(
    (a: PublicDataPortalInfo, b: PublicDataPortalInfo) =>
      getUnixTimestamp(b.stdDay) - getUnixTimestamp(a.stdDay)
  );
  sorted.forEach((value: PublicDataPortalInfo) => {
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

function clearRecoveredList(): void {
  recoveredList.innerHTML = null;
}

function setTotalRecoveredByCountry(data: PublicDataPortalResponse): void {
  recoveredTotal.innerText = data
    .reduce(
      (total: number, current: PublicDataPortalInfo) =>
        (total += parseInt(current.isolClearCnt)),
      0
    )
    .toString();
  // recoveredTotal.innerText = data[0].Cases;
}

function startLoadingAnimation(): void {
  deathsList.appendChild(deathSpinner);
  recoveredList.appendChild(recoveredSpinner);
}

function endLoadingAnimation(): void {
  deathsList.removeChild(deathSpinner);
  recoveredList.removeChild(recoveredSpinner);
}

async function setupData() {
  const { data } = await fetchCovidSummary();
  const xmlNode = new DOMParser().parseFromString(data, 'text/xml');
  const jsonData = xmlToJson(xmlNode);
  const originData: PublicDataPortalResponse =
    jsonData.response.body.items.item;

  // 합계와 검역 데이터 제외
  const finData: PublicDataPortalResponse = originData.filter(
    (item: PublicDataPortalInfo) =>
      item.gubun !== '합계' && item.gubun !== '검역'
  );

  setTotalConfirmedNumber(finData);
  setTotalDeathsByWorld(finData);
  setTotalRecoveredByWorld(finData);
  setCountryRanksByConfirmedCases(finData);
  setLastUpdatedTimestamp(finData);
}

function renderChart(data: number[], labels: string[]): void {
  // const lineChart = $('#lineChart') as HTMLCanvasElement;
  // const ctx = lineChart.getContext('2d');
  const ctx = ($('#lineChart') as HTMLCanvasElement).getContext('2d');
  Chart.defaults.color = '#f5eaea';
  Chart.defaults.font.family = 'Exo 2';

  // Chart.js 업데이트로 인해 register 메소드 추가
  Chart.register(
    LineElement,
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    Filler
  );

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
          fill: true,
        },
      ],
    },
    options: {},
  });
}

function setChartData(data: PublicDataPortalResponse): void {
  const sorted = data.sort(
    (a: PublicDataPortalInfo, b: PublicDataPortalInfo) =>
      getUnixTimestamp(a.stdDay) - getUnixTimestamp(b.stdDay)
  );
  const chartData = sorted
    .slice(-7)
    .map((value: PublicDataPortalInfo) => parseInt(value.defCnt));
  const chartLabel = sorted
    .slice(-7)
    .map((value: PublicDataPortalInfo) =>
      new Date(value.stdDay).toLocaleDateString().slice(0, -1)
    );
  renderChart(chartData, chartLabel);
}

function setTotalConfirmedNumber(data: PublicDataPortalResponse): void {
  confirmedTotal.innerText = data
    .reduce(
      (total: number, current: PublicDataPortalInfo) =>
        (total += parseInt(current.defCnt)),
      0
    )
    .toString();
}

function setTotalDeathsByWorld(data: PublicDataPortalResponse): void {
  deathsTotal.innerText = data
    .reduce(
      (total: number, current: PublicDataPortalInfo) =>
        (total += parseInt(current.deathCnt)),
      0
    )
    .toString();
}

function setTotalRecoveredByWorld(data: PublicDataPortalResponse): void {
  recoveredTotal.innerText = data
    .reduce(
      (total: number, current: PublicDataPortalInfo) =>
        (total += parseInt(current.isolClearCnt)),
      0
    )
    .toString();
}

function setCountryRanksByConfirmedCases(data: PublicDataPortalResponse): void {
  const sorted = data.sort(
    (a: PublicDataPortalInfo, b: PublicDataPortalInfo) =>
      parseInt(b.defCnt) - parseInt(a.defCnt)
  );
  sorted.forEach((value: PublicDataPortalInfo) => {
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

function setLastUpdatedTimestamp(data: PublicDataPortalResponse): void {
  lastUpdatedTime.innerText = new Date(data[0].stdDay).toLocaleString();
}

startApp();
