function fetchData() {
  return {
    data: {
      name: 'capt',
      age: 100,
    },
    config: {},
    statusText: 'OK',
    headers: {},
  };
}

var result = fetchData();

console.log('result', result);
console.log('result.data', result.data);

var { data: captain, config, statusText } = fetchData();
// console.log(data);
console.log('config', config);
console.log('statusText', statusText);
console.log('captain', captain); // 별칭을 줄 수 있다.
