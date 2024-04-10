/** 
 * Mapped Type (맵드 타입)
 * 기존에 정의된 타입을 새로운 타입으로 변환해주는 유틸리티 타입
 */
type Heroes = 'Hulk' | 'Capt' | 'Thor';
type HeroAges = { [K in Heroes]: number }; // for in 반복문과 유사한 형태

const ages: HeroAges = {
  Hulk: 33,
  Capt: 100,
  Thor: 1000,
};

// for in 반복문 코드
var arr = ['a', 'b', 'c'];
for (var key in arr) {
  console.log(key); // 0, 1, 2
  console.log(arr[key]); // a, b, c
}
