import React, { useEffect, useState } from 'react'
import FormGrade from '../../components/FormGrade/FormGrade'
import Grade from '../../components/Grade/Grade';
import './style.css'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { createAssignment, getAssignmentByClassId } from '../../actions/gradeActions';
import { useNavigate, useParams } from 'react-router-dom';
import CourseHeader from '../../components/CourseHeader/CourseHeader';
import { getClass } from '../../actions/classAction';

export default function GradeStructure() {
  const [user, setUser] = useState({});
  const [name, setName] = useState('');
  const [grades, setGrades] = useState([]);
  const { courseId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("userSigninClassroom")) {
      setUser(JSON.parse(localStorage.getItem("userSigninClassroom")));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const [course, setCourse] = useState();
  useEffect(() => {
    const func = async () => {
      const result = await getClass(courseId, user.token);
      if (result) {
        setCourse(result);
      }
    };
    if (user.token) {
      func();
    }
  }, [courseId, user]);

  useEffect(() => {
    if (user.token) {
      const getAssignment = async () => {
        const res = await getAssignmentByClassId(courseId, user.token);
        if (res) {
          setGrades(res.scores);
          setName(res.description)
        }
      }
      getAssignment();
    }
  }, [user, courseId]);
  const addGrade = (grade) => {
    setGrades(prevState => [
      {
        name: grade.title,
        composition: Number(grade.detail)
      }
      , ...prevState]);
  }

  const updateGrade = (oldGrade, updateGrade) => {
    const items = grades.map(grade => grade.name === oldGrade.name ? updateGrade : grade);
    setGrades(items);
  }

  const deleteGrade = (deleteGrade) => {
    const items = grades.filter(grade => grade.name !== deleteGrade.name);
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
    const sum = grades.reduce((a, c) => a + c.composition, 0);
    if (sum !== 100) {
      alert("Total detail of grades must be 100. Please check again!!!");
    }
    else {
      const res = await createAssignment(name, grades, courseId, user.token);
      if (res) {
        navigate(`/c/${res.classId}`)
      }
      else {
        alert('Create assignment fail. Something was wrong!!!');
      }
    }
  }

  return (
    <React.Fragment>
      {course && <div>
        <CourseHeader course={course} user={user} />
        <div className='control-name mt-3'>
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
                        key={grade.name}
                        draggableId={grade.name}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <Grade
                              title={grade.name}
                              detail={grade.composition}
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
      </div>}
    </React.Fragment>

  )
}
