import { GAME_SPEED, GRID_WIDTH, GRID_HEIGHT, SPEED_SETTINGS } from '../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

let currentGameSpeed = GAME_SPEED;

const loadGameSpeed = async () => {
    try {
        const speed = await AsyncStorage.getItem('gameSpeed');
        if (speed && SPEED_SETTINGS[speed]) {
            currentGameSpeed = SPEED_SETTINGS[speed];
        }
    } catch (error) {
        console.log('Error loading game speed:', error);
    }
};

loadGameSpeed();

const randomFoodPosition = (entities) => {
    let newX, newY;
    let valid = false;
    while (!valid) {
        newX = Math.floor(Math.random() * GRID_WIDTH);
        newY = Math.floor(Math.random() * GRID_HEIGHT);
        const head = entities.head;
        const tail = entities.tail;
        
        if (newX === head.x && newY === head.y) {
            continue;
        }
        const hitTail = tail.elements.some(part => part.x === newX && part.y === newY);
        if (hitTail) {
            continue;
        }
        valid = true;
    }
    
    return { x: newX, y: newY };
};

const GameLoop = (entities, { touches, time, dispatch }) => {
    if (!entities || !entities.game) {
        console.log('ERROR: Entities veya entities.game yok!');
        return entities || {};
    }
    
    if (!entities.game.running) {
        const touch = touches.find(x => x.type === "press");
        if (touch) {
            console.log('Oyun başlatılıyor...');
            entities.game.running = true;
            dispatch({ type: "start-game" });
        }
        
        return entities;
    }
    
    // Swipe Detection
    const touch = touches.find(x => x.type === "start" || x.type === "move"); 
    if (touch && touch.delta) { 
        const [currentX, currentY] = entities.game.moveDirection;
        const dx = touch.delta.pageX;
        const dy = touch.delta.pageY;
        
        const SWIPE_THRESHOLD = 15;
        
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) { 
            const newDirX = dx > 0 ? 1 : -1;
            if (currentX !== -newDirX) {
                 entities.game.moveDirection = [newDirX, 0];
            }
        } 
        else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > SWIPE_THRESHOLD) {
            const newDirY = dy > 0 ? 1 : -1;
            if (currentY !== -newDirY) {
                entities.game.moveDirection = [0, newDirY];
            }
        }
    }
    
    if (time.current >= entities.game.nextTime) {
        
        const head = entities.head;
        const tail = entities.tail;
        const food = entities.food;
        const [moveX, moveY] = entities.game.moveDirection;
        
        const newX = head.x + moveX;
        const newY = head.y + moveY;
        
        // Duvar çarpışması
        if (newX < 0 || newX >= GRID_WIDTH || newY < 0 || newY >= GRID_HEIGHT) {
            console.log('DUVAR ÇARPIŞMASI!', { newX, newY, GRID_WIDTH, GRID_HEIGHT });
            dispatch({ type: "game-over" });
            return entities;
        }
        
        // Kendi kuyruğuna çarpma
        const hitTail = tail.elements.some(part => part.x === newX && part.y === newY);
        if (hitTail) {
            console.log('KUYRUK ÇARPIŞMASI!');
            dispatch({ type: "game-over" });
            return entities;
        }
        
        // Yiyecek yeme
        let foodEaten = false;
        if (newX === food.x && newY === food.y) {
            foodEaten = true;
            entities.game.score = (entities.game.score || 0) + 1; 
            dispatch({ type: "score-update", score: entities.game.score }); 
            
            const newFoodPos = randomFoodPosition(entities);
            food.x = newFoodPos.x;
            food.y = newFoodPos.y;
        }
        
        // Kuyruğu güncelle
        tail.elements.unshift({ x: head.x, y: head.y });
        
        if (!foodEaten) {
            tail.elements.pop();
        }
        
        // Kafayı taşı
        head.x = newX;
        head.y = newY;
        
        entities.game.nextTime = time.current + currentGameSpeed;
    }
    
    return entities;
};

export { GameLoop };
