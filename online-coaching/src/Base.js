import React from 'react'

import {Helmet} from "react-helmet"

class Base extends React.Component {
    render () {
        return (
            <Helmet>
                <title>C150 Training Statistics</title>
            </Helmet>
        );
    }
}

export default Base
