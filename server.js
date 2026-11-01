
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'data', 'rooms.json');
fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });

const players = [
['Virat Kohli','Batter','India',2,8000,38,131,0],
['Rohit Sharma','Batter','India',2,6600,30,132,0],
['MS Dhoni','Wicketkeeper','India',1.5,5200,38,137,0],
['Jasprit Bumrah','Bowler','India',2,0,0,0,170],
['Ravindra Jadeja','All-rounder','India',2,2800,27,130,150],
['Hardik Pandya','All-rounder','India',2,1800,28,145,70],
['Suryakumar Yadav','Batter','India',2,3500,32,145,0],
['Shubman Gill','Batter','India',2,3200,38,138,0],
['Rishabh Pant','Wicketkeeper','India',2,3300,35,148,0],
['KL Rahul','Wicketkeeper','India',2,4500,45,135,0],
['Rashid Khan','Bowler','Afghanistan',2,0,0,0,150],
['Andre Russell','All-rounder','West Indies',2,2300,29,175,100],
['Jos Buttler','Wicketkeeper','England',2,3500,38,148,0],
['Sunil Narine','All-rounder','West Indies',2,1000,17,165,180],
['Trent Boult','Bowler','New Zealand',2,0,0,0,110],
['Yuzvendra Chahal','Bowler','India',1.5,0,0,0,200],
['Shreyas Iyer','Batter','India',2,3000,32,130,0],
['David Warner','Batter','Australia',1.5,6500,40,140,0],
['Glenn Maxwell','All-rounder','Australia',1.5,2800,25,155,40],
['Pat Cummins','Bowler','Australia',2,0,0,0,90],

['Faf du Plessis','Batter','South Africa',1.5,4500,36,136,0],
['Devdutt Padikkal','Batter','India',1,1600,30,126,0],
['Ruturaj Gaikwad','Batter','India',1.5,2200,39,136,0],
['Yashasvi Jaiswal','Batter','India',2,1800,33,150,0],
['Rinku Singh','Batter','India',1,900,32,145,0],
['Tilak Varma','Batter','India',1,1100,39,145,0],
['Ishan Kishan','Wicketkeeper','India',1.5,2600,29,135,0],
['Sanju Samson','Wicketkeeper','India',2,4000,30,140,0],
['Quinton de Kock','Wicketkeeper','South Africa',1.5,2900,32,135,0],
['Nicholas Pooran','Wicketkeeper','West Indies',2,2200,32,160,0],
['Jitesh Sharma','Wicketkeeper','India',0.75,700,24,160,0],
['Phil Salt','Wicketkeeper','England',1.5,650,40,175,0],
['Dinesh Karthik','Wicketkeeper','India',0.5,4800,26,135,0],
['Ravichandran Ashwin','All-rounder','India',1.5,800,13,118,170],
['Axar Patel','All-rounder','India',1.5,1600,21,130,110],
['Krunal Pandya','All-rounder','India',1,1500,22,130,70],
['Washington Sundar','All-rounder','India',1,400,15,115,35],
['Marcus Stoinis','All-rounder','Australia',1.5,1800,27,140,40],
['Cameron Green','All-rounder','Australia',2,700,42,150,15],
['Liam Livingstone','All-rounder','England',1.5,900,27,160,15],
['Moeen Ali','All-rounder','England',1,1100,24,140,30],
['Sam Curran','All-rounder','England',1.5,900,25,135,40],
['Mitchell Marsh','All-rounder','Australia',1.5,1500,30,140,35],
['Venkatesh Iyer','All-rounder','India',1.5,1300,29,135,5],
['Deepak Hooda','All-rounder','India',0.75,1200,25,130,10],
['Bhuvneshwar Kumar','Bowler','India',1.5,300,10,100,180],
['Mohammed Shami','Bowler','India',2,200,9,100,190],
['Mohammed Siraj','Bowler','India',1.5,100,8,95,90],
['Arshdeep Singh','Bowler','India',1.5,50,8,90,70],
['Kuldeep Yadav','Bowler','India',1.5,100,10,100,120],
['Ravi Bishnoi','Bowler','India',1,50,8,95,60],
['Varun Chakravarthy','Bowler','India',1.5,50,7,90,90],
['Harshal Patel','Bowler','India',1.5,250,12,120,100],
['T Natarajan','Bowler','India',1,20,5,80,40],
['Avesh Khan','Bowler','India',1,20,5,80,50],
['Mukesh Kumar','Bowler','India',0.75,10,4,70,15],
['Umran Malik','Bowler','India',0.75,10,4,90,15],
['Kagiso Rabada','Bowler','South Africa',2,100,8,100,110],
['Anrich Nortje','Bowler','South Africa',1.5,50,7,100,30],
['Marco Jansen','All-rounder','South Africa',1.5,300,18,125,40],
['Gerald Coetzee','Bowler','South Africa',1,50,8,130,20],
['Mitchell Starc','Bowler','Australia',2,100,10,110,40],
['Josh Hazlewood','Bowler','Australia',2,50,7,90,40],
['Adam Zampa','Bowler','Australia',1,20,5,80,20],
['Nathan Ellis','Bowler','Australia',0.75,10,4,80,10],
['Lockie Ferguson','Bowler','New Zealand',1.5,20,5,100,15],
['Matt Henry','Bowler','New Zealand',1,10,4,80,5],
['Tim Southee','Bowler','New Zealand',1,50,6,90,10],
['Daryl Mitchell','All-rounder','New Zealand',1.5,500,30,135,10],
['Kane Williamson','Batter','New Zealand',1.5,2100,36,125,0],
['Devon Conway','Wicketkeeper','New Zealand',1.5,900,45,130,0],
['Aiden Markram','All-rounder','South Africa',1.5,500,30,135,5],
['David Miller','Batter','South Africa',1.5,2700,36,140,0],
['Travis Head','Batter','Australia',2,700,40,165,0],
['Jake Fraser-McGurk','Batter','Australia',1,300,20,160,0],
['Rachin Ravindra','All-rounder','New Zealand',1.5,200,22,140,5],
['Shivam Dube','All-rounder','India',1.5,1500,30,155,5],
['Rahul Tripathi','Batter','India',0.75,2200,26,140,0],
['Manish Pandey','Batter','India',0.5,3800,29,120,0],
['Mayank Agarwal','Batter','India',0.75,2300,22,130,0]
].map((p, i) => ({
    id: i + 1,
    name: p[0],
    role: p[1],
    country: p[2],
    base: p[3],
    runs: p[4],
    average: p[5],
    strikeRate: p[6],
    wickets: p[7]
}));

const rooms = new Map();
const sockets = new Map();

const code = () => crypto.randomBytes(3).toString('hex').toUpperCase();

function saveRooms() {
    try {
        const data = [...rooms.values()].map(r => ({
            ...r,
            timer: undefined
        }));

        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Could not save rooms:', e.message);
    }
}

try {
    if (fs.existsSync(DATA_FILE)) {
        for (const r of JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))) {
            r.timer = null;

            r.players.forEach(p => {
                p.online = false;
                p.socketId = null;
            });

            rooms.set(r.code, r);
        }
    }
} catch (e) {
    console.error('Room recovery failed:', e.message);
}

function getRoom(s) {
    return rooms.get(s.data.room);
}

function attachPlayer(s, r, p) {
    p.online = true;
    p.socketId = s.id;

    s.data.room = r.code;
    s.data.playerToken = p.token;

    s.join(r.code);

    sockets.set(s.id, {
        room: r.code,
        token: p.token
    });

    if (p.token === r.hostToken) {
        r.hostSocket = s.id;
    }
}

function pub(r) {
    return {
        code: r.code,
        host: r.players.find(p => p.token === r.hostToken)?.id,

        players: r.players.map(p => ({
            id: p.id,
            name: p.name,
            online: p.online,
            purse: p.purse,
            squad: p.squad
        })),

        status: r.status,
        current: r.current,
        bid: r.bid,
        leader: r.leader,
        seconds: r.seconds,
        lot: r.lot,
        totalLots: r.pool.length,
        upcoming: r.pool.slice(r.lot),
        sold: r.sold,
        unsold: r.unsold,
        log: r.log.slice(-12),
        simulation: r.simulation
    };
}

function emit(r) {
    saveRooms();
    io.to(r.code).emit('room', pub(r));
}

function nextLot(r) {
    if (r.lot >= r.pool.length) {
        clearInterval(r.timer);
        r.status = 'finished';
        r.current = null;
        emit(r);
        return;
    }

    r.current = r.pool[r.lot++];
    r.bid = r.current.base;
    r.leader = null;
    r.seconds = 20;
    r.status = 'auction';

    emit(r);

    clearInterval(r.timer);

    r.timer = setInterval(() => {
        if (r.status !== 'auction') return;

        if (--r.seconds <= 0) {
            clearInterval(r.timer);

            if (r.leader) {
                const w = r.players.find(p => p.id === r.leader);

                if (w) {
                    w.purse -= r.bid;
                    w.squad.push({
                        ...r.current,
                        paid: r.bid
                    });

                    r.sold.push({
                        ...r.current,
                        buyer: w.name,
                        paid: r.bid
                    });

                    r.log.push(
                        `${r.current.name} SOLD to ${w.name} for ₹${r.bid.toFixed(2)} Cr`
                    );
                }
            } else {
                r.unsold.push(r.current);
                r.log.push(`${r.current.name} went UNSOLD`);
            }

            r.current = null;
            emit(r);

            setTimeout(() => {
                if (rooms.has(r.code) && r.status === 'auction') {
                    nextLot(r);
                }
            }, 2200);
        } else {
            emit(r);
        }
    }, 1000);
}

// These are game ratings, not predictions of real-world player performance.
function batting(p) {
    const base =
        p.role === 'Batter' ? 76 :
        p.role === 'Wicketkeeper' ? 70 :
        p.role === 'All-rounder' ? 65 : 30;

    return Math.max(
        20,
        Math.min(
            98,
            base +
            (p.average || 0) * 0.35 +
            (p.strikeRate || 0) * 0.08 +
            (p.runs || 0) / 900
        )
    );
}

function bowling(p) {
    const base =
        p.role === 'Bowler' ? 72 :
        p.role === 'All-rounder' ? 61 : 12;

    return Math.max(
        8,
        Math.min(
            98,
            base +
            (p.wickets || 0) * 0.09 +
            (p.role === 'Bowler' ? 8 : 0)
        )
    );
}

function squadRatings(team) {
    const s = team.squad;

    const bats = s.map(batting).sort((a, b) => b - a);
    const bowls = s.map(bowling).sort((a, b) => b - a);

    const bat = s.length
        ? bats.slice(0, 6).reduce((a, b) => a + b, 0) /
          Math.min(6, bats.length)
        : 25;

    const bowl = s.length
        ? bowls.slice(0, 6).reduce((a, b) => a + b, 0) /
          Math.min(6, bowls.length)
        : 15;

    const all = s.filter(p => p.role === 'All-rounder').length;
    const keeper = s.some(p => p.role === 'Wicketkeeper') ? 1 : 0;
    const depth = Math.min(s.length / 11, 1);
    const balance = Math.min(all, 3) * 2 + keeper * 3;

    return {
        batting: bat,
        bowling: bowl,
        allRounders: all,
        depth,
        overall: bat * 0.42 + bowl * 0.40 + balance + depth * 12
    };
}

function simulateInnings(team, opponent) {
    const s = team.squad;

    const teamBoost = (squadRatings(team).overall - 60) * 0.22;
    const opponentPressure =
        (squadRatings(opponent).bowling - 50) * 0.07;

    const batters = s
        .slice()
        .sort((a, b) => batting(b) - batting(a))
        .slice(0, Math.min(7, s.length));

    if (!batters.length) {
        return {
            runs: 70 + Math.floor(Math.random() * 35),
            wickets: 10,
            playerRuns: [],
            bowlerWickets: []
        };
    }

    let total = 0;
    let wickets = 0;
    const playerRuns = [];
    const bowlerWickets = [];

    const bowlers = opponent.squad
        .slice()
        .sort((a, b) => bowling(b) - bowling(a));

    if (!bowlers.length) {
        bowlers.push({
            name: 'Team bowling unit',
            role: 'Bowler',
            wickets: 0
        });
    }

    for (let i = 0; i < batters.length; i++) {
        const p = batters[i];
        const quality = batting(p);

        const contribution = Math.max(
            0,
            Math.round(
                (
                    quality * 0.42 +
                    teamBoost -
                    opponentPressure +
                    Math.random() * 34 -
                    7
                ) * (0.65 + Math.random() * 0.45)
            )
        );

        const runs = Math.min(100, contribution);

        total += runs;
        playerRuns.push({
            name: p.name,
            runs
        });

        if (
            i < batters.length - 1 &&
            Math.random() <
            (0.22 + (bowling(bowlers[i % bowlers.length]) / 500))
        ) {
            wickets++;
        }
    }

    for (let i = 0; i < wickets; i++) {
        const b = bowlers[i % bowlers.length];

        if (b) {
            bowlerWickets.push({
                name: b.name,
                wickets: 1
            });
        }
    }

    total += Math.floor(Math.random() * 25);

    return {
        runs: Math.max(65, total),
        wickets: Math.min(10, wickets),
        playerRuns,
        bowlerWickets
    };
}

function simulateMatch(a, b, stats) {
    const first = Math.random() < 0.5 ? a : b;
    const second = first === a ? b : a;

    const x = simulateInnings(first, second);
    const y = simulateInnings(second, first);

    const diff = x.runs - y.runs;

    const winner =
        diff === 0
            ? (Math.random() < 0.5 ? first : second)
            : (diff > 0 ? first : second);

    const loser = winner === first ? second : first;
    const margin = Math.abs(diff) || 1;

    stats.get(winner.id).points += 2;
    stats.get(winner.id).wins++;
    stats.get(loser.id).losses++;

    stats.get(winner.id).nrr +=
        winner === first ? margin / 20 : -margin / 20;

    stats.get(loser.id).nrr +=
        winner === first ? -margin / 20 : margin / 20;

    for (const [team, inn] of [[first, x], [second, y]]) {
        for (const p of inn.playerRuns) {
            const k = team.name + '|' + p.name;

            stats.get(team.id).runs.set(
                k,
                (stats.get(team.id).runs.get(k) || 0) + p.runs
            );
        }
    }

    for (const [bowlingTeam, inn] of [[second, x], [first, y]]) {
        for (const p of inn.bowlerWickets) {
            const k = bowlingTeam.name + '|' + p.name;

            stats.get(bowlingTeam.id).wickets.set(
                k,
                (stats.get(bowlingTeam.id).wickets.get(k) || 0) + p.wickets
            );
        }
    }

    const result =
        winner === first
            ? `${winner.name} won by ${margin} runs (simulated)`
            : `${winner.name} won by ${Math.max(1, 10 - y.wickets)} wickets (simulated)`;

    return {
        match: `${first.name} ${x.runs}/${x.wickets} vs ${second.name} ${y.runs}/${y.wickets}`,
        winner: winner.name,
        result
    };
}

function tournament(r) {
    const teams = r.players.filter(p => p.squad.length > 0);

    if (teams.length < 2) {
        return {
            error: 'At least two participants must purchase at least one player before simulation.'
        };
    }

    const stats = new Map(
        teams.map(t => [
            t.id,
            {
                id: t.id,
                name: t.name,
                points: 0,
                wins: 0,
                losses: 0,
                nrr: 0,
                ratings: squadRatings(t),
                runs: new Map(),
                wickets: new Map()
            }
        ])
    );

    const matches = [];

    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            matches.push(simulateMatch(teams[i], teams[j], stats));
        }
    }

    const table = [...stats.values()].sort(
        (a, b) =>
            b.points - a.points ||
            b.nrr - a.nrr ||
            b.ratings.overall - a.ratings.overall
    );

    let champion = table[0];
    let runner = table[1] || table[0];
    const playoffs = [];

    if (table.length >= 4) {
        const byId = new Map(teams.map(t => [t.id, t]));

        const q1 = simulateMatch(
            byId.get(table[0].id),
            byId.get(table[1].id),
            stats
        );

        const el1 = simulateMatch(
            byId.get(table[2].id),
            byId.get(table[3].id),
            stats
        );

        playoffs.push(q1, el1);

        const q1Winner = teams.find(t => t.name === q1.winner);
        const elWinner = teams.find(t => t.name === el1.winner);

        const final = simulateMatch(q1Winner, elWinner, stats);
        playoffs.push(final);

        champion = teams.find(t => t.name === final.winner);
        runner = champion.id === q1Winner.id ? elWinner : q1Winner;
    }

    const allRuns = [];
    const allWickets = [];

    for (const s of stats.values()) {
        for (const [key, val] of s.runs) {
            const [team, player] = key.split('|');
            allRuns.push({
                team,
                player,
                value: val
            });
        }

        for (const [key, val] of s.wickets) {
            const [team, player] = key.split('|');
            allWickets.push({
                team,
                player,
                value: val
            });
        }
    }

    allRuns.sort((a, b) => b.value - a.value);
    allWickets.sort((a, b) => b.value - a.value);

    return {
        table: [...stats.values()]
            .sort((a, b) => b.points - a.points || b.nrr - a.nrr)
            .map(s => ({
                name: s.name,
                played: s.wins + s.losses,
                wins: s.wins,
                losses: s.losses,
                points: s.points,
                nrr: Number(s.nrr.toFixed(2)),
                overall: Number(s.ratings.overall.toFixed(1)),
                batting: Number(s.ratings.batting.toFixed(1)),
                bowling: Number(s.ratings.bowling.toFixed(1))
            })),

        matches,
        playoffs,
        champion: champion.name,
        runnerUp: runner.name,
        orangeCap: allRuns[0] || null,
        purpleCap: allWickets[0] || null,

        note: 'Simulated results are generated from the auction squads and game ratings. They are for entertainment, not real match predictions.'
    };
}

io.on('connection', s => {

    s.on('create', ({ name }) => {
        const c = code();
        const token = crypto.randomBytes(24).toString('hex');

        const p = {
            id: token.slice(0, 12),
            token,
            name: (name || 'Host').slice(0, 18),
            online: true,
            socketId: s.id,
            purse: 120,
            squad: []
        };

        const r = {
            code: c,
            hostToken: token,
            hostSocket: s.id,
            players: [p],
            status: 'waiting',
            current: null,
            bid: 0,
            leader: null,
            seconds: 20,
            lot: 0,
            pool: [...players],
            sold: [],
            unsold: [],
            log: [],
            timer: null,
            simulation: null
        };

        rooms.set(c, r);
        attachPlayer(s, r, p);

        s.emit('joined', {
            code: c,
            host: true,
            token
        });

        emit(r);
    });

    s.on('join', ({ code: c, name, token }) => {
        const r = rooms.get((c || '').toUpperCase());

        if (!r) {
            return s.emit('errorMsg', 'Room not found. Check the code.');
        }

        let p = token && r.players.find(x => x.token === token);

        if (!p) {
            if (r.status !== 'waiting') {
                return s.emit(
                    'errorMsg',
                    'This auction has started. Rejoin using the same browser/device that joined earlier.'
                );
            }

            if (r.players.length >= 10) {
                return s.emit('errorMsg', 'Room is full (10 players).');
            }

            const fresh = crypto.randomBytes(24).toString('hex');

            p = {
                id: fresh.slice(0, 12),
                token: fresh,
                name: (name || 'Player').slice(0, 18),
                online: false,
                socketId: null,
                purse: 120,
                squad: []
            };

            r.players.push(p);
        } else if (name && p.name !== name && r.status === 'waiting') {
            p.name = name.slice(0, 18);
        }

        attachPlayer(s, r, p);

        s.emit('joined', {
            code: r.code,
            host: p.token === r.hostToken,
            token: p.token
        });

        emit(r);
    });

    s.on('reconnectRoom', ({ code: c, token }) => {
        const r = rooms.get((c || '').toUpperCase());

        if (!r || !token) return;

        const p = r.players.find(x => x.token === token);
        if (!p) return;

        attachPlayer(s, r, p);

        s.emit('joined', {
            code: r.code,
            host: p.token === r.hostToken,
            token: p.token
        });

        emit(r);
    });

    s.on('start', () => {
        const r = getRoom(s);

        if (!r || r.hostToken !== s.data.playerToken) return;

        if (r.status !== 'waiting') {
            return s.emit('errorMsg', 'The auction has already started.');
        }

        if (r.players.length < 2) {
            return s.emit('errorMsg', 'At least 2 players must join.');
        }

        r.status = 'auction';
        r.log.push('Auction started! Good luck.');

        r.pool.sort(() => Math.random() - 0.5);
        r.lot = 0;

        nextLot(r);
    });

    s.on('bid', ({ amount }) => {
        const r = getRoom(s);

        if (!r || r.status !== 'auction' || !r.current) return;

        const p = r.players.find(
            x => x.token === s.data.playerToken
        );

        if (!p) return;

        const n = Number(amount);

        if (
            !Number.isFinite(n) ||
            n <= r.bid ||
            n > p.purse ||
            p.squad.length >= 25 ||
            r.leader === p.id
        ) {
            return;
        }

        r.bid = Number(n.toFixed(2));
        r.leader = p.id;
        r.seconds = 20;

        r.log.push(`${p.name} bids ₹${r.bid.toFixed(2)} Cr`);

        emit(r);
    });

    s.on('simulate', () => {
        const r = getRoom(s);

        if (
            !r ||
            r.hostToken !== s.data.playerToken ||
            r.status !== 'finished'
        ) {
            return;
        }

        const result = tournament(r);

        if (result.error) {
            return s.emit('errorMsg', result.error);
        }

        r.simulation = result;
        r.status = 'simulated';

        emit(r);
    });

    s.on('disconnect', () => {
        const ref = sockets.get(s.id);

        if (!ref) return;

        const r = rooms.get(ref.room);
        sockets.delete(s.id);

        if (!r) return;

        const p = r.players.find(x => x.token === ref.token);

        if (p) {
            p.online = false;
            p.socketId = null;
        }

        if (r.hostToken === ref.token) {
            r.hostSocket = null;
        }

        emit(r);
    });

});

const port = process.env.PORT || 3000;

server.listen(port, '0.0.0.0', () => {
    console.log(`Auction Battle running on ${port}`);
});
