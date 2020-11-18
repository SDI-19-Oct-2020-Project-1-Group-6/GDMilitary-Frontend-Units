import React from 'react'

export default class UnitInformationBox extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            info: {afscs:[] }
        }
    }
    async componentDidMount() {
      fetch(`http://unitsdb:4444/unit/${this.props.unit}`)
      .then(response => response.json())
      .then(data => this.setState({ info: data }));
    }
    render() {
        return (
            <div>
                <img src={this.state.info.logo} alt={`Logo for ${this.state.info.name}`} width='100px' height='100px'/><br />
                Name {this.state.info.name} <br />
                Location {this.state.info.location} <br />
                Size {this.state.info.size} <br />
                AFSC {this.state.info.afscs.join()} <br />
            </div>

        )
    }
}
