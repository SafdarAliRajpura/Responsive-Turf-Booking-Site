/**
 * GoF Strategy Pattern: Draft Order & Squad Selection Strategies
 * Academic Context: Project Management & Design Patterns
 */

export class DraftStrategy {
    constructor(name) {
        this.name = name;
    }

    /**
     * Determines which captain ('A' or 'B') has the pick for a given turn index
     * @param {number} pickIndex - 0-based total number of picks made so far
     * @param {string} firstPicker - 'A' or 'B' (winner of the coin toss)
     * @returns {'A' | 'B'}
     */
    getNextPicker(pickIndex, firstPicker = 'A') {
        throw new Error('getNextPicker must be implemented by concrete strategy');
    }

    /**
     * Auto balances remaining unpicked pool between Team A and Team B
     */
    autoBalance(unpickedPool, teamA, teamB) {
        throw new Error('autoBalance must be implemented by concrete strategy');
    }
}

/**
 * Concrete Strategy: Snake Draft (Competitive Standard)
 * Round 1: Cap 1 -> Cap 2
 * Round 2: Cap 2 -> Cap 1
 * Round 3: Cap 1 -> Cap 2
 */
export class SnakeDraftStrategy extends DraftStrategy {
    constructor() {
        super('Snake Draft');
    }

    getNextPicker(pickIndex, firstPicker = 'A') {
        const otherPicker = firstPicker === 'A' ? 'B' : 'A';
        // Every 2 picks represents a round
        const round = Math.floor(pickIndex / 2);
        const positionInRound = pickIndex % 2;

        if (round % 2 === 0) {
            // Even round (0, 2, 4): firstPicker -> otherPicker
            return positionInRound === 0 ? firstPicker : otherPicker;
        } else {
            // Odd round (1, 3, 5): otherPicker -> firstPicker
            return positionInRound === 0 ? otherPicker : firstPicker;
        }
    }

    autoBalance(unpickedPool, teamA, teamB) {
        // Sort players descending by OVR
        const sorted = [...unpickedPool].sort((a, b) => (b.ovr || 80) - (a.ovr || 80));
        const newTeamA = [...teamA];
        const newTeamB = [...teamB];

        sorted.forEach((player, idx) => {
            const sumA = newTeamA.reduce((sum, p) => sum + (p.ovr || 80), 0);
            const sumB = newTeamB.reduce((sum, p) => sum + (p.ovr || 80), 0);

            if (sumA <= sumB) {
                newTeamA.push({ ...player, pickedAtRound: idx + 1 });
            } else {
                newTeamB.push({ ...player, pickedAtRound: idx + 1 });
            }
        });

        return { teamA: newTeamA, teamB: newTeamB, unpickedPool: [] };
    }
}

/**
 * Concrete Strategy: Alternate Draft (Traditional Pickup Game)
 * Cap 1 -> Cap 2 -> Cap 1 -> Cap 2...
 */
export class AlternateDraftStrategy extends DraftStrategy {
    constructor() {
        super('Alternate Draft');
    }

    getNextPicker(pickIndex, firstPicker = 'A') {
        const otherPicker = firstPicker === 'A' ? 'B' : 'A';
        return pickIndex % 2 === 0 ? firstPicker : otherPicker;
    }

    autoBalance(unpickedPool, teamA, teamB) {
        const newTeamA = [...teamA];
        const newTeamB = [...teamB];
        unpickedPool.forEach((p, idx) => {
            if (newTeamA.length <= newTeamB.length) newTeamA.push({ ...p, pickedAtRound: newTeamA.length + 1 });
            else newTeamB.push({ ...p, pickedAtRound: newTeamB.length + 1 });
        });
        return { teamA: newTeamA, teamB: newTeamB, unpickedPool: [] };
    }
}

/**
 * Concrete Strategy: Auto Fair Balance (AI Optimal Equilibrium)
 * Balances based on roles (GK/Bowler/Batsman/Forward) and OVR ratings
 */
export class AutoFairBalanceStrategy extends DraftStrategy {
    constructor() {
        super('Auto Fair Balance');
    }

    getNextPicker(pickIndex, firstPicker = 'A') {
        // Defaults to snake draft if manual picks are made
        return new SnakeDraftStrategy().getNextPicker(pickIndex, firstPicker);
    }

    autoBalance(unpickedPool, teamA, teamB) {
        // Group players by role
        const roleGroups = {};
        unpickedPool.forEach(p => {
            const role = p.role || 'All-Rounder';
            if (!roleGroups[role]) roleGroups[role] = [];
            roleGroups[role].push(p);
        });

        const newTeamA = [...teamA];
        const newTeamB = [...teamB];

        // Distribute role by role to ensure equal role counts
        Object.keys(roleGroups).forEach(role => {
            const players = roleGroups[role].sort((a, b) => (b.ovr || 80) - (a.ovr || 80));
            players.forEach((player) => {
                const sumA = newTeamA.reduce((sum, p) => sum + (p.ovr || 80), 0);
                const sumB = newTeamB.reduce((sum, p) => sum + (p.ovr || 80), 0);

                if (newTeamA.length < newTeamB.length) {
                    newTeamA.push({ ...player, pickedAtRound: newTeamA.length + 1 });
                } else if (newTeamB.length < newTeamA.length) {
                    newTeamB.push({ ...player, pickedAtRound: newTeamB.length + 1 });
                } else if (sumA <= sumB) {
                    newTeamA.push({ ...player, pickedAtRound: newTeamA.length + 1 });
                } else {
                    newTeamB.push({ ...player, pickedAtRound: newTeamB.length + 1 });
                }
            });
        });

        return { teamA: newTeamA, teamB: newTeamB, unpickedPool: [] };
    }
}

/**
 * Factory for Draft Strategies
 */
export class DraftStrategyFactory {
    static getStrategy(type = 'snake') {
        switch (type) {
            case 'alternate':
                return new AlternateDraftStrategy();
            case 'auto_fair':
                return new AutoFairBalanceStrategy();
            case 'snake':
            default:
                return new SnakeDraftStrategy();
        }
    }

    static getAvailableStrategies() {
        return [
            {
                id: 'snake',
                name: 'Snake Draft',
                badge: 'FAIR STANDARD',
                description: 'Alternating rounds reverse order (A → B, B → A) for competitive parity.'
            },
            {
                id: 'alternate',
                name: 'Classic Alternating',
                badge: 'STREET STYLE',
                description: 'Turn-by-turn pick order (A → B → A → B).'
            },
            {
                id: 'auto_fair',
                name: 'AI Equilibrium Split',
                badge: '1-CLICK AI',
                description: 'Automatically distributes athletes matching roles and OVR rating.'
            }
        ];
    }
}
