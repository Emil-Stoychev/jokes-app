let a = window.location.origin.split(`:${window.location.port}`);

const URL = a[0] + ":3030/users";

export const getUserByToken = (token) => {
  return fetch(`${URL}/getUserByToken/${token}`).then((res) => res.json());
};

export const login = (data) => {
  return fetch(`${URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export const register = (data) => {
  return fetch(`${URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};

export const editUserAcc = (data, token) => {
  return fetch(`${URL}/editProfile/${token}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => res.json());
};
