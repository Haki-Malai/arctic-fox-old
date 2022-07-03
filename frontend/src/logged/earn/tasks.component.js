import React from 'react';
import { Text, Image, Pressable } from 'react-native';
import styles from '../../../style';

export default class Tasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
        this.addTask = this.addTask.bind(this);
    }
    addTask() {
		// Authorization from saved cookie
        const requestOptions = {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },
            body: JSON.stringify({
                function: 'add',
                username: this.props.userData.username,
                social: this.props.title
            }),
            mode: 'cors'
        }

        fetch('http://localhost:8010/proxy/tasks', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Task added successfully!');
                } else {
                    alert('Cannot add another task!');
                }
            })
            .catch(e => {
                alert(e);
            });
    }
    render() {
        var task = [], background;
        if (this.props.title==='Facebook') {
            background = styles.mediaF;
        } else if (this.props.title==='Instagram') {
            background = styles.mediaI;
        } else if (this.props.title==='Youtube') {
            background = styles.mediaY;
        }
        for (let i=0; i<=25; i++) {
            task.push(
                <Pressable style={[this.props.style, background]} disabled={!this.props.enabled}>
                    <Image style={styles.mediaIcon} source={require('../../../assets/media/'+this.props.title+'.png')}/>
                    <Text style={styles.mediaTitle}>{this.props.title}-Like  +{this.props.plus}</Text>
                    <Pressable style={styles.mediaReceive}>
                        <Text style={styles.mediaReceiveText} onClick={() => this.addTask()}>{this.props.lang==='en'? 'Receive': 'Απέκτησε'}</Text>
                    </Pressable>
                </Pressable>
            )
        }
        return(
            task
        );
    }
}