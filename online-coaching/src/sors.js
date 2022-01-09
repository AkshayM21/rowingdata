import React from 'react'
import ReactDOM from 'react-dom'
import {Base} from './index.js'
import {Tabs} from '.workouts.js'

//Need to pass uni, name in from coach_view.js

class SorS extends React.Component {
    render() {
        return(
            <div>
                GET Method for obtaining sors csv by uni
            </div>
        )
    }
}

class Page {
    render() {
        return(
            <div>
                Need to pass uni from link into sors.js from back end
                <Tabs uni="uni" name="name"/>
                <Workouts uni="uni"/>
            </div>
        ) 
    }
}

ReactDOM.render(<Page />, document.getElementById('app'))