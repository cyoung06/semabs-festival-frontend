
import { browser, dev } from '$app/environment';

const BASE_URL = (browser  && !dev) ?  `http://${location.host}/api` : "http://127.0.0.1:8081";

export const createMedia = async (file, name, progressReport) => {
    const form = new FormData()
    form.append("media", file)
    form.append("request", new Blob([JSON.stringify({name: name})], {
        type: "application/json"
    }))
    const xhr = new XMLHttpRequest();
    const resp = await new Promise((resolve) => {
        xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
                progressReport(event.loaded, event.total);
            }
        });
        xhr.responseType = 'json';
        xhr.addEventListener("readystatechange", () => {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                resolve(xhr.response)
            }
        })
        xhr.open("POST", `${BASE_URL}/eventmedia/`, true);
        xhr.send(form);
    })
    return await resp;
}
export const swapMedia = async (file, id, progressReport) => {
    const form = new FormData()
    form.append("media", file)
    const xhr = new XMLHttpRequest();
    const resp = await new Promise((resolve) => {
        xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
                progressReport(event.loaded, event.total);
            }
        });
        xhr.responseType = 'json';
        xhr.addEventListener("readystatechange", () => {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                resolve(xhr.response)
            }
        })
        xhr.open("PUT", `${BASE_URL}/eventmedia/${id}/media`, true);
        xhr.send(form);
    })
    return await resp;
}

export const renameMedia = async (id, name) => {
    const resp = await fetch(`${BASE_URL}/eventmedia/${id}/name`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name: name})
    });
    return await resp.json();
}

export const getMedias = async () =>  {
    const resp = await fetch(`${BASE_URL}/eventmedia/`, {
        method: "GET"
    });
    return await resp.json();
}

export const getMedia = async (id) => {
    const resp = await fetch(`${BASE_URL}/eventmedia/${id}`, {
        method: "GET"
    });
    return await resp.json();
}

export const deleteMedia = async (id) => {
    const resp = await fetch(`${BASE_URL}/eventmedia/${id}`, {
        method: "DELETE"
    });
    return;
}

export const getMediaDownloadUrl = (id) =>{
    return `${BASE_URL}/eventmedia/${id}/media`
}

export const addEvent = async (mediaId, event) => {
    const resp = await fetch(`${BASE_URL}/eventmedia/${mediaId}/events`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(event)
    });
    return await resp.json();
}

export const removeEvent = async (mediaId, event) => {
    const resp = await fetch(`${BASE_URL}/eventmedia/${mediaId}/events/${event.id}`, {
        method: "DELETE"
    });
    return await resp.json();
}

export const updateEvent = async (mediaId, event) => {
    await removeEvent(mediaId, event);
    const newEv = await addEvent(mediaId, event);
    event.id = newEv.id;
    return event;
}

export const getUsers = async () => {
    const resp = await fetch(`${BASE_URL}/user/`, {
        method: "GET"
    });
    return await resp.json();
}

export const addUser = async (username) => {
    const resp = await fetch(`${BASE_URL}/user/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/text"
        },
        body: username
    });
}

export const getCurrentVote = async () => {
    const resp = await fetch(`${BASE_URL}/vote/`, {
        method: "GET"
    });
    if (resp.status == 404) return null;
    return await resp.json();
}
export const voteFor = async (username, idx) => {
    const resp = await fetch(`${BASE_URL}/vote/vote`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name: username, index: idx})
    });
    if (resp.status == 404) return null;
    return;
}
export const getCurrentQuestion = async () => {
    const resp = await fetch(`${BASE_URL}/question/`, {
        method: "GET"
    });
    if (resp.status == 404) return null;
    return await resp.json();
}
export const getAllQuestion = async () => {
    const resp = await fetch(`${BASE_URL}/question/dump`, {
        method: "GET"
    });
    if (resp.status == 404) return null;
    return await resp.json();
}
export const answer = async (username, answer) => {
    const resp = await fetch(`${BASE_URL}/question/answer`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name: username, answer: answer})
    });
    if (resp.status == 404) return null;
    return await resp.json();
}

export const grade = async (id, name, correct) => {
    const resp = await fetch(`${BASE_URL}/question/${id}/grade`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name: name, correct: correct})
    });
    if (resp.status == 404) return null;
}

export const finishGrade = async (id) => {

    const resp = await fetch(`${BASE_URL}/question/${id}/finishGrade`, {
        method: "POST"
    });
    if (resp.status == 404) return null;
}
export const reDoGrade = async (id) => {
    const resp = await fetch(`${BASE_URL}/question/${id}/reGrade`, {
        method: "POST"
    });
    if (resp.status == 404) return null;
}

export const getPoints = async () => {

    const resp = await fetch(`${BASE_URL}/point/`, {
        method: "GET"
    });
    if (resp.status == 404) return null;
    return await resp.json();
}

export const getTime = async () => {
    const resp = await fetch(`${BASE_URL}/point/time`, {
        method: "GET"
    });
    if (resp.status == 404) return null;
    return await resp.json();
}
export const incPoint = async (username, amount) => {
    const resp = await fetch(`${BASE_URL}/point/inc`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({name: username, point: amount})
    });
    if (resp.status == 404) return null;
    return;
}
export const resetLeaderboard = async () => {

    const resp = await fetch(`${BASE_URL}/point/zero`, {
        method: "POST"
    });
    if (resp.status == 404) return null;
    return;
}

export const deleteUser = async(username) => {

    const resp = await fetch(`${BASE_URL}/user/delete`, {
        method: "POST",
        headers: {"Content-Type":"application/text"},
        body: username
    });
    if (resp.status == 404) return null;
    return;
}

export const pause = async () => {
    const resp = await fetch(`${BASE_URL}/playback/pause`, {
        method: "POST"
    });
}
export const play = async () => {
    const resp = await fetch(`${BASE_URL}/playback/resume`, {
        method: "POST"
    });
}
export const seek = async (ms) => {
    const resp = await fetch(`${BASE_URL}/playback/seek`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({timestamp: ms})
    });
}
export const stop = async () => {
    const resp = await fetch(`${BASE_URL}/playback/stop`, {
        method: "POST"
    });
}
export const getPlaybackStatus = async () => {
    const resp = await fetch(`${BASE_URL}/playback/`, {
        method: "GET"
    });
    return await resp.json();
}

export const beginEvent = async (id) => {
    const resp = await fetch(`${BASE_URL}/eventmedia/${id}/begin`, {
        method: "POST"
    });
    return;
}
export const nextMediaForce = async (id) => {
    const resp = await fetch(`${BASE_URL}/eventmedia/${id}/beginForce`, {
        method: "POST"
    });
    return;
}
