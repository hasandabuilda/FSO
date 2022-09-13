import Part from './Part'

const Content = ({parts}) => {
    let total = parts.reduce((sum, part) => sum + part.exercises, 0)
    return (
        <>
            {parts.map(part => 
                <Part key={part.id} name={part.name} num={part.exercises} />)}
            <h3>Total of {total} exercises</h3>
        </>
    )
}

export default Content