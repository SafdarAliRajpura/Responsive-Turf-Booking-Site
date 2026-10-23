/**
 * GoF State Pattern: Draft Room Lifecycle States
 * Academic Context: Project Management & Design Patterns
 */

export class DraftState {
    constructor(name) {
        this.name = name;
    }

    canPickPlayer() {
        return false;
    }

    canTossCoin() {
        return false;
    }

    canExportSquads() {
        return false;
    }

    canEditRoster() {
        return false;
    }

    getNextStepName() {
        return '';
    }
}

export class SetupDraftState extends DraftState {
    constructor() {
        super('SETUP');
    }

    canEditRoster() {
        return true;
    }

    getNextStepName() {
        return '3D Coin Toss';
    }
}

export class CoinTossDraftState extends DraftState {
    constructor() {
        super('COIN_TOSS');
    }

    canTossCoin() {
        return true;
    }

    getNextStepName() {
        return 'Start Live Draft';
    }
}

export class DraftingState extends DraftState {
    constructor() {
        super('DRAFTING');
    }

    canPickPlayer() {
        return true;
    }

    getNextStepName() {
        return 'Finalize Squads';
    }
}

export class CompletedDraftState extends DraftState {
    constructor() {
        super('COMPLETED');
    }

    canExportSquads() {
        return true;
    }

    getNextStepName() {
        return 'Matchday Face-Off';
    }
}

/**
 * Draft State Machine Context
 */
export class DraftStateMachine {
    constructor(initialState = 'SETUP') {
        this.setState(initialState);
    }

    setState(stateKey) {
        switch (stateKey) {
            case 'COIN_TOSS':
                this.currentState = new CoinTossDraftState();
                break;
            case 'DRAFTING':
                this.currentState = new DraftingState();
                break;
            case 'COMPLETED':
                this.currentState = new CompletedDraftState();
                break;
            case 'SETUP':
            default:
                this.currentState = new SetupDraftState();
                break;
        }
        return this.currentState;
    }

    getState() {
        return this.currentState;
    }
}
