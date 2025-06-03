import { ImageDetectionService, Detection } from './image-detection.service';
import * as tmp from 'tmp';
import * as fs from 'fs';
import * as child_process from 'child_process';
import { PassThrough } from 'stream';

describe('ImageDetectionService', () => {
  let service: ImageDetectionService;
  let mockTmp: { name: string; removeCallback: jest.Mock };

  beforeEach(() => {
    service = new ImageDetectionService();
    // tmp.fileSync já mockado via jest.mock
    mockTmp = tmp.fileSync() as any;
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
  });(() => {
    service = new ImageDetectionService();
    mockTmp = { name: 'fake.jpg', removeCallback: jest.fn() };
    jest.spyOn(tmp, 'fileSync').mockReturnValue(mockTmp as any);
    jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return detections on successful run', async () => {
    const fakeStdout = new PassThrough();
    const fakeStderr = new PassThrough();
    const fakeProc = {
      stdout: fakeStdout,
      stderr: fakeStderr,
      on: (event: string, cb: (code: number) => void) => {
        if (event === 'close') {
          setImmediate(() => cb(0));
        }
      },
    } as any;
    jest.spyOn(child_process, 'spawn').mockReturnValue(fakeProc);

    const detectionArray: Detection[] = [
      { class: 'person', confidence: 0.98, box: { x: 1, y: 2, w: 3, h: 4 } },
    ];
    const json = JSON.stringify(detectionArray);
    setImmediate(() => {
      fakeStdout.emit('data', Buffer.from(json));
    });

    const result = await service.detect(Buffer.from(''));
    expect(result).toEqual(detectionArray);
    expect(fs.writeFileSync).toHaveBeenCalledWith(mockTmp.name, expect.any(Buffer));
    expect(mockTmp.removeCallback).toHaveBeenCalled();
  });

  it('should throw error on non-zero exit', async () => {
    const fakeStdout = new PassThrough();
    const fakeStderr = new PassThrough();
    const fakeProc = {
      stdout: fakeStdout,
      stderr: fakeStderr,
      on: (event: string, cb: (code: number) => void) => {
        if (event === 'close') {
          setImmediate(() => cb(1));
        }
      },
    } as any;
    jest.spyOn(child_process, 'spawn').mockReturnValue(fakeProc);
    setImmediate(() => {
      fakeStderr.emit('data', Buffer.from('error occurred'));
    });

    await expect(service.detect(Buffer.from(''))).rejects.toThrow('error occurred');
    expect(mockTmp.removeCallback).toHaveBeenCalled();
  });
});
