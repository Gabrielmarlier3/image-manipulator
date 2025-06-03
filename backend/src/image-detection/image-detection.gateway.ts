import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { ImageDetectionService, Detection } from './image-detection.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class ImageDetectionGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ImageDetectionGateway.name);

  constructor(private readonly detectionService: ImageDetectionService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  /**
   * Recebe frames via event 'frame' (Buffer) e emite 'detections' com resultados
   */
  @SubscribeMessage('frame')
  async handleFrame(
    client: Socket,
    @MessageBody() frame: Buffer,
  ) {
    try {
      const detections: Detection[] = await this.detectionService.detect(frame);
      client.emit('detections', detections);
    } catch (err) {
      this.logger.error(`Detection error: ${err.message}`);
      client.emit('error', { message: err.message });
    }
  }
}
