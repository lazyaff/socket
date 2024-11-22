// app/api/connect/socket/route.js
import { NextRequest, NextResponse } from 'next/server';
import { io } from 'socket.io-client';

export async function POST(req: NextRequest) {
	try {
		const socket = io('http://localhost:3000');
		await new Promise((resolve: any, reject) => {
			socket.on('connect', () => {
				console.log('Connected to Socket.IO server');
				socket.emit('gyro', { data: 'New' });
				setTimeout(() => {
					socket.close();
					resolve();
				}, 100);
			});
		});

		return NextResponse.json({
			success: true,
			status: 200,
			message: 'Message sent to Socket.IO server',
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{
				success: false,
				status: 500,
				message: 'Internal server error',
			},
			{ status: 500 }
		);
	}
}
