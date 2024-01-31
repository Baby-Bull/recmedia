import { getToken } from "./storage";

// retryDelay: 2s
const defaultRetryDelay = 2000;
const defaultMaxRetries = 5;

const getWsEndpoint = () => `${process.env.NEXT_PUBLIC_WS}${getToken()}`;

const WebsocketClient = ({
  url,
  retryDelay = defaultRetryDelay,
  maxRetries = defaultMaxRetries,
}: {
  url: string | (() => string);
  retryDelay?: number;
  maxRetries?: number;
}) => {
  let wsInstance: WebSocket;
  let tryReconnectFn: any;
  let retries = 0;
  let isClosed = false;

  // eslint-disable-next-line no-unused-vars
  const eventHandlers: Map<string, Array<(payload?: any) => void | Promise<void>>> = new Map();

  const emitInternal = (event: any, payload: any) => {
    const handlersOfEvent = eventHandlers.get(event);
    if (handlersOfEvent?.length) {
      handlersOfEvent.forEach((handler) => {
        handler(payload);
      });
    }
  };

  const createWsInstance = () => {
    tryReconnectFn = () => {
      retries += 1;
      isClosed = retries >= maxRetries;
      if (!isClosed) {
        window.setTimeout(() => {
          createWsInstance();
        }, retryDelay);
      }
    };
    const wsUrl = typeof url === "function" ? url() : url;
    wsInstance = new WebSocket(wsUrl);

    wsInstance.onopen = (e) => {
      if (retries > 0) {
        emitInternal("reconnected", null);
        retries = 0;
      }
      emitInternal("connected", e);
      isClosed = false;
    };

    wsInstance.addEventListener("message", (e: any) => {
      const messageReceived = JSON.parse(e.data);
      const entries = Object.entries(messageReceived ?? {});
      if (entries.length) {
        entries.forEach(([event, payload]) => emitInternal(event, payload));
      }
    });
    wsInstance.onclose = tryReconnectFn;
  };

  createWsInstance();

  return {
    isClosed() {
      return isClosed;
    },
    // emit to server
    emit(event: any, payload: any) {
      wsInstance.send(
        JSON.stringify({
          ...payload,
          event,
        }),
      );
    },

    on(event, handler) {
      const handlers = eventHandlers.get(event);
      eventHandlers.set(event, handlers?.length ? [...handlers, handler] : [handler]);
    },

    off(event, fnRef = null) {
      if (fnRef) {
        const handlers = eventHandlers.get(event);
        if (handlers?.length) {
          eventHandlers.set(
            event,
            handlers.filter((handler) => handler !== fnRef),
          );
        }
      } else {
        eventHandlers.delete(event);
      }
    },

    close() {
      wsInstance.removeEventListener("close", tryReconnectFn);
      wsInstance.close();
      isClosed = true;
      emitInternal("disconnected", null);
    },

    reconnect() {
      console.log("reconnect");
      
      isClosed = false;
      retries = 0;
      createWsInstance();
    },
  };
};

const socket =
  typeof window !== "undefined"
    ? WebsocketClient({
      url: getWsEndpoint,
    })
    : null;

export default socket;
