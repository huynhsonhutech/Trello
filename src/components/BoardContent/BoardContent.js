import React from 'react';
import './BoardContent.scss'
import Column from 'components/Column/Column';


function BoardBar(){
    return(
      <div className="board-content">
        <Column />
        <Column />
        <Column />
      </div>
        )
}

export default BoardBar
