const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abcd';

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

const hashedPassword ="$2a$10$ELWmm3tk3Qp.4Cp0lH3GGecJH1btjbYtR/ZWUwy6LpUFwYx3E2S9m";


bcrypt.compare(password, hashedPassword,(err, res) => {
    console.log(res);
});


// const data = {
//     id: 20
// }

// const token = jwt.sign(data, '123abc'); 

// console.log(token);

// const decoded = jwt.verify(token, '123abc');
// console.log('decoded', decoded);
// const message = "I am user number 3";
// const hash = SHA256(message).toString();
// console.log(`Hash: ${hash}`);

// const data = {
//     id: 4
// }

// const token = {
//     data,
//     hash: SHA256(JSON.stringify(data).toString()+"some secret")
// }