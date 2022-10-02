const Notification = ({message}) => {
    let messageStyle = {}
    if (message) {
        messageStyle = {
            color: 'green',
            backgroundColor: 'lightgray',
            fontSize: '22px',
            margin: '10px',
            padding: '10px',
            border: 'solid 3px green',
            borderRadius: '10px'
        }

        if (message.includes('Error')) {
            messageStyle.color = 'red'
            messageStyle.border = 'solid 3px red'
        }
    }

    return (
        <div style={messageStyle}>{message}</div>
    )
}

export default Notification