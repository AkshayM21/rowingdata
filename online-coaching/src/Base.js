import React from 'react'

import {Helmet} from "react-helmet"

class Base extends React.Component {
    render () {
        return (
            <Helmet>
                <title>StrokeInsights</title>
            </Helmet>
        );
    }
}

export default Base
