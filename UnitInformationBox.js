import React from 'react'

export default class UnitInformationBox extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            info: {
                name:'',
                location:'',
                size:'',
                afscs:''
            },
            modify: {
                name:'',
                location:'',
                size:'',
                afscs:''
            },
            isEditing: {
                name:false,
                location:false,
                size:false,
                afscs:false
            }
        }
    }

    async getUnitInfo() {
        let data = await fetch(`http://localhost:4444/units/${this.props.unit}`);
        data = await data.json();
        if (data.code===200) {
            return {...data.result,afscs:data.result.afscs.join()};
        }else{
            throw new Error("Failed to read data from API");
        }
    }
    async componentDidMount() {
        this.getUnitInfo()
        .then(data=>this.setState({info:data}))
        .catch(()=>this.setState(
            {info: {
                name:'',
                location:'',
                size:'',
                afscs:''
                }
            })
        );
    }
    handleChangeText=(field,value)=>{
        let currentModify=this.state.modify;
        currentModify[field]=value;
        this.setState({modify:currentModify})
    }
    handleSubmit=(field) => {
        ///TODO SUBMIT CHANGES TO DB THEN REQUEST NEW INFO
        fetch(`http://localhost:4444/units/${this.props.unit}`,{
            method: 'PATCH',
            headers:{
                "Content-Type":"application/json"
            }
        }).then(data=>data.json()).then(data=>console.log(data));
        //clear entries and undo editing state. easiest to just cancel
        this.handleCancel(field);
    }
    handleCancel=(field) => {
        let modify=this.state.modify;
        modify[field] = '';
        let isEditing = this.state.isEditing;
        isEditing[field] = false;
        this.setState({modify:modify,isEditing:isEditing});
    }
    handleStartEditing=(field) => {
        let modify=this.state.modify;
        modify[field] = this.state.info[field];
        let isEditing = this.state.isEditing;
        isEditing[field] = true;
        this.setState({modify:modify,isEditing:isEditing});
    }
    labelOrEdit=(field) => {
        if (this.state.isEditing[field]) {
            return (
                <div className="input-group mb-3">
                    <input type='text' className='form-control' value={this.state.modify[field]} onChange={(event)=>this.handleChangeText(field,event.target.value)} />
                    <div className="input-group-append">
                        <button type='button' onClick={()=>this.handleSubmit(field)}>OK</button>
                        <button type='button' onClick={()=>this.handleCancel(field)}>Cancel</button>
                    </div>
                </div>
            )
        }else{
            return (
                <div className="input-group mb-3">
                    <input type="text" readOnly className="form-control-plaintext"  value={this.state.info[field]} />
                    <div className="input-group-append">
                        <button type='button' onClick={()=>this.handleStartEditing(field)}>Edit</button>
                    </div>
                </div>
            )
        }
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
                
                
                
                
                <div className="card-text">{this.labelOrEdit('name')} </div>
                <div className="card-text">Location: {this.labelOrEdit('location')} </div>
                <div className="card-text">Population: {this.labelOrEdit('size')} </div>
                <div className="card-text">AFSCs Available: {this.labelOrEdit('afscs')} </div>
                </div>
            </div>

        )
    }
}
