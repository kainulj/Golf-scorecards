import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import ListGroup from 'react-bootstrap/ListGroup'

const CourseList = (props) => {

  return (
    <div>
      <ListGroup>
        {props.courses.map(course =>
          <ListGroup.Item key={course.id}>
            <Link to={`kentat/${course.id}`}>{course.name}</Link>
          </ListGroup.Item>
        )}
      </ListGroup>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    courses: state.courses
  }
}

export default connect(mapStateToProps)(CourseList)

CourseList.propTypes = {
  courses: PropTypes.array
}