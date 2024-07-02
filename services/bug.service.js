
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
    getDefaultFilter,
    getEmptyBug,
    getEmptySort

}


function query(filterBy = {}) {
    // return storageService.query(STORAGE_KEY)
    return axios.get(BASE_URL, { params: filterBy })
        .then(res => res.data)
        .catch(err => console.log(err))

}

function _setNextPrevBugId(bug) {
    return query().then((bugs) => {
        const bugIdx = bugs.findIndex((currBug) => currBug._id === bug._id)
        const nextBug = bugs[bugIdx + 1] ? bugs[bugIdx + 1] : bugs[0]
        const prevBug = bugs[bugIdx - 1] ? bugs[bugIdx - 1] : bugs[bugs.length - 1]
        bug.nextBugId = nextBug._id
        bug.prevBugId = prevBug._id
        return bug
    })
}


function getById(bugId) {
    return axios.get(BASE_URL + bugId)
        .then(res => res.data)
        .then(bug => _setNextPrevBugId(bug))
}


function remove(bugId) {
    return axios.delete(BASE_URL + bugId )
        .then(res => res.data)
}


function getEmptyBug(title = '', severity = '') {
    return { title, severity }
}


function getDefaultFilter() {
    return { title: '', severity: '', labels: [] }
}


function save(bug) {
    if (bug._id) {
        return axios.put(BASE_URL, bug)
    } else {
        return axios.post(BASE_URL, bug).then(res => res.data)
    }
}

function getEmptySort() {
    return {
        by: 'title',
        desc: 1
    }
}


function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (!bugs || !bugs.length) {
        bugs = [
            {
                title: "Infinite Loop Detected",
                severity: 4,
                description: "des",
                _id: "1NF1N1T3",
                labels: [
                    "critical",
                    "dev-branch"
                ]

            },
            {
                title: "Keyboard Not Found",
                severity: 3,
                description: "des",
                _id: "K3YB0RD",
                labels: [
                    "critical",
                    "need-CR",
                    "dev-branch"
                ]
            },
            {
                title: "404 Coffee Not Found",
                severity: 2,
                description: "des",
                _id: "C0FF33",
                labels: [
                    "critical",
                    "need-CR",
                    "dev-branch"
                ]
            },
            {
                title: "Unexpected Response",
                severity: 1,
                description: "des",
                _id: "G0053",
                labels: [
                    "dev-branch"
                ]
            }
        ]
        utilService.saveToStorage(STORAGE_KEY, bugs)
    }



}
