import * as signalR from '@microsoft/signalr';
import { AgentMode } from '@/types/agentMode';

export interface ChatMessage {
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
}

export class SignalRService {
    private connection: signalR.HubConnection | null = null;
    private isConnected = false;
    private isConnecting = false;

    constructor(private hubUrl: string = 'http://localhost:5038/chathub') {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(this.hubUrl, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        this.setupEventHandlers();
    }

    private setupEventHandlers() {
        if (!this.connection) return;

        this.connection.onreconnecting(() => {
            console.log('SignalR: Attempting to reconnect...');
            this.isConnected = false;
            this.isConnecting = true;
        });

        this.connection.onreconnected(() => {
            console.log('SignalR: Reconnected successfully');
            this.isConnected = true;
            this.isConnecting = false;
        });

        this.connection.onclose(() => {
            console.log('SignalR: Connection closed');
            this.isConnected = false;
            this.isConnecting = false;
        });
    }

    async connect(): Promise<boolean> {
        if (!this.connection) return false;
        if (this.isConnecting) return false;
        if (this.isConnected) return true;

        this.isConnecting = true;

        try {
            await this.connection.start();
            this.isConnected = true;
            this.isConnecting = false;
            console.log('SignalR: Connected successfully');
            return true;
        } catch (error) {
            console.error('SignalR: Connection failed', error);
            this.isConnected = false;
            this.isConnecting = false;
            return false;
        }
    }

    async disconnect(): Promise<void> {
        if (this.connection) {
            await this.connection.stop();
            this.isConnected = false;
        }
    }

    async sendMessage(message: string, sessionId: string, agentMode: AgentMode = AgentMode.AzureOnly): Promise<void> {
        if (!this.connection || !this.isConnected) {
            throw new Error('SignalR connection is not established');
        }

        try {
            // Send message with agent mode to the hub
            await this.connection.invoke('ProcessMessage', message, sessionId, agentMode);
        } catch (error) {
            console.error('SignalR: Failed to send message', error);
            throw error;
        }
    }

    onToolCall(callback: (data: { tool: string; input: string; output: string }) => void): void {
        if (!this.connection) return;
        // Remove any existing handlers first
        this.connection.off('onToolCall');
        this.connection.on('onToolCall', callback);
    }

    onFinalResponse(callback: (response: string) => void): void {
        if (!this.connection) return;
        // Remove any existing handlers first
        this.connection.off('onFinalResponse');
        this.connection.on('onFinalResponse', callback);
    }

    onStreamingChunk(callback: (chunk: string) => void): void {
        if (!this.connection) return;
        this.connection.off('ReceiveStreamingChunk');
        this.connection.on('ReceiveStreamingChunk', callback);
    }

    onStreamingStarted(callback: () => void): void {
        if (!this.connection) return;
        this.connection.off('StreamingStarted');
        this.connection.on('StreamingStarted', callback);
    }

    onStreamingCompleted(callback: () => void): void {
        if (!this.connection) return;
        this.connection.off('StreamingCompleted');
        this.connection.on('StreamingCompleted', callback);
    }

    removeEventHandlers(): void {
        if (!this.connection) return;
        this.connection.off('onToolCall');
        this.connection.off('onFinalResponse');
        this.connection.off('ReceiveStreamingChunk');
        this.connection.off('StreamingStarted');
        this.connection.off('StreamingCompleted');
    }

    async joinSession(sessionId: string): Promise<void> {
        if (!this.connection || !this.isConnected) {
            throw new Error('SignalR connection is not established');
        }

        try {
            await this.connection.invoke('JoinSession', sessionId);
        } catch (error) {
            console.error('SignalR: Failed to join session', error);
            throw error;
        }
    }

    async leaveSession(sessionId: string): Promise<void> {
        if (!this.connection || !this.isConnected) {
            throw new Error('SignalR connection is not established');
        }

        try {
            await this.connection.invoke('LeaveSession', sessionId);
        } catch (error) {
            console.error('SignalR: Failed to leave session', error);
            throw error;
        }
    }

    getConnectionState(): signalR.HubConnectionState {
        return this.connection?.state || signalR.HubConnectionState.Disconnected;
    }

    isConnectionActive(): boolean {
        return this.isConnected && this.connection?.state === signalR.HubConnectionState.Connected;
    }
}

// Singleton instance
export const signalRService = new SignalRService();
