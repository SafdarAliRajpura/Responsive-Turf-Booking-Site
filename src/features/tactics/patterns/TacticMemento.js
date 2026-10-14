/**
 * DESIGN PATTERN: MEMENTO PATTERN (GoF Behavioral Pattern)
 * 
 * Captures and externalizes the internal state of the tactical pitch board 
 * (player positions, drawings, selected formation) without violating encapsulation.
 * Enables multi-step Undo and Redo operations.
 */

export class TacticMemento {
    constructor(state) {
        // Deep clone state to ensure true snapshot immutability
        this._snapshot = JSON.stringify(state);
        this.timestamp = Date.now();
    }

    getState() {
        return JSON.parse(this._snapshot);
    }
}

export class TacticCaretaker {
    constructor(maxHistory = 30) {
        this.undoStack = [];
        this.redoStack = [];
        this.maxHistory = maxHistory;
    }

    /**
     * Record a new state checkpoint
     */
    saveState(state) {
        const memento = new TacticMemento(state);
        this.undoStack.push(memento);
        if (this.undoStack.length > this.maxHistory) {
            this.undoStack.shift(); // Evict oldest state
        }
        // A new action invalidates future redo branch
        this.redoStack = [];
    }

    /**
     * Revert to previous checkpoint
     * @param {Object} currentState Current active state to save to redo stack
     */
    undo(currentState) {
        if (!this.canUndo()) return null;

        // Push current active state to redo stack
        this.redoStack.push(new TacticMemento(currentState));

        const previousMemento = this.undoStack.pop();
        return previousMemento.getState();
    }

    /**
     * Re-apply future checkpoint
     * @param {Object} currentState Current active state to save back to undo stack
     */
    redo(currentState) {
        if (!this.canRedo()) return null;

        // Push current active state back to undo stack
        this.undoStack.push(new TacticMemento(currentState));

        const nextMemento = this.redoStack.pop();
        return nextMemento.getState();
    }

    canUndo() {
        return this.undoStack.length > 0;
    }

    canRedo() {
        return this.redoStack.length > 0;
    }

    clear() {
        this.undoStack = [];
        this.redoStack = [];
    }
}
