let currentExercise = 'cat-camel';
let exerciseOrder = ['cat-camel', 'bird-dog', 'curl-up', 'side-bridge'];
let exerciseState = {
    currentSet: 1,
    currentRep: 0,
    totalSets: 0,
    repsPerSet: [],
    isRunning: false,
    isPaused: false,
    timer: null,
    currentSide: 'right',
    timeLeft: 0
};

function switchExercise(exerciseName) {
    if (exerciseState.isRunning) {
        alert('Please complete the current exercise before switching.');
        return;
    }

    document.querySelectorAll('.exercise').forEach(ex => ex.classList.remove('active'));
    document.querySelectorAll('.exercise-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(exerciseName).classList.add('active');
    document.querySelector(`[data-exercise="${exerciseName}"]`).classList.add('active');
    
    currentExercise = exerciseName;
    resetExercise();
}

function resetExercise() {
    if (exerciseState.timer) {
        clearInterval(exerciseState.timer);
    }
    exerciseState.isRunning = false;
    exerciseState.isPaused = false;
    exerciseState.currentSet = 1;
    exerciseState.currentRep = 0;
    exerciseState.currentSide = 'right';
    exerciseState.timeLeft = 0;
    
    const exercise = document.getElementById(currentExercise);
    if (exercise) {
        const playBtn = exercise.querySelector('.play-pause-btn');
        if (playBtn) {
            playBtn.dataset.state = 'play';
            playBtn.innerHTML = '▶ PLAY';
        }
    }
    
    updateDisplay();
    hideOverlays();
}

function updateDisplay() {
    const exercise = document.getElementById(currentExercise);
    if (!exercise) return;
    
    const setDisplay = exercise.querySelector('.current-set');
    const repDisplay = exercise.querySelector('.current-rep');
    const instructionDisplay = exercise.querySelector('.exercise-instruction');
    const timerDisplay = exercise.querySelector('.timer-countdown-big');
    
    if (setDisplay && exerciseState.totalSets > 0) {
        setDisplay.textContent = `Set: ${exerciseState.currentSet}/${exerciseState.totalSets}`;
    }
    
    if (repDisplay && exerciseState.repsPerSet.length > 0) {
        const currentSetReps = exerciseState.repsPerSet[exerciseState.currentSet - 1] || 0;
        repDisplay.textContent = `Rep: ${exerciseState.currentRep}/${currentSetReps}`;
    }
    
    if (instructionDisplay) {
        updateInstruction();
    }
    
    if (timerDisplay) {
        const defaultTime = currentExercise === 'cat-camel' ? '40s' : '10s';
        timerDisplay.textContent = exerciseState.timeLeft > 0 ? `${exerciseState.timeLeft}s` : defaultTime;
    }
}

function updateInstruction() {
    const exercise = document.getElementById(currentExercise);
    const instructionDisplay = exercise.querySelector('.exercise-instruction');
    
    if (!instructionDisplay) return;
    
    if (!exerciseState.isRunning) {
        instructionDisplay.textContent = 'Get ready to start';
        return;
    }
    
    switch(currentExercise) {
        case 'cat-camel':
            instructionDisplay.textContent = 'Perform slow cat-camel movements';
            break;
        case 'bird-dog':
            const birdDogSide = ((exerciseState.currentRep - 1) % 2 === 0) ? 'Right arm & left leg' : 'Left arm & right leg';
            instructionDisplay.textContent = `Hold position - ${birdDogSide}`;
            break;
        case 'curl-up':
            instructionDisplay.textContent = 'Hold curl-up position';
            break;
        case 'side-bridge':
            const bridgeSide = ((exerciseState.currentRep - 1) % 2 === 0) ? 'Right side' : 'Left side';
            instructionDisplay.textContent = `Hold position - ${bridgeSide}`;
            break;
    }
}

function toggleCatCamel() {
    const playBtn = document.querySelector('#cat-camel .play-pause-btn');
    
    if (!exerciseState.isRunning) {
        startCatCamel();
    } else if (exerciseState.isPaused) {
        resumeExercise();
    } else {
        pauseExercise();
    }
}

function startCatCamel() {
    exerciseState.totalSets = 2;
    exerciseState.repsPerSet = [1, 1]; // 1 "rep" = 40 seconds
    exerciseState.isRunning = true;
    exerciseState.isPaused = false;
    
    const playBtn = document.querySelector('#cat-camel .play-pause-btn');
    playBtn.dataset.state = 'pause';
    playBtn.innerHTML = '⏸ PAUSE';
    
    performCatCamelSet();
}

function performCatCamelSet() {
    const currentSetReps = exerciseState.repsPerSet[exerciseState.currentSet - 1];
    
    if (exerciseState.currentRep < currentSetReps) {
        exerciseState.currentRep++;
        updateDisplay();
        
        startCountdown(40, () => {
            if (exerciseState.currentSet < exerciseState.totalSets) {
                showRest(() => {
                    exerciseState.currentSet++;
                    exerciseState.currentRep = 0;
                    performCatCamelSet();
                });
            } else {
                completeExercise();
            }
        });
    }
}

function toggleBirdDog() {
    const playBtn = document.querySelector('#bird-dog .play-pause-btn');
    
    if (!exerciseState.isRunning) {
        startBirdDog();
    } else if (exerciseState.isPaused) {
        resumeExercise();
    } else {
        pauseExercise();
    }
}

function startBirdDog() {
    exerciseState.totalSets = 3;
    exerciseState.repsPerSet = [12, 8, 4]; // 6 reps per side = 12 total
    exerciseState.isRunning = true;
    exerciseState.isPaused = false;
    
    const playBtn = document.querySelector('#bird-dog .play-pause-btn');
    playBtn.dataset.state = 'pause';
    playBtn.innerHTML = '⏸ PAUSE';
    
    performBirdDogSet();
}

function performBirdDogSet() {
    const currentSetReps = exerciseState.repsPerSet[exerciseState.currentSet - 1];
    
    if (exerciseState.currentRep < currentSetReps) {
        exerciseState.currentRep++;
        updateDisplay();
        
        startCountdown(10, () => {
            if (exerciseState.currentRep < currentSetReps) {
                performBirdDogSet();
            } else {
                if (exerciseState.currentSet < exerciseState.totalSets) {
                    showRest(() => {
                        exerciseState.currentSet++;
                        exerciseState.currentRep = 0;
                        performBirdDogSet();
                    });
                } else {
                    completeExercise();
                }
            }
        });
    }
}

function toggleCurlUp() {
    const playBtn = document.querySelector('#curl-up .play-pause-btn');
    
    if (!exerciseState.isRunning) {
        startCurlUp();
    } else if (exerciseState.isPaused) {
        resumeExercise();
    } else {
        pauseExercise();
    }
}

function startCurlUp() {
    exerciseState.totalSets = 3;
    exerciseState.repsPerSet = [6, 4, 2];
    exerciseState.isRunning = true;
    exerciseState.isPaused = false;
    
    const playBtn = document.querySelector('#curl-up .play-pause-btn');
    playBtn.dataset.state = 'pause';
    playBtn.innerHTML = '⏸ PAUSE';
    
    performCurlUpSet();
}

function performCurlUpSet() {
    const currentSetReps = exerciseState.repsPerSet[exerciseState.currentSet - 1];
    
    if (exerciseState.currentRep < currentSetReps) {
        exerciseState.currentRep++;
        updateDisplay();
        
        startCountdown(10, () => {
            if (exerciseState.currentRep < currentSetReps) {
                performCurlUpSet();
            } else {
                if (exerciseState.currentSet < exerciseState.totalSets) {
                    showRest(() => {
                        exerciseState.currentSet++;
                        exerciseState.currentRep = 0;
                        performCurlUpSet();
                    });
                } else {
                    completeExercise();
                }
            }
        });
    }
}

function toggleSideBridge() {
    const playBtn = document.querySelector('#side-bridge .play-pause-btn');
    
    if (!exerciseState.isRunning) {
        startSideBridge();
    } else if (exerciseState.isPaused) {
        resumeExercise();
    } else {
        pauseExercise();
    }
}

function startSideBridge() {
    exerciseState.totalSets = 3;
    exerciseState.repsPerSet = [12, 8, 4]; // 6 reps per side = 12 total
    exerciseState.isRunning = true;
    exerciseState.isPaused = false;
    
    const playBtn = document.querySelector('#side-bridge .play-pause-btn');
    playBtn.dataset.state = 'pause';
    playBtn.innerHTML = '⏸ PAUSE';
    
    performSideBridgeSet();
}

function performSideBridgeSet() {
    const currentSetReps = exerciseState.repsPerSet[exerciseState.currentSet - 1];
    
    if (exerciseState.currentRep < currentSetReps) {
        exerciseState.currentRep++;
        updateDisplay();
        
        startCountdown(10, () => {
            if (exerciseState.currentRep < currentSetReps) {
                performSideBridgeSet();
            } else {
                if (exerciseState.currentSet < exerciseState.totalSets) {
                    showRest(() => {
                        exerciseState.currentSet++;
                        exerciseState.currentRep = 0;
                        performSideBridgeSet();
                    });
                } else {
                    completeExercise();
                }
            }
        });
    }
}

function startCountdown(seconds, callback) {
    exerciseState.timeLeft = seconds;
    const exercise = document.getElementById(currentExercise);
    const timerDisplay = exercise.querySelector('.timer-countdown-big');
    
    updateDisplay(); // Update instruction for current rep
    
    const countdownTimer = setInterval(() => {
        if (!exerciseState.isPaused) {
            exerciseState.timeLeft--;
            timerDisplay.textContent = `${exerciseState.timeLeft}s`;
            
            if (exerciseState.timeLeft <= 0) {
                clearInterval(countdownTimer);
                exerciseState.timeLeft = 0;
                updateDisplay();
                callback();
            }
        }
    }, 1000);
    
    exerciseState.timer = countdownTimer;
}

function pauseExercise() {
    exerciseState.isPaused = true;
    const exercise = document.getElementById(currentExercise);
    const playBtn = exercise.querySelector('.play-pause-btn');
    
    if (playBtn) {
        playBtn.dataset.state = 'play';
        playBtn.innerHTML = '▶ PLAY';
    }
}

function resumeExercise() {
    exerciseState.isPaused = false;
    const exercise = document.getElementById(currentExercise);
    const playBtn = exercise.querySelector('.play-pause-btn');
    
    if (playBtn) {
        playBtn.dataset.state = 'pause';
        playBtn.innerHTML = '⏸ PAUSE';
    }
}

function showRest(callback) {
    const restOverlay = document.querySelector('.rest-overlay');
    const restTimer = document.querySelector('.rest-timer');
    let timeLeft = currentExercise === 'cat-camel' ? 10 : 30;
    
    restOverlay.classList.remove('hidden');
    restTimer.textContent = `${timeLeft}s`;
    
    const restCountdown = setInterval(() => {
        timeLeft--;
        restTimer.textContent = `${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(restCountdown);
            restOverlay.classList.add('hidden');
            callback();
        }
    }, 1000);
}

function showTransition(nextExerciseName, callback) {
    const restOverlay = document.querySelector('.rest-overlay');
    const restContent = document.querySelector('.rest-content');
    const restTitle = restContent.querySelector('h3');
    const restTimer = document.querySelector('.rest-timer');
    const restText = restContent.querySelector('p');
    
    let timeLeft = 15;
    
    // Update the content for transition
    restTitle.textContent = 'Great ✅';
    restText.textContent = `Next: ${nextExerciseName}`;
    restTimer.textContent = `${timeLeft}s`;
    
    restOverlay.classList.remove('hidden');
    
    const transitionCountdown = setInterval(() => {
        timeLeft--;
        restTimer.textContent = `${timeLeft}s`;
        
        if (timeLeft <= 0) {
            clearInterval(transitionCountdown);
            restOverlay.classList.add('hidden');
            
            // Reset to original rest content
            restTitle.textContent = 'Rest Period';
            restText.textContent = 'Take a 30-second rest';
            
            callback();
        }
    }, 1000);
}

function completeExercise() {
    exerciseState.isRunning = false;
    
    const currentIndex = exerciseOrder.indexOf(currentExercise);
    if (currentIndex < exerciseOrder.length - 1) {
        // Auto-transition to next exercise after 15 seconds
        const nextExerciseName = exerciseOrder[currentIndex + 1].replace('-', ' ');
        
        // Show transition overlay with countdown
        showTransition(nextExerciseName, () => {
            nextExercise();
        });
        
    } else {
        // Show final completion overlay only for the last exercise
        const completionOverlay = document.querySelector('.completion-overlay');
        const nextBtn = document.getElementById('next-exercise-btn');
        const nextExerciseText = document.querySelector('.next-exercise-text');
        
        if (nextBtn) nextBtn.style.display = 'none';
        if (nextExerciseText) {
            nextExerciseText.textContent = 'Congratulations! You completed all exercises!';
        }
        
        if (completionOverlay) {
            completionOverlay.classList.remove('hidden');
        }
    }
}

function nextExercise() {
    const currentIndex = exerciseOrder.indexOf(currentExercise);
    if (currentIndex < exerciseOrder.length - 1) {
        const nextExerciseName = exerciseOrder[currentIndex + 1];
        switchExercise(nextExerciseName);
        hideOverlays();
        
        // Auto-start the next exercise
        setTimeout(() => {
            startExercise(nextExerciseName);
        }, 1000); // Small delay to ensure UI is updated
    }
}

function startExercise(exerciseName) {
    switch(exerciseName) {
        case 'cat-camel':
            startCatCamel();
            break;
        case 'bird-dog':
            startBirdDog();
            break;
        case 'curl-up':
            startCurlUp();
            break;
        case 'side-bridge':
            startSideBridge();
            break;
    }
}

function hideOverlays() {
    document.querySelector('.rest-overlay').classList.add('hidden');
    document.querySelector('.completion-overlay').classList.add('hidden');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.exercise-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const exercise = e.target.dataset.exercise;
            switchExercise(exercise);
        });
    });
    
    updateDisplay();
});

// Make functions globally available
window.toggleCatCamel = toggleCatCamel;
window.toggleBirdDog = toggleBirdDog;
window.toggleCurlUp = toggleCurlUp;
window.toggleSideBridge = toggleSideBridge;
window.resetExercise = resetExercise;
window.nextExercise = nextExercise;
