import React from "react";
import { View, Image, Pressable, Text } from 'react-native';
import Lang from '../lang.component';
import styles from '../../style';

export default class Welcome extends React.Component {
    render() {
        return(
            <View style={[styles.container, styles.menuContainer]}>
                <Image style={styles.welcomeLogo} source={require('../../assets/logo.png')}/>
				<Text style={styles.welcomeTitle}>SpotFox</Text>
				<Pressable style={styles.menuPressable} onPress={() => { this.props.setPage('login') }}>
					<Text style={styles.textPressable}>{this.props.lang === 'en'? 'Log In': 'Σύνδεση'}</Text>
				</Pressable>
				<Pressable style={styles.menuPressable} onPress={() => { this.props.setPage('signup') }}>
					<Text style={styles.textPressable}>{this.props.lang === 'en'? 'Sign Up': 'Εγγραφή'}</Text>
				</Pressable>
                <Lang
                    lang={this.props.lang}
                    setLang={this.props.setLang}
                ></Lang>
            </View>
        );
    }
}