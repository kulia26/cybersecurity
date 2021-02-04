'use strict';

const net = require('net');
const {users} = require('./users');

const steps = [
    "initial",
    "enter_name",
    "enter_password",
    "authenticated",
];

const getUser = (n, p) => users.find(u => u.name === n && u.password === p);

const handleClientResponse = (message, socket, state) => {
    if(state.step === steps[0]) {
        socket.write('Hello, client ! Please enter your username:');
        return {
            ...state,
            step: steps[1],
        }
    }

    if(state.step === steps[1]) {
        socket.write(`${message}, please enter your password:`);
        return {
            ...state,
            step: steps[2],
            username: message,
        }
    }

    if(state.step === steps[2]) {
        const password = message;
        const username = state.username;

        if(getUser(username, password)){
            socket.write(`${username}, you are successfully authorised, try:`);
            return {
                ...state,
                username,
                password,
                step: steps[3]
            }
        }

        socket.write(`Username or Password is incorrect, please try again.\nPlease enter your username:`);
        return {
            ...state,
            step: steps[1],
        }
    }

    if(state.step === steps[3]) {
        const secrets = ['💥','💚','💜','💛','🌸','🍬']
        const secret = secrets[Math.round(Math.random()*5)];

        socket.write(`There is your secret: ${secret}`);
        return {
            ...state,
            step: steps[0],
        }
    }

    return {...state};
}

const connection = socket => {

    console.dir({
        localAddress: socket.localAddress,
        localPort: socket.localPort,
        remoteAddress: socket.remoteAddress,
        remoteFamily: socket.remoteFamily,
        remotePort: socket.remotePort,
        bufferSize: socket.bufferSize,
    });

    const connectionStore = {
        state: {
            step: steps[0],
        },
    };

    socket.on('data', data => {
        const message = data.toString();
        console.log(`Client ${socket.remotePort} say: ${message}`);
        connectionStore.state = handleClientResponse(message, socket, connectionStore.state);
    });

    socket.on('end', () => {
        console.log('Connection closed');
        console.dir({
            bytesRead: socket.bytesRead,
            bytesWritten: socket.bytesWritten,
        });
    });

    socket.on('error', err => {
        console.log('💩');
        console.log(err);
    });

    socket.on('timeout', () => {
        console.log('⌛');
    });
};

const server = net.createServer();

server.on('connection', connection);

server.listen(2000);
