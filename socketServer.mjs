import { createServer } from 'node:http';
import next from 'next';
import { Server } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
let port = process.env.PORT || 3000;
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const startServer = (port) => {
	app.prepare().then(() => {
		const httpServer = createServer((req, res) => {
			res.setHeader('Access-Control-Allow-Origin', '*');
			res.setHeader(
				'Access-Control-Allow-Methods',
				'GET, POST, PUT, DELETE, OPTIONS'
			);
			res.setHeader(
				'Access-Control-Allow-Headers',
				'Content-Type, Authorization'
			);
			if (req.method === 'OPTIONS') {
				res.writeHead(204);
				res.end();
				return;
			}
			handler(req, res);
		});

		const io = new Server(httpServer, {
			cors: {
				origin: '*',
				methods: ['GET', 'POST'],
			},
		});

		io.on('connection', (socket) => {
			socket.on('gyro', (data) => {
				console.log(`Message from client:`, data);
				io.emit('gyro', { data: data });
			});
		});

		httpServer
			.once('error', (err) => {
				if (err.code === 'EADDRINUSE') {
					console.warn(
						`Port ${port} in use, trying port ${port + 1}`
					);
				} else {
					console.error(err);
					process.exit(1);
				}
			})
			.listen(port, () => {
				console.log(`> Ready on http://${hostname}:${port}`);
			});
	});
};

startServer(port);
