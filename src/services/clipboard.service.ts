import store from '@/store';
import Messages from '@/lib/messages';

export class ClipboardService {
    constructor() {}

    public copyToClipboard(value: any): Promise<void> {
        return navigator.clipboard.writeText(value).then(
            () => {
                store.commit(
                    'message',
                    Messages.success('common.messages.copyClipboardSuccess')
                );
            },
            (error) => {
                console.error('Failed to copy to clipboard:', error);
                store.commit(
                    'message',
                    Messages.error('common.messages.copyClipboardError')
                );
            }
        );
    }
}
