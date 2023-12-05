const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../Models/User");

let secret = process.env.secret;

const getUserByToken = async (userId) => {
  try {
    let userAcc = await User.findById(userId);

    if (!userAcc) {
      return { message: "User not exist!" };
    }

    return {
      _id: userAcc._id,
      username: userAcc.username,
      rank: userAcc.rank,
      avatar: userAcc.avatar,
    };
  } catch (error) {
    return error;
  }
};

const getUserByJokeAuthor = async (userId) => {
  try {
    let userAcc = await User.findById(userId);

    if (!userAcc) {
      return { message: "User not exist!" };
    }

    return userAcc;
  } catch (error) {
    return error;
  }
};

const login = async (data) => {
  try {
    let { username, password } = data;

    let user = await User.findOne({ username });

    if (!user) {
      return { message: "Wrong username or password!" };
    }

    let isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return { message: "Wrong username or password!" };
    }

    let result = await new Promise((resolve, reject) => {
      jwt.sign(
        { _id: user._id, username: user.username },
        secret,
        { expiresIn: "7d" },
        (err, token) => {
          if (err) {
            return reject(err);
          }

          resolve(token);
        }
      );
    });

    return {
      token: result,
      _id: user?._id,
      username: user?.username,
    };
  } catch (error) {
    return error;
  }
};

const register = async (data) => {
  try {
    let { username, password, avatar } = data;

    let user = await User.findOne({ username });

    if (user) {
      return { message: "Username is not available!" };
    }

    let hashedPassword = await bcrypt.hash(password, 10);

    let createdUser = {
      username,
      password: hashedPassword,
      avatar,
    };

    return await User.create(createdUser);
  } catch (error) {
    return error;
  }
};

const editProfile = async (data, userId) => {
  // try {
  //   let user = await User.findById(userId);
  //   if (!user?._id) return { message: "Потребителят не е намерен!" };
  //   const userAcc = await User.find({
  //     $and: [
  //       {
  //         $or: [{ username: data.username }, { phone: data.phone }],
  //       },
  //       {
  //         _id: { $ne: userId },
  //       },
  //     ],
  //   });
  //   if (userAcc.length > 0)
  //     return { message: "Името или номера вече са заети!" };
  //   let isValidPassword = await bcrypt.compare(data.oldPassword, user.password);
  //   if (!isValidPassword) {
  //     return { message: "Паролите не съвпадат!" };
  //   }
  //   if (data.newPassword.trim() != "") {
  //     let hashedPassword = await bcrypt.hash(data.newPassword, 10);
  //     user.password = hashedPassword;
  //   }
  //   user.username = data.username;
  //   user.phone = data.phone;
  //   user.image = data.image;
  //   user.save();
  //   let result = await new Promise((resolve, reject) => {
  //     jwt.sign(
  //       { _id: user._id, username: user.username },
  //       secret,
  //       { expiresIn: "7d" },
  //       (err, token) => {
  //         if (err) {
  //           return reject(err);
  //         }
  //         resolve(token);
  //       }
  //     );
  //   });
  //   return {
  //     token: result,
  //     _id: user?._id,
  //     username: user?.username,
  //     role: user?.role,
  //     image: user?.image,
  //     phone: user?.phone,
  //     active: user?.active,
  //     timeTable: user?.timeTable,
  //   };
  // } catch (error) {
  //   return error;
  // }
};

module.exports = {
  login,
  getUserByToken,
  register,
  editProfile,
  getUserByJokeAuthor
};
