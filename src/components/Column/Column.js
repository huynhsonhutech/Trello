import React, {useCallback, useEffect, useState} from 'react'
import './Column.scss'
import { Dropdown, Form  } from 'react-bootstrap'
import ConfirmModal from 'components/Common/ConfirmModal'
import { MODAL_ACTION_CONFIRM } from 'utilities/constants'
import { saveTitleAfterEnter, selectAllInlineText } from 'components/Common/ContentEditable'

import Card from 'components/Card/Card'
import { mapOrder } from 'utilities/sorts'
import { Container, Draggable } from 'react-smooth-dnd';

function Column(props){

    const {column,onCardDrop, onUpdateColumn} = props
    const cards = mapOrder(column.cards, column.cardOrder, 'id')

    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [columnTitle, setColumnTitle] = useState('')

    const handleColumnTitleChange = useCallback((e) => setColumnTitle(e.target.value), [])
    
    const handleColumnTitleBlur = () => {
      const newColumns = {
        ...column,
        title: columnTitle
      }
      onUpdateColumn(newColumns)
    }

    useEffect(() => {
      setColumnTitle(column.title)
    }, [column.title])

    const toggleShowConfirmModal = () => setShowConfirmModal(!showConfirmModal)
    
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
                <Dropdown.Item >Add card..</Dropdown.Item>
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
          </div>      
        <footer>
          <div className='footer-actions'>
            <i className='fa fa-plus icon'> Add another Card</i>
          </div>
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