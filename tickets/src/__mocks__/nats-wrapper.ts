export const natsWrapper = {
    client: {
        async publish(subject: string, data: string, callback: () => void) {
            callback();
        }
    }
};