import fetch from 'node-fetch';

export interface ILogger {
  debug(primaryMessage: string, ...supportingData: any[]): void;
  warn(primaryMessage: string, ...supportingData: any[]): void;
  error(primaryMessage: string, ...supportingData: any[]): void;
  info(primaryMessage: string, ...supportingData: any[]): void;
}

export class Logger implements ILogger {
  private sessionId: string;
  private userId: string;
  constructor(userId: string, sessionId: string) {
    this.userId = userId;
    this.sessionId = sessionId;
  }
  public debug(primaryMessage: string, ...supportingData: any[]) {
    this.emitLogMessage('debug', primaryMessage, supportingData);
  }
  public warn(primaryMessage: string, ...supportingData: any[]) {
    this.emitLogMessage('warn', primaryMessage, supportingData);
  }
  public error(primaryMessage: string, ...supportingData: any[]) {
    this.emitLogMessage('error', primaryMessage, supportingData);
  }
  public info(primaryMessage: string, ...supportingData: any[]) {
    this.emitLogMessage('info', primaryMessage, supportingData);
  }
  private emitLogMessage(
    msgType: 'debug' | 'info' | 'error' | 'warn',
    msg: string,
    supportingDetails: any[],
    url?: string | undefined,
  ) {
    const body = {
      log: supportingDetails[0],
      msg: msg,
      msgType: msgType,
      sessionId: this.sessionId,
      userId: this.userId,
    };
    // console.log(JSON.stringify(body))
    url = url === undefined ? 'http://localhost:3000' : url;
    fetch(url + '/events', {
      body: JSON.stringify(body),
      headers: { Authorization: 'Bearer ' + this.sessionId, 'Content-Type': 'application/json; charset=utf-8' },
      method: 'POST',
    })
      .then(response => response.json())
      // AbortController.then(json=>console.log(json))
      .catch(error => {
        throw error;
      });
  }
}
