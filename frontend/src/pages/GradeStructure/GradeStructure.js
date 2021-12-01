import React, { useState } from 'react'
import FormGrade from '../../components/FormGrade/FormGrade'
import Grade from '../../components/Grade/Grade';
import './style.css'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

export default function GradeStructure() {
  const initGrades = [
    {
      title: "bt1",
      detail: 10
    },
    {
      title: "bt2",
      detail: 20
    },
    {
      title: "bt3",
      detail: 30
    },
    {
      title: "bt4",
      detail: 40
    },
  ]
  const [grades, setGrades] = useState(initGrades);

  const addGrade = (grade) => {
    setGrades(prevState => [
      {
        title: grade.title,
        detail: Number(grade.detail)
      }
      , ...prevState]);
  }

  const updateGrade = (oldGrade, updateGrade) => {
    const items = grades.map(grade => grade.title === oldGrade.title ? updateGrade : grade);
    setGrades(items);
  }

  const deleteGrade = (deleteGrade) => {
    const items = grades.filter(grade => grade.title !== deleteGrade.title);
    setGrades(items);
  }

  const handleOnGradeEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(grades);
    const [reOrderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reOrderedItem);
    setGrades(items);
  }

  return (
    <div>
      {grades.length > 0 &&
        <DragDropContext onDragEnd={handleOnGradeEnd}>
          <Droppable droppableId="grades">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {grades.map((grade, index) => {
                  return (
                    <Draggable
                      key={grade.title}
                      draggableId={grade.title}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <Grade
                            title={grade.title}
                            detail={grade.detail}
                            updateGrades={updateGrade}
                            deleteGrades={deleteGrade}
                          />
                        </div>
                      )}
                    </Draggable>
                  )
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

        </DragDropContext>

      }
      <FormGrade addGrade={addGrade} />
    </div>
  )
}
