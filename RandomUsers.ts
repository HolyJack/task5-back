import { Faker, fakerUK, fakerEN_US, fakerTR, faker } from "@faker-js/faker";

export function getFaker(local: string, seed: number) {
  let newFaker = faker;
  local === "us" && (newFaker = fakerEN_US);
  local === "tr" && (newFaker = fakerTR);
  local === "uk" && (newFaker = fakerUK);
  newFaker.seed(seed);
  return newFaker;
}

type RandomUserApiGenerator = {
  local: string;
  seed: number;
  page: number;
};

function randomUserApiGenerator({ local, seed, page }: RandomUserApiGenerator) {
  const faker = getFaker(local, seed + page) as Faker;
  let index = 0;

  function getRandomUser() {
    index++;

    const fullName = faker.person.fullName();

    const state = faker.location.state();
    const city = faker.location.city();
    const streetAddress = faker.location.streetAddress({
      useFullAddress: true,
    });
    const zipcode = faker.location.zipCode();
    const address = faker.helpers
      .arrayElements([state, city, zipcode], {
        min: 2,
        max: 3,
      })
      .concat([streetAddress])
      .join(", ");
    const phoneNumber = faker.phone.number();
    const uuid = faker.string.uuid();

    return { "#": index + page * 10, uuid, fullName, address, phoneNumber };
  }

  function getRandomUsers() {
    const users = Array(10)
      .fill(null)
      .map(() => getRandomUser());
    return users;
  }

  const randomUserApi = {
    get: getRandomUser,
    getMany: getRandomUsers,
  };

  return randomUserApi;
}

const localeAlphabets: Record<string, string[]> = {
  us: [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ],
  uk: [
    "а",
    "б",
    "в",
    "г",
    "ґ",
    "д",
    "е",
    "є",
    "ж",
    "з",
    "и",
    "і",
    "ї",
    "й",
    "к",
    "л",
    "м",
    "н",
    "о",
    "п",
    "р",
    "с",
    "т",
    "у",
    "ф",
    "х",
    "ц",
    "ч",
    "ш",
    "щ",
    "ь",
    "ю",
    "я",
  ],
  tr: [
    "a",
    "b",
    "c",
    "ç",
    "d",
    "e",
    "f",
    "g",
    "ğ",
    "h",
    "ı",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "ö",
    "p",
    "r",
    "s",
    "ş",
    "t",
    "u",
    "ü",
    "v",
    "y",
    "z",
  ],
};

function generateDigitsAndPrintableCharsArray() {
  const digits = Array.from({ length: 10 }, (_, i) => i.toString());
  const printableChars = Array.from({ length: 95 }, (_, i) =>
    String.fromCharCode(i + 32),
  ); // ASCII printable characters start from 32

  return digits.concat(printableChars);
}
const digitsAndPritChars = generateDigitsAndPrintableCharsArray();

function addErrorsToUser(
  user: {
    "#": number;
    uuid: string;
    fullName: string;
    address: string;
    phoneNumber: string;
  },
  local: string,
  amount: number,
) {
  const faker = getFaker(local, user["#"]);
  const fullTextSize =
    user.fullName.length + user.address.length + user.phoneNumber.length;
  const fullNameWeight = user.fullName.length / fullTextSize;
  const adressWeight = user.address.length / fullTextSize;
  const fullNameErros =
    0.25 *
    faker.helpers.rangeToNumber({ min: 0, max: 4 * amount * fullNameWeight });
  const addressErrors =
    0.25 *
    faker.helpers.rangeToNumber({
      min: 0,
      max: 4 * amount * adressWeight,
    });
  const phoneNumberErrors = amount - fullNameErros - addressErrors;

  function removeRandomChar(value: string) {
    const i = faker.helpers.rangeToNumber({ min: 0, max: value.length });
    return value.slice(0, i) + value.slice(i + 1);
  }

  function addRandomChar(value: string) {
    const i = faker.helpers.rangeToNumber({ min: 0, max: value.length });

    return (
      value.slice(0, i) +
      faker.helpers.arrayElement<string>(
        localeAlphabets[local].concat(digitsAndPritChars),
      ) +
      value.slice(i)
    );
  }

  function switchNeighbors(value: string) {
    const i = faker.helpers.rangeToNumber({ min: 0, max: value.length });
    const c1 = value.charAt(i);
    const c2 = value.charAt(i + 1);
    const new_value = value.slice(0, i) + c2 + c1 + value.slice(i + 2);
    return new_value;
  }

  function addErros(str: string, amount: number) {
    let strWithErrors = str;
    while (amount > 0) {
      if (
        (0 < amount &&
          amount < 1 &&
          faker.helpers.maybe(() => true, { probability: amount })) ||
        amount >= 1
      )
        strWithErrors = removeRandomChar(strWithErrors);

      amount--;
      if (
        (0 < amount &&
          amount < 1 &&
          faker.helpers.maybe(() => true, { probability: amount })) ||
        amount >= 1
      )
        strWithErrors = addRandomChar(strWithErrors);
      amount--;
      if (
        (0 < amount &&
          amount < 1 &&
          faker.helpers.maybe(() => true, { probability: amount })) ||
        amount >= 1
      )
        strWithErrors = switchNeighbors(strWithErrors);
      amount--;
    }

    return strWithErrors;
  }

  return {
    ...user,
    fullName: addErros(user.fullName, fullNameErros),
    address: addErros(user.address, addressErrors),
    phoneNumber: addErros(user.phoneNumber, phoneNumberErrors),
  };
}

export { addErrorsToUser };
export default randomUserApiGenerator;
