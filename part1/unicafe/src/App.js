import {useState} from 'react'

const Title = ({text}) => <h1>{text}</h1>

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const Content = ({text, num}) => (
  <tr>
    <td>{text}</td>
    <td>{num}</td>
  </tr>
)

const Statistics = (props) => {

  let good = props.good
  let neutral = props.neutral
  let bad = props.bad

  if (good == 0 && neutral == 0 && bad == 0) {
    return (
      <>
        <Title text="statistics" />
        <div>No feedback given</div>
      </>
    )
  }

  let all = good + neutral + bad
  let average = (good - bad) / all
  let positive = good / all * 100

  return (
    <>
      <Title text="statistics" />
      <table>
        <tbody>
          <Content text="good" num={good} />
          <Content text="neutral" num={neutral} />
          <Content text="bad" num={bad} />
          <Content text="all" num={all} />
          <Content text="average" num={average} />
          <Content text="positive" num={positive + " %"} />
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  // Save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const clickGood = () => setGood(good + 1)
  const clickNeutral = () => setNeutral(neutral + 1)
  const clickBad = () => setBad(bad + 1)

  return (
    <div>
      <Title text="give feedback"/>
      <Button onClick={clickGood} text="good" />
      <Button onClick={clickNeutral} text="neutral" />
      <Button onClick={clickBad} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App