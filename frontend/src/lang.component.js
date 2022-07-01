import React from "react";
import { View, Image, Pressable } from 'react-native';
import styles from '../style';

export default class Lang extends React.Component {
    render() {
        return(
            <View style={styles.lang}>
                <Pressable onPress={() => this.props.setLang('el')}>
                    <Image style={styles.langIcon} source={require('../assets/lang/greek.png')}></Image>
                </Pressable>
                <Pressable onPress={() => this.props.setLang('en')}>
                    <Image style={styles.langIcon} source={require('../assets/lang/english.png')}></Image>
                </Pressable>
            </View>
        );
    }
}