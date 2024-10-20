export const getAllProducts = (e: string) => fetch(e).then((data) => data.json())

export const fetchUserPost = (e: string) => fetch(e, {method: "POST"}).then(data => data.json())