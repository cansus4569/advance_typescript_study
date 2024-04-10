/** Pick 유틸리티 */
interface Product {
  id: number;
  name: string;
  price: number;
  brand: string;
  stock: number;
}

// 1. 상품 목록을 받아오기 위한 API 함수
function fetchProducts(): Promise<Product[]> {
  // ...
}

// Product 인터페이스와 중첩되는 부분이 많음 => 그래서 유틸리티를 사용함
// interface ProductDetail {
//   id: number;
//   name: string;
//   price: number;
// }

// 2. 특정 상품의 상세 정보를 나타내기 위한 함수
type ShoppingItem = Pick<Product, 'id' | 'name' | 'price'>; // Pick 유틸리티 타입을 사용하여 Product 인터페이스에서 id, name, price만 뽑아오기
function displayProductDetail(shoppingItem: ShoppingItem) {}

// interface UpdateProduct {
//     id?: number;
//     name?: string;
//     price?: number;
//     brand?: string;
//     stock?: number;
// }

type UpdateProduct = Partial<Product>; // Partial 유틸리티 타입을 사용하여 Product 인터페이스의 모든 속성을 옵셔널하게 만들기
// 3. 특정 상품 정보를 업데이트(갱신)하는 함수
function updateProductItem(productItem: UpdateProduct) {}

// 4. 유틸리티 타입 구현하기 - Partial
interface UserProfile {
  username: string;
  email: string;
  profilePhotoUrl: string;
}

// 불필요하게 타입 정의가 중복됨.
interface UserProfileUpdate {
    username?: string;
    email?: string;
    profilePhotoUrl?: string;
}

// #1
type UserProfileUpdate1 = {
  username?: UserProfile['username'];
  email?: UserProfile['email'];
  profilePhotoUrl?: UserProfile['profilePhotoUrl'];
};

// #2
type UserProfileUpdate2 = {
  [p in 'username' | 'email' | 'profilePhotoUrl']?: UserProfile[p];
};

// #3
//type UserProfileKeys = keyof UserProfile;
type UserProfileUpdate3 = {
  [p in keyof UserProfile]?: UserProfile[p];
};

// #4
type Subset<T> = {
  [p in keyof T]?: T[p];
};

/** Omit 유틸리티 */
// Omit 유틸리티 타입을 사용하여 Product 인터페이스에서 지정한 속성을 제외한 나머지만 뽑아온다.
interface AddressBook {
  name: string;
  phone: number;
  address: string;
  company: string;
}

const phoneBook: Omit<AddressBook, 'address'> = {
  name: '재택근무',
  phone: 1234567890,
  company: '회사',
};

const chingtao: Omit<AddressBook, 'address' | 'company'> = {
  name: '중극집',
  phone: 1234567890,
};
