// Calculates par of a hole for the player
const playersPar = (playinghcp, par, holeHcp) => {
  return par + Math.floor(playinghcp/18)+(holeHcp <= (playinghcp % 18) ? 1 : 0)
}

// Calculates playing hcp for the player
// Players hcp * slope / 113 + (cr - course's par)
export const playingHcp = (hcp, slope, cr, pars) => {
  return Math.round(hcp * slope / 113 + (cr - pars.reduce((i, j) => i + j)))
}

// Calculates how many strokes the score is over the players par of a hole
export const countStrokes = (holeHcp, par, coursehcp, score) => {
  const parsedScore = parseInt(score)
  if(parsedScore  && parsedScore > 0) {
    return Math.min(2, score - playersPar(coursehcp, par, holeHcp))
  } else if(score === ''){
    return ''
  }
  return 2
}


const adjustedScore = (holeHcp, par, coursehcp, score) => {
  const maxScore = 2 + playersPar(coursehcp, par, holeHcp)
  const parsedScore = parseInt(score)
  if(parsedScore && parsedScore > 0){
    return Math.min(maxScore, parsedScore)
  } else if(score === ''){
    return ''
  }
  return maxScore
}

// Calculates the score differential of the round
// (Adjusted score - cr) * 113 / slope
const scoreDiff = (adjScores, course) => {
  const diff = (adjScores - course.cr) * 113/course.slope
  return Number(Math.round(parseFloat(diff + 'e' + 1)) + 'e-' + 1).toFixed(1)
}

// Calculates the sum of the valid scores
const reduceScores = (scores) => {
  return scores
    .map(i => parseInt(i))
    .filter(i => !isNaN(i))
    .reduce((i, j) => i + j, 0)
}

/* Checks the scores. If a score isn't given, it's not an integer
  or it's larger than the max score, change it to '-'.
*/
const parseScores = (adjscores, strokes, scores, playinghcp, pars, hcps) => {
  let newAdjscores = [...adjscores]
  let newStrokes = [...strokes]
  const editedScores = scores.map((s, i) => {
    if(strokes[i] === 2 || s === ''){
      newStrokes[i] = 2
      newAdjscores[i] = playersPar(playinghcp, pars[i], hcps[i]) + 2
      return '-'
    } else {
      return s
    }
  })
  return [editedScores, newStrokes, newAdjscores]
}

export default {
  playersPar,
  playingHcp,
  countStrokes,
  adjustedScore,
  scoreDiff,
  reduceScores,
  parseScores
}