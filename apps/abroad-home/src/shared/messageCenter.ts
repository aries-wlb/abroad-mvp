// Message Center
class MsgCenter {
  // message queue
  private msgQueue: Array<any> = []

  // auto-increment message Id
  private listenId = 0

  // Message listening map with to listenId as key
  private handlerMapById: any = {}

  //  Message listening map with to cmd as key
  private handlerMapByCmd: any = {}

  // message center status, 1 is running,  2 is stopped
  private status = 1

  // run message center
  resume() {
    this.status = 1
  }

  // stop message center
  stop() {
    this.status = 2
  }

  // add message listener
  addMsgListener(cmd: string, callback: any): number {
    if (!cmd) return -1

    this.listenId += 1
    const msgInfo = { cmd, callback }
    this.handlerMapById[this.listenId] = msgInfo
    if (!this.handlerMapByCmd[cmd]) this.handlerMapByCmd[cmd] = {}

    this.handlerMapByCmd[cmd][this.listenId] = msgInfo
    return this.listenId
  }

  // remove message listener
  removeMsgListener(listenId: number) {
    if (!listenId || listenId === -1) return

    if (this.handlerMapById[listenId]) {
      const { cmd } = this.handlerMapById[listenId]
      delete this.handlerMapById[listenId]
      delete this.handlerMapByCmd[cmd][listenId]
    }
  }

  // send message
  sendMsg(cmd: string, data: any) {
    if (!cmd) return

    this.msgQueue.push({ cmd, data })
    this.triggerMsg()
  }

  // trigger broadcast message
  triggerMsg() {
    if (this.status === 2) return

    for (let i = 0; i < 100; i += 1) {
      const msgInfo = this.msgQueue.shift()
      if (!msgInfo) break

      const listerArray = this.handlerMapByCmd[msgInfo.cmd]
      if (!listerArray) continue

      for (const j in listerArray) listerArray[j]?.callback(msgInfo.data)
    }
  }
}

export const messageCenter = new MsgCenter()
