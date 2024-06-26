// 예전 비동기 처리
function fetchData() {
  $.ajax('users/1', function(user) {
    console.log(user);
    $.ajax('users/2', ...);
  });
  console.log(user);
}

// 최신 비동기 처리
async function fetchData() {
    var user = await $.ajax('users/1');
    console.log(user);
}
