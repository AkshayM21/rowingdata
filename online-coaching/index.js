import React from 'react'
import ReactDOM from 'react-dom'

export class Base extends React.Component {
    render () {
        return (
            <Helmet>
                <title>C150 Training Statistics</title>
            </Helmet>
        );
    }
}

class Login {
    render() {
        return();
    }
}

class Page {
    render() {
        return(
            <div>
                <Base />
                <Login />
            </div>
        ) 
    }
}

ReactDOM.render(<Page />, document.getElementById('root'))