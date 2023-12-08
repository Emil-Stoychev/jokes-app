const { Joke } = require("../Models/Joke");
const { User } = require("../Models/User");

const getAll = async (skip = 0, limit = 10) => {
  try {
    return (await Joke.find()
      .populate("author")
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(limit)) || [];
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getAllByUser = async (userId, skip = 0, limit = 10) => {
  try {
    let user = await getUserByJokeAuthorId(userId);

    if (!user._id) {
      return { message: "User not exist!" };
    }

    return (await Joke.find({ author: userId })
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(limit)) || [];
  } catch (error) {
    console.error(error);
    return error;
  }
};

const getJokeForEditById = async (jokeId, userId) => {
  try {
    let user = await getUserByJokeAuthorId(userId);

    if (!user._id) {
      return { message: "User not exist!" };
    }

    let joke = await Joke.findById(jokeId);

    if (!joke._id) {
      return { message: "Joke not exist!" };
    }

    if (joke.author != userId) {
      return { message: "You cannot change this joke!" };
    }

    return joke;
  } catch (error) {
    return { message: "Invalid joke ID!" };
  }
};

const getAllLikedByUser = async (userId, skip = 0, limit = 10) => {
  try {
    let user = await getUserByJokeAuthorId(userId);

    if (!user._id) {
      return { message: "User not exist!" };
    }

    return (await Joke.find({ likes: userId })
      .populate("author")
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(limit)) || [];
  } catch (error) {
    console.error(error);
    return error;
  }
};

const createJoke = async (container, userId) => {
  try {
    let user = await getUserByJokeAuthorId(userId);

    let createdJoke = await Joke.create({
      author: user._id,
      text: container.text,
      textColor: container.textColor,
      bgColor: container.bgColor,
      size: container.size,
      textAlign: container.textAlign,
      fontWeight: container.fontWeight,
      fontStyle: container.fontStyle,
      letterSpacing: container.letterSpacing,
      fontFamily: container.fontFamily
    });

    return createdJoke || {};
  } catch (error) {
    console.error(error);
    return error;
  }
};

const editJoke = async (container, jokeId, userId) => {
  try {
    let user = await getUserByJokeAuthorId(userId);

    if (!user._id) {
      return { message: "User not exist!" };
    }

    let joke = await Joke.findById(jokeId);

    if (!joke._id) {
      return { message: "Joke not exist!" };
    }

    if (joke.author != userId) {
      return { message: "You cannot change this joke!" };
    }

    let editedJoke = await Joke.findByIdAndUpdate(jokeId, {
      text: container.text,
      textColor: container.textColor,
      bgColor: container.bgColor,
      size: container.size,
      textAlign: container.textAlign,
      fontWeight: container.fontWeight,
      fontStyle: container.fontStyle,
      letterSpacing: container.letterSpacing,
      fontFamily: container.fontFamily
    });

    return editedJoke;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const deleteJokesByAuthorId = async (author) => {
  try {
    return await Joke.deleteMany({ author })
  } catch (error) {
    console.log(error);
    return error
  }
}

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
    let user = await getUserByJokeAuthorId(userId);

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


// USER FUNC

const getUserByJokeAuthorId = async (userId) => {
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

module.exports = {
  getAll,
  createJoke,
  likeJoke,
  getAllByUser,
  getAllLikedByUser,
  getJokeForEditById,
  editJoke,
  deleteJoke,
  deleteJokesByAuthorId
};
