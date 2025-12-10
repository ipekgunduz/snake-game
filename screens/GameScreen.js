import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Head } from '../src/components/Head';
import { Food } from '../src/components/Food';
import { Tail } from '../src/components/Tail';
import { Wall } from '../src/components/Wall';
import { CELL_SIZE, BOARD_WIDTH, BOARD_HEIGHT, GRID_WIDTH, GRID_HEIGHT } from '../src/constants'; 
import Background from '../src/components/Background';
import * as Haptics from 'expo-haptics'; 
import { Audio } from 'expo-av'; 

const GridBackground = ({ width, height, cellSize }) => {
    const lines = [];
    for (let i = 0; i <= width; i += cellSize) {
        lines.push(
            <View key={`v-${i}`} style={{ position: 'absolute', left: i, top: 0, width: 1, height: height, backgroundColor: 'rgba(255, 255, 255, 0.03)' }} />
        );
    }
    for (let i = 0; i <= height; i += cellSize) {
        lines.push(
            <View key={`h-${i}`} style={{ position: 'absolute', left: 0, top: i, width: width, height: 1, backgroundColor: 'rgba(255, 255, 255, 0.03)' }} />
        );
    }
    return <>{lines}</>;
};

const GameScreen = ({ navigation }) => {
    const [running, setRunning] = useState(false);
    const [score, setScore] = useState(0);
    const [currentSpeed, setCurrentSpeed] = useState(150);
    const [baseSpeed, setBaseSpeed] = useState(150);
    const [head, setHead] = useState({ x: Math.floor(GRID_WIDTH / 2), y: Math.floor(GRID_HEIGHT / 2) });
    const [tail, setTail] = useState([]);
    const [food, setFood] = useState({ x: Math.floor(GRID_WIDTH / 2) + 5, y: Math.floor(GRID_HEIGHT / 2) });
    const [walls, setWalls] = useState([]);
    const [wallMode, setWallMode] = useState(false);
    const [direction, setDirection] = useState([1, 0]);
    const [activeTouches, setActiveTouches] = useState(0);
    const [eatSound, setEatSound] = useState();

    const foodRef = useRef(food);
    const tailRef = useRef(tail);
    const scoreRef = useRef(score);
    const wallsRef = useRef(walls);
    const directionRef = useRef([1, 0]);
    const nextDirectionRef = useRef([1, 0]);
    const gameLoop = useRef(null);
    const touchStartRef = useRef({ x: 0, y: 0 });
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const eatSoundRef = useRef(null);

    useEffect(() => { foodRef.current = food; }, [food]);
    useEffect(() => { tailRef.current = tail; }, [tail]);
    useEffect(() => { scoreRef.current = score; }, [score]);
    useEffect(() => { wallsRef.current = walls; }, [walls]);

    const touchTimerRef = useRef(null);
    const [isLongPress, setIsLongPress] = useState(false);

    // Hız kontrolü:
    useEffect(() => {
    if (touchTimerRef.current) clearTimeout(touchTimerRef.current);

    if (activeTouches > 0) {
        touchTimerRef.current = setTimeout(() => {
            setIsLongPress(true);
        }, 250); 
    } else {
        setIsLongPress(false);
    }

    return () => {
        if (touchTimerRef.current) clearTimeout(touchTimerRef.current);
    };
}, [activeTouches]);

useEffect(() => {
    if (isLongPress) {
        if (activeTouches === 1) {
            setCurrentSpeed(baseSpeed * 0.5); // 2x hızlı
        } else if (activeTouches >= 2) {
            setCurrentSpeed(baseSpeed * 2);   // 2x yavaş
        }
    } else {
        setCurrentSpeed(baseSpeed); 
    }
}, [activeTouches, isLongPress, baseSpeed]);

    useEffect(() => {
        async function loadSound() {
            try {
                await Audio.setAudioModeAsync({
                    playsInSilentModeIOS: true, 
                    staysActiveInBackground: false,
                    shouldDuckAndroid: true,
                });
                const { sound } = await Audio.Sound.createAsync(require('../assets/pop.mp3'));
                eatSoundRef.current = sound;
                setEatSound(sound);
                await sound.setVolumeAsync(1.0);
            } catch (e) {
                console.log("Ses yükleme hatası:", e);
            }
        }
        loadSound();
        return () => { if (eatSoundRef.current) eatSoundRef.current.unloadAsync(); };
    }, []);

    const playEatSound = async () => {
        try {
            if (eatSoundRef.current) {
                await eatSoundRef.current.stopAsync();
                await eatSoundRef.current.playFromPositionAsync(0);
            }
        } catch (e) {}
    };

    const getSpeedFromLevel = (level) => {
        switch (level) {
            case 'slow': return 160;
            case 'normal': return 120;
            case 'fast': return 80;
            default: return 120;
        }
    };

    const generateWalls = (currentHead, currentTail, currentFood) => {
    const wallCount = 8;
    const newWalls = [];
    const minDistance = 5; 

    for (let i = 0; i < wallCount; i++) {
        let attempts = 0;
        let valid = false;
        let wx, wy;

        while (!valid && attempts < 50) {
            wx = Math.floor(Math.random() * GRID_WIDTH);
            wy = Math.floor(Math.random() * GRID_HEIGHT);

            const distToHead = Math.abs(wx - currentHead.x) + Math.abs(wy - currentHead.y);
            if (distToHead < minDistance) { attempts++; continue; }

            const tooCloseToTail = currentTail.some(part => {
                const dist = Math.abs(wx - part.x) + Math.abs(wy - part.y);
                return dist < 3;
            });
            if (tooCloseToTail) { attempts++; continue; }

            // Yiyecekle çakışma kontrolü
            if (wx === currentFood.x && wy === currentFood.y) { attempts++; continue; }

            // Diğer duvarlarla çakışma kontrolü
            if (newWalls.some(wall => wall.x === wx && wall.y === wy)) { attempts++; continue; }

            valid = true;
        }

        if (valid) newWalls.push({ x: wx, y: wy });
    }

    return newWalls;
};

    const randomFoodPosition = (currentHead, currentTail, currentWalls) => {
        let newX, newY;
        let valid = false;
        let attempts = 0;
        while (!valid && attempts < 100) {
            newX = Math.floor(Math.random() * GRID_WIDTH);
            newY = Math.floor(Math.random() * GRID_HEIGHT);
            if (newX === currentHead.x && newY === currentHead.y) { attempts++; continue; }
            if (currentTail.some(part => part.x === newX && part.y === newY)) { attempts++; continue; }
            if (currentWalls.some(wall => wall.x === newX && wall.y === newY)) { attempts++; continue; }
            valid = true;
        }
        return { x: newX, y: newY };
    };

    const resetGame = () => {
        setRunning(false);
        setScore(0);
        const startX = Math.floor(GRID_WIDTH / 2);
        const startY = Math.floor(GRID_HEIGHT / 2);
        const initialHead = { x: startX, y: startY };
        setHead(initialHead);
        setTail([]);
        const initialFood = { x: startX + 5, y: startY };
        setFood(initialFood);
        setDirection([1, 0]);
        directionRef.current = [1, 0];
        nextDirectionRef.current = [1, 0];
        
        AsyncStorage.getItem('wallMode').then(mode => {
            const isWallMode = mode === 'true';
            setWallMode(isWallMode);
            if (isWallMode) {
                setWalls(generateWalls(initialHead, [], initialFood));
            } else {
                setWalls([]);
            }
        });
        
        if (gameLoop.current) clearInterval(gameLoop.current);
    };

    const gameOverHandler = async (finalScore) => {
        setRunning(false);
        if (gameLoop.current) clearInterval(gameLoop.current);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        
        try {
            const highScore = await AsyncStorage.getItem('highScore');
            if (!highScore || finalScore > parseInt(highScore)) {
                await AsyncStorage.setItem('highScore', finalScore.toString());
            }
            
            const history = await AsyncStorage.getItem('scoreHistory');
            const scores = history ? JSON.parse(history) : [];
            scores.unshift({ score: finalScore, date: new Date().toISOString() });
            await AsyncStorage.setItem('scoreHistory', JSON.stringify(scores.slice(0, 10)));

            const stats = await AsyncStorage.getItem('globalStats');
            let currentStats = stats ? JSON.parse(stats) : { totalApples: 0, totalGames: 0 };
            currentStats.totalApples += finalScore;
            currentStats.totalGames += 1;
            await AsyncStorage.setItem('globalStats', JSON.stringify(currentStats));
        } catch (error) { 
            console.log('Veri kaydetme hatası:', error); 
        }
        
        setTimeout(() => { navigation.navigate('GameOver', { score: finalScore }); }, 100);
    };

    useFocusEffect(
        React.useCallback(() => {
            const loadSpeed = async () => {
                const savedLevel = await AsyncStorage.getItem('gameSpeed');
                const speed = getSpeedFromLevel(savedLevel);
                setBaseSpeed(speed);
                setCurrentSpeed(speed);
            };
            loadSpeed();
            resetGame();
            return () => { if (gameLoop.current) clearInterval(gameLoop.current); };
        }, [])
    );

    useEffect(() => {
        if (!running) return;
        
        gameLoop.current = setInterval(() => {
            directionRef.current = nextDirectionRef.current;
            setDirection([...directionRef.current]);
            const [moveX, moveY] = directionRef.current;
            
            setHead(prevHead => {
                const newHead = { x: prevHead.x + moveX, y: prevHead.y + moveY };

                // Duvar çarpışması
                if (newHead.x < 0 || newHead.x >= GRID_WIDTH || newHead.y < 0 || newHead.y >= GRID_HEIGHT) {
                    gameOverHandler(scoreRef.current);
                    return prevHead;
                }

                // Kuyruk çarpışması
                if (tailRef.current.some(part => part.x === newHead.x && part.y === newHead.y)) {
                    gameOverHandler(scoreRef.current);
                    return prevHead;
                }

                // Duvar blokları çarpışması
                if (wallsRef.current.some(wall => wall.x === newHead.x && wall.y === newHead.y)) {
                    gameOverHandler(scoreRef.current);
                    return prevHead;
                }

                const foodEaten = newHead.x === foodRef.current.x && newHead.y === foodRef.current.y;

                if (foodEaten) {
                    playEatSound();
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

                    setScore(s => {
                        const newScore = s + 1;
                        Animated.sequence([
                            Animated.timing(scaleAnim, { toValue: 1.5, duration: 100, useNativeDriver: true }),
                            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
                        ]).start();
                        return newScore;
                    });
                    
                    setTail(prev => [prevHead, ...prev]);
                    const newFood = randomFoodPosition(newHead, [prevHead, ...tailRef.current], wallsRef.current);
                    setFood(newFood);
                    
                    if (wallMode) {
                        setWalls(generateWalls(newHead, [prevHead, ...tailRef.current], newFood));
                    }
                } else {
                    setTail(prev => [prevHead, ...prev.slice(0, -1)]);
                }
                return newHead;
            });
        }, currentSpeed);

        return () => { if (gameLoop.current) clearInterval(gameLoop.current); };
    }, [running, currentSpeed, wallMode]); 

    const handleTouchStart = (e) => {
        if (!running) { setRunning(true); return; }
        setActiveTouches(e.nativeEvent.touches.length);
        const touch = e.nativeEvent.touches[0];
        touchStartRef.current = { x: touch.pageX, y: touch.pageY };
    };

    const handleTouchMove = (e) => {
        setActiveTouches(e.nativeEvent.touches.length);
    };

    const handleTouchEnd = (e) => {
        if (!running) return;
        
        if (e.nativeEvent.touches.length === 0) {
            setActiveTouches(0);
            
            const touch = e.nativeEvent.changedTouches[0];
            const dx = touch.pageX - touchStartRef.current.x;
            const dy = touch.pageY - touchStartRef.current.y;
            const [currentX, currentY] = directionRef.current;
            
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
                const newDirX = dx > 0 ? 1 : -1;
                if (currentX !== -newDirX) nextDirectionRef.current = [newDirX, 0];
            } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) {
                const newDirY = dy > 0 ? 1 : -1;
                if (currentY !== -newDirY) nextDirectionRef.current = [0, newDirY];
            }
        } else {
            setActiveTouches(e.nativeEvent.touches.length);
        }
    };

    return (
        <Background>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backButton}>← Menü</Text>
                    </TouchableOpacity>
                    <Animated.Text style={[styles.scoreText, { transform: [{ scale: scaleAnim }] }]}>
                        🏆 {score}
                    </Animated.Text>
                </View>

                <View 
                    style={[styles.gameBoard, { width: BOARD_WIDTH, height: BOARD_HEIGHT }]}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <GridBackground width={BOARD_WIDTH} height={BOARD_HEIGHT} cellSize={CELL_SIZE} />
                    <Head x={head.x} y={head.y} size={CELL_SIZE} direction={direction} />
                    <Food x={food.x} y={food.y} size={CELL_SIZE} />
                    <Tail elements={tail} size={CELL_SIZE} headDirection={direction} />
                    {wallMode && walls.map((wall, index) => (
                        <Wall key={index} x={wall.x} y={wall.y} size={CELL_SIZE} />
                    ))}
                    
                    {!running && (
                        <View style={styles.overlay} pointerEvents="none">
                            <Text style={styles.overlayTitle}>🐍 SNAKE 🐍</Text>
                            <Text style={styles.overlayText}>Başlamak için ekrana dokun</Text>
                            {wallMode && <Text style={styles.wallModeText}>🧱 Duvar Modu Aktif</Text>}
                        </View>
                    )}
                </View>
            </View>
        </Background>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingHorizontal: 20, position: 'absolute', top: 40, zIndex: 10 },
    backButton: { color: '#4ecca3', fontSize: 18, fontWeight: 'bold' },
    scoreText: { color: '#ffffff', fontSize: 28, fontWeight: 'bold' },
    speedIndicator: { position: 'absolute', top: 100, backgroundColor: 'rgba(78, 204, 163, 0.9)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, zIndex: 10 },
    speedText: { color: '#1a1a2e', fontSize: 18, fontWeight: 'bold' },
    gameBoard: { backgroundColor: 'transparent', borderWidth: 3, borderColor: '#4ecca3', borderRadius: 10, position: 'relative', overflow: 'hidden' },
    overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
    overlayTitle: { color: '#4ecca3', fontSize: 48, fontWeight: 'bold', marginBottom: 20 },
    overlayText: { color: '#ffffff', fontSize: 18, opacity: 0.9 },
    wallModeText: { color: '#e94560', fontSize: 16, marginTop: 10, fontWeight: 'bold' },
});

export default GameScreen;