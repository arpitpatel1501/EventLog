import React from 'react';
//import EventCard from './EventCard';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import {
    //BrowserRouter,
    //Route,
    Redirect,
    //Router,
    //browserHistory,
    //IndexRoute
  } from "react-router-dom";
import {ProtectedRoute} from './protected.route'
import EventDetails from './EventDetails'

import AnnouncementIcon from '@material-ui/icons/Announcement';

import foodImg from './images/food_club.png'
import artImg from './images/art_club.png'
import photoImg from './images/photo_club.png'
import envImg from './images/env_club.png'
import danceImg from './images/dance_club.png'





class EventCard extends React.Component{
    constructor(props){
        super(props);
        //console.log(this.props);
        this.state={
            confirm:null,
            eventRed:null,
            temp:false,
            reg:false,del:<Redirect to={{pathname: "/event",}}/>
        }
    }
    

    
    
    renderRegBtn(){

            if(this.state.reg){
                return(
                    <Button variant="contained" size="small" color="secondary" onClick={()=>this.unregister(this.props.resp.event_id)}>
                        Unregister
                </Button>
            )
            }else{
                return(
                    <Button variant="contained" size="small" color="primary" onClick={()=>this.register(this.props.resp.event_id)}>
                            Register
                    </Button>
                )
            }
        
    }
    renderButtons(){
        if(this.props.added===4){
            return(
                <CardActions>
                    <Button variant="outlined" size="small" color="primary"
                        onClick={()=>{
                            this.setState({eventRed:<Redirect to={{pathname: "/modifyevent",}} />},
                            this.props.onRed(this.props.resp)
                            )
                        }}
                    >
                        Modify
                    </Button>
                    <Button variant="contained" size="small" color="secondary"
                        onClick={()=>{this.setState({confirm:"overlay"},this.props.onConfirm(this.state.confirm))}}
                    >
                        Delete
                    </Button>
                </CardActions>
            )
        }
        else{
            return(
                <CardActions>
                    <Button variant="outlined" size="small" color="primary"
                        onClick={()=>{
                                this.setState({eventRed:this.state.del},()=>{this.props.onRed(this.props.resp)})
                            
                        }}
                    >
                        More
                    </Button>
                    {this.renderRegBtn()}
                    
                </CardActions>
            )
        }
    }
    isDeleted(){
        if(this.props.resp.is_deleted==1){
            return(
                <Box margin={1}>
                <Typography variant="body2" color="textSecondary" component="p">
                    Event Deleted
                </Typography>
                </Box>
            )
        }
        else{
            return(this.renderButtons())
        }
    }

    getCardImage(){
        console.log(this.props.resp.club_id)
        fetch("http://localhost:8000/api/getclublogo?club_id="+this.props.resp.club_id)
            .then(res=>res.json())
            .then(res=>{
                this.setState({logo:res.data[0].club_logo})
            })
            .catch(err=>err);
    }
    componentDidMount(){
        this.isRegistered()
        this.getCardImage()
    }

    register(event_id){
        const req={user_id:this.props.cur_user,event_id:event_id}
        fetch('http://localhost:8000/api/eventregister', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(req)
            })
            .then((res) => res.json())
            .catch((err)=>console.log(err))
            this.setState({temp:!this.state.temp},()=>this.isRegistered())
        }

    unregister(event_id){
        const req={user_id:this.props.cur_user,event_id:event_id}
        fetch('http://localhost:8000/api/unregister', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(req)
            })
            .then((res) => res.json())
            .catch((err)=>console.log(err))
        this.setState({temp:!this.state.temp},()=>this.isRegistered())
    }


    isRegistered(){
        const req={user_id:this.props.cur_user,event_id:this.props.resp.event_id}
        fetch('http://localhost:8000/api/getregs', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(req)
        })
        .then((res) => res.json())
        .then((data)=>this.setState({reg:data.reg}))
        .catch((err)=>console.log(err))
    }
    modifyMark(){
        if(this.props.resp.isModified==="true"){
            return(<Box textAlign="right"><AnnouncementIcon color="secondary"/></Box>)
        }else{return(null)}}

    render(){
        return(
            <Container margin={1}>
            
            
                <Card>
                <CardActionArea>
                    {this.modifyMark()}
                    <CardMedia
                        component="img"
                        height="140"
                        image={this.state.logo}
                        title={this.props.resp.event_name}
                        onClick={()=>{
                            this.setState({eventRed:<Redirect to={{pathname: "/event",}} />},
                            this.props.onRed(this.props.resp)
                            )
                        }}
                    />
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {this.props.resp.event_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {this.props.resp.start_date}
                        

                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {this.props.resp.event_venue}
                    </Typography>
                    </CardContent>
                </CardActionArea>
                {this.isDeleted()}
                
                </Card>
                {this.state.eventRed}
            
            </Container>
        )

    }
}

export default EventCard;
