import React from "react";
import { View, Text, Pressable, Image, Linking } from "react-native";
import styles from "../../../style";

export default class Support extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "email@example.gr",
            whatsapp: "6955555555",
        };
    }
    render() {
        return (
            <View style={styles.optionContainer}>
                <Pressable
                    style={[styles.optionContainer, styles.support]}
                    onPress={() =>
                        Linking.openURL("mailto:support@example.com")
                    }
                >
                    <Image
                        style={styles.accountOptionPressableIcon}
                        source={require("../../../assets/account/envelope.png")}
                    ></Image>
                    <Text style={styles.accountOptionPressableText}>
                        {this.state.email}
                    </Text>
                </Pressable>
                <Pressable style={[styles.optionContainer, styles.support]}>
                    <Image
                        style={styles.accountOptionPressableIcon}
                        source={require("../../../assets/account/whatsapp.png")}
                    ></Image>
                    <Text style={styles.accountOptionPressableText}>
                        {this.state.whatsapp}
                    </Text>
                </Pressable>
            </View>
        );
    }
}
