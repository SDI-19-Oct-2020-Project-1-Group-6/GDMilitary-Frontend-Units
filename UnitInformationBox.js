import React from 'react'

export default class UnitInformationBox extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            info: {afscs:[] }
        }
    }
    initializeInfo() {
        this.setState({info:{afscs:[]}});
    }
    async componentDidMount() {
      fetch(`http://localhost:4444/units/${this.props.unit}`)
      .then(response => response.json())
      .then(data => {
          if (data.code===200) {
            this.setState({ info: data.result})
          }
      });
    }
    render() {
        /*
        <div class="card">
  <div class="card-body">
    <h4 class="card-title">Card title</h4>
    <h6 class="card-subtitle mb-2 text-muted">Card subtitle</h6>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="card-link">Card link</a>
    <a href="#" class="card-link">Another link</a>
  </div>
</div>
*/
        return (
            
            <div className="card">
                <div className="card-body">
                <h4 className="card-title">Unit Information</h4>
                {/* <img src={this.state.info.logo} alt={`Logo for ${this.state.info.name}`} width='100px' height='100px'/><br /> */}
                <p className="card-text">Name: {this.state.info.name} </p>
                <p className="card-text">Location: {this.state.info.location} </p>
                <p className="card-text">Population: {this.state.info.size} </p>
                <p className="card-text">AFSCs Available: {this.state.info.afscs.join()} </p>
                </div>
            </div>

        )
    }
}
