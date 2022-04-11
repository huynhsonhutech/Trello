import React from 'react';
import './Column.scss'

import Task from 'components/Task/Task';


function Column(){
    return(
        <div className='board-column'>
        <header>BrainStorm</header>
          <ul className='task-list'>
            <Task />
            <li className='task-item'>Hello Brotherrrrrrrrrrrrrr</li>
            <li className='task-item'>Hello Brotherrrrrrrrrrrrrr</li>
            <li className='task-item'>Hello Brotherrrrrrrrrrrrrr</li>
            <li className='task-item'>Hello Brotherrrrrrrrrrrrrr</li>
          </ul>      
        <footer>
          Add another Card
        </footer>
      </div>
        )
}

export default Column