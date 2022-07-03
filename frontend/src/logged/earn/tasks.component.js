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

        fetch(this.props.url+'tasks', requestOptions)
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
        var task = [];
        task.push(
                <Pressable style={[styles.media, styles.mediaBack]} onPress={() => this.props.setMedia('none')}>
                    {this.props.lang==='en'? 'Back': 'Επιστροφή'}
                </Pressable>
        )
        for (let i=0; i<=Math.floor(Math.random() * 12); i++) { //RANDOM NUMBER FOR TESTING
            task.push(
                <Pressable style={i & 1? [styles.media, styles.mediaA]: [styles.media, styles.mediaB]} disabled={!this.props.enabled}>
                    <Image style={styles.mediaIcon} source={require('../../../assets/media/'+this.props.title+'.png')}/>
                    <Text style={styles.mediaTitle}>Find vulnerability  +{this.props.plus}</Text>
                    <Pressable style={styles.mediaReceive}>
                        <Text style={styles.mediaReceiveText} onClick={() => this.addTask()}>{this.props.lang==='en'? 'Receive': 'Απέκτησε'}</Text>
                    </Pressable>
                </Pressable>
            )
        }
        task.push(
                <Pressable style={[styles.media, styles.mediaBack]} onPress={() => this.props.setMedia('none')}>
                    {this.props.lang==='en'? 'Back': 'Επιστροφή'}
                </Pressable>
        )
        return(
            task
        );
    }
}