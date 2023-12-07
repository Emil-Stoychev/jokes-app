const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../Models/User");
const { deleteJokesByAuthorId } = require("./jokesService");

let secret = process.env.secret;

const getUserByToken = async (userId) => {
  try {
    let user = await User.findById(userId);

    if (!user) {
      return { message: "User not exist!" };
    }

    return {
      _id: user._id,
      username: user.username,
      rank: user.rank,
      avatar: user.avatar,
      createdAt: user.createdAt
    };
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
      _id: user._id,
      username: user.username,
      rank: user.rank,
      avatar: user.avatar,
      createdAt: user.createdAt
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
  try {
    const { username, password, newPassword, avatar } = data;
    let user = await User.findById(userId);

    if (!user?._id) return { message: "User not found!" };

    let isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { message: "Incorrect password!" };
    }

    if (newPassword.trim() != "") {
      if (newPassword.length > 3) {
        let hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
      }
    }
    user.avatar = avatar;
    user.save();

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
      _id: user._id,
      username: user.username,
      rank: user.rank,
      avatar: user.avatar,
      createdAt: user.createdAt
    };
  } catch (error) {
    return error;
  }
};

const deleteProfile = async (userId) => {
  try {
    let user = await User.findById(userId);

    if (!user?._id) return { message: "User not found!" };

    await deleteJokesByAuthorId(userId)
    await User.findByIdAndDelete(userId)

    return {}
  } catch (error) {
    return error;
  }
};

module.exports = {
  getUserByToken,
  login,
  register,
  editProfile,
  deleteProfile,
};
