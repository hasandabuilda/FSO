const Filter = ({newFilter, setNewFilter}) => {

    const filterName = (event) => setNewFilter(event.target.value)

    return (
        <div>
            filter names shown with
            <input value={newFilter} onChange={filterName} />
        </div>
    )
}

export default Filter