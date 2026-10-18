/**
 * GoF Strategy Pattern & Factory Pattern for TurfX Scorecards
 * Academic Context: Project Management & Design Patterns
 * 
 * Defines sport-specific calculation, validation, and broadcast formatting
 * algorithms encapsulated into interchangeable Strategy classes.
 */

// Base Strategy (Abstract)
export class ScorecardStrategy {
    constructor(sport) {
        this.sport = sport;
    }

    computeSummary(scorecard) {
        throw new Error('computeSummary() must be implemented by concrete Strategy');
    }

    formatWhatsAppShare(scorecard) {
        throw new Error('formatWhatsAppShare() must be implemented by concrete Strategy');
    }

    validate(scorecard) {
        if (!scorecard.teamA?.name?.trim() || !scorecard.teamB?.name?.trim()) {
            return { valid: false, error: 'Both Team / Player names are required.' };
        }
        return { valid: true };
    }

    getDefaultData() {
        return {};
    }
}

/**
 * Concrete Strategy: Cricket & Turf Box Cricket
 */
export class CricketScoreStrategy extends ScorecardStrategy {
    constructor() {
        super('Cricket');
    }

    getDefaultData() {
        return {
            cricketData: {
                matchOversLimit: 10,
                firstInnings: {
                    team: 'A',
                    runs: 0,
                    wickets: 0,
                    overs: 0,
                    balls: 0,
                    extras: 0,
                    batsmen: [],
                    bowlers: []
                },
                secondInnings: {
                    team: 'B',
                    runs: 0,
                    wickets: 0,
                    overs: 0,
                    balls: 0,
                    extras: 0,
                    batsmen: [],
                    bowlers: []
                }
            }
        };
    }

    computeSummary(scorecard) {
        const inn1 = scorecard.cricketData?.firstInnings || { runs: 0, wickets: 0, overs: 0, balls: 0, team: 'A' };
        const inn2 = scorecard.cricketData?.secondInnings || { runs: 0, wickets: 0, overs: 0, balls: 0, team: 'B' };

        const teamAName = scorecard.teamA?.name || 'Team A';
        const teamBName = scorecard.teamB?.name || 'Team B';

        const batFirstTeam = inn1.team === 'A' ? teamAName : teamBName;
        const batSecondTeam = inn1.team === 'A' ? teamBName : teamAName;

        const batFirstScore = `${inn1.runs}/${inn1.wickets} (${inn1.overs}.${inn1.balls || 0} ov)`;
        const batSecondScore = `${inn2.runs}/${inn2.wickets} (${inn2.overs}.${inn2.balls || 0} ov)`;

        let winner = 'Draw';
        let resultSummary = 'Match Tied';

        if (inn1.runs > inn2.runs) {
            winner = batFirstTeam;
            const diff = inn1.runs - inn2.runs;
            resultSummary = `${batFirstTeam} won by ${diff} run${diff === 1 ? '' : 's'}`;
        } else if (inn2.runs > inn1.runs) {
            winner = batSecondTeam;
            const wicketsLeft = Math.max(0, 10 - inn2.wickets);
            resultSummary = `${batSecondTeam} won by ${wicketsLeft} wicket${wicketsLeft === 1 ? '' : 's'}`;
        } else if (inn1.runs === inn2.runs && inn1.runs > 0) {
            winner = 'Tie';
            resultSummary = 'Match Tied (Scores Level)';
        }

        const scoreHighlight = `${batFirstTeam}: ${inn1.runs}/${inn1.wickets} vs ${batSecondTeam}: ${inn2.runs}/${inn2.wickets}`;

        return {
            winner,
            resultSummary,
            scoreHighlight,
            teamAScoreDisplay: inn1.team === 'A' ? batFirstScore : batSecondScore,
            teamBScoreDisplay: inn1.team === 'B' ? batFirstScore : batSecondScore
        };
    }

    formatWhatsAppShare(scorecard) {
        const summary = this.computeSummary(scorecard);
        const inn1 = scorecard.cricketData?.firstInnings || {};
        const inn2 = scorecard.cricketData?.secondInnings || {};

        let text = `🏏 *TURFX BOX CRICKET SCORECARD* 🏏\n`;
        text += `🏟️ *Turf:* ${scorecard.turfName || 'Arena Turf'}\n`;
        text += `📅 *Date:* ${scorecard.matchDate || 'Match Day'} | ⏰ ${scorecard.matchTime || 'Prime Slot'}\n\n`;

        text += `🏆 *RESULT:* ${summary.resultSummary.toUpperCase()}\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `1️⃣ *1st Innings:*\n`;
        text += `   ${inn1.team === 'A' ? scorecard.teamA?.name : scorecard.teamB?.name}: *${inn1.runs}/${inn1.wickets}* (${inn1.overs}.${inn1.balls || 0} Overs)\n\n`;
        text += `2️⃣ *2nd Innings:*\n`;
        text += `   ${inn2.team === 'A' ? scorecard.teamA?.name : scorecard.teamB?.name}: *${inn2.runs}/${inn2.wickets}* (${inn2.overs}.${inn2.balls || 0} Overs)\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;

        if (scorecard.playerOfTheMatch) {
            text += `⭐ *Player of the Match:* 👑 ${scorecard.playerOfTheMatch.toUpperCase()}\n`;
        }
        if (scorecard.notes) {
            text += `📝 *Highlights:* ${scorecard.notes}\n`;
        }

        text += `\n⚡ *Verified on TurfX Match Ledger*`;
        return text;
    }
}

/**
 * Concrete Strategy: Football & Futsal
 */
export class FootballScoreStrategy extends ScorecardStrategy {
    constructor() {
        super('Football');
    }

    getDefaultData() {
        return {
            footballData: {
                teamAGoals: 0,
                teamBGoals: 0,
                halfTimeScore: { teamA: 0, teamB: 0 },
                penalties: { isPenaltyShootout: false, scoreA: 0, scoreB: 0 },
                goalScorers: []
            }
        };
    }

    computeSummary(scorecard) {
        const fb = scorecard.footballData || { teamAGoals: 0, teamBGoals: 0 };
        const teamAName = scorecard.teamA?.name || 'Team A';
        const teamBName = scorecard.teamB?.name || 'Team B';

        let winner = 'Draw';
        let resultSummary = `Match Drawn ${fb.teamAGoals} - ${fb.teamBGoals}`;

        if (fb.teamAGoals > fb.teamBGoals) {
            winner = teamAName;
            resultSummary = `${teamAName} won ${fb.teamAGoals} - ${fb.teamBGoals}`;
        } else if (fb.teamBGoals > fb.teamAGoals) {
            winner = teamBName;
            resultSummary = `${teamBName} won ${fb.teamBGoals} - ${fb.teamAGoals}`;
        } else if (fb.penalties?.isPenaltyShootout) {
            if (fb.penalties.scoreA > fb.penalties.scoreB) {
                winner = teamAName;
                resultSummary = `${teamAName} won ${fb.penalties.scoreA} - ${fb.penalties.scoreB} on Penalties (${fb.teamAGoals}-${fb.teamBGoals} FT)`;
            } else if (fb.penalties.scoreB > fb.penalties.scoreA) {
                winner = teamBName;
                resultSummary = `${teamBName} won ${fb.penalties.scoreB} - ${fb.penalties.scoreA} on Penalties (${fb.teamAGoals}-${fb.teamBGoals} FT)`;
            }
        }

        const scoreHighlight = `${teamAName} ${fb.teamAGoals} - ${fb.teamBGoals} ${teamBName}`;

        return {
            winner,
            resultSummary,
            scoreHighlight,
            teamAScoreDisplay: `${fb.teamAGoals} Goals`,
            teamBScoreDisplay: `${fb.teamBGoals} Goals`
        };
    }

    formatWhatsAppShare(scorecard) {
        const summary = this.computeSummary(scorecard);
        const fb = scorecard.footballData || {};

        let text = `⚽ *TURFX MATCHDAY SCORECARD* ⚽\n`;
        text += `🏟️ *Turf:* ${scorecard.turfName || 'Arena Turf'}\n`;
        text += `📅 *Date:* ${scorecard.matchDate || 'Match Day'} | ⏰ ${scorecard.matchTime || 'Prime Slot'}\n\n`;

        text += `🏆 *RESULT:* ${summary.resultSummary.toUpperCase()}\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `⚔️ *FINAL SCORE:*\n`;
        text += `   *${scorecard.teamA?.name}* ${fb.teamAGoals} - ${fb.teamBGoals} *${scorecard.teamB?.name}*\n`;

        if (fb.halfTimeScore && (fb.halfTimeScore.teamA > 0 || fb.halfTimeScore.teamB > 0)) {
            text += `   (HT: ${fb.halfTimeScore.teamA} - ${fb.halfTimeScore.teamB})\n`;
        }
        if (fb.penalties?.isPenaltyShootout) {
            text += `   (Penalties: ${fb.penalties.scoreA} - ${fb.penalties.scoreB})\n`;
        }

        if (fb.goalScorers && fb.goalScorers.length > 0) {
            text += `\n🎯 *GOALSCORERS:*\n`;
            fb.goalScorers.forEach(g => {
                text += `• ${g.playerName} (${g.team === 'A' ? scorecard.teamA?.name : scorecard.teamB?.name}) - ${g.minute ? g.minute + "'" : '⚽'}\n`;
            });
        }
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;

        if (scorecard.playerOfTheMatch) {
            text += `⭐ *Man of the Match:* 👑 ${scorecard.playerOfTheMatch.toUpperCase()}\n`;
        }
        if (scorecard.notes) {
            text += `📝 *Tactical Notes:* ${scorecard.notes}\n`;
        }

        text += `\n⚡ *Verified on TurfX Match Ledger*`;
        return text;
    }
}

/**
 * Concrete Strategy: Racket Sports (Badminton / Tennis)
 */
export class RacketScoreStrategy extends ScorecardStrategy {
    constructor(sport = 'Badminton') {
        super(sport);
    }

    getDefaultData() {
        return {
            racketData: {
                matchFormat: 'Singles',
                sets: [
                    { setNumber: 1, scoreA: 21, scoreB: 18, winner: 'A' },
                    { setNumber: 2, scoreA: 19, scoreB: 21, winner: 'B' },
                    { setNumber: 3, scoreA: 21, scoreB: 15, winner: 'A' }
                ],
                setsWonA: 2,
                setsWonB: 1
            }
        };
    }

    computeSummary(scorecard) {
        const rd = scorecard.racketData || { sets: [], setsWonA: 0, setsWonB: 0 };
        const teamAName = scorecard.teamA?.name || 'Player / Pair A';
        const teamBName = scorecard.teamB?.name || 'Player / Pair B';

        let setsA = 0;
        let setsB = 0;

        if (rd.sets && rd.sets.length > 0) {
            rd.sets.forEach(s => {
                const a = Number(s.scoreA || 0);
                const b = Number(s.scoreB || 0);
                if (a > b) setsA++;
                else if (b > a) setsB++;
            });
        } else {
            setsA = rd.setsWonA || 0;
            setsB = rd.setsWonB || 0;
        }

        let winner = 'Draw';
        let resultSummary = `Tied (${setsA} - ${setsB} Sets)`;

        if (setsA > setsB) {
            winner = teamAName;
            resultSummary = `${teamAName} won ${setsA} - ${setsB}`;
        } else if (setsB > setsA) {
            winner = teamBName;
            resultSummary = `${teamBName} won ${setsB} - ${setsA}`;
        }

        const setScoresStr = (rd.sets || [])
            .map(s => `${s.scoreA}-${s.scoreB}`)
            .join(', ');

        const scoreHighlight = `${teamAName} [${setsA}] vs [${setsB}] ${teamBName} (${setScoresStr})`;

        return {
            winner,
            resultSummary,
            scoreHighlight,
            teamAScoreDisplay: `${setsA} Sets`,
            teamBScoreDisplay: `${setsB} Sets`
        };
    }

    formatWhatsAppShare(scorecard) {
        const summary = this.computeSummary(scorecard);
        const rd = scorecard.racketData || {};
        const isBadminton = this.sport === 'Badminton';

        let text = `${isBadminton ? '🏸' : '🎾'} *TURFX ${this.sport.toUpperCase()} SHOWDOWN* ${isBadminton ? '🏸' : '🎾'}\n`;
        text += `🏟️ *Court:* ${scorecard.turfName || 'Indoor Court'}\n`;
        text += `📅 *Date:* ${scorecard.matchDate || 'Match Day'} | ⏰ ${scorecard.matchTime || 'Prime Slot'}\n\n`;

        text += `🏆 *RESULT:* ${summary.resultSummary.toUpperCase()}\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `⚔️ *SET BREAKDOWN:*\n`;
        (rd.sets || []).forEach(s => {
            text += `   Set ${s.setNumber}: ${scorecard.teamA?.name} *${s.scoreA}* - *${s.scoreB}* ${scorecard.teamB?.name}\n`;
        });
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;

        if (scorecard.playerOfTheMatch) {
            text += `⭐ *Player of the Match:* 👑 ${scorecard.playerOfTheMatch.toUpperCase()}\n`;
        }
        if (scorecard.notes) {
            text += `📝 *Notes:* ${scorecard.notes}\n`;
        }

        text += `\n⚡ *Verified on TurfX Match Ledger*`;
        return text;
    }
}

/**
 * Concrete Strategy: Universal Sport (Basketball / Box Sports / Custom)
 */
export class UniversalScoreStrategy extends ScorecardStrategy {
    constructor(sport = 'Universal') {
        super(sport);
    }

    getDefaultData() {
        return {
            universalData: {
                metricName: 'Points',
                pointsA: 0,
                pointsB: 0
            }
        };
    }

    computeSummary(scorecard) {
        const ud = scorecard.universalData || { metricName: 'Points', pointsA: 0, pointsB: 0 };
        const teamAName = scorecard.teamA?.name || 'Team A';
        const teamBName = scorecard.teamB?.name || 'Team B';
        const pA = Number(ud.pointsA || 0);
        const pB = Number(ud.pointsB || 0);

        let winner = 'Draw';
        let resultSummary = `Tied at ${pA} ${ud.metricName || 'Points'}`;

        if (pA > pB) {
            winner = teamAName;
            resultSummary = `${teamAName} won ${pA} - ${pB}`;
        } else if (pB > pA) {
            winner = teamBName;
            resultSummary = `${teamBName} won ${pB} - ${pA}`;
        }

        const scoreHighlight = `${teamAName} ${pA} - ${pB} ${teamBName} (${ud.metricName || 'Points'})`;

        return {
            winner,
            resultSummary,
            scoreHighlight,
            teamAScoreDisplay: `${pA} ${ud.metricName || 'Pts'}`,
            teamBScoreDisplay: `${pB} ${ud.metricName || 'Pts'}`
        };
    }

    formatWhatsAppShare(scorecard) {
        const summary = this.computeSummary(scorecard);
        const ud = scorecard.universalData || {};

        let text = `🏅 *TURFX MATCH SCORECARD (${this.sport.toUpperCase()})* 🏅\n`;
        text += `🏟️ *Venue:* ${scorecard.turfName || 'Arena Turf'}\n`;
        text += `📅 *Date:* ${scorecard.matchDate || 'Match Day'}\n\n`;

        text += `🏆 *RESULT:* ${summary.resultSummary.toUpperCase()}\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;
        text += `⚔️ *FINAL SCORE:*\n`;
        text += `   *${scorecard.teamA?.name}*: ${ud.pointsA || 0} ${ud.metricName || 'Points'}\n`;
        text += `   *${scorecard.teamB?.name}*: ${ud.pointsB || 0} ${ud.metricName || 'Points'}\n`;
        text += `━━━━━━━━━━━━━━━━━━━━━\n`;

        if (scorecard.playerOfTheMatch) {
            text += `⭐ *MVP:* 👑 ${scorecard.playerOfTheMatch.toUpperCase()}\n`;
        }

        text += `\n⚡ *Verified on TurfX Match Ledger*`;
        return text;
    }
}

/**
 * GoF Factory Pattern: ScorecardFactory
 * Instantiates the appropriate strategy and schema template for any sport.
 */
export class ScorecardFactory {
    static getStrategy(sport = 'Cricket') {
        const normalized = (sport || '').toLowerCase().trim();
        if (normalized.includes('cricket')) {
            return new CricketScoreStrategy();
        }
        if (normalized.includes('football') || normalized.includes('futsal') || normalized.includes('soccer')) {
            return new FootballScoreStrategy();
        }
        if (normalized.includes('badminton')) {
            return new RacketScoreStrategy('Badminton');
        }
        if (normalized.includes('tennis') || normalized.includes('pickleball')) {
            return new RacketScoreStrategy('Tennis');
        }
        return new UniversalScoreStrategy(sport || 'Universal');
    }

    static getSupportedSports() {
        return [
            {
                id: 'Cricket',
                label: 'Cricket / Box Cricket',
                icon: '🏏',
                badgeColor: 'border-neon-green/30 bg-neon-green/10 text-neon-green',
                accentColor: '#39ff14',
                gradient: 'from-emerald-500/20 via-slate-900 to-slate-950',
                popularFormats: ['6 Overs Box', '8 Overs Turbo', '10 Overs Classic', 'T20 Match']
            },
            {
                id: 'Football',
                label: 'Football / Futsal',
                icon: '⚽',
                badgeColor: 'border-neon-blue/30 bg-neon-blue/10 text-neon-blue',
                accentColor: '#00f0ff',
                gradient: 'from-cyan-500/20 via-slate-900 to-slate-950',
                popularFormats: ['5v5 Turf Cage', '7v7 Arena', '11v11 Pitch']
            },
            {
                id: 'Badminton',
                label: 'Badminton',
                icon: '🏸',
                badgeColor: 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-400',
                accentColor: '#d946ef',
                gradient: 'from-fuchsia-500/20 via-slate-900 to-slate-950',
                popularFormats: ['Singles (Best of 3)', 'Doubles (Best of 3)']
            },
            {
                id: 'Tennis',
                label: 'Tennis / Pickleball',
                icon: '🎾',
                badgeColor: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
                accentColor: '#f59e0b',
                gradient: 'from-amber-500/20 via-slate-900 to-slate-950',
                popularFormats: ['Singles Tiebreak', 'Doubles Pro Set']
            },
            {
                id: 'Universal',
                label: 'Universal Turf Sport',
                icon: '🎯',
                badgeColor: 'border-purple-500/30 bg-purple-500/10 text-purple-400',
                accentColor: '#a855f7',
                gradient: 'from-purple-500/20 via-slate-900 to-slate-950',
                popularFormats: ['Points Match', 'Timed Rounds']
            }
        ];
    }

    static createDefaultScorecard(sport = 'Cricket', bookingData = null) {
        const strategy = ScorecardFactory.getStrategy(sport);
        const sportSpecific = strategy.getDefaultData();

        return {
            sport,
            turfName: bookingData?.venue || bookingData?.turfName || 'Arena Turf',
            turfLocation: bookingData?.location || 'Certified Arena Ground',
            bookingId: bookingData?.id || bookingData?._id || null,
            matchDate: bookingData?.date || new Date().toISOString().split('T')[0],
            matchTime: bookingData?.time || bookingData?.timeSlot || 'Prime Slot',
            teamA: {
                name: 'Team Alpha',
                captain: 'Captain A',
                scoreDisplay: ''
            },
            teamB: {
                name: 'Team Beta',
                captain: 'Captain B',
                scoreDisplay: ''
            },
            winner: 'Pending',
            resultSummary: '',
            playerOfTheMatch: '',
            notes: '',
            ...sportSpecific
        };
    }
}
