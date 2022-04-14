import React, {useEffect, useRef, useState} from 'react'
import './Column.scss'
import { Dropdown, Form, Button  } from 'react-bootstrap'
import ConfirmModal from 'components/Common/ConfirmModal'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import { saveTitleAfterEnter, selectAllInlineText } from 'components/Common/ContentEditable'

import Card from 'components/Card/Card'
import { mapOrder } from 'utilities/sorts'
import { Container, Draggable } from 'react-smooth-dnd';
import { cloneDeep } from 'lodash'

function Column(props){

    const {column, onCardDrop, onUpdateColumn} = props
    const cards = mapOrder(column.cards, column.cardOrder, 'id')

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [columnTitle, setColumnTitle] = useState('')

    const newCardTextAreaRef = useRef(null)

    const handleColumnTitleChange = (e) => setColumnTitle(e.target.value)

    const [newCardTitle, setnewCardTitle] = useState('');
    const onNewCardTitleChange = (e) => setnewCardTitle(e.target.value)
    
    const handleColumnTitleBlur = () => {
      const newColumns = {
        ...column,
        title: columnTitle
      }
      onUpdateColumn(newColumns)
    }

    const [openNewCardForm, setopenNewCardForm] = useState(false);
    const toggleOpenNewCardForm = () => setopenNewCardForm(!openNewCardForm)
  

    useEffect(() => {
      setColumnTitle(column.title)
    }, [column.title])

    useEffect(() => {
      if(newCardTextAreaRef && newCardTextAreaRef.current){
        newCardTextAreaRef.current.focus()
        newCardTextAreaRef.current.select()
      }
    }, [openNewCardForm]);

    const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)
    
    const addNewCard = () => {
      if(!newCardTitle){
        newCardTextAreaRef.current.focus()
        return
      }

    const newCardToAdd = {
      id: Math.random().toString(36).substr(2, 5), //random 5 characters
      boardId: column.boardId,
      columnId: column.id,
      title: newCardTitle.trim(),
      cover: null
    }

    let newColumn = cloneDeep(column)
    newColumn.cards.push(newCardToAdd)
    newColumn.cardOrder.push(newCardToAdd.id)

    onUpdateColumn(newColumn)
    setnewCardTitle('')
    toggleOpenNewCardForm()

  }

    //Remove Column
    const onConfirmModalAction = (type) => {
      if(type === MODAL_ACTION_CONFIRM){
        const newColumns = {
          ...column,
          _destroy: true
        }
        onUpdateColumn(newColumns)
      }
      toggleShowConfirmModal()
    }
    
    return(
      <div className='column'>
        <header className="column-drag-handle">
          <div className="column-title">
            <Form.Control 
                size="sm" type="text" 
                className="trello-clone-content-editable"
                value={columnTitle}
                onChange={handleColumnTitleChange}
                onBlur={handleColumnTitleBlur}
                onKeyDown={saveTitleAfterEnter}
                onMouseDown={e => e.preventDefault()}
                onClick={selectAllInlineText}
                spellCheck="false"
              />
          </div>
          <div className="column-dropdown-actions">
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic" size="sm" className="dropdown-btn"/>

              <Dropdown.Menu>
                <Dropdown.Item onClick={toggleOpenNewCardForm}>Add card..</Dropdown.Item>
                <Dropdown.Item onClick={toggleShowConfirmModal} >Remove column..</Dropdown.Item>
                <Dropdown.Item >Move all cards in this column..</Dropdown.Item>
                <Dropdown.Item >Active all cards in this column..</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </header>
          <div className='card-list'>
            <Container
                    orientation='vertical' // default
                    groupName='col'
                    onDrop= {dropResult => onCardDrop(column.id, dropResult)}
                    getChildPayload={index => cards[index]}
                    dragClass='card-ghost'
                    dropClass='card-ghost-drop'
                    dropPlaceholder={{                      
                      animationDuration: 150,
                      showOnTop: true,
                      className: 'cards-drop-preview' 
                    }}
                    dropPlaceholderAnimationDuration={200}  
                    >
                    {cards.map((card, index) => (
                      <Draggable  key={index}><Card card={card}/></Draggable>))}
              
            </Container>
            {openNewCardForm &&
              <div className="add-new-card-area">
                <Form.Control 
                    size="sm"
                    as="textarea" 
                    rows="3"
                    placeholder="Enter card title.."
                    className="textarea-enter-new-card"
                    ref={newCardTextAreaRef}
                    value={newCardTitle}
                    onChange={onNewCardTitleChange}
                    onKeyDown={event => (event.key === 'Enter') && addNewCard()}
                  />
              </div>
            }
          </div>      
        <footer>
          {openNewCardForm &&
            <div className="add-new-card-action">
                <Button variant="success" size="sm" onClick={addNewCard}>Add card</Button>
                <span className="cancel-icon" onClick={toggleOpenNewCardForm}>
                  <i className="fa fa-times icon"/>
                </span>
            </div>
          }
          {!openNewCardForm &&
            <div className='footer-actions' onClick={toggleOpenNewCardForm}>
              <i className='fa fa-plus icon'> Add another Card</i>
            </div>
          }
        </footer>
        <ConfirmModal
          show = {showConfirmModal}
          onAction = {onConfirmModalAction}
          title = "Remove column"
          content = {`Are you sure you want to remove <strong>${column.title}</strong>. <br/>All related cards will be removed`}
        />
      </div>
        )
}

export default Column