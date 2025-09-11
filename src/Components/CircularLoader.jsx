import React from "react";
import { View, ActivityIndicator } from "react-native";

const CircularLoader = ({ size = "large" }) => {

    return (
        <View
            className="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-50 flex justify-center items-center z-50"
            style={{ opacity: 0.5 }}
        >
            <ActivityIndicator size={size} color={'red'} />
        </View>
    );
};

export default CircularLoader;
