import React from 'react';
import { View, Image } from 'react-native';

const Tail = ({ elements, size, headDirection }) => {
    if (!elements || elements.length === 0) {
        return null;
    }

    const getRotation = (index) => {
        const isLastSegment = index === elements.length - 1;
        const isFirstSegment = index === 0;
        
        if (isFirstSegment && headDirection) {
            const [dx, dy] = headDirection;
            if (dx === 1) return 90;
            if (dx === -1) return -90;
            if (dy === 1) return 180;
            if (dy === -1) return 0;
        }
        
        if (isLastSegment && elements.length > 1) {
            const current = elements[index];
            const prev = elements[index - 1];
            const dx = prev.x - current.x;
            const dy = prev.y - current.y;
            
            if (dx === 1) return 90;
            if (dx === -1) return -90;
            if (dy === 1) return 180;
            if (dy === -1) return 0;
        }
        
        if (index > 0 && index < elements.length - 1) {
            const current = elements[index];
            const prev = elements[index - 1];
            const dx = prev.x - current.x;
            const dy = prev.y - current.y;
            
            if (dx === 1) return 90;
            if (dx === -1) return -90;
            if (dy === 1) return 180;
            if (dy === -1) return 0;
        }
        
        return 0;
    };

    const tailParts = elements.map((element, index) => {
        const isLastSegment = index === elements.length - 1;
        const rotation = getRotation(index);

        return (
            <View
                key={index}
                style={{
                    position: 'absolute',
                    left: element.x * size,
                    top: element.y * size,
                    width: size,
                    height: size,
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: [{ rotate: `${rotation}deg` }],
                }}
            >
                <Image
                    source={
                        isLastSegment
                            ? require('../../assets/tail.png')
                            : require('../../assets/body.png')
                    }
                    style={{
                        width: size ,
                        height: size,
                    }}
                    resizeMode="stretch"
                />
            </View>
        );
    });
    
    return <View>{tailParts}</View>;
};

export { Tail };