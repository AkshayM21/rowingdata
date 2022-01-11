import React, {Component} from "react"


class SubmissionForm extends Component{

    constructor(props) {
        super(props);
        
        this.state = {
            uni: 'N/A', 
            date: 'N/A',
            description: 'N/A',
            time_on: 'N/A',
            workout_type: 'N/A',
            rpe: 'N/A',
            file:'N/A'
        };
        this.handleChange=this.handleChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
    }

    handleChange(e) {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({[name]: value})
    }

    handleSelectChange(e) {
        this.setState({workout_type: e.target.value});
    }

    render (){
        return(
                <form onSubmit={this.handleSubmit} method="POST">
                    <label>
                        UNI:
                        <input type="text" name="uni" value={this.state.uni} onChange={this.handleChange}/>
                    </label>
                    <label>
                        Date:
                        <input type="text" name="date" value={this.state.date} onChange={this.handleChange}/>
                    </label>
                    <label>
                        Workout Description (6x8min erg):
                        <input type="text" name="description" value={this.state.description} onChange={this.handleChange}/>
                    </label>   
                    <label>
                        Split Time (6x8 input 8):
                        <input type="text" name="time_on" value={this.state.time_on} onChange={this.handleChange}/>
                    </label>                
                    <label>
                        Workout Type:
                        <select value={this.state.value} onChange={this.handleSelectChange} name="workout_type">
                            <option value="decoupling">3x19 Decoupling Workout</option>
                            <option value="rp3">Other RP3 workout</option>
                            <option value="hr_data">Garmin HR Data</option>
                        </select>
                    </label>      
                    <label>
                        RPE (1-10):
                        <input type="text" name="rpe" value={this.state.rpe} onChange={this.handleChange}/>
                    </label>
                    <label>
                        File:
                        <input type="file" id="input"/>
                    </label>
                    <button type="submit">Submit</ button>
                </form>
        )
    }
}

export default SubmissionForm