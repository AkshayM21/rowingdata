import React, { useState } from 'react'
import ReactDOM from 'react-dom'

// Menu passes uni and name up to Page
class Menu extends React.Component {
    constructor(props) {
        super(props);
        // JSON of rower names, format {'jl6078': 'Jonathan Liu', 'uni2':'Name2'}
        this.state={rowers={}};
    }

    handleChange(e) {
        const uni=e.target.value;
        this.props.onChange(uni, this.state.rowers[uni]);
    }
    render() {      
        return (
          <div>
            <select
                value={this.state.value}
                onChange={this.handleChange}>
                {Object.keys(this.state.rowers).map(uni => {
                    return <option value={uni}>{this.state.rowers[uni]}</option>
                })}
            </select>
          </div>
        );
    }
}

export default function Card(props){
    return(
        <div>
            <Card style={{ width: '18rem' }}>
                <ListGroup variant="flush">
                    <ListGroup.Item>Date:{this.props.workout['date']} Workout:{this.props.workout['workout_description']}</ListGroup.Item>
                    <ListGroup.Item>RPE:{this.props.workout['rpe']}</ListGroup.Item>
                </ListGroup>
            </Card>
            {/*<Card.Body>
                <Card.Link href="#">Training Stress Metrics</Card.Link>
                <Card.Link href="#">Force Profile Analysis</Card.Link>
            </Card.Body>*/}
        </div>
    )
}

export default function Deck(props) {
    // Need GET method for json, use props.uni to call  
    const[workouts, setWorkouts]= useState({});
    
    return(
        <div>
            {Object.values(workouts).map(obj => {
                <Card workout={obj}/>})}
        </div>
    );   
}

export default function Workouts(props) {
    return(
        <Deck uni={this.props.uni} />
    )  
}


export default function SorS(props) {
    const[results, setResults] = useState({});  
    // Array of JSON objects is named SorS- results={SorS: [Array of Rows]}
    // Need GET method for json, use props.uni to call   
    return (
        {SorS.map((row,i) => (
            <tr key={i}>
                {Object.values(row).map((cell) => (
                    <td>{cell}</td>
                ))}
            </tr>
        ))}
    );
}

export default function Tabs(props) {
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

export default function Page(props) {
    const[uni, setUni] = useState('');
    const[name, setName] = useState('');

    const handleChange= (newUni, newName) => {
        setUni(newUni);
        setName(newName);
    }

    return(
        <div>
            <Menu onChange={handleChange} />
            <h1>{name}</h1>
            <Tabs uni={this.state.uni} />
        </div>
    )
}

ReactDOM.render(<Page />, document.getElementById('coach_view'))
