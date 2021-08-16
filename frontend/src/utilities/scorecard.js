const playersPar = (coursehcp, par, holeHcp) => {
  return par + Math.floor(coursehcp/18)+(holeHcp <= (coursehcp % 18) ? 1 : 0)
}

export const playingHcp = (hcp, slope, cr, pars) => {
  return Math.round(hcp * slope / 113 + (cr - pars.reduce((i, j) => i + j)))
}

export const countStrokes = (holeHcp, par, coursehcp, score) => {
  const parsedScore = parseInt(score)
  if(parsedScore) {
    return Math.min(2, score - playersPar(coursehcp, par, holeHcp))
  } else if(score === ''){
    return ''
  }
  return 2
}

const adjustedScore = (holeHcp, par, coursehcp, score) => {
  const maxScore = 2 + playersPar(coursehcp, par, holeHcp)
  const parsedScore = parseInt(score)
  if(parsedScore){
    return Math.min(maxScore, parsedScore)
  } else if(score === ''){
    return ''
  }
  return maxScore
}

const scoreDiff = (adjScores, course) => {
  const diff = (adjScores - course.cr) * 113/course.slope
  return Number(Math.round(parseFloat(diff + 'e' + 1)) + 'e-' + 1).toFixed(1)
}

const reduceScores = (scores) => {
  return scores
    .map(i => parseInt(i))
    .filter(i => !isNaN(i))
    .reduce((i, j) => i + j, 0)
}

export default {
  playersPar,
  playingHcp,
  countStrokes,
  adjustedScore,
  scoreDiff,
  reduceScores
}