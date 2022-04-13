

//onKeyDown
export const saveTitleAfterEnter = (e) => {
    if(e.key === 'Enter'){
        e.target.preventDefault()
        e.target.blur()
    }
}

//select all input value
export const selectAllInlineText = (e) => {
    e.target.focus()
    e.target.select()
}