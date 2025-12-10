import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Food = ({ x, y, size }) => {
    const foodSize = size * 1.5; 
    
    const offset = (foodSize - size) / 2;

    return (
        <Image
            source={require('../../assets/food.png')}
            style={[
                styles.food,
                {
                    width: foodSize,
                    height: foodSize,
                    left: x * size - offset,
                    top: y * size - offset,
                }
            ]}
            resizeMode="contain"
        />
    );
};

const styles = StyleSheet.create({
    food: {
        position: 'absolute',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});

export { Food };