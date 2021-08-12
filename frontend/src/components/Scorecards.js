import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'
Moment.locale('fi')
import { Tabs, Tab } from 'react-bootstrap'
import { connect } from 'react-redux'

import ScorecardList from './ScorecardList'
import ScorecardChart from './ScorecardChart'

const Scorecards = (props) => {
  const [tab, setTab] = useState('all')

  if(props.scorecards.length === 0){
    return <h1>Ei tuloskortteja</h1>
  }

  const years = []
  props.scorecards.map(sc => {
    const date = new Date(sc.date)
    if(years.indexOf(date.getFullYear()) === -1){
      years.push(date.getFullYear())
    }
  })

  return (
    <div>
      <ScorecardChart />
      <Tabs
        activeKey={tab}
        onSelect={t => setTab(t)}
        className='mb-3'
      >
        <Tab eventKey='all' title='Kaikki'>
          <ScorecardList scorecards={props.scorecards}/>
        </Tab>
        {years.sort((i, j) => i < j)
          .map(y => (
            <Tab key={y} eventKey={y} title={y}>
              <ScorecardList
                scorecards={props.scorecards.filter(sc => new Date(sc.date).getFullYear() === y)}
              />
            </Tab>
          ))}
      </Tabs>
    </div>
  )
}


const mapStateToProps = (state) => {
  return {
    scorecards: state.scorecards.sort((i, j) => i.date < j.date)
  }
}

export default connect(mapStateToProps)(Scorecards)

Scorecards.propTypes = {
  scorecards: PropTypes.array
}