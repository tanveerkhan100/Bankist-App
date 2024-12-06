'use strict';

const account1 = {
  owner: 'Jonas shmedtmann',
  movements: [200, 450, -400, 3000, -650, -140, 30, 1300],
  interestRate: 1.2, //%
  pin: 1111,
};
const account2 = {
  owner: 'Jessica jey',
  movements: [200, 650, -600, 3000, -650, -340, 30, 1300],
  interestRate: 1.5, //%
  pin: 2222,
};
const account3 = {
  owner: 'horland pal',
  movements: [200, 750, -400, 2000, -750, -40, 30, 1300],
  interestRate: 0.8, //%
  pin: 3333,
};
const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawl';

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov} €</div>
        </div>
        `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance} €`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};
createUsernames(accounts);

const calcDisplaySummary = function (acc) {
  const sumIn = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const sumOut = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const sumInt = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr)
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumIn.textContent = `${sumIn} €`;
  labelSumOut.textContent = `${Math.abs(sumOut)} €`;
  labelSumInterest.textContent = `${sumInt} €`;
};

/////////////////////////////////////////////////////////////
// Log in
let currentAccount;

const updateUI = function (acc) {
  displayMovements(acc.movements);

  // display Balance
  calcDisplayBalance(acc);

  // display Summary
  calcDisplaySummary(acc);
};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split('')[0]
    }`;
    containerApp.style.opacity = 100;

    // input field empty
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // display Movement
    updateUI(currentAccount);
  }

  ////////////////////////////////////////////////
  // transfer amounts

  btnTransfer.addEventListener('click', function (e) {
    e.preventDefault();

    const amount = Number(inputTransferAmount.value);
    const receiveAcc = accounts.find(
      (acc) => acc.username === inputTransferTo.value
    );
    inputTransferAmount.value = inputTransferTo.value = '';

    if (
      amount > 0 &&
      currentAccount.balance >= amount &&
      receiveAcc &&
      receiveAcc?.username !== currentAccount.username
    ) {
      currentAccount.movements.push(-amount);
      receiveAcc.movements.push(amount);
    }
    updateUI(currentAccount);
  });
});

/////////////////////////////////////////////////////////
// request Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  inputLoanAmount.value = '';
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    // add movement
    currentAccount.movements.push(amount);

    // updateUI
    updateUI(currentAccount);
  }
});

//////////////////////////////////////////////////////
// logout account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    // delete account
    accounts.splice(index, 1);

    // hide account
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

//////////////////////////////////////////
// Sorting movements
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

const movements = [200, 350, -200, 230, -80, -250];
/*
// challenge No. 1

const checkDogs = function (julia, kate) {
  const correctDogs = julia.slice();
  correctDogs.splice(0, 1);
  correctDogs.splice(-2);

  const dogs = correctDogs.concat(kate);
  console.log(dogs);

  dogs.forEach(function (dog, i) {
    if (dog >= 3) {
      console.log(`Dog number ${i + 1} is an adult, and is ${dog} year old`);
    } else {
      console.log(`Dog number ${i + 1} is still a puppy`);
    }
  });
};

checkDogs([1, 2, 5, 12, 15], [3, 5, 2, 1, 7]);

const eurToUSD = 1.1;

// Arrow function
// const change = movements.map(mov =>  mov * eurToUSD)

const change1 = movements.map(function (mov) {
  return mov * eurToUSD;
});
console.log(change1);

const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eurToUSD);
console.log(movementsUSDfor);

const description = movements.map(
  (mov, i) =>
    ` movement ${i + 1}: you ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
      mov)
    }`
);
console.log(description);

// forEach loop 
const description1 = [];
movements.forEach(function(mov, i){
  if(mov > 0){
    description1.push(`movement ${i + 1}: you deposited ${mov}`)
  }
  else{
    description1.push(`movement ${i + 1}: you withdrew ${Math.abs(mov)}`)
  }
})
console.log(description1);


///////////////////////////////////////////////////////////
// filter

const withdrawls = movements.filter(mov => mov < 0)
const deposits = movements.filter(function(mov){ 
  return  mov > 0
})
console.log(movements)
console.log(withdrawls)
console.log(deposits)


////////////////////////////////////////////////////////////
// reduce method

const balance = movements.reduce((acc, cur) => acc + cur, 0);
console.log(balance);

// for loop
let balance2 = 0;
for (const mov of movements) balance2 += mov;
console.log(balance2);

// another example
const max = movements.reduce(
  // if else in shorter form 
  (acc, mov) => (acc > mov ? acc : mov),
  movements[0]
);

console.log(max);

//////////////////////////////////////////////////////
// challeng 2

const calcAverageHumanAge = function (ages) {
  const humAge = ages.map((age) => (age <= 2 ? 2 * age : 16 + age * 4));
  const adult = humAge.filter((age) => age >= 18);
  console.log(humAge);
  console.log(adult);

  // const average = adult.reduce((acc, cur) => acc + cur, 0) / adult.length;
  // same as upper ^
  const average = adult.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
  
  return average;
};

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

console.log(avg1, avg2)


const eurToUSD = 1.1;

// PIPLINE 
const totalDepositsUSD = movements
  .filter((mov) => mov > 0)
  .map((mov) => mov * eurToUSD)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositsUSD);


///////////////////////////////////////////////////
// challenge 3
const calcAverageHumanAge = (ages) =>
  ages
    .map((age) => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter((age) => age >= 18)
    .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);

console.log(avg1, avg2);

//////////////////////////////////////////////
// find method

const firstWithdrawl = movements.find((mov) => mov < 0);

console.log(movements);
console.log(firstWithdrawl);

const account = accounts.find((acc) => acc.owner === 'Jonas shmedtmann');

console.log(account);

//////////////
// equality
console.log(movements.includes(-130));

//
const deposit = (mov) => mov > 0;
// some
console.log(movements.some(deposit));
// every
console.log(movements.every(deposit));
// filter
console.log(movements.filter(deposit));

/////////////////////////
// flat method
const overallBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

// flatMap
const overallBalance2 =  accounts
.flatMap((acc) => acc.movements)
.reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);


/////////////////////////////
// sorting arrays
const arr = ['zeeshan', 'Ahmad', 'javed', 'Farhan'];
console.log(arr);
console.log(arr.sort());

console.log(movements);
// return < 0 A, B (Keep order) 
// return > 0 B, A (switch order) 

// Ascending 
// movements.sort((a, b) => {
//   if(a > b)
//     return 1
//   if(a < b)
//     return -1
// })
movements.sort((a, b) => a - b);
console.log(movements);

// Descending 
// movements.sort((a, b) => {
//   if(a > b)
//     return -1
//   if(a < b)
//     return 1
// })
movements.sort((a, b) => b - a)
console.log(movements);
*/

/////////////////////////////////////////
// Array fill method
const z = Array.from({ lengthL: 7 }, (_, i) => i + 1);
console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value')
  );
  (el) => Number(el.textContent('€', ''));
  console.log(movementsUI);

  // second method
  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  console.log(movementsUI2);
});

///////////////////////////////////////////////////////
// practice Exercise 3
const { deposits, withdrawls } = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawls += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawls'] += cur;

      return sums;
    },
    { deposits: 0, withdrawls: 0 }
  );

console.log(deposits, withdrawls);

// exercise 4
const convertTitleCase = function (title) {
  const capitelize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'and', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map((word) =>
      exceptions.includes(word) ? word : capitelize(word)
    ).join(' ');

  return capitelize(titleCase);
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is a another title with an EXAMPLE'));
