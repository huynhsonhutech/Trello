import React, { useState, useEffect, useRef, useCallback } from 'react'
import { isEmpty } from 'lodash'
import './BoardContent.scss'
import Column from 'components/Column/Column'
import { Container as BootstrapContainer, Row, Col, Form, Button } from 'react-bootstrap'
import { Container, Draggable } from 'react-smooth-dnd'

import { mapOrder } from 'utilities/sorts'
import { applyDrag  } from 'utilities/dragDrop'
import { initialData } from 'actions/initialData'

function BoardBar() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState({});
  const [openNewColumnForm, setopenNewColumnForm] = useState(false);

  const newColumnInputRef = useRef(null)
  const [newColumnTitle, setnewColumnTitle] = useState('');
  const onNewColumnTitleChange = useCallback((e) => setnewColumnTitle(e.target.value), [])
  
  useEffect(() => {
    const boardFromDB = initialData.boards.find(
      (board) => board.id === 'board-1'
    );
    if (boardFromDB) {
      setBoard(boardFromDB);
      //sort Column
      setColumns(mapOrder(boardFromDB.columns, boardFromDB.columnOrder, 'id'));
    }
  }, []);

  useEffect(() => {
    if(newColumnInputRef && newColumnInputRef.current){
      newColumnInputRef.current.focus()
      newColumnInputRef.current.select()
    }
  }, [openNewColumnForm]);

  if (isEmpty(board)) {
    return (
      <div className='not-found' style={{ padding: '10px', color: 'white' }}>
        Board not found
      </div>
    );
  }

  const onUpdateColumn = (newColumnToUpdate) => {
    const columnIdToUpdate = newColumnToUpdate.id

    let newColumns = [...columns]
    const columnIndexToUpdate = newColumns.findIndex(i => i.id === columnIdToUpdate)

    if(newColumnToUpdate._destroy){
      //delete
      newColumns.splice(columnIndexToUpdate, 1)
    }else{
      //update
      newColumns.splice(columnIndexToUpdate, 1, newColumnToUpdate)
    }

    let newBoard = {...board}
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns
    console.log(newBoard)

    setColumns(newColumns)
    setBoard(newBoard)
  }

  const onColumnDrop = (dropResult) => {
    let newColumns = [...columns]
    newColumns = applyDrag(newColumns, dropResult)

    //clone Board
    let newBoard = {...board}
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns
    console.log(newBoard)

    setColumns(newColumns)
    setBoard(newBoard)
  }

  const onCardDrop = (columnId,dropResult) => {
    //check removedIndex and addedIndex
    if (dropResult.removedIndex !== null ||  dropResult.addedIndex !== null){
      let newColumns = [...columns]
      let currentColumn = newColumns.find(c => c.id === columnId)
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult)
      currentColumn.cardOrder = currentColumn.cards.map (c => c.id)

      setColumns(newColumns)
    }   
  }

  const toggleOpenNewColumnForm = () => setopenNewColumnForm(!openNewColumnForm)

  const addNewColumn = () => {
    if(!newColumnTitle){
      newColumnInputRef.current.focus()
      return
    }

    const newColumnToAdd = {
      id: Math.random().toString(36).substr(2, 5), //random 5 characters
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOrder: [],
      cards: []
    }

    let newColumns = [...columns]
    newColumns.push(newColumnToAdd)

    //clone board
    let newBoard = {...board}
    newBoard.columnOrder = newColumns.map(c => c.id)
    newBoard.columns = newColumns
    console.log(newBoard)

    setColumns(newColumns)
    setBoard(newBoard)
    setnewColumnTitle('')
    toggleOpenNewColumnForm()
  }

  return (
    <div className='board-content'>
      <Container
          orientation='horizontal'
          onDrop={onColumnDrop}
          getChildPayload={index => columns[index]}
          //dragHandleSelector='.column-drag-handle'
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'column-drop-preview'
          }}
        >
      {columns.map((column, index) => (
        <Draggable  key={index}>
          <Column column={column}  onCardDrop={onCardDrop} onUpdateColumn={onUpdateColumn}/>
        </Draggable>
      ))}
      </Container>

      <BootstrapContainer className="trello-bootstrap-container">
        {!openNewColumnForm && 
          <Row>
            <Col className="add-new-column" onClick={toggleOpenNewColumnForm}>
              <i className='fa fa-plus icon'> Add another Column </i>
            </Col>
          </Row>
        }
        {openNewColumnForm &&
          <Row>
            <Col className="enter-new-column">
              <Form.Control 
                size="sm" type="text" 
                placeholder="Enter column title.."
                className="input-enter-new-column"
                ref={newColumnInputRef}
                value={newColumnTitle}
                onChange={onNewColumnTitleChange}
                onKeyDown={event => (event.key === 'Enter') && addNewColumn()}
              />
              <Button variant="success" size="sm" onClick={addNewColumn}>Add column</Button>
              <span className="cancel-new-column" onClick={toggleOpenNewColumnForm}>
                <i className="fa fa-times icon"/>
              </span>
            </Col>
          </Row>
        }
      </BootstrapContainer>
    </div>
  );
}

export default BoardBar;
