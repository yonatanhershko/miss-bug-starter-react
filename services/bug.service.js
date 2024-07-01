
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'


const BASE_URL = '/api/bug/'
const STORAGE_KEY = 'bugDB'

_createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
}


function query() {
    // return storageService.query(STORAGE_KEY)
    return axios.get(BASE_URL)
        .then(res => res.data)
        .catch(err => console.log(err))

}


function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
        // .then(bug => _setNextPrevbugId(bug))
}

// function getById(bugId) {
//     return storageService.get(STORAGE_KEY, bugId)
// }


function remove(bugId) {
    return axios.get(BASE_URL + bugId + '/remove')
    .then(res => res.data)
}




function save(bug) {
    const url = BASE_URL + 'save'
    let queryParams = `?title=${bug.title}&severity=${bug.severity}`
    if (bug._id) queryParams += `&_id=${bug._id}`
    return axios.get(url + queryParams).then(res => res.data)
}


function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (!bugs || !bugs.length) {
        bugs = [
            {
                title: "Infinite Loop Detected",
                severity: 4,
                description: "des",
                _id: "1NF1N1T3"
            },
            {
                title: "Keyboard Not Found",
                severity: 3,
                description: "des",
                _id: "K3YB0RD"
            },
            {
                title: "404 Coffee Not Found",
                severity: 2,
                description: "des",
                _id: "C0FF33"
            },
            {
                title: "Unexpected Response",
                severity: 1,
                description: "des",
                _id: "G0053"
            }
        ]
        utilService.saveToStorage(STORAGE_KEY, bugs)
    }



}
