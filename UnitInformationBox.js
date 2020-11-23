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
            return {...data.result,afscs:data.result.afscs.join(', ')};
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
        let newData ={};
        newData[field] = this.state.modify[field];
        ///TODO SUBMIT CHANGES TO DB THEN REQUEST NEW INFO
        fetch(`http://localhost:4444/units/${this.props.unit}`,{
            method: 'PATCH',
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(newData)
        }).then(data=>data.json()).then(data=>{
            if (field==='name') {
                this.props.onUpdateName();
            }else{
                this.getUnitInfo().then(data=>this.setState({info:data}));
            }
        }).catch(data=>console.log(data));
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
                <div className="ui input">
                    <label className="ui right labeled">{this.state.info[field]}</label>
                    <button className="ui label mini button" type='button' onClick={()=>this.handleStartEditing(field)}>Edit</button>
                </div>
            )
        }
    }
    render() {

        return (
            
            <div className="ui fluid card">
                <div className="content">
                <h4 className="header">Unit Information</h4>
                </div>
                <div className="content">
                {/* <img src={this.state.info.logo} alt={`Logo for ${this.state.info.name}`} width='100px' height='100px'/><br /> */}
                <div className="ui right labled input">
                    <div className="ui input">
                        <label className="ui right labeled">{this.state.info['name']}</label>
                    </div> 
                </div>
                <div className="ui small feed">Location: {this.labelOrEdit('location')} </div>
                <div className="ui small feed">Population: {this.labelOrEdit('size')} </div>
                <div className="ui small feed">AFSCs Available: {this.labelOrEdit('afscs')} </div>
                </div>  
            </div>

        )
    }
}
