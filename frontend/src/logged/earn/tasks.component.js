import React from "react";
import { Text, Image, Pressable, View } from "react-native";
import styles from "../../../style";

export default class Tasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            accessToken: localStorage.getItem("token"),
        };
        this.getTask = this.getTask.bind(this);
    }

    getTask(id) {
        const requestOptions = {
            method: "POST",
            headers: {
                Authorization: "Bearer " + this.state.accessToken,
                "Content-Type": "application/json",
                Accept: "*/*",
            },
            body: JSON.stringify({
                task_id: id,
            }),
            mode: "cors",
        };

        fetch(this.props.url + "assign_on_task", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("Assigned to task successfully!");
                    location.reload();
                } else {
                    alert("Cannot get assigned to another task!");
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }

    componentDidMount() {
        // Get available tasks based on vuln type
        const requestOptions = {
            method: "POST",
            headers: {
                Authorization: "Bearer " + this.state.accessToken,
                "Content-Type": "application/json",
                Accept: "*/*",
            },
            body: JSON.stringify({
                vulnerability: this.props.title,
            }),
            mode: "cors",
        };

        fetch(this.props.url + "available_tasks", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.tasks) {
                    this.setState({ tasks: data.tasks });
                } else {
                    console.log(data.tasks);
                    alert("Failed to load available tasks!");
                }
            })
            .catch((e) => {
                console.log(e);
            });
    }

    render() {
        var toRender = [];
        toRender.push(
            <Pressable
                key={-1}
                style={[styles.media, styles.mediaBack]}
                onPress={() => this.props.setMedia("none")}
            >
                <Text>{this.props.lang === "en" ? "Back" : "Επιστροφή"}</Text>
            </Pressable>
        );
        for (let i = 0; i < this.state.tasks.length; i++) {
            var task_data = JSON.parse(this.state.tasks[i]);
            toRender.push(
                <Pressable
                    key={i}
                    style={
                        i & 1
                            ? [styles.media, styles.mediaA]
                            : [styles.media, styles.mediaB]
                    }
                    onPress={() => this.getTask(task_data.id)}
                >
                    <Image
                        style={styles.mediaIcon}
                        source={require("../../../assets/media/" +
                            this.props.title +
                            ".png")}
                    />
                    <Text style={styles.mediaTitle}>
                        #{task_data.id} Find vulnerability +{this.props.plus}
                    </Text>
                </Pressable>
            );
        }
        if (this.state.tasks.length == 0) {
            toRender.push(
                <View
                    key={-3}
                    style={[
                        styles.media,
                        styles.mediaDisabled,
                        styles.mediaNoData,
                    ]}
                >
                    <Text style={styles.mediaTitle}>No tasks available</Text>
                </View>
            );
        }
        toRender.push(
            <Pressable
                key={-2}
                style={[styles.media, styles.mediaBack]}
                onPress={() => this.props.setMedia("none")}
            >
                <Text>{this.props.lang === "en" ? "Back" : "Επιστροφή"}</Text>
            </Pressable>
        );
        return <View>{toRender}</View>;
    }
}
