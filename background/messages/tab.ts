import { PlasmoMessaging } from '@plasmohq/messaging'

import { gotoTab } from '~utils/tab'

export interface ITabRequest<T> {
  path: string
  data: { [key: string]: String } & T
}

const handler: PlasmoMessaging.MessageHandler = async (
  req: PlasmoMessaging.Request<string, ITabRequest<any>>
) => {
  gotoTab(req.body.path, req.body.data)
  throw new Error('hi')
}

export default handler
