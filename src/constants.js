import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const CELL_SIZE = 30; 
const BOARD_WIDTH = Math.floor(width / CELL_SIZE) * CELL_SIZE;
const BOARD_HEIGHT = Math.floor(height / CELL_SIZE) * CELL_SIZE;

const GRID_WIDTH = Math.floor(width / CELL_SIZE);
const GRID_HEIGHT = Math.floor(height / CELL_SIZE);

const GRID_SIZE = GRID_WIDTH;

// Hız ayarları
const SPEED_SETTINGS = {
    slow: 150,
    normal: 100,
    fast: 60
};

const GAME_SPEED = 100; // Default hız

export {
    CELL_SIZE,
    BOARD_WIDTH,
    BOARD_HEIGHT,
    GRID_SIZE,
    GRID_WIDTH,
    GRID_HEIGHT,
    GAME_SPEED,
    SPEED_SETTINGS,
    width,
    height
};