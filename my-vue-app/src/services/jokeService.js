let a = window.location.origin.split(`:${window.location.port}`)

const URL = a[0] + ':3030/jokes'

export const getAll = (skip, createdAt) => {
    return fetch(`${URL}/${skip}/${createdAt}`)
        .then(res => res.json())
}

export const allJokesByUser = (userId, skip) => {
    return fetch(`${URL}/getAllJokesByUser/${userId}/${skip}`)
        .then(res => res.json())
}

export const allLikedJokesByUser = (userId, skip) => {
    return fetch(`${URL}/getAllLikedJokesByUser/${userId}/${skip}`)
        .then(res => res.json())
}

export const getJokeForEditById = (jokeId, token) => {
    return fetch(`${URL}/getJokeForEditById/${jokeId}/${token}`)
        .then(res => res.json())
}

export const createJoke = (data, token) => {
    return fetch(`${URL}/createJoke/${token}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}

export const editJokeById = (data, jokeId, token) => {
    return fetch(`${URL}/editJoke/${jokeId}/${token}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
}

export const likeJoke = (jokeId, token) => {
    return fetch(`${URL}/likeJoke/${jokeId}/${token}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify()
    })
        .then(res => res.json())
}

export const deleteJoke = (jokeId, token) => {
    return fetch(`${URL}/deleteJoke/${jokeId}/${token}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    })
}
