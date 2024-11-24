// app/api/connect/socket/route.js
import { NextRequest, NextResponse } from "next/server";
import { io } from "socket.io-client";
import fs from "fs";

export async function POST(req: NextRequest) {
    try {
        const socket = io("http://localhost:3000");
        await new Promise((resolve: any, reject) => {
            socket.on("connect", async () => {
                console.log("Connected to Socket.IO server");
                const videoBuffer = fs.readFileSync("public/tes.mp4");
                const base64 = videoBuffer.toString("base64");
                socket.emit("video", "data:video/mp4;base64," + base64);
                setTimeout(() => {
                    socket.close();
                    resolve();
                }, 1000);
            });
        });

        return NextResponse.json({
            success: true,
            status: 200,
            message: "Message sent to Socket.IO server",
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                success: false,
                status: 500,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
