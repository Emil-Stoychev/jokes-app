const { Joke } = require("../Models/Joke");
const { getUserByJokeAuthor } = require("./authService");

const getAll = async () => {
  try {
    return (await Joke.find().populate("author")) || [];
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getAllByUser = async (userId) => {
  try {
    let user = await getUserByJokeAuthor(userId);

    if (!user._id) {
      return { message: "User not exist!" };
    }

    return (await Joke.find({ author: userId })) || [];
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getAllLikedByUser = async (userId) => {
  try {
    let user = await getUserByJokeAuthor(userId);

    if (!user._id) {
      return { message: "User not exist!" };
    }

    return (await Joke.find({ likes: userId }).populate('author')) || [];
  } catch (error) {
    console.error(error);
    return error;
  }
};

const createJoke = async (container, userId) => {
  try {
    let user = await getUserByJokeAuthor(userId);

    if (!user._id) {
      return { message: "User is not exist!" };
    }

    let createdJoke = await Joke.create({
      author: user._id,
      text: container.text,
      textColor: container.textColor,
      bgColor: container.bgColor,
      size: container.size,
      textAlign: container.textAlign,
    });

    return createdJoke || {};
  } catch (error) {
    console.error(error);
    return error;
  }
};

const likeJoke = async (jokeId, userId) => {
  try {
    let currJoke = await Joke.findById(jokeId);

    if (!currJoke) {
      return { message: "Joke is not exist!" };
    }

    if (currJoke.author == userId) {
      return { message: "You cannot like your own joke!" };
    }

    if (currJoke.likes.includes(userId)) {
      await Joke.updateOne({ _id: jokeId }, { $pull: { likes: userId } });
    } else {
      await Joke.updateOne({ _id: jokeId }, { $push: { likes: userId } });
    }

    return await Joke.findById(jokeId);
  } catch (error) {
    console.error(error);
    return error;
  }
};

const deleteJoke = async (jokeId, userId) => {
  try {
    let joke = await Joke.findById(jokeId);
    let user = await getUserByJokeAuthor(userId);

    if (!user._id || userId != joke?.author) {
      return { message: "Access denied!" };
    }

    await Joke.findByIdAndDelete(jokeId);

    return joke;
  } catch (error) {
    console.error(error);
    return error;
  }
};
module.exports = {
  getAll,
  createJoke,
  likeJoke,
  getAllByUser,
  getAllLikedByUser,
  deleteJoke,
};
