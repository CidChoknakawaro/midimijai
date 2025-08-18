let subscribers = [];
export function subscribe(fn) {
    subscribers.push(fn);
    return () => {
        subscribers = subscribers.filter((s) => s !== fn);
    };
}
export function publish(cmd) {
    subscribers.forEach((s) => s(cmd));
}
