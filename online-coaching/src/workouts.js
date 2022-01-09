import React from 'react'
import ReactDOM from 'react-dom'
import {Base} from './index.js'

//Need to pass uni, name in from coach_view.js
class Tabs extends React.Component {
    render() {
        return(
            <div>
                <Base/>
                <h1>{{name}}</h1>
                <div>
                    <a href="/workouts/">Workouts</a>
                    |
                    <a href="/sors/">SorS Results</a>
                </div>
            </div>
        )
    }
}

class Workouts extends React.Component {
    render() {
        return(
            <div>
                GET Method for obtaining rower csv
            </div>
        )
    }
}

//ReactDOM.render(< />, document.getElementById('app'))