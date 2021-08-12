import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'moment'
Moment.locale('fi')
import { connect } from 'react-redux'
import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from 'recharts'

const ScorecardChart = (props) => {

  if(props.scorecards.length < 2){
    return null
  }

  const data = props.scorecards.map(s => {
    return { date: new Date(s.date), scorediff: s.scorediff }
  }).sort((i, j) => i.date > j.date)

  const getDays = () => {
    const gameDates = data
      .map(sc => new Date('', sc.date.getMonth(), sc.date.getDate()))
      .sort((i, j) => i > j)
    return gameDates
  }
  const playedDates = getDays()

  const seasonDates = []
  for(let d = playedDates[0]; d <= playedDates[playedDates.length - 1]; d.setDate(d.getDate() + 1)){
    seasonDates.push(new Date(d))
  }

  const years = []
  data.map(d => {
    if(years.indexOf(d.date.getFullYear()) === -1){
      years.push(d.date.getFullYear())
    }
  })

  const yearlyData = years.map(year => {
    const yearsData = data.filter(sc => sc.date.getFullYear() === year)
    return {
      name: year,
      data: seasonDates.map(sd => {
        const dayScorecard = yearsData.find(sc => (
          sc.date.getDate() === sd.getDate()
          && sc.date.getMonth() === sd.getMonth()
        ))
        if(dayScorecard) {
          return { date: Moment(sd).format('D.M'), scorediff: dayScorecard.scorediff }
        } else {
          return { date: Moment(sd).format('D.M'), scorediff: null }
        }
      })
    }
  })

  const colors = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf']

  return (
    <div>
      <ResponsiveContainer width="95%" height={600}>
        <ComposedChart>
          <XAxis dataKey="date" type="category" allowDuplicatedCategory={false}/>
          <YAxis dataKey="scorediff"/>
          <Tooltip />
          <Legend />
          {yearlyData.map((yd, i) => (
            <Line
              dataKey="scorediff"
              name={yd.name}
              key={yd.name}
              data={yd.data}
              stroke={colors[i]}
              connectNulls
            />
          ))}
          <ReferenceLine y={props.scorecards[0].hcp} label="HCP" stroke="black" strokeDasharray="5 5"/>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}


const mapStateToProps = (state) => {
  return {
    scorecards: state.scorecards.sort((i, j) => i.date < j.date)
  }
}

export default connect(mapStateToProps)(ScorecardChart)

ScorecardChart.propTypes = {
  scorecards: PropTypes.array
}