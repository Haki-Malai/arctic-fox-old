import React from 'react';
import { View, Text, Pressable, Image, Linking } from 'react-native';
import styles from '../../../style';

export default class Support extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: [],
			accessToken: localStorage.getItem('token'),
        }
    }
    componentDidMount() {
        const requestOptions = {
            method: 'GET',
            headers: { 
                'Authorization': 'Bearer ' + this.state.accessToken,
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },
            mode: 'cors',
        }
        fetch(this.props.url+'guide', requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.success === false) {
                    this.setState({text: data});
                    alert(this.props.lang=='en'? 'There was an error.': 'Σφάλμα.')
                } else {
                    data.paragraphs.forEach((element, index) => {
                        this.setState({text: [...this.state.text, <Text key={index} style={styles.guideParagraph}>{element}</Text>]})
                    });
                }
            })
            .catch(e => console.log(e))
    }
    render() {
        return(
            <View style={styles.optionContainer}>
                <Text style={styles.guideTitle}>{this.props.lang=='en'?'User Guide': 'Οδηγίες χρήσης'}</Text>
                {this.state.text}
            </View>
        );
    }
}