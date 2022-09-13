import {useState} from 'react'

let selected = 0
let mostVotesIndex = 0

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    `The first 90 percent of the code accounts for the first 10 percent of
      of the development time... The remaining 10 percent of the code accounts
      for the other 90 percent of the development time.`,
    `Any fool can write code that a computer can understand. Good programmers
      write code that humans can understand`,
    'Premature optimization is the root of all evil',
    `Debugging is twice as hard as writing the code in the first place.
      Therefore, if you write the code as cleverly as possible, you are, by
      definition, not smart enough to debug it.`,
    `Programing without an extremely heavy use of console.log is some as if a
      doctor would refuse to use x-rays or blood tests when diagnosing
      patients`,
  ]

  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const newVote = () => {
    let oldVotes = [...votes]
    oldVotes[selected]++
    setVotes(oldVotes)
  }

  const nextAnecdote = () => {
    selected++
    if (selected === anecdotes.length) {selected = 0}
    setVotes([...votes]) // We want to re-render here to update the anecdote
  }
  
  let mostVotes = votes.reduce((maxValue, vote, index) => {
    let newMax = [0, 0]
    if (vote > maxValue[1]) {
      newMax[0] = index
      newMax[1] = vote
      return newMax
    }
    else {
      return maxValue
    }
  }, [0, 0])
  mostVotesIndex = mostVotes[0]

  return (
    <div>
      <h1>Anecdote of the Day</h1>
      <div>{anecdotes[selected]}</div>
      <div>{"has " + votes[selected] + " votes"}</div>
      <button onClick={newVote}>vote</button>
      <button onClick={nextAnecdote}>next anecdote</button>
      <h1>Anecdote with most Votes</h1>
      <div>{anecdotes[mostVotesIndex]}</div>
      <div>{"has " + votes[mostVotesIndex] + " votes"}</div>
    </div>
  )
}

export default App