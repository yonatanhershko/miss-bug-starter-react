



import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'

const { useState, useEffect } = React

export function BugIndex() {
    const [bugs, setBugs] = useState(null)
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

    useEffect(() => {
        loadBugs()
    }, [filterBy])

    function loadBugs() {
        bugService.query(filterBy)
            .then(bug => {
                setBugs(bug)
            })
            .catch(err => {
                console.log('err:', err)
            })
    }


    function onRemoveBug(bugId) {
        bugService
            .remove(bugId)
            .then(() => {
                console.log('Deleted Succesfully!')
                const bugsToUpdate = bugs.filter((bug) => bug._id !== bugId)
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug removed')
            })
            .catch((err) => {
                console.log('Error from onRemoveBug ->', err)
                showErrorMsg('Cannot remove bug')
            })
    }

    function onAddBug() {
        const title = prompt('Bug title?')
        if (!title) return showErrorMsg('Title is required')

        const description = prompt('Bug description?')
        if (!description) return showErrorMsg('Description is required')

        const severityInput = prompt('Bug severity?')
        const severity = parseInt(severityInput, 10)
        if (isNaN(severity) || severity < 1 || severity > 5) {
            return showErrorMsg('Severity must be a number between 1 and 5')
        }

        const labels = prompt('Bug labels (comma-separated)?', 'critical,need-CR,dev-branch')
            .split(',')
            .map(label => label.trim())

        const bug = {
            title,
            description,
            severity,
            labels,
            createdAt: Date.now() 
        }
        console.log(bug)////
        bugService.save(bug)
            .then(savedBug => {
                console.log('Added Bug', savedBug)
                setBugs(prevBugs => [...prevBugs, savedBug])
                showSuccessMsg('Bug added')
            })
            .catch(err => {
                console.log('Error from onAddBug ->', err)
                showErrorMsg('Cannot add bug')
            })
    }

    function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const bugToSave = { ...bug, severity }
        bugService
            .save(bugToSave)
            .then((savedBug) => {
                console.log('Updated Bug:', savedBug)
                const bugsToUpdate = bugs.map((currBug) =>
                    currBug._id === savedBug._id ? savedBug : currBug
                )
                setBugs(bugsToUpdate)
                showSuccessMsg('Bug updated')
            })
            .catch((err) => {
                console.log('Error from onEditBug ->', err)
                showErrorMsg('Cannot update bug')
            })
    }

    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    function togglePagination() {
        setFilterBy(prevFilter => {
            return { ...prevFilter, pageIdx: prevFilter.pageIdx === undefined ? 0 : undefined }
        })
    }
    
    function onChangePage(diff) {
        if (filterBy.pageIdx === undefined) return
        
        setFilterBy(prevFilter => {
            let nextPageIdx = prevFilter.pageIdx + diff
            if (nextPageIdx < 0) nextPageIdx = 0
            return { ...prevFilter, pageIdx: nextPageIdx }
        })
    }


    return (
        <main>
            <section className='info-actions'>
                <h3>Bugs App</h3>
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <section>
                <button onClick={togglePagination} >Toggle Pagination</button>
                <button onClick={() => onChangePage(-1)}>-</button>
                {filterBy.pageIdx + 1 || 'No Pagination'}
                <button onClick={() => onChangePage(1)}>+</button>
            </section>
            </section>
            <main>
                <BugFilter filterBy={filterBy} onSetFilter={onSetFilter} />
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>
        </main>
    )
}
