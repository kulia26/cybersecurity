'use strict';

const net = require('net');

const socket = new net.Socket();

socket.setEncoding('utf8');

const {config} = require('./test.config')

// change to your private ip
// const {config} = require('./prod.config')

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const send = message => {
  console.log('Client >', message.toString());
  const data = message.toString().trim();

  if (!data) return false;

  socket.write(data);
  return true;
};

const handleServerResponse = (response) => {
  readline.question(`Server > ${response.toString()}`, data => {
    const success = send(data);
    if (!success) handleServerResponse(response);
  });
};

socket.on('data', message => {
  handleServerResponse(message);
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
  console.log('Timeout ⌛');
});

socket.on('connect', () => {
  send('Hello, server !');
});

socket.connect({
  port: config.port,
  host: config.host,
});
