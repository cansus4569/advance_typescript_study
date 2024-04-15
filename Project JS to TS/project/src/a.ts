interface Hero {
  name: string;
  skill: string;
}

// const capt: Hero = {
//   name: 'capt',
//   skill: 'shield',
// };

// const capt: Hero = {};

// as 타입 단언을 주의해서 사용해야 한다.
const capt = {} as Hero;
capt.name = 'capt';
capt.skill = 'shield';

// non-null assertion operator : !
const abc: string | null;
abc!;
