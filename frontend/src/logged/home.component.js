import React from 'react';
import { View, Text, Image } from 'react-native';
import Navigator from './navigator.component';
import styles from '../../style';

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            loading: false,
            feed: []
        }
        this.setMedia = this.setMedia.bind(this);
        
    }
    setMedia() {
        this.props.setPage('earn');
    }
    componentDidMount() {
		this.props.refreshUserData();
    }
    render() {
        return(
            <View style={styles.container}>
                <Text>Text</Text>
            </View>
        );
    }
}