import React, { useEffect, useState } from 'react'
import FormGrade from '../../components/FormGrade/FormGrade'
import Grade from '../../components/Grade/Grade';
import './style.css'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { createAssignment } from '../../actions/gradeActions';
import { useNavigate } from 'react-router-dom';

export default function GradeStructure() {
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [grades, setGrades] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("userSigninClassroom")) {
      setUser(JSON.parse(localStorage.getItem("userSigninClassroom")));
    } else {
      navigate("/login");
    }
  }, [navigate]);
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

  const saveGrade = async () => {
    const sum = grades.reduce((a, c) => a + c.detail, 0);
    console.log(user.token);
    if (sum !== 100) {
      alert("Total detail of grades must be 100. Please check again!!!");
    }
    else {
      const res = await createAssignment(name, grades.length, user.token);
      if (res) {
        console.log(res);
      }
      else {
        alert('Create assignment fail. Something was wrong!!!');
      }
    }
  }

  return (
    <div>
      <div className='control-name'>
        <label htmlFor='name'>Name of Assignment</label>
        <input
          className='name-assignment'
          type='text'
          value={name}
          onChange={e => { setName(e.target.value) }}
        />
      </div>
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
      <div className='control-grade'>
        <button
          className='btn-save-grade'
          onClick={saveGrade}
        >SAVE</button>
      </div>

    </div>
  )
}
