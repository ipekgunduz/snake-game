import React, { useEffect, useRef } from 'react';
import { Animated, Image } from 'react-native';

const Head = ({ x, y, size, direction }) => {
    const animatedX = useRef(new Animated.Value(x * size)).current;
    const animatedY = useRef(new Animated.Value(y * size)).current;
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(animatedX, {
                toValue: x * size,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(animatedY, {
                toValue: y * size,
                duration: 50,
                useNativeDriver: true,
            }),
        ]).start();
    }, [x, y]);

    useEffect(() => {
        let rotationValue = 0;
        
        if (direction) {
            const [dx, dy] = direction;
            if (dx === 1) rotationValue = 90;
            else if (dx === -1) rotationValue = -90;
            else if (dy === 1) rotationValue = 180;
            else if (dy === -1) rotationValue = 0;
        }

        Animated.timing(rotation, {
            toValue: rotationValue,
            duration: 100,
            useNativeDriver: true,
        }).start();
    }, [direction]);

    const rotateInterpolate = rotation.interpolate({
        inputRange: [-360, 360],
        outputRange: ['-360deg', '360deg'],
    });

    return (
        <Animated.View
            style={{
                position: 'absolute',
                width: size,
                height: size,
                transform: [
                    { translateX: animatedX },
                    { translateY: animatedY },
                    { rotate: rotateInterpolate },
                ],
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Image
                source={require('../../assets/head.png')}
                style={{
                    width: size * 3/2,
                    height: size * 3/2,
                }}
                resizeMode="stretch"
            />
        </Animated.View>
    );
};

export { Head };