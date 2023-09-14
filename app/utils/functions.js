let jwt = require("jsonwebtoken");

function validatorMapper(errors = []) {
  let message = {};
  errors.forEach((error) => {
    message[error.path] = error.msg;
  });
  return message;
}
// function to generate 4 int otp code
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000);
}
function generateAdminToken() {
  let token = jwt.sign(
    { id: "65021d9878a4b27020a87ff6" },
    process.env.JWT_SECRET
  );
  console.log(token);
}

function generateCoupon() {
  // generate coupon with string like keuiidanc length of 5
  let english_letters = [
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
  ];
  let numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  // random selection from english_letters and numbers until the length of 5 some time uper case wortd
  let coupon_code = "";
  for (let i = 0; i < 5; i++) {
    coupon_code +=
      english_letters[Math.floor(Math.random() * english_letters.length)] +
      numbers[Math.floor(Math.random() * numbers.length)];
  }
  return coupon_code;
}

function generatePaginationInfo(total_count, limit, page) {
  const total_pages = Math.ceil(total_count / limit);
  const has_last_page = page > 1;
  const has_next_page = page < total_count && total_count > limit;
  let metadata = {
    total_count,
    total_pages,
    has_last_page,
    has_next_page,
  };
  console.log(metadata)
  return metadata
}

module.exports = {
  validatorMapper,
  generateOTP,
  generateCoupon,
  generatePaginationInfo
};
