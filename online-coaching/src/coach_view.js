import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import {Base} from './index.js'

// Menu passes uni up to Page
class Menu extends React.Component {
    handleChange(e) {
        const uni=e.target.value;
        this.props.onChange(uni)
    }
    render() {      
        return (
          <div>
            <select
                value={this.state.value}
                onChange={this.handleChange}>
                <option value='apm2196'>Aidan Mahaffey</option>
                <option value='agw2135'>Aidan Walkeryee</option>
                <option value='amk2360'>Alex Kosarek</option>
                <option value='az2493'>Alexandros Zisimidis</option>
                <option value='ahk2181'>Alptug Kaynar</option>
                <option value='ask2281'>Andrew Kim</option>
                <option value='as6203'>Arnav Sawhney</option>
                <option value='abs2267'>Ayush Saini</option>
                <option value='ebb2164'>Brendan Burbage</option>
                <option value='cbr2136'>CB Roman</option>
                <option value='cja2163'>Curtis Alter</option>
                <option value='igs2107'>Gavin Southerland</option>
                <option value='gbd2117'>Gil Dexter</option>
                <option value='jdg2209'>Jack Gallagher</option>
                <option value='jfh2147'>Jack Hartman</option>
                <option value='jeg2241'>Jackson Gallagher</option>
                <option value='jld2226'>Jake Duffy</option>
                <option value='mjk2243'>Michael Keane</option>
                <option value='mkr2146'>Michael Ritter</option>
                <option value='ncw2128'>Nate Wirth</option>
                <option value='oc2251'>Owen Cordaro</option>
                <option value='pb2751'>Pedro Santos</option>
                <option value='pcw2120'>Peter Woodville</option>
                <option value='rwg2120'>Reese Gregory</option>
                <option value='rgw2123'>Rye Walker</option>
                <option value='stg2130'>Sam Gregoire</option>
                <option value='smw2237'>Sam Zimbel</option>
                <option value='sjm2254'>Stanley Mason</option>
                <option value='jsw2206'>Stone Walker</option>
                <option value='tjk2142'>Tommy Kimberlin</option>
                <option value='tsm2132'>Tucker McMullen</option>
                <option value='wcw2125'>Will West</option>
            </select>
          </div>
        );
      }
}

class Card extends React.Component {
    render() {
        return(
            <div>
                <Card style={{ width: '18rem' }}>
                    <Card.Header>{this.props.name}</Card.Header>
                    <ListGroup variant="flush">
                        <ListGroup.Item>Date:{this.props.date} Workout:{this.props.workout_description}</ListGroup.Item>
                        <ListGroup.Item>RPE:{this.props.rpe}</ListGroup.Item>
                    </ListGroup>
                </Card>
                {/*<Card.Body>
                    <Card.Link href="#">Training Stress Metrics</Card.Link>
                    <Card.Link href="#">Force Profile Analysis</Card.Link>
                </Card.Body>*/}
            </div>
        )
    };   
}

class Deck extends React.Component {
    // Hooks for GET Method for roweruni.csv data
    render() {
        return();
        // Loop through all json and create cards for each item
        // Need to lay out in rows
    }
    
}

export default function Workouts() {
    render() {
        return(
            <Deck uni={this.props.uni} />
        )
    }  
}

class SorS extends React.Component {
    render() {
        return(
            // Table for SorS 
            // Use this.props.uni?
        );
    }  
}

class Tabs extends React.Component {
    render() {
        return (
            <Tabs>
                <TabList>
                    <Tab>Workouts</Tab>
                    <Tab>SorS</Tab>
                    <TabPanel>
                        <Workouts uni={this.props.uni} />
                    </TabPanel>
                    <TabPanel>
                        <SorS uni={this.props.uni}/>
                    </TabPanel>
                </TabList>
            </Tabs>
        );
    }
}

class Page extends React.Component {
    constructor(props){
        super(props);
        this.state = {uni: ''};
        this.changeUNI = this.changeUNI.bind(this);
    }

    changeUNI(newUNI) {
        this.setState({uni=newUNI});
    }

    render() {
        //return Workout if tab=workout, return sors if tab=sors
        return(
            <div>
                <Base/>
                <Menu onChange={this.changeUNI} />
                <h1>{this.props.name}</h1>
                <Tabs uni={this.state.uni} />
            </div>
        )
    }
}

ReactDOM.render(<Page />, document.getElementById('coach_view'))
