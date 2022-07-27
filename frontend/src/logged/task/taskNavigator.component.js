import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import styles from "../../../style";

export default class TaskNavigator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            style: {
                process: styles.taskNavPressablePressed,
                pending: styles.taskNavPressable,
                approved: styles.taskNavPressable,
                others: styles.taskNavPressable,
            },
        };
    }

    changeStyle(page) {
        if (page === "process") {
            this.setState({
                style: {
                    process: styles.taskNavPressablePressed,
                    pending: styles.taskNavPressable,
                    approved: styles.taskNavPressable,
                    others: styles.taskNavPressable,
                },
            });
        } else if (page === "pending") {
            this.setState({
                style: {
                    process: styles.taskNavPressable,
                    pending: styles.taskNavPressablePressed,
                    approved: styles.taskNavPressable,
                    others: styles.taskNavPressable,
                },
            });
        } else if (page === "approved") {
            this.setState({
                style: {
                    process: styles.taskNavPressable,
                    pending: styles.taskNavPressable,
                    approved: styles.taskNavPressablePressed,
                    others: styles.taskNavPressable,
                },
            });
        } else if (page === "others") {
            this.setState({
                style: {
                    process: styles.taskNavPressable,
                    pending: styles.taskNavPressable,
                    approved: styles.taskNavPressable,
                    others: styles.taskNavPressablePressed,
                },
            });
        }
    }

    render() {
        return (
            <View style={styles.taskNavigator}>
                <Pressable
                    style={this.state.style.process}
                    onPress={() => {
                        this.props.setPage("process");
                        this.changeStyle("process");
                    }}
                >
                    <Text style={styles.taskNavPressableText}>
                        {this.props.lang == "en" ? "Process" : "Διεργασία"}
                    </Text>
                </Pressable>
                <Pressable
                    style={this.state.style.pending}
                    onPress={() => {
                        this.props.setPage("pending");
                        this.changeStyle("pending");
                    }}
                >
                    <Text style={styles.taskNavPressableText}>
                        {this.props.lang == "en" ? "Pending" : "Εκκρεμεί"}
                    </Text>
                </Pressable>
                <Pressable
                    style={this.state.style.approved}
                    onPress={() => {
                        this.props.setPage("approved");
                        this.changeStyle("approved");
                    }}
                >
                    <Text style={styles.taskNavPressableText}>
                        {this.props.lang == "en" ? "Approved" : "Εγκρίθηκε"}
                    </Text>
                </Pressable>
                <Pressable
                    style={this.state.style.others}
                    onPress={() => {
                        this.props.setPage("others");
                        this.changeStyle("others");
                    }}
                >
                    <Text style={styles.taskNavPressableText}>
                        {this.props.lang == "en" ? "Others" : "Άλλες"}
                    </Text>
                </Pressable>
            </View>
        );
    }
}
