let a = window.location.origin.split(`:${window.location.port}`)

const URL = a[0] + ':3030/jokes'

export const getAll = () => {
    return fetch(`${URL}`)
        .then(res => res.json())
}

export const allJokesByUser = (userId) => {
    return fetch(`${URL}/getAllJokesByUser/${userId}`)
        .then(res => res.json())
}

export const allLikedJokesByUser = (userId) => {
    return fetch(`${URL}/getAllLikedJokesByUser/${userId}`)
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
