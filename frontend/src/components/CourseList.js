import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ListGroup from 'react-bootstrap/ListGroup'

// Lists links to all courses
const CourseList = () => {

  const courses = useSelector(state => state.courses)

  if(!courses) {
    return null
  }

  return (
    <div>
      <ListGroup>
        {courses.map(course =>
          <ListGroup.Item key={course.id}>
            <Link to={`courses/${course.id}`}>{course.name}</Link>
          </ListGroup.Item>
        )}
      </ListGroup>
    </div>
  )
}

export default CourseList