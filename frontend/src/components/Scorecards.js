import React, { useState } from 'react'
import Moment from 'moment'
Moment.locale('fi')
import { Tabs, Tab } from 'react-bootstrap'
import { useSelector } from 'react-redux'

import ScorecardList from './ScorecardList'
import ScorecardChart from './ScorecardChart'

const Scorecards = () => {

  const [tab, setTab] = useState('all')

  const scorecards = useSelector(state => {
    if(state.scorecards){
      return state.scorecards.sort((i, j) => {
        return i.date > j.date ? -1 : 1
      })
    }
  })

  if(!scorecards){
    return null
  }

  if(scorecards.length === 0){
    return <h1>No scorecards</h1>
  }

  const years = []
  scorecards.map(sc => {
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
          <ScorecardList scorecards={scorecards}/>
        </Tab>
        {years.sort((i, j) => i < j)
          .map(y => (
            <Tab key={y} eventKey={y} title={y}>
              <ScorecardList
                scorecards={scorecards.filter(sc => new Date(sc.date).getFullYear() === y)}
              />
            </Tab>
          ))}
      </Tabs>
    </div>
  )
}

export default Scorecards