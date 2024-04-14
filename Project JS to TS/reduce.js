var heroes = [
  { name: 'capt', age: 100 },
  { name: 'thor', age: 1000 },
];

console.log(
  heroes.reduce((total, currentItem) => {
    total = total + currentItem.age;
    return total;
  }, 0)
);
