/**
 * DESIGN PATTERN: STRATEGY PATTERN (GoF Behavioral Pattern)
 * 
 * Defines an algorithmic family of formation coordinate calculators.
 * Encapsulates each formation strategy and makes them interchangeable at runtime
 * across 5v5, 7v7, and 11v11 pitch formats.
 */

// Base Strategy Interface
class FormationStrategy {
    calculatePositions() {
        throw new Error("calculatePositions() must be implemented by concrete strategy.");
    }
}

// ----------------------------------------------------
// 5v5 FORMATION STRATEGIES
// ----------------------------------------------------
class FiveAsideDiamondStrategy extends FormationStrategy {
    calculatePositions() {
        return [
            { id: 'p1', name: 'Goalkeeper', number: 1, role: 'GK', x: 50, y: 88, isCaptain: false },
            { id: 'p2', name: 'Center Back', number: 4, role: 'DEF', x: 50, y: 65, isCaptain: false },
            { id: 'p3', name: 'Left Wing', number: 7, role: 'MID', x: 22, y: 45, isCaptain: false },
            { id: 'p4', name: 'Right Wing', number: 11, role: 'MID', x: 78, y: 45, isCaptain: false },
            { id: 'p5', name: 'Striker', number: 9, role: 'FWD', x: 50, y: 20, isCaptain: true }
        ];
    }
}

class FiveAsideBoxStrategy extends FormationStrategy {
    calculatePositions() {
        return [
            { id: 'p1', name: 'Goalkeeper', number: 1, role: 'GK', x: 50, y: 88, isCaptain: false },
            { id: 'p2', name: 'Left Back', number: 3, role: 'DEF', x: 30, y: 62, isCaptain: false },
            { id: 'p3', name: 'Right Back', number: 2, role: 'DEF', x: 70, y: 62, isCaptain: false },
            { id: 'p4', name: 'Left Forward', number: 10, role: 'FWD', x: 32, y: 28, isCaptain: true },
            { id: 'p5', name: 'Right Forward', number: 9, role: 'FWD', x: 68, y: 28, isCaptain: false }
        ];
    }
}

class FiveAsideAttackStrategy extends FormationStrategy {
    calculatePositions() {
        return [
            { id: 'p1', name: 'Goalkeeper', number: 1, role: 'GK', x: 50, y: 88, isCaptain: false },
            { id: 'p2', name: 'Sweeper', number: 4, role: 'DEF', x: 50, y: 70, isCaptain: false },
            { id: 'p3', name: 'Playmaker', number: 8, role: 'MID', x: 50, y: 48, isCaptain: true },
            { id: 'p4', name: 'Left Winger', number: 7, role: 'FWD', x: 24, y: 22, isCaptain: false },
            { id: 'p5', name: 'Right Winger', number: 11, role: 'FWD', x: 76, y: 22, isCaptain: false }
        ];
    }
}

class FiveAsidePyramidStrategy extends FormationStrategy {
    calculatePositions() {
        return [
            { id: 'p1', name: 'Goalkeeper', number: 1, role: 'GK', x: 50, y: 88, isCaptain: false },
            { id: 'p2', name: 'Left Defender', number: 3, role: 'DEF', x: 28, y: 65, isCaptain: false },
            { id: 'p3', name: 'Right Defender', number: 2, role: 'DEF', x: 72, y: 65, isCaptain: false },
            { id: 'p4', name: 'Central Mid', number: 6, role: 'MID', x: 50, y: 44, isCaptain: false },
            { id: 'p5', name: 'Target Man', number: 9, role: 'FWD', x: 50, y: 20, isCaptain: true }
        ];
    }
}

// ----------------------------------------------------
// 7v7 FORMATION STRATEGIES
// ----------------------------------------------------
class SevenAsideStandardStrategy extends FormationStrategy {
    calculatePositions() {
        return [
            { id: 'p1', name: 'Goalkeeper', number: 1, role: 'GK', x: 50, y: 90, isCaptain: false },
            { id: 'p2', name: 'Left Back', number: 3, role: 'DEF', x: 28, y: 72, isCaptain: false },
            { id: 'p3', name: 'Right Back', number: 2, role: 'DEF', x: 72, y: 72, isCaptain: false },
            { id: 'p4', name: 'Left Mid', number: 7, role: 'MID', x: 20, y: 45, isCaptain: false },
            { id: 'p5', name: 'Central Mid', number: 8, role: 'MID', x: 50, y: 48, isCaptain: true },
            { id: 'p6', name: 'Right Mid', number: 11, role: 'MID', x: 80, y: 45, isCaptain: false },
            { id: 'p7', name: 'Center Forward', number: 9, role: 'FWD', x: 50, y: 20, isCaptain: false }
        ];
    }
}

class SevenAsideTreeStrategy extends FormationStrategy {
    calculatePositions() {
        return [
            { id: 'p1', name: 'Goalkeeper', number: 1, role: 'GK', x: 50, y: 90, isCaptain: false },
            { id: 'p2', name: 'Left Stopper', number: 3, role: 'DEF', x: 25, y: 72, isCaptain: false },
            { id: 'p3', name: 'Center Stopper', number: 4, role: 'DEF', x: 50, y: 74, isCaptain: false },
            { id: 'p4', name: 'Right Stopper', number: 2, role: 'DEF', x: 75, y: 72, isCaptain: false },
            { id: 'p5', name: 'Left Attacking Mid', number: 10, role: 'MID', x: 35, y: 42, isCaptain: true },
            { id: 'p6', name: 'Right Attacking Mid', number: 8, role: 'MID', x: 65, y: 42, isCaptain: false },
            { id: 'p7', name: 'Poacher', number: 9, role: 'FWD', x: 50, y: 18, isCaptain: false }
        ];
    }
}

class SevenAsideBalanceStrategy extends FormationStrategy {
    calculatePositions() {
        return [
            { id: 'p1', name: 'Goalkeeper', number: 1, role: 'GK', x: 50, y: 90, isCaptain: false },
            { id: 'p2', name: 'Left Defender', number: 3, role: 'DEF', x: 30, y: 70, isCaptain: false },
            { id: 'p3', name: 'Right Defender', number: 2, role: 'DEF', x: 70, y: 70, isCaptain: false },
            { id: 'p4', name: 'Left Mid', number: 6, role: 'MID', x: 30, y: 45, isCaptain: false },
            { id: 'p5', name: 'Right Mid', number: 8, role: 'MID', x: 70, y: 45, isCaptain: true },
            { id: 'p6', name: 'Left Striker', number: 10, role: 'FWD', x: 35, y: 22, isCaptain: false },
            { id: 'p7', name: 'Right Striker', number: 9, role: 'FWD', x: 65, y: 22, isCaptain: false }
        ];
    }
}

// ----------------------------------------------------
// 11v11 FORMATION STRATEGIES
// ----------------------------------------------------
class ElevenAsideFourThreeThreeStrategy extends FormationStrategy {
    calculatePositions() {
        return [
            { id: 'p1', name: 'Goalkeeper', number: 1, role: 'GK', x: 50, y: 92, isCaptain: false },
            { id: 'p2', name: 'Left Wing-Back', number: 3, role: 'DEF', x: 15, y: 74, isCaptain: false },
            { id: 'p3', name: 'Left Center-Back', number: 4, role: 'DEF', x: 38, y: 78, isCaptain: false },
            { id: 'p4', name: 'Right Center-Back', number: 5, role: 'DEF', x: 62, y: 78, isCaptain: false },
            { id: 'p5', name: 'Right Wing-Back', number: 2, role: 'DEF', x: 85, y: 74, isCaptain: false },
            { id: 'p6', name: 'Defensive Pivot', number: 6, role: 'MID', x: 50, y: 58, isCaptain: false },
            { id: 'p7', name: 'Left Box-to-Box', number: 8, role: 'MID', x: 32, y: 46, isCaptain: false },
            { id: 'p8', name: 'Right Playmaker', number: 10, role: 'MID', x: 68, y: 46, isCaptain: true },
            { id: 'p9', name: 'Left Inverted Winger', number: 7, role: 'FWD', x: 20, y: 24, isCaptain: false },
            { id: 'p10', name: 'Center Forward', number: 9, role: 'FWD', x: 50, y: 16, isCaptain: false },
            { id: 'p11', name: 'Right Winger', number: 11, role: 'FWD', x: 80, y: 24, isCaptain: false }
        ];
    }
}

class ElevenAsideFourTwoThreeOneStrategy extends FormationStrategy {
    calculatePositions() {
        return [
            { id: 'p1', name: 'Goalkeeper', number: 1, role: 'GK', x: 50, y: 92, isCaptain: false },
            { id: 'p2', name: 'Left Back', number: 3, role: 'DEF', x: 15, y: 75, isCaptain: false },
            { id: 'p3', name: 'Center Back L', number: 4, role: 'DEF', x: 38, y: 78, isCaptain: false },
            { id: 'p4', name: 'Center Back R', number: 5, role: 'DEF', x: 62, y: 78, isCaptain: false },
            { id: 'p5', name: 'Right Back', number: 2, role: 'DEF', x: 85, y: 75, isCaptain: false },
            { id: 'p6', name: 'Deep Pivot L', number: 6, role: 'MID', x: 35, y: 60, isCaptain: false },
            { id: 'p7', name: 'Deep Pivot R', number: 8, role: 'MID', x: 65, y: 60, isCaptain: false },
            { id: 'p8', name: 'Left Attacking Mid', number: 11, role: 'MID', x: 20, y: 38, isCaptain: false },
            { id: 'p9', name: 'Central Number 10', number: 10, role: 'MID', x: 50, y: 36, isCaptain: true },
            { id: 'p10', name: 'Right Attacking Mid', number: 7, role: 'MID', x: 80, y: 38, isCaptain: false },
            { id: 'p11', name: 'Lone Striker', number: 9, role: 'FWD', x: 50, y: 16, isCaptain: false }
        ];
    }
}

class ElevenAsideThreeFiveTwoStrategy extends FormationStrategy {
    calculatePositions() {
        return [
            { id: 'p1', name: 'Goalkeeper', number: 1, role: 'GK', x: 50, y: 92, isCaptain: false },
            { id: 'p2', name: 'Left Stopper', number: 3, role: 'DEF', x: 26, y: 78, isCaptain: false },
            { id: 'p3', name: 'Central Libero', number: 4, role: 'DEF', x: 50, y: 80, isCaptain: false },
            { id: 'p4', name: 'Right Stopper', number: 2, role: 'DEF', x: 74, y: 78, isCaptain: false },
            { id: 'p5', name: 'Left Wing-Back', number: 11, role: 'MID', x: 12, y: 50, isCaptain: false },
            { id: 'p6', name: 'Anchor Mid', number: 6, role: 'MID', x: 38, y: 55, isCaptain: false },
            { id: 'p7', name: 'Playmaker', number: 10, role: 'MID', x: 50, y: 40, isCaptain: true },
            { id: 'p8', name: 'Anchor Mid R', number: 8, role: 'MID', x: 62, y: 55, isCaptain: false },
            { id: 'p9', name: 'Right Wing-Back', number: 7, role: 'MID', x: 88, y: 50, isCaptain: false },
            { id: 'p10', name: 'Left Striker', number: 9, role: 'FWD', x: 38, y: 18, isCaptain: false },
            { id: 'p11', name: 'Right Striker', number: 19, role: 'FWD', x: 62, y: 18, isCaptain: false }
        ];
    }
}

// ----------------------------------------------------
// STRATEGY CONTEXT / FACTORY
// ----------------------------------------------------
export const FORMATION_CATALOG = {
    '5v5': [
        { id: '1-2-1', label: '1-2-1 (Diamond)', desc: 'Balanced high press with explosive wings', strategy: new FiveAsideDiamondStrategy() },
        { id: '2-2', label: '2-2 (Box)', desc: 'Solidity with paired attacking tandem', strategy: new FiveAsideBoxStrategy() },
        { id: '1-1-2', label: '1-1-2 (All Out Attack)', desc: 'Aggressive wide overload', strategy: new FiveAsideAttackStrategy() },
        { id: '2-1-1', label: '2-1-1 (Pyramid)', desc: 'Counter-attack lock with target pivot', strategy: new FiveAsidePyramidStrategy() }
    ],
    '7v7': [
        { id: '2-3-1', label: '2-3-1 (Classic)', desc: 'The gold standard amateur 7s formation', strategy: new SevenAsideStandardStrategy() },
        { id: '3-2-1', label: '3-2-1 (Christmas Tree)', desc: 'Rock solid defense with creative dual #10s', strategy: new SevenAsideTreeStrategy() },
        { id: '2-2-2', label: '2-2-2 (Total Balance)', desc: 'Equidistant zones with dual strikers', strategy: new SevenAsideBalanceStrategy() }
    ],
    '11v11': [
        { id: '4-3-3', label: '4-3-3 (Attacking Trio)', desc: 'High press with wide dynamic wingers', strategy: new ElevenAsideFourThreeThreeStrategy() },
        { id: '4-2-3-1', label: '4-2-3-1 (Double Pivot)', desc: 'Modern control with central attacking midfield', strategy: new ElevenAsideFourTwoThreeOneStrategy() },
        { id: '3-5-2', label: '3-5-2 (Wing-Back Blitz)', desc: 'Overloaded midfield with dual target strikers', strategy: new ElevenAsideThreeFiveTwoStrategy() }
    ]
};

/**
 * Strategy Context Invoker
 * Dispatches coordinates for selected pitch format and formation ID
 */
export function getFormationPositions(pitchFormat = '5v5', formationId = '1-2-1') {
    const list = FORMATION_CATALOG[pitchFormat] || FORMATION_CATALOG['5v5'];
    const matched = list.find(f => f.id === formationId) || list[0];
    return matched.strategy.calculatePositions();
}
