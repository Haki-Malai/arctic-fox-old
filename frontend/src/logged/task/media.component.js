import React from "react";
import { Pressable, Text, Image, View, Linking } from "react-native";
import styles from "../../../style";

export default class Media extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
            file: "",
			accessToken: localStorage.getItem("token"),
        }
        this.setExpanded = this.setExpanded.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.loadImage = this.loadImage.bind(this);
    }

    setExpanded() {
        this.setState({expanded: !this.state.expanded});
    }

    loadInBrowser(url) {
        Linking.openURL(url).catch(err => alert("Couldn't load page", err));
    }

    loadImage() {
        this.setState({file: document.querySelector("input[type='file']").files[0]});
    }

    uploadImage() {
        if (this.state.file && this.state.accessToken) {
            var formData = new FormData();
            formData.append("image", this.state.file);
            formData.append("task_id", this.props.data.id);
            const requestOptions = {
                method: "POST",
                headers: { 
                    "Authorization": "Bearer " + this.state.accessToken,
                    "Accept": "*/*"
                },
				mode: "cors",
				body: formData
            }

            fetch(this.props.url+"upload_task_proof", requestOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("Image uploaded successfully!");
                    } else {
                        alert("Something went wrong, please try again!");
                    }
                })
                .catch(e => {
                    console.log(e);
            });
        }
    }

    render() {
        var toRender, mediaStyles = [styles.media], toDo;
        if (this.props.data.requirements === 1) {
            toDo = "like";
        }

        this.props.mkey & 1? mediaStyles.push(styles.mediaA): mediaStyles.push(styles.mediaB);

        // Might be usefull someday who knows :P
        //switch(this.props.data.status){
            //case 0:

            //case 1:

            //case 2:

            //case 3:
        //}

        if (this.state.expanded === true){
            mediaStyles.push(styles.expandedMedia)
            var upload;
            // If status isn"t on process there is no need for the upload area
            if (this.props.data.status == 0) {
                upload = <View key={this.props.mkey}>
                                <Text style={styles.uploadLinkText}>Upload proof</Text>
                                <input
                                    id="file"
                                    style={{ fontSize: "1.2em", marginTop: ".6em"}}
                                    type="file" 
                                    accept="image/*"
                                    onChange={() => this.loadImage()}
                                >
                                </input>
                                <Pressable style={styles.uploadButton} onPress={() => this.uploadImage()}>
                                    <Text style={styles.uploadLinkText}>Upload</Text>
                                </Pressable>
                            </View>
            }
            toRender = <View style={mediaStyles} >
                            <View style={styles.upload}>
                                <View style={styles.uploadLinkTextTopWrapper}>
                                    <Text style={[styles.uploadLinkTextTop, styles.uploadLinkText]} onClick={() => this.setExpanded()}>Minimize</Text>
                                </View>
                                <Text style={styles.uploadLinkText}>Task: {this.props.data.vulnerability}</Text>
                                <Pressable style={styles.uploadLink} >
                                    <Text style={styles.uploadLinkText} onPress={() => this.loadInBrowser(this.props.data.url)}>Link: {this.props.data.url}</Text>
                                </Pressable>
                                {upload}
                            </View>
                        </View>
        } else {
            toRender =  <Pressable style={mediaStyles} onPress={() => this.setExpanded() }>
                            <Image style={styles.mediaIcon} source={require("../../../assets/media/"+this.props.data.vulnerability+".png")}/>
                            <Text style={styles.mediaTitle}>{this.props.data.vulnerability} </Text>
                        </Pressable>
        }
        return(
            toRender
        );
    }
}