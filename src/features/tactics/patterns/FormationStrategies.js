/**
 * DESIGN PATTERN: STRATEGY PATTERN (GoF Behavioral Pattern)
 * 
 * Defines an algorithmic family of formation coordinate calculators across sports:
 * 1. Football Formations (5v5, 7v7, 11v11) on Rectangular Pitch
 * 2. Turf Box Cricket Field Sets (6v6, 7v7, 8v8) on Square Cage Pitch
 * 
 * Encapsulates coordinate geometry and makes sport strategies interchangeable at runtime.
 */

// Base Strategy Interface
class FormationStrategy {
    calculatePositions() {
        throw new Error("calculatePositions() must be implemented by concrete strategy.");
    }
}

// ====================================================
// FOOTBALL FORMATION STRATEGIES (Rectangular Pitch)
// ====================================================
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

// ====================================================
// CRICKET FORMATION STRATEGIES (Square Box Turf)
// Pitch strip runs vertically through center:
// - Striker end (Batsman): ~30% Y
// - Bowling crease (Bowler): ~70% Y
// ====================================================

// --- 7v7 Box Cricket Strategies ---
class CricketSevenAsideBalancedStrategy extends FormationStrategy {
    calculatePositions() {
        return [
            { id: 'p1', name: 'Wicketkeeper', number: 1, role: 'WK', x: 50, y: 16, isCaptain: false },
            { id: 'p2', name: 'Bowler', number: 99, role: 'BOW', x: 50, y: 76, isCaptain: true },
            { id: 'p3', name: 'Point', number: 7, role: 'AR', x: 22, y: 35, isCaptain: false },
            { id: 'p4', name: 'Cover', number: 18, role: 'BAT', x: 20, y: 58, isCaptain: false },
            { id: 'p5', name: 'Mid-Wicket', number: 45, role: 'BAT', x: 78, y: 38, isCaptain: false },
            { id: 'p6', name: 'Long-On', number: 33, role: 'AR', x: 75, y: 74, isCaptain: false },
            { id: 'p7', name: 'Long-Off', number: 10, role: 'BOW', x: 24, y: 78, isCaptain: false }
        ];
    }
}

class CricketSevenAsideAttackStrategy extends FormationStrategy {
    calculatePositions() {
        return [
            { id: 'p1', name: 'Wicketkeeper', number: 1, role: 'WK', x: 50, y: 14, isCaptain: false },
            { id: 'p2', name: 'First Slip', number: 2, role: 'AR', x: 38, y: 18, isCaptain: false },
            { id: 'p3', name: 'Silly Point', number: 7, role: 'BAT', x: 28, y: 32, isCaptain: false },
            { id: 'p4', name: 'Short Mid-Wicket', number: 45, role: 'BAT', x: 72, y: 34, isCaptain: false },
            { id: 'p5', name: 'Bowler', number: 99, role: 'BOW', x: 50, y: 76, isCaptain: true },
            { id: 'p6', name: 'Deep Long-Off', number: 18, role: 'BOW', x: 22, y: 82, isCaptain: false },
            { id: 'p7', name: 'Deep Long-On', number: 33, role: 'AR', x: 78, y: 82, isCaptain: false }
        ];
    }
}

class CricketSevenAsideDeathStrategy extends FormationStrategy {
    calculatePositions() {
        return [
            { id: 'p1', name: 'Wicketkeeper', number: 1, role: 'WK', x: 50, y: 16, isCaptain: false },
            { id: 'p2', name: 'Bowler', number: 99, role: 'BOW', x: 50, y: 75, isCaptain: true },
            { id: 'p3', name: 'Deep Point Fence', number: 7, role: 'AR', x: 14, y: 30, isCaptain: false },
            { id: 'p4', name: 'Deep Cover Fence', number: 18, role: 'BAT', x: 14, y: 68, isCaptain: false },
            { id: 'p5', name: 'Deep Mid-Wicket', number: 45, role: 'BAT', x: 86, y: 35, isCaptain: false },
            { id: 'p6', name: 'Deep Square Leg', number: 10, role: 'BOW', x: 86, y: 68, isCaptain: false },
            { id: 'p7', name: 'Straight Long-On', number: 33, role: 'AR', x: 65, y: 84, isCaptain: false }
        ];
    }
}

// --- 6v6 Box Cricket Strategies ---
class CricketSixAsideRingStrategy extends FormationStrategy {
    calculatePositions() {
        return [
            { id: 'p1', name: 'Wicketkeeper', number: 1, role: 'WK', x: 50, y: 16, isCaptain: false },
            { id: 'p2', name: 'Bowler', number: 99, role: 'BOW', x: 50, y: 75, isCaptain: true },
            { id: 'p3', name: 'Point', number: 7, role: 'AR', x: 22, y: 36, isCaptain: false },
            { id: 'p4', name: 'Mid-Wicket', number: 45, role: 'BAT', x: 78, y: 38, isCaptain: false },
            { id: 'p5', name: 'Deep Long-Off', number: 18, role: 'BOW', x: 22, y: 80, isCaptain: false },
            { id: 'p6', name: 'Deep Long-On', number: 33, role: 'AR', x: 78, y: 80, isCaptain: false }
        ];
    }
}

class CricketSixAsideAttackStrategy extends FormationStrategy {
    calculatePositions() {
        return [
            { id: 'p1', name: 'Wicketkeeper', number: 1, role: 'WK', x: 50, y: 14, isCaptain: false },
            { id: 'p2', name: 'First Slip', number: 2, role: 'AR', x: 38, y: 18, isCaptain: false },
            { id: 'p3', name: 'Short Cover', number: 18, role: 'BAT', x: 25, y: 40, isCaptain: false },
            { id: 'p4', name: 'Short Mid-Wicket', number: 45, role: 'BAT', x: 75, y: 40, isCaptain: false },
            { id: 'p5', name: 'Bowler', number: 99, role: 'BOW', x: 50, y: 76, isCaptain: true },
            { id: 'p6', name: 'Sweeper Cover', number: 7, role: 'AR', x: 20, y: 80, isCaptain: false }
        ];
    }
}

// --- 8v8 Box Cricket Strategies ---
class CricketEightAsideWallStrategy extends FormationStrategy {
    calculatePositions() {
        return [
            { id: 'p1', name: 'Wicketkeeper', number: 1, role: 'WK', x: 50, y: 16, isCaptain: false },
            { id: 'p2', name: 'Slip', number: 2, role: 'AR', x: 38, y: 18, isCaptain: false },
            { id: 'p3', name: 'Point', number: 7, role: 'AR', x: 20, y: 36, isCaptain: false },
            { id: 'p4', name: 'Extra Cover', number: 18, role: 'BAT', x: 20, y: 60, isCaptain: false },
            { id: 'p5', name: 'Mid-Wicket', number: 45, role: 'BAT', x: 80, y: 38, isCaptain: false },
            { id: 'p6', name: 'Square Leg', number: 10, role: 'BAT', x: 80, y: 60, isCaptain: false },
            { id: 'p7', name: 'Bowler', number: 99, role: 'BOW', x: 50, y: 76, isCaptain: true },
            { id: 'p8', name: 'Straight Long-On', number: 33, role: 'BOW', x: 70, y: 84, isCaptain: false }
        ];
    }
}

class CricketEightAsideDeathStrategy extends FormationStrategy {
    calculatePositions() {
        return [
            { id: 'p1', name: 'Wicketkeeper', number: 1, role: 'WK', x: 50, y: 16, isCaptain: false },
            { id: 'p2', name: 'Bowler', number: 99, role: 'BOW', x: 50, y: 75, isCaptain: true },
            { id: 'p3', name: 'Third Man Fence', number: 2, role: 'AR', x: 20, y: 18, isCaptain: false },
            { id: 'p4', name: 'Deep Point', number: 7, role: 'AR', x: 14, y: 35, isCaptain: false },
            { id: 'p5', name: 'Deep Cover', number: 18, role: 'BAT', x: 14, y: 68, isCaptain: false },
            { id: 'p6', name: 'Deep Mid-Wicket', number: 45, role: 'BAT', x: 86, y: 35, isCaptain: false },
            { id: 'p7', name: 'Deep Square Leg', number: 10, role: 'BAT', x: 86, y: 68, isCaptain: false },
            { id: 'p8', name: 'Long-On', number: 33, role: 'BOW', x: 65, y: 84, isCaptain: false }
        ];
    }
}

// ====================================================
// SPORT FORMATION CATALOGS (Strategy Registry)
// ====================================================
export const SPORT_CATALOGS = {
    Football: {
        aspectRatio: 'aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4]',
        formats: ['5v5', '7v7', '11v11'],
        defaultFormat: '5v5',
        formations: {
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
        }
    },
    Cricket: {
        aspectRatio: 'aspect-square', // USER SPECIFIC REQUIREMENT: Square turf box cricket
        formats: ['6v6', '7v7', '8v8'],
        defaultFormat: '7v7',
        formations: {
            '6v6': [
                { id: '6-ring', label: '6v6 Balanced Ring', desc: 'Even cage coverage with dual deep sweepers', strategy: new CricketSixAsideRingStrategy() },
                { id: '6-attack', label: '6v6 Powerplay Attack', desc: 'Close slip and short covers pressure', strategy: new CricketSixAsideAttackStrategy() }
            ],
            '7v7': [
                { id: '7-ring', label: '7v7 Standard Box Ring', desc: 'The standard amateur turf cricket field placement', strategy: new CricketSevenAsideBalancedStrategy() },
                { id: '7-attack', label: '7v7 Aggressive Slips', desc: 'Slip + Silly Point early wickets lock', strategy: new CricketSevenAsideAttackStrategy() },
                { id: '7-death', label: '7v7 Death Overs Lock', desc: 'Deep net-boundary protection against big hitters', strategy: new CricketSevenAsideDeathStrategy() }
            ],
            '8v8': [
                { id: '8-wall', label: '8v8 Complete Net Wall', desc: 'Maximum cage coverage across off and leg nets', strategy: new CricketEightAsideWallStrategy() },
                { id: '8-death', label: '8v8 Death Boundary Defense', desc: 'Deep fence anchors on all boundary ropes', strategy: new CricketEightAsideDeathStrategy() }
            ]
        }
    }
};

// Legacy alias for football compatibility
export const FORMATION_CATALOG = SPORT_CATALOGS.Football.formations;

/**
 * Strategy Context Invoker
 * Dispatches coordinates for selected sport, format, and formation ID
 */
export function getFormationPositions(sport = 'Football', pitchFormat, formationId) {
    const sportConfig = SPORT_CATALOGS[sport] || SPORT_CATALOGS.Football;
    const format = pitchFormat || sportConfig.defaultFormat;
    const list = sportConfig.formations[format] || sportConfig.formations[sportConfig.defaultFormat];
    const matched = list.find(f => f.id === formationId) || list[0];
    return matched.strategy.calculatePositions();
}
