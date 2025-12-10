import React from 'react';
import { Image } from 'react-native';

const Wall = ({ x, y, size }) => {
    return (
        <Image
            source={require('../../assets/wall.png')}
            style={{
                position: 'absolute',
                left: x * size,
                top: y * size,
                width: size,
                height: size,
            }}
            resizeMode="stretch"
        />
    );
};

export { Wall };