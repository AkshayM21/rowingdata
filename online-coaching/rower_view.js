import React from 'react'
import ReactDOM from 'react-dom'
import {Base} from './index.js'

class Rower extends React.Component {
    render() {
        return(
            <div>
                <Base/>
                <h1>Submit Workout Information</h1>
                Submission forms for params/file
            </div>
        )
    }
}

ReactDOM.render(<Rower />, document.getElementById('app'))